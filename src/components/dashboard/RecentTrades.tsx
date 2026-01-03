"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getRecentTrades, TradeItem } from '@/app/actions/trading';

export default function RecentTrades({ onLoaded }: { onLoaded?: () => void }) {
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await getRecentTrades(session.access_token);
          if (data) setTrades(data);
        }
      } catch (error) {
        console.error("Failed to fetch recent trades", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchTrades();

    // Poll every 5 seconds for new trades
    const interval = setInterval(fetchTrades, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="recent-trades glass-panel p-4">Loading trades...</div>;

  return (
    <div className="recent-trades glass-panel">
      <div className="section-header">
        <h3>Recent Trades</h3>
        {/* <button className="view-all-btn">View All</button> */}
      </div>

      <div className="trades-list">
        {trades.length === 0 ? (
          <div className="no-trades">No recent trades found</div>
        ) : (
          trades.map((trade, index) => (
            <div key={`${trade.id}-${index}`} className="trade-item">
              <div className="trade-main">
                <span className={`trade-type ${trade.type}`}>
                  {trade.type.toUpperCase()}
                </span>
                <span className="trade-pair">{trade.pair}</span>
              </div>
              <div className="trade-details">
                <span className="trade-amount">{trade.amount}</span>
                <span className="trade-price">${trade.price.toLocaleString()}</span>
              </div>
              <div className="trade-meta">
                <span className="trade-time">{trade.time}</span>
                {trade.profit !== undefined && (
                  <span className={`trade-profit ${trade.profit >= 0 ? 'positive' : 'negative'}`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}$
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .recent-trades {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .no-trades {
            color: rgba(255,255,255,0.4);
            font-size: 0.9rem;
            text-align: center;
            padding: 2rem 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .view-all-btn {
          background: transparent;
          border: none;
          color: var(--primary-purple);
          font-size: 0.8rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .view-all-btn:hover {
          opacity: 0.7;
        }

        .trades-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .trades-list::-webkit-scrollbar { width: 4px; }
        .trades-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .trade-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          gap: 0.5rem;
        }

        .trade-main {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
        }

        .trade-type {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .trade-type.buy {
          background: rgba(0, 255, 136, 0.15);
          color: #00ff88;
        }

        .trade-type.sell {
          background: rgba(255, 60, 60, 0.15);
          color: #ff3c3c;
        }

        .trade-pair {
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
        }

        .trade-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.15rem;
        }

        .trade-amount {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .trade-price {
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
        }

        .trade-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.15rem;
          min-width: 70px;
        }

        .trade-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .trade-profit {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .trade-profit.positive {
          color: #00ff88;
        }

        .trade-profit.negative {
          color: #ff3c3c;
        }

        @media (min-width: 480px) {
          .trade-item {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
