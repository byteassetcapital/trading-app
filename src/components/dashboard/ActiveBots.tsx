"use client";

import React from 'react';

interface Bot {
  id: string;
  name: string;
  strategy: string;
  status: 'running' | 'paused' | 'stopped';
  profit: number;
  profitPercent: number;
  trades24h: number;
  winRate: number;
}

interface ActiveBotsProps {
  bots?: Bot[];
  onLoaded?: () => void;
}

// Mock data
const mockBots: Bot[] = [
  { id: '1', name: 'Grid Bot #1', strategy: 'BTC/USDT Grid', status: 'running', profit: 1250.50, profitPercent: 12.5, trades24h: 45, winRate: 68 },
  { id: '2', name: 'DCA Bot', strategy: 'ETH Weekly DCA', status: 'running', profit: 890.20, profitPercent: 8.9, trades24h: 3, winRate: 100 },
  { id: '3', name: 'Scalper Pro', strategy: 'SOL Scalping', status: 'paused', profit: -120.00, profitPercent: -2.4, trades24h: 0, winRate: 45 },
  { id: '4', name: 'Arbitrage #2', strategy: 'Cross-Exchange', status: 'running', profit: 340.80, profitPercent: 5.2, trades24h: 128, winRate: 92 },
];

export default function ActiveBots({ bots = mockBots, onLoaded }: ActiveBotsProps) {
  React.useEffect(() => {
    if (onLoaded) onLoaded();
  }, []);
  const runningBots = bots.filter(b => b.status === 'running').length;
  const totalProfit = bots.reduce((acc, bot) => acc + bot.profit, 0);

  return (
    <div className="active-bots glass-panel">
      <div className="section-header">
        <div className="header-title">
          <h3>Active Bots</h3>
          <span className="running-count">{runningBots} Running</span>
        </div>
        <button className="add-bot-btn">+ New Bot</button>
      </div>

      <div className="bots-summary">
        <div className="summary-item">
          <span className="summary-label">Total Profit</span>
          <span className={`summary-value ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bots-list">
        {bots.map((bot) => (
          <div key={bot.id} className="bot-card">
            <div className="bot-header">
              <div className="bot-name-wrap">
                <span className={`status-dot ${bot.status}`}></span>
                <span className="bot-name">{bot.name}</span>
              </div>
              <span className={`bot-status ${bot.status}`}>{bot.status}</span>
            </div>

            <div className="bot-strategy">{bot.strategy}</div>

            <div className="bot-stats">
              <div className="stat">
                <span className="stat-label">Profit</span>
                <span className={`stat-value ${bot.profit >= 0 ? 'positive' : 'negative'}`}>
                  {bot.profit >= 0 ? '+' : ''}{bot.profitPercent}%
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">24h Trades</span>
                <span className="stat-value">{bot.trades24h}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Win Rate</span>
                <span className="stat-value">{bot.winRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .active-bots {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .running-count {
          font-size: 0.65rem;
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-weight: 500;
        }

        .add-bot-btn {
          background: linear-gradient(135deg, var(--primary-purple), var(--accent-purple));
          border: none;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .add-bot-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(101, 91, 178, 0.4);
        }

        .bots-summary {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .summary-value {
          font-size: 1rem;
          font-weight: 700;
        }

        .summary-value.positive {
          color: #00ff88;
        }

        .summary-value.negative {
          color: #ff3c3c;
        }

        .bots-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bot-card {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: border-color 0.2s;
        }

        .bot-card:hover {
          border-color: rgba(101, 91, 178, 0.3);
        }

        .bot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .bot-name-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.running {
          background: #00ff88;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
        }

        .status-dot.paused {
          background: #ffaa00;
        }

        .status-dot.stopped {
          background: #ff3c3c;
        }

        .bot-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
        }

        .bot-status {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          text-transform: capitalize;
          font-weight: 500;
        }

        .bot-status.running {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
        }

        .bot-status.paused {
          background: rgba(255, 170, 0, 0.1);
          color: #ffaa00;
        }

        .bot-status.stopped {
          background: rgba(255, 60, 60, 0.1);
          color: #ff3c3c;
        }

        .bot-strategy {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 0.75rem;
        }

        .bot-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .stat-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
        }

        .stat-value.positive {
          color: #00ff88;
        }

        .stat-value.negative {
          color: #ff3c3c;
        }

        @media (min-width: 768px) {
          .bot-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
