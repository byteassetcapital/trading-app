"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Loader from "@/components/Loader";
import UserDisplay from "@/components/UserDisplay";
import SecondaryNav from "@/components/autonomous/SecondaryNav";
import ApiSettings from "@/components/autonomous/ApiSettings";
import styles from './page.module.css';

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
  PnLAnalysis,
  MainChart,
} from "@/components/dashboard";

import { getAggregatedDashboardData, type AggregatedDashboardData } from '@/app/actions/trading';

export default function AutonomousPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<AggregatedDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Bot Settings Dummy State
  const [bots, setBots] = useState([
    { id: 1, name: 'BTC Notch', active: true },
    { id: 2, name: 'BTC HFT Algo', active: false },
    { id: 3, name: 'SOL Multi Trader', active: true },
  ]);

  const toggleBot = (id: number) => {
    setBots(bots.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  // Fetch all dashboard data on mount
  useEffect(() => {
    if (activeSection !== 'overview') return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          router.push('/login');
          return;
        }

        // Single aggregated fetch - replaces 6+ individual API calls
        const data = await getAggregatedDashboardData(session.access_token, 14);

        if (data) {
          setDashboardData(data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('An error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeSection, router]);

  // Render Functions
  const renderOverview = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!dashboardData) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No data available</p>
        </div>
      );
    }

    return (
      <>
        <section className="section-quick-stats">
          <QuickStats data={dashboardData.quickStats} />
        </section>

        <div className="grid-item pnl-area" style={{ marginBottom: '1.5rem' }}>
          <div className="pnl-grid">
            <UnrealizedPnL data={dashboardData.accountData.unrealizedPnL} />
            <RealizedPnL data={dashboardData.realizedPnL} />
            <AccountBalance data={dashboardData.accountData.totalBalance} />
            <PnLAnalysis data={dashboardData.dailyPnL} />
          </div>
        </div>

        <div className="grid-item live-trades-area" style={{ marginBottom: '1.5rem' }}>
          <LiveTrades data={dashboardData.accountData.positions} />
        </div>

        <div className="grid-item waiting-trades-area">
          <WaitingTrades data={dashboardData.openOrders} />
        </div>

        <div className="charts-stack" style={{ display: 'none' }}>
          <MainChart />
          <Watchlist onLoaded={() => { }} />
        </div>

        <div className="grid-item trades-area" style={{ paddingTop: '1.5rem' }}>
          <RecentTrades data={dashboardData.recentTrades} />
        </div>

        <div className="grid-item bots-area">
          <ActiveBots onLoaded={() => { }} />
        </div>

        {/* Preservation of original styles for grid layout */}
        <style jsx>{`
          .bg-glow-1, .bg-glow-2 {
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            filter: blur(80px);
            z-index: -1;
            opacity: 0.15;
            pointer-events: none;
          }
          .bg-glow-1 { background: #3f5efb; top: 10%; left: -10%; }
          .bg-glow-2 { background: #fc466b; bottom: 10%; right: -10%; }

          .section-quick-stats { margin-bottom: 1.5rem; }
          
          /* Original Mobile First Styles */
          .grid-item { width: 100%; }
          .pnl-grid { display: flex; flex-direction: column; gap: 1rem; }
          
          @media (min-width: 768px) {
             .pnl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
             .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          }

          @media (min-width: 1024px) {
             .dash-grid { display: grid; grid-template-columns: 350px 1fr; grid-template-rows: auto auto; gap: 12px; }
             .pnl-area { grid-column: 1 / -1; grid-row: 2 / 3; width: 100%; }
             .pnl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; width: 100%; }
             .bots-area { grid-column: 1 / -1; grid-row: 3 / 4; padding-top: 1.5rem; }
          }
          
          .charts-stack { display: flex; flex-direction: column; gap: 1.25rem; }
        `}</style>
      </>
    );
  };

  const renderTradingSettings = () => (
    <div className={styles.section}>
      <div className={styles.contentPanel}>
        <h3 className={styles.panelTitle}>Nastavení Botů</h3>
        <div className={styles.botList}>
          {bots.map(bot => (
            <div key={bot.id} className={styles.botItem}>
              <div className={styles.botInfo}>
                <span className={styles.botName}>{bot.name}</span>
                <span className={styles.botStatus}>{bot.active ? 'Běží' : 'Zastaveno'}</span>
              </div>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={bot.active}
                  onChange={() => toggleBot(bot.id)}
                />
                <div className={styles.toggleSwitch}></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFunds = () => (
    <div className={styles.section}>
      <div className={styles.contentPanel}>
        <h3 className={styles.panelTitle}>Správa Prostředků</h3>
        <div className={styles.fundsGrid}>
          <div className={styles.fundAction}>
            <div className={styles.fundIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <h4 className={styles.fundTitle}>Vklad</h4>
            <p className={styles.fundDescription}>Přidat finanční prostředky do portfolia</p>
            <button className={styles.fundButton}>Vložit</button>
          </div>
          <div className={styles.fundAction}>
            <div className={styles.fundIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <h4 className={styles.fundTitle}>Výběr</h4>
            <p className={styles.fundDescription}>Vybrat prostředky z portfolia</p>
            <button className={styles.fundButton}>Vybrat</button>
          </div>
          <div className={styles.fundAction}>
            <div className={styles.fundIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <h4 className={styles.fundTitle}>Převod</h4>
            <p className={styles.fundDescription}>Převést mezi účty</p>
            <button className={styles.fundButton}>Převést</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Background Glows */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className={styles.title}>Autonomní Trading</h1>
            <span className={styles.subtitle}>Trading Overview & Management</span>
          </div>
          <UserDisplay />
        </div>

        <SecondaryNav activeSection={activeSection} onSectionChange={setActiveSection} />
      </header>

      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'trading_settings' && renderTradingSettings()}
      {activeSection === 'funds' && renderFunds()}
      {activeSection === 'api' && <ApiSettings />}
    </div>
  );
}
