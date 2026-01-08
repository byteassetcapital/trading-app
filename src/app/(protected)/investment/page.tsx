"use client";

import React, { useState } from 'react';
import MetricCard from '@/components/investment/MetricCard';
import SecondaryNav from '@/components/investment/SecondaryNav';
import styles from './page.module.css';

// Icons
const WalletIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const PercentIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" x2="5" y1="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
);

const ActivityIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function InvestmentDashboard() {
    const [activeSection, setActiveSection] = useState('overview');

    // Fake data
    const metrics = {
        totalBalance: '$125,847.50',
        totalProfit: '$23,456.80',
        totalReturn: '22.9%',
        inTrade: '8',
        realizedTrades: '156'
    };

    const renderOverview = () => (
        <div className={styles.overview}>
            <div className={styles.metricsGrid}>
                <MetricCard
                    title="Celková Bilance"
                    value={metrics.totalBalance}
                    change="+8.5%"
                    isPositive={true}
                    icon={<WalletIcon />}
                />
                <MetricCard
                    title="Celkový Profit"
                    value={metrics.totalProfit}
                    change="+12.3%"
                    isPositive={true}
                    icon={<TrendingUpIcon />}
                />
                <MetricCard
                    title="Celková Návratnost"
                    value={metrics.totalReturn}
                    change="+3.2%"
                    isPositive={true}
                    icon={<PercentIcon />}
                />
                <MetricCard
                    title="Právě v Obchodu"
                    value={metrics.inTrade}
                    icon={<ActivityIcon />}
                />
                <MetricCard
                    title="Realizované Obchody"
                    value={metrics.realizedTrades}
                    icon={<CheckCircleIcon />}
                />
            </div>

            <div className={styles.contentGrid}>
                {/* Portfolio Distribution */}
                <div className={styles.contentPanel}>
                    <h3 className={styles.panelTitle}>Portfolio Distribuce</h3>
                    <div className={styles.distributionList}>
                        <div className={styles.distributionItem}>
                            <div className={styles.distributionInfo}>
                                <span className={styles.assetName}>Bitcoin (BTC)</span>
                                <span className={styles.assetPercent}>45%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '45%' }}></div>
                            </div>
                            <span className={styles.assetValue}>$56,631.38</span>
                        </div>
                        <div className={styles.distributionItem}>
                            <div className={styles.distributionInfo}>
                                <span className={styles.assetName}>Ethereum (ETH)</span>
                                <span className={styles.assetPercent}>30%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '30%' }}></div>
                            </div>
                            <span className={styles.assetValue}>$37,754.25</span>
                        </div>
                        <div className={styles.distributionItem}>
                            <div className={styles.distributionInfo}>
                                <span className={styles.assetName}>Solana (SOL)</span>
                                <span className={styles.assetPercent}>15%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '15%' }}></div>
                            </div>
                            <span className={styles.assetValue}>$18,877.13</span>
                        </div>
                        <div className={styles.distributionItem}>
                            <div className={styles.distributionInfo}>
                                <span className={styles.assetName}>Ostatní</span>
                                <span className={styles.assetPercent}>10%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '10%' }}></div>
                            </div>
                            <span className={styles.assetValue}>$12,584.74</span>
                        </div>
                    </div>
                </div>

                {/* Recent Performance */}
                <div className={styles.contentPanel}>
                    <h3 className={styles.panelTitle}>Výkon za Poslední Měsíc</h3>
                    <div className={styles.performanceList}>
                        <div className={styles.performanceItem}>
                            <span className={styles.performanceLabel}>Týden 1</span>
                            <span className={styles.performanceValue}>+$1,234.50</span>
                            <span className={`${styles.performanceChange} ${styles.positive}`}>+2.1%</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span className={styles.performanceLabel}>Týden 2</span>
                            <span className={styles.performanceValue}>+$2,845.20</span>
                            <span className={`${styles.performanceChange} ${styles.positive}`}>+4.5%</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span className={styles.performanceLabel}>Týden 3</span>
                            <span className={styles.performanceValue}>-$456.80</span>
                            <span className={`${styles.performanceChange} ${styles.negative}`}>-0.7%</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span className={styles.performanceLabel}>Týden 4</span>
                            <span className={styles.performanceValue}>+$3,120.40</span>
                            <span className={`${styles.performanceChange} ${styles.positive}`}>+5.2%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className={styles.section}>
            <div className={styles.contentPanel}>
                <h3 className={styles.panelTitle}>Nastavení Investice</h3>
                <div className={styles.settingsForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Výchozí Alokace</label>
                        <input type="text" className={styles.input} placeholder="např. 1000 USDT" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Auto-Reinvestice</label>
                        <div className={styles.toggleWrapper}>
                            <label className={styles.toggle}>
                                <input type="checkbox" />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={styles.toggleLabel}>Zapnuto</span>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Maximální Expozice</label>
                        <input type="text" className={styles.input} placeholder="např. 50%" />
                    </div>
                    <button className={styles.saveButton}>Uložit Nastavení</button>
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

    const renderGoals = () => (
        <div className={styles.section}>
            <div className={styles.contentPanel}>
                <h3 className={styles.panelTitle}>Nastavení Cílů & Risk Profile</h3>
                <div className={styles.settingsForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Investiční Cíl</label>
                        <select className={styles.select}>
                            <option>Konzervativní Růst</option>
                            <option>Vyvážený Růst</option>
                            <option>Agresivní Růst</option>
                            <option>Maximální Výnos</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Časový Horizont</label>
                        <select className={styles.select}>
                            <option>Krátkodobý (0-1 rok)</option>
                            <option>Střednědobý (1-3 roky)</option>
                            <option>Dlouhodobý (3-5 let)</option>
                            <option>Velmi dlouhodobý (5+ let)</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Riziková Tolerance</label>
                        <div className={styles.riskSlider}>
                            <input type="range" min="1" max="5" defaultValue="3" className={styles.slider} />
                            <div className={styles.riskLabels}>
                                <span>Nízká</span>
                                <span>Střední</span>
                                <span>Vysoká</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Maximální Denní Ztráta</label>
                        <input type="text" className={styles.input} placeholder="např. 5%" />
                    </div>
                    <button className={styles.saveButton}>Uložit Profil</button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return renderOverview();
            case 'settings':
                return renderSettings();
            case 'funds':
                return renderFunds();
            case 'goals':
                return renderGoals();
            default:
                return renderOverview();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Investiční Dashboard</h1>
                <p className={styles.subtitle}>Sledujte a spravujte své investice</p>
            </div>

            <SecondaryNav activeSection={activeSection} onSectionChange={setActiveSection} />

            {renderContent()}
        </div>
    );
}
