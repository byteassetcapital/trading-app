"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getQuickStats, QuickStatsData } from '@/app/actions/trading';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
  loading?: boolean;
}

const initialStats: StatItem[] = [
  { label: 'Win Rate', value: '...', icon: '📈' },
  { label: 'Total Trades', value: '...', icon: '⚡' },
  { label: 'Best Trade', value: '...', icon: '🏆' },
];

const ASSETS = ['ALL', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'BTCUSDC', 'ETHUSDC'];

export default function QuickStats({ onLoaded }: { onLoaded?: () => void }) {
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [loading, setLoading] = useState(true);
  const [assetFilter, setAssetFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // If not logged in, we might want to just show placeholders or return
        if (!session?.access_token) {
          setLoading(false);
          return;
        }

        const filter = assetFilter === 'ALL' ? '' : assetFilter;
        const data = await getQuickStats(session.access_token, filter);

        if (isMounted && data) {
          setStats([
            { label: 'Win Rate', value: data.winRate, icon: '📈' },
            { label: 'Total Trades', value: data.totalTrades, icon: '⚡' },
            { label: 'Best Trade', value: data.bestTrade, icon: '🏆' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        if (isMounted) setLoading(false);
        if (onLoaded) onLoaded();
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, [assetFilter]);

  return (
    <div className="quick-stats-container">
      <div className="filters">
        <select
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value)}
          className="asset-select glass-input"
        >
          {ASSETS.map(asset => (
            <option key={asset} value={asset}>{asset}</option>
          ))}
        </select>
      </div>

      <div className="quick-stats">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card glass-panel ${loading ? 'loading-pulse' : ''}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
              {stat.change !== undefined && (
                <span className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quick-stats-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filters {
          display: flex;
          justify-content: flex-end;
        }

        .asset-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          padding: 0.5rem 1rem;
          outline: none;
          font-size: 0.8rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .asset-select:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .asset-select option {
            background: #1a1a1a;
            color: #fff;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .stat-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem !important;
          transition: transform 0.2s, opacity 0.3s;
        }

        .loading-pulse {
            opacity: 0.7;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 0.4; }
            100% { opacity: 0.7; }
        }

        .stat-icon {
          font-size: 1.25rem;
          opacity: 0.8;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-change {
          font-size: 0.65rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #00ff88;
        }

        .stat-change.negative {
          color: #ff3c3c;
        }

        @media (min-width: 480px) {
          .quick-stats {
            grid-template-columns: repeat(3, 1fr); /* Changed to 3 since we have 3 stats */
          }

          .stat-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (min-width: 768px) {
          .stat-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
