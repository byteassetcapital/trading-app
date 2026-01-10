"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getRealizedPnLStats, RealizedPnLData } from '@/app/actions/trading';

export default function RealizedPnL({ onLoaded }: { onLoaded?: () => void }) {
  const supabase = createClient();
  const [data, setData] = useState<RealizedPnLData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const result = await getRealizedPnLStats(session.access_token);
          if (result) setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch realized PnL", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="realized-pnl glass-panel p-4">Loading PnL...</div>;

  const totalPnL = data?.totalPnL || 0;
  const breakdown = data?.breakdown || [];
  const isPositive = totalPnL >= 0;

  return (
    <div className="realized-pnl glass-panel">
      <div className="pnl-header">
        <span className="pnl-label">Realized P&L</span>
        <span className="pnl-period">Recent</span>
      </div>

      <div className={`pnl-total ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>

      <div className="pnl-breakdown">
        {breakdown.length === 0 ? (
          <div className="no-data">No PnL data</div>
        ) : (
          breakdown.map((item, index) => (
            <div key={index} className="breakdown-item">
              <span className="breakdown-label">{item.label}</span>
              <span className={`breakdown-value ${item.value >= 0 ? 'positive' : 'negative'}`}>
                {item.value >= 0 ? '+' : ''}{item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .realized-pnl {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .no-data {
            color: rgba(255,255,255,0.4);
            font-size: 0.8rem;
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

        .pnl-period {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
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

        .pnl-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breakdown-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .breakdown-value {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .breakdown-value.positive {
          color: #00ff88;
        }

        .breakdown-value.negative {
          color: #ff3c3c;
        }

        @media (min-width: 768px) {
          .pnl-total {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
