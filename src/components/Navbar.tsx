"use client";

import Link from 'next/link';
import React, { useState } from 'react'; // Přidán useState


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Stav pro mobilní menu

  return (
    <nav className={`navbar glass-panel ${isOpen ? 'nav-open' : ''}`}>
      <div className="logo glow-text">
        <Link href="/">Byte Asset Capital</Link>
      </div>

      {/* Hamburger tlačítko - viditelné jen na mobilu */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className={isOpen ? "icon-close" : "icon-hamburger"}></span>
      </button>

      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
        <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
        <Link href="/dashboard" className="btnSecondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setIsOpen(false)}>
          Dashboard
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          z-index: 1000;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .logo { font-size: 1.5rem; font-weight: bold; color: white; z-index: 1001; }

        .nav-links { display: flex; gap: 2rem; align-items: center; }

        /* Mobilní menu - skryté tlačítko na desktopu */
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }

        .icon-hamburger::before { content: "☰"; color: white; font-size: 2rem; }
        .icon-close::before { content: "✕"; color: white; font-size: 2rem; }

        /* --- RESPONSIVE DESIGN --- */
        @media (max-width: 768px) {
          .menu-toggle { display: block; }

          .nav-links {
            display: none; /* Skryté ve výchozím stavu */
            flex-direction: column;
            position: absolute;
            top: 100%; /* Hned pod navbarem */
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.9); /* Tmavé pozadí pro mobilní menu */
            backdrop-filter: blur(15px);
            padding: 2rem;
            border-radius: 20px;
            margin-top: 10px;
            gap: 1.5rem;
          }

          .nav-links.active {
            display: flex; /* Zobrazit při kliknutí */
          }
          
          .navbar.nav-open {
            border-radius: 25px; /* Upravit tvar při otevření */
          }
        }

        .nav-links :global(a:not(.btn-secondary)) { font-weight: 500; opacity: 0.8; color: white; text-decoration: none; }
        .nav-links :global(a:not(.btn-secondary):hover) { opacity: 1; color: #E49EAC; }
      `}</style>
    </nav>
  );
}