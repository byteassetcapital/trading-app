"use client";

import { useState } from 'react';
import Loader from "@/components/Loader";
import UserDisplay from "@/components/UserDisplay";
import {
  RecentTrades,
  LiveTrades,
  WaitingTrades,
  RealizedPnL,
  UnrealizedPnL,
  ActiveBots,
  Watchlist,
  AccountBalance,
  QuickStats,
} from "@/components/dashboard";




export default function Dashboard() {
  const [loadingStates, setLoadingStates] = useState({
    quickStats: true,
    liveTrades: true,
    waitingTrades: true,
    watchlist: true,
    unrealizedPnL: true,
    realizedPnL: true,
    accountBalance: true,
    activeBots: true,
    recentTrades: true,
  });

  const handleLoaded = (key: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  const isFullyLoaded = !Object.values(loadingStates).some(state => state);

  return (
    <div className="dashboard-container">
      {/* Show Loader until everything is ready */}
      {!isFullyLoaded && <Loader />}

      {/* Header */}
      <header className="dash-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <span className="welcome-text">Trading Overview</span>
        </div>
        <div className="header-right">
          <UserDisplay />
        </div>
      </header>

      {/* Quick Stats */}
      <section className="section-quick-stats">
        <QuickStats onLoaded={() => handleLoaded('quickStats')} />
      </section>

      {/* Live Trades */}
      <div className="grid-item live-trades-area" style={{ marginBottom: '1.5rem' }}>
        <LiveTrades onLoaded={() => handleLoaded('liveTrades')} />
      </div>

      {/* Waiting Trades */}
      <div className="grid-item waiting-trades-area">
        <WaitingTrades onLoaded={() => handleLoaded('waitingTrades')} />
      </div>





      {/* Main Grid Layout */}
      <div className="dash-grid">


        {/* Watchlist / Mini Charts */}
        <div className="grid-item chart-area">
          <Watchlist onLoaded={() => handleLoaded('watchlist')} />
        </div>

        {/* P&L Section - Mobile: stacked, Desktop: side by side */}
        <div className="grid-item pnl-area">
          <div className="pnl-grid">
            <UnrealizedPnL onLoaded={() => handleLoaded('unrealizedPnL')} />
            <RealizedPnL onLoaded={() => handleLoaded('realizedPnL')} />
            <AccountBalance onLoaded={() => handleLoaded('accountBalance')} />
          </div>
        </div>



        {/* Active Bots */}
        <div className="grid-item bots-area" style={{ display: 'none' }}>
          <ActiveBots onLoaded={() => handleLoaded('activeBots')} />
        </div>

      </div>

      {/* Recent Trades */}
      <div className="grid-item trades-area">
        <RecentTrades onLoaded={() => handleLoaded('recentTrades')} />
      </div>

      <style jsx>{`


        .dashboard-container {
          position: relative;
          z-index: 1; /* Aby obsah byl nad glow efekty */
          overflow: hidden;
          /* ... zbytek tvého paddingu atd. ... */
        }

        .bg-glow-1, .bg-glow-2 {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(80px);
          z-index: -1; /* Musí být pod obsahem */
          opacity: 0.15; /* Jemné, aby to nerušilo */
          pointer-events: none;
        }

        .bg-glow-1 {
          background: #3f5efb;
          top: 10%;
          left: -10%;
        }

        .bg-glow-2 {
          background: #fc466b;
          bottom: 10%;
          right: -10%;
        }

        /* ============================================
           MOBILE FIRST STYLES (< 480px)
           ============================================ */
        
        .dashboard-container {
          padding: 6rem 1rem 2rem;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .dash-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .welcome-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        /* Quick Stats Section */
        .section-quick-stats {
          margin-bottom: 1.5rem;
        }

        /* Main Grid - Mobile: single column stack */
        .dash-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 12px;
        }

        .grid-item {
          width: 100%;
        }

        /* P&L Grid - Mobile: stacked */
        .pnl-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ============================================
           SMALL TABLETS (480px+)
           ============================================ */
        @media (min-width: 480px) {
          .dashboard-container {
            padding: 7rem 1.5rem 2rem;
          }

          .dash-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .dash-grid {
            gap: 1.25rem;
          }
        }

        /* ============================================
           TABLETS (768px+)
           ============================================ */
        @media (min-width: 768px) {
          .dashboard-container {
            padding: 8rem 2rem 2rem;
          }

          .header-left h1 {
            font-size: 1.75rem;
          }

          /* P&L side by side */
          .pnl-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }

          .dash-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .balance-area {
            grid-column: span 1;
            padding-top: 12px;
            padding-bottom: 12px;
          }

          .chart-area {
            grid-column: span 2;
          }

          .pnl-area {
            grid-column: span 2;
          }

          .bots-area {
            grid-column: span 1;
            display: none;
          }

          .trades-area {
            grid-column: span 1;
          }
        }

        /* ============================================
           DESKTOP (1024px+)
           ============================================ */
        @media (min-width: 1024px) {
          .dash-grid {
            display: grid;
            grid-template-columns: 350px 1fr;
            grid-template-rows: auto auto;
            gap: 12px;
          }

          .pnl-area {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }

          /* Force PnL grid to be a vertical stack in the sidebar */
          .pnl-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .chart-area {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
          }

          /* Active Bots - Full width below the main columns */
          .bots-area {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
            display: none;
          }
        }

        /* ============================================
           LARGE DESKTOP (1280px+)
           ============================================ */
        @media (min-width: 1280px) {
          /* Maintain the 2-column layout from 1024px+ */
          
          .header-left h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div >
  );
}
