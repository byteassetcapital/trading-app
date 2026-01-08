"use client";

import React from 'react';
import EarlyAccessForm from './EarlyAccessForm';

const FreeTrialBenefits = () => {
  const benefits = [
    {
      icon: "📊",
      text: "7 dní paper trading s virtuálními $1,000",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: "💳",
      text: "Žádná platební karta",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: "🔒",
      text: "Žádný risk vlastních peněz",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: "👁️",
      text: "Vidíš systém v akci",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: "🤖",
      text: "Žádné ruční obchodování",
      gradient: "from-violet-500/20 to-purple-500/20"
    }
  ];

  return (
    <section className="free-trial-section">
      <div className="trial-container">
        {/* Header */}
        <div className="trial-header">
          <span className="trial-badge">ZDARMA</span>
          <h2 className="trial-title">
            Co získáš s <span className="gradient-highlight">Free Trial</span>
          </h2>
          <p className="trial-subtitle">
            Vyzkoušej našu platformu bez rizika a přesvědč se sám
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Icon Circle with Glow */}
              <div className="icon-container">
                <div className="icon-glow"></div>
                <span className="benefit-icon">{benefit.icon}</span>
              </div>

              {/* Benefit Text */}
              <p className="benefit-text">{benefit.text}</p>

              {/* Checkmark */}
              <div className="checkmark-wrapper">
                <svg
                  className="checkmark"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Card Background Gradient */}
              <div className="card-bg-gradient"></div>
            </div>
          ))}
        </div>

        <EarlyAccessForm />

        {/* CTA Button */}
        <div className="trial-cta-wrapper">
          <button className="trial-cta-button">
            <span className="button-shimmer"></span>
            <span className="button-text">Začít Free Trial</span>
            <svg
              className="button-arrow"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .free-trial-section {
          width: 100%;
          padding: 6rem 1.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }

        /* Animated background gradient spots */
        .free-trial-section::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(149, 77, 95, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s ease-in-out infinite;
        }

        .free-trial-section::after {
          content: '';
          position: absolute;
          bottom: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(228, 158, 172, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 15s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.1);
          }
        }

        .trial-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;

        }

        /* Header Styles */
        .trial-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .trial-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(149, 77, 95, 0.2);
          border: 1px solid rgba(228, 158, 172, 0.3);
          border-radius: 50px;
          color: var(--pink-mist);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          animation: pulse-badge 2s ease-in-out infinite;
        }

        @keyframes pulse-badge {
          0%, 100% {
            box-shadow: 0 0 20px rgba(228, 158, 172, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(228, 158, 172, 0.4);
          }
        }

        .trial-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .gradient-highlight {
          background: linear-gradient(135deg, var(--rosewood) 0%, var(--pink-mist) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .trial-subtitle {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #b0b0b0;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Benefits Grid */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .benefit-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideUp 0.6s ease-out backwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .benefit-card:hover {
          transform: translateY(-8px);
          border-color: rgba(228, 158, 172, 0.3);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 0 30px rgba(228, 158, 172, 0.05);
        }

        .benefit-card:hover .icon-glow {
          transform: scale(1.5);
          opacity: 0.3;
        }

        .benefit-card:hover .checkmark {
          transform: scale(1.1);
          color: var(--pink-mist);
        }

        /* Icon Styles */
        .icon-container {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .icon-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(149, 77, 95, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(20px);
          transition: all 0.4s ease;
          opacity: 0.2;
        }

        .benefit-icon {
          font-size: 2.5rem;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        /* Benefit Text */
        .benefit-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: #f8fafc;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        /* Checkmark */
        .checkmark-wrapper {
          width: 32px;
          height: 32px;
          background: rgba(34, 197, 94, 0.15);
          border: 1.5px solid rgba(34, 197, 94, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          color: #4ade80;
          transition: all 0.3s ease;
        }

        /* Card Background Gradient */
        .card-bg-gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(149, 77, 95, 0.08) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .benefit-card:hover .card-bg-gradient {
          opacity: 1;
        }

        /* CTA Button */
        .trial-cta-wrapper {
          display: flex;
          justify-content: center;
        }

        .trial-cta-button {
          position: relative;
          background: linear-gradient(135deg, var(--night-bordeaux) 0%, var(--rosewood) 100%);
          color: #ffffff;
          border: 1px solid rgba(228, 158, 172, 0.4);
          border-radius: 50px;
          padding: 1.2rem 3rem;
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          display: none;
        }

        .trial-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 10px 30px rgba(149, 77, 95, 0.4),
            inset 0 0 20px rgba(228, 158, 172, 0.2);
        }

        .trial-cta-button:active {
          transform: translateY(0);
        }

        /* Button Shimmer Effect */
        .button-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        .button-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .trial-cta-button:hover .button-arrow {
          transform: translateX(4px);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .free-trial-section {
            padding: 4rem 1.5rem;
          }

          .trial-header {
            margin-bottom: 3rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .benefit-card {
            padding: 2rem 1.5rem;
          }

          .trial-cta-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default FreeTrialBenefits;
