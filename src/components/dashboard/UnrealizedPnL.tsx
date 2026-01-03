"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAccountData, PositionItem } from '@/app/actions/trading';

export default function UnrealizedPnL({ onLoaded }: { onLoaded?: () => void }) {
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [totalPnL, setTotalPnL] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await getAccountData(session.access_token);
          if (data) {
            setPositions(data.positions);
            setTotalPnL(data.unrealizedPnL);
          }
        }
      } catch (error) {
        console.error("Failed to fetch PnL data", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchData();
  }, []);

  const isPositive = totalPnL >= 0;

  if (loading) return <div className="unrealized-pnl glass-panel p-4">Loading positions...</div>;

  return (
    <div className="unrealized-pnl glass-panel">
      <div className="pnl-header">
        <span className="pnl-label">Unrealized P&L</span>
        <span className="positions-count">{positions.length} Active</span>
      </div>

      <div className={`pnl-total ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>

      <div className="positions-list">
        {positions.length === 0 ? (
          <div className="no-positions">No active positions</div>
        ) : (
          positions.map((position) => (
            <div key={position.id} className="position-item">
              <div className="position-info">
                <span className={`position-side ${position.side}`}>
                  {position.side.toUpperCase()}
                </span>
                <span className="position-pair">{position.pair}</span>
              </div>
              <div className="position-prices">
                <span className="entry-price">${position.entryPrice.toLocaleString()}</span>
                <span className="price-arrow">→</span>
                <span className="current-price">${position.currentPrice.toLocaleString()}</span>
              </div>
              <div className={`position-pnl ${position.pnl >= 0 ? 'positive' : 'negative'}`}>
                <span className="pnl-amount">
                  {position.pnl >= 0 ? '+' : ''}${Math.abs(position.pnl).toFixed(2)}
                </span>
                <span className="pnl-percent">
                  ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .unrealized-pnl {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .no-positions {
            color: rgba(255,255,255,0.4);
            font-size: 0.9rem;
            text-align: center;
            padding: 1rem 0;
        }

        .pnl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pnl-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .positions-count {
          font-size: 0.7rem;
          color: var(--primary-purple);
          background: rgba(101, 91, 178, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .pnl-total {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .pnl-total.positive {
          color: #00ff88;
        }

        .pnl-total.negative {
          color: #ff3c3c;
        }

        .positions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          max-height: 200px;
          overflow-y: auto;
        }

        .positions-list::-webkit-scrollbar {
          width: 4px;
        }

        .positions-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .positions-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .position-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          gap: 0.5rem;
        }

        .position-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .position-side {
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          font-size: 0.6rem;
          font-weight: 700;
        }

        .position-side.long {
          background: rgba(0, 255, 136, 0.15);
          color: #00ff88;
        }

        .position-side.short {
          background: rgba(255, 60, 60, 0.15);
          color: #ff3c3c;
        }

        .position-pair {
          font-size: 0.8rem;
          font-weight: 500;
          color: #fff;
        }

        .position-prices {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .price-arrow {
          color: rgba(255, 255, 255, 0.3);
        }

        .current-price {
          color: #fff;
        }

        .position-pnl {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .pnl-amount {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .pnl-percent {
          font-size: 0.65rem;
          opacity: 0.7;
        }

        .position-pnl.positive {
          color: #00ff88;
        }

        .position-pnl.negative {
          color: #ff3c3c;
        }

        @media (min-width: 768px) {
          .pnl-total {
            font-size: 2rem;
          }

          .position-item {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
