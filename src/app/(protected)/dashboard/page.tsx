"use client";

import { useState } from 'react';
import Link from 'next/link';
import UserDisplay from "@/components/UserDisplay";

export default function Dashboard() {
  // Fake data pro aktivní plány
  const [activePlans] = useState([
    {
      id: 1,
      type: 'managed',
      name: 'Conservative Growth',
      balance: 15420.50,
      profit: 1245.30,
      profitPercent: 8.76,
      status: 'active',
      startDate: '2025-11-15',
      trades: 24
    },
    {
      id: 2,
      type: 'autonomous',
      name: 'BTC Scalping Bot',
      balance: 8750.00,
      profit: -125.80,
      profitPercent: -1.42,
      status: 'active',
      startDate: '2026-01-02',
      trades: 67
    },
    {
      id: 3,
      type: 'managed',
      name: 'Aggressive Futures',
      balance: 22100.00,
      profit: 3420.15,
      profitPercent: 18.31,
      status: 'active',
      startDate: '2025-10-01',
      trades: 156
    }
  ]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dash-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <span className="welcome-text">Přehled vašeho portfolia</span>
        </div>
        <div className="header-right">
          <UserDisplay />
        </div>
      </header>

      {/* Quick Navigation Cards - Premium Design */}
      <section className="quick-nav-section">
        <Link href="/investment" className="nav-card investment-card">
          <div className="nav-card-bg-gradient"></div>
          <div className="nav-card-glow"></div>
          <div className="nav-card-inner">
            <div className="nav-card-header">
              <div className="nav-card-icon-wrapper">
                <div className="icon-glow"></div>
                <div className="nav-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
              </div>
              <div className="nav-card-badge">Portfolio</div>
            </div>
            <div className="nav-card-content">
              <h3>Investice</h3>
              <p>Managed portfolia a fondy s profesionální správou</p>
            </div>
            <div className="nav-card-footer">
              <span className="nav-card-link-text">Přejít na investice</span>
              <div className="nav-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/autonomous" className="nav-card autonomous-card">
          <div className="nav-card-bg-gradient"></div>
          <div className="nav-card-glow"></div>
          <div className="nav-card-inner">
            <div className="nav-card-header">
              <div className="nav-card-icon-wrapper">
                <div className="icon-glow"></div>
                <div className="nav-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" />
                    <path d="m16.2 7.8 2.9-2.9" />
                    <path d="M18 12h4" />
                    <path d="m16.2 16.2 2.9 2.9" />
                    <path d="M12 18v4" />
                    <path d="m4.9 19.1 2.9-2.9" />
                    <path d="M2 12h4" />
                    <path d="m4.9 4.9 2.9 2.9" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <div className="nav-card-badge">AI Powered</div>
            </div>
            <div className="nav-card-content">
              <h3>Autonomní Trading</h3>
              <p>Automatizované strategie s pokročilou AI analýzou</p>
            </div>
            <div className="nav-card-footer">
              <span className="nav-card-link-text">Spustit trading</span>
              <div className="nav-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/settings" className="nav-card settings-card">
          <div className="nav-card-bg-gradient"></div>
          <div className="nav-card-glow"></div>
          <div className="nav-card-inner">
            <div className="nav-card-header">
              <div className="nav-card-icon-wrapper">
                <div className="icon-glow"></div>
                <div className="nav-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <div className="nav-card-badge">Customize</div>
            </div>
            <div className="nav-card-content">
              <h3>Nastavení</h3>
              <p>Konfigurace účtu, bezpečnost a API klíče</p>
            </div>
            <div className="nav-card-footer">
              <span className="nav-card-link-text">Otevřít nastavení</span>
              <div className="nav-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Active Plans Widget */}
      <section className="active-plans-section">
        <div className="section-header">
          <h2>Aktivní Plány</h2>
          <span className="plan-count">{activePlans.length} aktivní</span>
        </div>

        <div className="plans-grid">
          {activePlans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.type}-plan`}>
              <div className="plan-header">
                <div className="plan-type-badge">
                  {plan.type === 'managed' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                    </svg>
                  )}
                  <span>{plan.type === 'managed' ? 'Managed' : 'Autonomous'}</span>
                </div>
                <div className={`status-indicator ${plan.status}`}>
                  <span className="status-dot"></span>
                  {plan.status}
                </div>
              </div>

              <h3 className="plan-name">{plan.name}</h3>

              <div className="plan-stats">
                <div className="stat-row">
                  <span className="stat-label">Balance:</span>
                  <span className="stat-value balance">${plan.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Profit:</span>
                  <span className={`stat-value profit ${plan.profit >= 0 ? 'positive' : 'negative'}`}>
                    {plan.profit >= 0 ? '+' : ''}${plan.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="profit-percent">({plan.profit >= 0 ? '+' : ''}{plan.profitPercent.toFixed(2)}%)</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Trades:</span>
                  <span className="stat-value">{plan.trades}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Start Date:</span>
                  <span className="stat-value">{new Date(plan.startDate).toLocaleDateString('cs-CZ')}</span>
                </div>
              </div>

              <div className="plan-footer">
                <Link href={plan.type === 'managed' ? '/investment' : '/autonomous'} className="view-details-btn">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
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
          margin-bottom: 2.5rem;
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

        /* Quick Navigation Section - PREMIUM STYLE */
        .quick-nav-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 3rem;
        }

        .nav-card {
          position: relative;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(230, 0, 0, 0.2);
        }

        .nav-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: all 0.4s ease;
        }

        .nav-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        }

        .nav-card:hover::before {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Animated Gradient Backgrounds */
        .nav-card-bg-gradient {
          position: absolute;
          inset: 0;
          opacity: 0.08;
          transition: opacity 0.4s ease;
          z-index: 0;
        }

        .investment-card .nav-card-bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .autonomous-card .nav-card-bg-gradient {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .settings-card .nav-card-bg-gradient {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .nav-card:hover .nav-card-bg-gradient {
          opacity: 0.15;
        }

        /* Glow Effect */
        .nav-card-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
        }

        .investment-card .nav-card-glow {
          background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
        }

        .autonomous-card .nav-card-glow {
          background: radial-gradient(circle, rgba(245, 87, 108, 0.4) 0%, transparent 70%);
        }

        .settings-card .nav-card-glow {
          background: radial-gradient(circle, rgba(79, 172, 254, 0.4) 0%, transparent 70%);
        }

        .nav-card:hover .nav-card-glow {
          opacity: 1;
        }

        /* Card Inner Content */
        .nav-card-inner {
          position: relative;
          z-index: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Header with Icon and Badge */
        .nav-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .nav-card-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .icon-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .investment-card .icon-glow {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .autonomous-card .icon-glow {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .settings-card .icon-glow {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .nav-card:hover .icon-glow {
          opacity: 0.6;
        }

        .nav-card-icon {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
        }

        .nav-card:hover .nav-card-icon {
          transform: scale(1.1) rotate(5deg);
          background: rgba(255, 255, 255, 0.1);
        }

        .investment-card .nav-card-icon {
          color: #667eea;
        }

        .autonomous-card .nav-card-icon {
          color: #f5576c;
        }

        .settings-card .nav-card-icon {
          color: #4facfe;
        }

        .nav-card-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        /* Content */
        .nav-card-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
          transition: transform 0.3s ease;
        }

        .nav-card:hover .nav-card-content h3 {
          transform: translateX(4px);
        }

        .nav-card-content p {
          font-size: 0.875rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Footer */
        .nav-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-card-link-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .nav-card:hover .nav-card-link-text {
          color: #fff;
        }

        .nav-card-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .nav-card:hover .nav-card-arrow {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        /* Active Plans Section */
        .active-plans-section {
          margin-top: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .plan-count {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
        }

        .plans-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .plan-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .plan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          opacity: 0.7;
        }

        .managed-plan::before {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .autonomous-plan::before {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        }

        .plan-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .plan-type-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.6);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
          padding: 0.25rem 0.625rem;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .plan-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 1rem 0;
        }

        .plan-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
        }

        .stat-value.balance {
          font-size: 1rem;
          color: #fff;
        }

        .stat-value.profit {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .stat-value.profit.positive {
          color: #22c55e;
        }

        .stat-value.profit.negative {
          color: #ef4444;
        }

        .profit-percent {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .plan-footer {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
        }

        .view-details-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .view-details-btn:hover {
          color: #fff;
          gap: 0.75rem;
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

          .plans-grid {
            gap: 1.25rem;
          }

          .nav-card-inner {
            padding: 1.75rem;
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

          .quick-nav-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .settings-card {
            grid-column: span 2;
          }

          .plans-grid {
            grid-template-columns: repeat(2, 1fr);
            display: grid;
          }

          .section-header h2 {
            font-size: 1.5rem;
          }
        }

        /* ============================================
           DESKTOP (1024px+)
           ============================================ */
        @media (min-width: 1024px) {
          .quick-nav-section {
            grid-template-columns: repeat(3, 1fr);
          }

          .settings-card {
            grid-column: span 1;
          }

          .plans-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .nav-card-inner {
            padding: 2rem;
          }
        }

        /* ============================================
           LARGE DESKTOP (1280px+)
           ============================================ */
        @media (min-width: 1280px) {
          .header-left h1 {
            font-size: 2rem;
          }

          .plan-card {
            padding: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
