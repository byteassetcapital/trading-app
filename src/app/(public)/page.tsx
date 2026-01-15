"use client";

import Link from "next/link";
import React from 'react';

import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TradeCryptoSection from '@/components/TradeCryptoSection';
import FreeTrialBenefits from '@/components/FreeTrialBenefits';
import EarlyAccessForm from '@/components/EarlyAccessForm';
import styles from './page.module.css';


export default function Home() {


  return (


    <main className="section-screen">
      <section className="comming-wrapper">
        <div className="comming-content">


          <div style={{
            display: 'flex',          // Aktivuje flexbox
            flexDirection: 'column',   // Srovná prvky (h1 a p) pod sebe
            alignItems: 'center',      // Vycentruje prvky horizontálně
            justifyContent: 'center',  // Vycentruje prvky vertikálně (pokud má div výšku)
            textAlign: 'center',       // Zajistí, že se vycentruje i samotný text uvnitř řádků
            maxWidth: '800px',         // Pro čtení textu je lepší menší šířka než 1200px
            margin: '0 auto',          // Vycentruje samotný kontejner na stránce
            padding: '0 20px',
            rowGap: '0.7rem',
          }}>
            <h1 className="h1">Autonomní AI Trading</h1>
            <p className="subtitle2">
              Nový projekt s ambicí změnit způsob, jakým lidé investují do kryptoměn. Vyzkoušej zdarma na virtuálních penězích.
            </p>
          </div>



          <div style={{
            position: 'relative',
            width: '95%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '20px',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderStyle: 'solid',
            marginTop: '20px',
            marginBottom: '20px',
          }}>
            <video
              src="/vid.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block' // Přidejte toto
              }}
            />
          </div>











          <div onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
              cursor: 'pointer'
            }}>
            <div className="scroll-arrow">
              {/* Jednoduchá SVG šipka */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>
      </section >


      {/* FREE TRIAL BENEFITS SECTION */}
      <FreeTrialBenefits />





      <div className="hero-content">
        <h1 className="glow-text title">Trade Without Emotion.
          <br /><span className="gradient-text">Win With Intelligence.</span></h1>
        <p className="subtitle">Nový Přístup k Automatizovanému Tradingu</p>

        <div style={{
          display: 'none',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }} className="cta-group">
          <Link href="/register" className="btnPrimary">Start Trading Now</Link>
          <Link href="/login" className="btnSecondary">Client Login</Link>
        </div>



      </div>







      {/* NOVÁ SEKCE - Opravená pro loga */}
      <section className="image-section">
        <div className="image-container">
          <div className="img-wrapper"><img src="/coinbase.png" alt="Coinbase" /></div>
          <div className="img-wrapper"><img src="/binance.png" alt="Binance" /></div>
          <div className="img-wrapper"><img src="/bitget.png" alt="Bitget" /></div>
        </div>
      </section>

      {/* FEATURE BENTO GRID SECTION */}
      <section className="features-section">
        <div className="bento-grid">
          {/* Card 1: 24/7 */}
          <div className="bento-card card-247">
            <div className="card-content">
              <h3>24/7 Trading</h3>
              <p>Nonstop Trading</p>
            </div>
            <div className="bg-text-247"><span className="slash"></span></div>
          </div>

          {/* Card 2: 0% Emotions */}
          <div className="bento-card card-emotions">
            <div className="card-content">
              <h3>0% Emocionálních chyb</h3>
              <p>Nonstop Trading</p>
            </div>
          </div>

          {/* Card 3: Bez unavy */}
          <div className="bento-card card-fatigue">
            <div className="card-content">
              <h1>Bez Únavy</h1>
            </div>
            <div className="fatigue-graphic">
            </div>
          </div>

          {/* Card 4: Real time */}
          <div className="bento-card card-realtime">
            <div className="card-content">
              <h3>Sleduj real time</h3>
              <p>Nonstop Trading</p>
            </div>
            <div className="dashboard-preview">
              {/* User will replace this image */}
              <img src="/dashboard.png" alt="Dashboard Preview" className="dashboard-img" />
            </div>
          </div>
        </div>
      </section>




      {/* CONSISTENCY SECTION */}
      <section className="consistency-section">


        <div className="cards-wrapper">
          {/* Left Card */}
          <div className="info-card side-card left">
            <div className="card-top">
              <h3>Proč většina traderů selže</h3>
              <p>Emoce, chaos a nekonzistence. AI dělá to, co člověk dlouhodobě nedokáže – drží plán.</p>
            </div>
            <div className="card-bottom">
              <div className="icon-wrapper">
                {/* Placeholder for bulb icon */}
                <span className="bulb-glow"></span>
                <img src="/bulb.png" alt="Icon" className="card-icon" />
              </div>
            </div>
          </div>

          {/* Center Card (Highlighted) */}
          <div className="info-card center-card">
            <div className="card-top">
              <h3>AI trading od 10 000 Kč</h3>
              <p>LSystém postavený na volume datech, řízení rizika a opakovatelnosti.</p>
            </div>
            <div className="card-bottom">
              <div className="icon-wrapper">
                <span className="bulb-glow-strong"></span>
                <img src="/bulb.png" alt="Icon" className="card-icon" />
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="info-card side-card right">
            <div className="card-top">
              <h3>Bez manuálních zásahů</h3>
              <p>Algoritmus pracuje 24/5. Ty sleduješ výkon, ne grafy.</p>
            </div>
            <div className="card-bottom">
              <div className="icon-wrapper">
                <span className="bulb-glow"></span>
                <img src="/bulb.png" alt="Icon" className="card-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TradeCryptoSection />

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <h2 className="section-title">Jak Funguje Náš systém</h2>

        <div className="timeline-container">
          {/* Item 1 (Left) */}
          <div className="timeline-item left">
            <div className="timeline-card">
              <div className="pill-badge">
                <span className="icon">▤</span> AI Market Scanner
              </div>
              <h3>AI analyzuje trh bez emocí</h3>
              <p>Systém nepřetržitě skenuje trh, identifikuje strukturu, likviditu a volatilitu. Trh nehodnotí podle pocitu, ale podle dat, která určují pravděpodobnost.</p>
            </div>
          </div>

          {/* Item 2 (Right) */}
          <div className="timeline-item right">
            <div className="timeline-card">
              <div className="pill-badge">
                <span className="icon">🛡️</span> Risk Engine
              </div>
              <h3>Určí přesný risk a velikost pozice</h3>
              <p>Model spočítá ideální velikost pozice, stop-loss a expozici podle aktuální volatility. Výsledek: žádné impulzivní vstupy, žádné přestřelené pozice.</p>
            </div>
          </div>

          {/* Item 3 (Left) */}
          <div className="timeline-item left">
            <div className="timeline-card">
              <div className="pill-badge">
                <span className="icon">🎯</span> High-Probability Entry
              </div>
              <h3>Vstupuje jen do situací s vysokou šancí úspěchu</h3>
              <p>AI filtruje šum, falešné pohyby a manipulační svíčky. Obchod otevírá pouze v momentě, kdy trh dává statisticky ověřenou výhodu.</p>
            </div>
          </div>

          {/* Item 4 (Right) */}
          <div className="timeline-item right">
            <div className="timeline-card">
              <div className="pill-badge">
                <span className="icon">⚡</span> Emotion-Free Execution
              </div>
              <h3>Automaticky vykonává plán bez emocí</h3>
              <p>Žádná chamtivost. Žádná panikaření. Žádná pomsta trhu. AI dodrží exit, protože nepodléhá stresu ani FOMO.</p>
            </div>
          </div>

          {/* Item 5 (Left) */}
          <div className="timeline-item left">
            <div className="timeline-card">
              <div className="pill-badge">
                <span className="icon">🌐</span> Macro-Aware Filtering
              </div>
              <h3>Kontroluje makroekonomická data a vyhýbá se rizikovým podmínkám</h3>
              <p>AI filtruje šum, falešné pohyby a manipulační svíčky. Obchod otevírá pouze v momentě, kdy trh dává statisticky ověřenou výhodu.</p>
            </div>
          </div>
        </div>
      </section>






      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />
      <div style={{ display: "none" }}>
        {/* PRICING SECTION */}
        <PricingSection />
        <div className="important-info">
          <p>Všechny strategie jsou backtestovány na historických datech od 2015, live track record od 2023. Kapitál klienta je vždy segregován. Žádné skryté poplatky.</p>
        </div>
      </div>


      <div id="early-access" style={{
        display: 'flex',              /* Aktivuje Flexbox */
        flexDirection: 'column',     /* Seřadí prvky pod sebe */
        justifyContent: 'center',    /* Vycentruje vertikálně (v rámci výšky) */
        alignItems: 'center',        /* Vycentruje horizontálně */
        textAlign: 'center',         /* Vycentruje text uvnitř h1 */
        minHeight: '50vh',           /* Minimální výška sekce */
        width: '100%'                /* Aby se roztáhl na celou šířku */
      }}>
        <h1>Zaregistrujte se k předběžnému přístupu a my Vás upozorníme!</h1>
        <EarlyAccessForm />
      </div>

      <style jsx>{`

 
  .feature-list {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    gap: 12px; /* Mezera mezi řádky */
  }

  .feature-item {
    display: flex;
    align-items: center; /* Zarovná fajfku na střed textu */
    font-size: 16px;
    color: #333;
  }

  .check {
    color: #2ecc71; /* Zelená barva pro fajfku */
    font-weight: bold;
    margin-right: 10px; /* Mezera mezi fajfkou a textem */
    width: 20px; /* Fixní šířka, aby text začínal pod sebou */
  }

  .text {
    line-height: 1.4;
  }


.comming-wrapper {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background-color: #0D0105;
  
  /* Zvýrazněné gradienty pro lepší viditelnost */
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(149, 77, 95, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(70, 33, 44, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(228, 158, 172, 0.15) 0%, transparent 40%);
  
  background-size: 200% 200%; /* Zvětšeno pro větší manévrovací prostor */
  animation: premiumFlow 11.4s ease-in-out infinite alternate;
}

@keyframes premiumFlow {
  0% {
    background-position: 5% 5%;
    filter: hue-rotate(0deg) brightness(1);
  }
  25% {
    background-position: 80% 15%; /* Úskok do strany */
  }
  50% {
    background-position: 40% 90%; /* Pád dolů */
    filter: hue-rotate(8deg) brightness(1.1); /* Mírné rozsvícení v polovině */
  }
  75% {
    background-position: 95% 45%; /* Šikmý pohyb nahoru */
  }
  100% {
    background-position: 10% 85%; /* Návrat jinou cestou */
    filter: hue-rotate(15deg) brightness(1);
  }
}

.comming-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  padding-top: 140px;
}

      .important-info  { 
        margin: 0 auto;
        text-align: center;
        font-size: 11px; 
        font-style: italic;
        color: #888; 
        line-height: 1.5; 
        margin-bottom: 2rem; 
        min-height: 40px; 
        max-width: 50%;
        background-color: var(--background);
      }



        /* --- GLOBAL RESET & VARS --- */
        :global(*) {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* --- LAYOUT STRUCTURE (MOBILE BASE) --- */
        .section-screen {
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          background-color: #0D0105;
          color: #fff;
          padding: 0;
        }

        /* --- HERO SECTION --- */
        /* --- HERO SECTION --- */
        .hero-content {
          text-align: center;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* Vertically center content */
          min-height: 70vh; /* Full viewport height fallback */
          min-height: 60vh; /* Dynamic viewport height */
          background-color: var(--background);
        }

        .title {
          font-size: clamp(2.5rem, 10vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: clamp(1rem, 4vw, 1.5rem);
          color: #b0b0b0;
          margin-bottom: 3rem;
          max-width: 600px;
          line-height: 1.5;
        }

        /* CTAs: Mobile Stacked Full Width */
        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 400px;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 2rem; /* Easy thumb click */
          border-radius: 100px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          width: 100%; /* Full width on mobile */
          font-size: 1.1rem;
        }

        .btn-primary {
          background: white;
          color: black;
        }
        
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
        }

        /* --- LOGO SECTION --- */
        .image-section {
          width: 100%;
          padding: 1rem;
          display: flex;
          justify-content: center;
          padding-bottom: 3rem;
          background: var(--background);
        }

        .image-container {
          display: flex;
          flex-direction: column; /* Stacked on mobile */
          gap: 2rem;
          width: 100%;
          max-width: 1100px;
          align-items: center;
          opacity: 0.7;
        }

        .img-wrapper img {
          height: 35px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%) brightness(1.5);
          opacity: 0.8;
          transition: opacity 0.3s;
        }
        .img-wrapper img:hover { opacity: 1; }

        /* --- FEATURES SECTION (Bento) --- */
        .features-section {
          width: 100%;
          padding: 4rem 1.5rem;
          display: flex;
          justify-content: center;
          background-color: var(--background);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: 1fr; /* 1 Column Mobile */
          gap: 1.5rem;
          width: 100%;
          max-width: 1000px;
        }

        .bento-card {
          background: #0b0b0f;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 280px;
          transition: transform 0.3s ease;
        }

        .card-content { z-index: 2; position: relative; }
        .card-content h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .card-content p { font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }

        /* Card Specifics */
        .card-247::before {
           content: ""; position: absolute; inset: 0;
           background-image: url('/247.png'); background-size: cover; background-position: bottom left; opacity: 0.3;
        }
        .bg-text-247 {
            position: absolute; bottom: 10px; left: 10px;
            font-size: 4rem; font-weight: 900; color: #fff; opacity: 0.05; pointer-events: none;
        }

        .card-emotions {
            background: linear-gradient(180deg, #0b0b0f 50%, var(--night-bordeaux) 100%);
        }
        .card-emotions::before {
             content: ""; position: absolute; inset: 0;
             background-image: url('/emotions.png'); background-size: cover; background-position: bottom right; opacity: 0.3; pointer-events: none;
        }

        .card-fatigue {
            background: radial-gradient(circle at top left, var(--night-bordeaux) 20%, transparent 100%);
            background-color: #0a0a0e;
            align-items: center; justify-content: center; text-align: center;
        }
        .fatigue-graphic { /* Placeholder if needed */ }

        .card-realtime {
            background: linear-gradient(180deg, #0b0b0f 0%, var(--night-bordeaux) 225%);
            padding-bottom: 0;
            min-height: 400px;
        }
        .dashboard-preview { margin-top: 2rem; width: 100%; display: flex; justify-content: center; }
        .dashboard-img { width: 100%; height: auto; border-radius: 12px 12px 0 0; }


        /* --- CONSISTENCY SECTION --- */
        .consistency-section {
            width: 100%;
            padding: 4rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            display: none;
        }

        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-header h2 { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 800; line-height: 1.2; }

        .cards-wrapper {
            display: flex;
            flex-direction: column; /* Stacked Mobile */
            gap: 2rem;
            width: 100%;
            max-width: 1200px;
            align-items: center;
            display: none;
        }

        .info-card {
            background: #0b0b0f;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: 2rem;
            width: 100%;
            max-width: 400px; /* Limit width on mobile but allow full width */
            min-height: 350px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            display: none;
        }
        
        .info-card.center-card {
             background: linear-gradient(180deg, #111116 0%, #16161e 100%);
             border: 1px solid rgba(255,255,255,0.1);
             /* No extra scale on mobile for simplicity */
             display: none;
        }
        
        .icon-wrapper {
            position: relative; width: 80px; height: 80px;
            display: flex; justify-content: center; align-items: center;
            margin-top: 2rem;
        }
        .bulb-glow {
            position: absolute; width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(123, 44, 191, 0.3), transparent 70%); filter: blur(10px);
        }
        .bulb-glow-strong {
            position: absolute; width: 150%; height: 150%;
            background: radial-gradient(circle, rgba(123, 44, 191, 0.5), transparent 70%); filter: blur(15px);
        }
        .card-icon {
            width: 50px; height: auto; position: relative; z-index: 2; opacity: 0.8;
        }

        /* --- HOW IT WORKS (Timeline) --- */
        .how-it-works-section {
            width: 100%;
            padding: 4rem 1.5rem;
            background-color: var(--background);
        }
        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            text-align: center;
            margin-bottom: 3rem;
            color: #fff;
        }

        .timeline-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            position: relative;
            padding-left: 1.5rem;
            border-left: 2px solid rgba(255,255,255,0.1); /* Left line for mobile */
        }

        .timeline-item {
            width: 100%;
            display: flex;
            justify-content: flex-start;
        }

        .timeline-card {
            background: #0b0b0f;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 1.5rem;
            width: 100%;
            position: relative;
        }
        
        .timeline-card h3 {
             font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.3;
        }
        .timeline-card p {
             font-size: 0.95rem; color: #888; line-height: 1.6;
        }

        .pill-badge {
             display: inline-flex; align-items: center; gap: 8px;
             background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
             border-radius: 100px; padding: 6px 14px; font-size: 0.8rem; margin-bottom: 1rem; color: #ccc;
        }
        .pill-badge .icon { font-size: 1rem; opacity: 0.8; }

/* Old Pricing Styles REMOVED - handled in component */
        .pricing-btn:hover { border-color: #fff; background: rgba(255,255,255,0.05); }
        
        .pricing-btn.pro-btn {
             background: rgba(0, 180, 216, 0.1); border-color: #00b4d8;
        }
        .pricing-btn.pro-btn:hover {
             box-shadow: 0 0 25px rgba(0, 180, 216, 0.4);
        }
        
        .spacer { flex-grow: 1; }


        /* ========================================= */
        /* --- DESKTOP / TABLET OVERRIDES (min-width) --- */
        /* ========================================= */
        
        @media (min-width: 768px) {
           
           /* HERO */
           /* HERO */
           .hero-content {
              padding-top: 0;
              margin-bottom: 0;
           }
           .cta-group {
              flex-direction: row;
              width: auto;
              max-width: none;
           }


           /* LOGOS */
           .image-container {
              flex-direction: row;
              justify-content: center;
              gap: 4rem;
           }

           /* BENTO GRID */
           .bento-grid {
               grid-template-columns: 1fr 1fr;
               grid-template-rows: auto auto auto;
           }
           .card-emotions { grid-row: span 2; }
           .card-realtime { grid-column: span 2; }

           /* CONSISTENCY */
           .cards-wrapper {
               flex-direction: row;
               align-items: center;
               height: 500px;
           }
           .info-card { height: 450px; }
           .side-card { opacity: 0.6; transform: scale(0.9); transition: all 0.4s ease; }
           .side-card:hover { opacity: 0.8; }
           .center-card { transform: scale(1.1); z-index: 10; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }

           /* TIMELINE */
           .timeline-container {
               border-left: none;
               padding-left: 0;
           }
           /* Central Line */
           .timeline-container::before {
               content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
               background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05));
               transform: translateX(-50%);
           }
           .timeline-item { width: 50%; margin-bottom: 0px; min-height: 200px;}
           
           .left { align-self: flex-start; padding-right: 3rem; justify-content: flex-end; text-align: right; }
           .right { align-self: flex-end; padding-left: 3rem; justify-content: flex-start; text-align: left; }
           
           .left .timeline-card { margin-left: auto; margin-right: 0;}
           .right .timeline-card { margin-right: auto; margin-left: 0;}

           /* PRICING */
           .pricing-container {
               flex-direction: row;
               align-items: center;
               justify-content: center;
               gap: 0rem;
           }
           .pricing-card.free {
               transform: scale(0.9) translateX(20px);
               margin-right: -20px;
               z-index: 1; border-right: none;
           }
           .pricing-card.pro {
               transform: scale(1);
               height: 650px;
               z-index: 10;
           }
        }
        




        /* TEXT UTILS - KEEPING EXISTING */
        .glow-text { text-shadow: 0 0 30px rgba(255,255,255,0.2); }
        .gradient-text {
             background: linear-gradient(90deg, #fff, #888, #fff); background-size: 200%;
             -webkit-background-clip: text; -webkit-text-fill-color: transparent;
             animation: shine 5s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }

        .features-list ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .features-list li { display: flex; align-items: center; gap: 10px; color: #ccc; }
        .check-icon { width: 20px; height: 20px; border-radius: 50%; border: 1px solid #666; display: flex; justify-content: center; align-items: center; font-size: 10px; }
        .pro-check { color: #00b4d8; border-color: #00b4d8; }

      `}</style>
    </main >
  );
}