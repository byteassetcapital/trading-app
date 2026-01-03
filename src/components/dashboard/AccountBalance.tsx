"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAccountData, AccountData } from '@/app/actions/trading';

export default function AccountBalance({ onLoaded }: { onLoaded?: () => void }) {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const result = await getAccountData(session.access_token);
          if (result) setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchBalance();
  }, []);

  if (loading) return <div className="account-balance glass-panel p-4">Loading balance...</div>;

  // Default 0 if no data
  const totalBalance = data ? data.totalBalance : 0;
  const availableBalance = data ? data.availableBalance : 0;
  const inPositions = data ? data.inPositions : 0;
  // We don't have 24h change history in this API endpoint yet, so we'll mock or hide it or calc from PnL if we wanted
  const change24h = 0;

  const isPositive = change24h >= 0;
  const positionsPercent = totalBalance > 0 ? (inPositions / totalBalance) * 100 : 0;

  return (
    <div className="account-balance glass-panel">
      <div className="balance-header">
        <span className="balance-label">Total Balance</span>
        <span className={`balance-change ${isPositive ? 'positive' : 'negative'}`}>
          {/* {isPositive ? '+' : ''}{change24h}% (24h) */}
          {/* Temporarily hidden or static since we don't have 24h data yet */}
        </span>
      </div>

      <div className="balance-amount gradient-text">
        ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>

      <div className="balance-bar">
        <div
          className="bar-available"
          style={{ width: `${100 - positionsPercent}%` }}
        ></div>
        <div
          className="bar-positions"
          style={{ width: `${positionsPercent}%` }}
        ></div>
      </div>

      <div className="balance-breakdown">
        <div className="breakdown-item">
          <div className="item-label">
            <span className="dot available"></span>
            <span>Available</span>
          </div>
          <span className="item-value">${availableBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="breakdown-item">
          <div className="item-label">
            <span className="dot positions"></span>
            <span>In Positions</span>
          </div>
          <span className="item-value">${inPositions.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <style jsx>{`
        .account-balance {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: 100%;
          justify-content: center;
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balance-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .balance-change {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .balance-change.positive {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
        }

        .balance-change.negative {
          color: #ff3c3c;
          background: rgba(255, 60, 60, 0.1);
        }

        .balance-amount {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .balance-bar {
          display: flex;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .bar-available {
          background: linear-gradient(90deg, var(--primary-purple), var(--accent-purple));
          border-radius: 3px 0 0 3px;
        }

        .bar-positions {
          background: #00ff88;
          border-radius: 0 3px 3px 0;
        }

        .balance-breakdown {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .item-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot.available {
          background: var(--primary-purple);
        }

        .dot.positions {
          background: #00ff88;
        }

        .item-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }

        @media (min-width: 768px) {
          .balance-amount {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
