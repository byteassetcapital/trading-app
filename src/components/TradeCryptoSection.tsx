import React from 'react';
import Link from 'next/link';

export default function TradeCryptoSection() {
    return (
        <section className="trade-crypto-section">
            <div className="content-container">
                <h2 className="title">Trade Crypto</h2>
                <p className="subtitle">Seamless. Secure. Smart.</p>

                <div className="cta-wrapper">
                    <Link href="/register" className="btnPrimary start-trading-btn">
                        START TRADING
                    </Link>
                </div>

                <div className="floating-icons">
                    {/* Bitcoin */}
                    <div className="icon-wrapper btc">
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 7h10.5a3.5 3.5 0 0 1 0 7H17v0h1a3.5 3.5 0 0 1 0 7H7V7z" />
                            <path d="M12 7v14" />
                            <path d="M11 4v3" />
                            <path d="M11 21v3" />
                            <path d="M15 4v3" />
                            <path d="M15 21v3" />
                        </svg>
                    </div>

                    {/* Ethereum */}
                    <div className="icon-wrapper eth">
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 2L6 14l10 6 10-6L16 2z" />
                            <path d="M16 30V20l10-6-10 16-10-16 10 6z" />
                        </svg>
                    </div>

                    {/* Litecoin */}
                    <div className="icon-wrapper ltc">
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 6v14.5a1.5 1.5 0 0 0 1.5 1.5h10" />
                            <path d="M9 14l8-4" />
                        </svg>
                    </div>

                    {/* Ripple/XRP-ish */}
                    <div className="icon-wrapper xrp">
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="16" cy="16" r="10" />
                            <path d="M16 11a5 5 0 0 1 0 10 5 5 0 0 1 0-10" />
                            <path d="M12 22l4 4 4-4" />
                        </svg>
                    </div>

                    {/* Lightning/Flash */}
                    <div className="icon-wrapper flash">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>

                    {/* Another generic coin */}
                    <div className="icon-wrapper coin">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 18V6" />
                        </svg>
                    </div>
                </div>

                <div className="partners">
                    <span className="partner-text">BINANCE</span>
                    <span className="partner-dot">•</span>
                    <span className="partner-text">COINBASE</span>
                    <span className="partner-dot">•</span>
                    <span className="partner-text">KRAKEN</span>
                </div>
            </div>

            <style jsx>{`
        .trade-crypto-section {
          position: relative;
          width: 100%;
          min-height: 500px;
          padding: 6rem 1.5rem;
          background: radial-gradient(circle at center, #e49eac0a 0%,var(--background) 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-container {
          position: relative;
          z-index: 10;
          text-align: center;
          width: 100%;
          max-width: 800px;
        }

        .title {
          font-size: clamp(3rem, 8vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #fff;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
          letter-spacing: -1px;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #888;
          margin-bottom: 3rem;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .cta-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 20;
        }

        .start-trading-btn {
          /* Specific override for this button to match the neon vibe */
          min-width: 200px;
          background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%); 
          /* Override global btnPrimary for this specific section look if needed, 
             but let's respect the design system first. 
             If user wants "reference image" look, that button was purple/blue.
             Global btnPrimary is Bordeaux/Rosewood. 
             Let's use a special class to blend both. */
           background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%);
           border: none;
           box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
           color: white;
           font-weight: 700;
           letter-spacing: 1px;
        }
        
        .start-trading-btn:hover {
           box-shadow: 0 0 40px rgba(138, 43, 226, 0.7);
           transform: translateY(-2px);
        }

        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .icon-wrapper {
          position: absolute;
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
          color: rgba(255, 255, 255, 0.2);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
        }

        .icon-wrapper svg {
          width: 60px;
          height: 60px;
        }
        
        /* Specific Icon Positioning & Colors */
        .btc {
          top: 20%;
          left: 15%;
          color: #F7931A;
          animation-duration: 7s;
          animation-delay: 0s;
        }
        
        .eth {
          top: 15%;
          right: 20%;
          color: #627EEA;
          animation-duration: 8s;
          animation-delay: 1s;
        }
        
        .ltc {
          bottom: 25%;
          left: 25%;
          color: #345D9D;
          animation-duration: 6s;
          animation-delay: 2s;
        }
        
        .xrp {
          top: 40%;
          right: 10%;
          color: #23292F;
          stroke: #008CE7; /* Specific stroke color override if needed */
          animation-duration: 9s;
          animation-delay: 0.5s;
        }
        .xrp svg { color: #008CE7; }
        
        .flash {
          bottom: 30%;
          right: 30%;
          color: #FFD700;
          animation-duration: 5s;
          animation-delay: 1.5s;
        }
        
        .coin {
           top: 50%;
           left: 5%;
           color: #ccc;
           animation-duration: 10s;
           animation-delay: 3s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        
        .partners {
           display: flex;
           justify-content: center;
           gap: 1.5rem;
           color: #555;
           font-size: 0.8rem;
           font-weight: 600;
           letter-spacing: 1px;
           margin-top: 2rem;
        }
        
        .partner-dot {
           color: #333;
        }
        
         @media (max-width: 768px) {
            .title {
               font-size: 2.5rem;
            }
            .icon-wrapper svg {
               width: 40px;
               height: 40px;
            }
            .btc { top: 10%; left: 5%; }
            .eth { top: 10%; right: 5%; }
         }

      `}</style>
        </section>
    );
}
