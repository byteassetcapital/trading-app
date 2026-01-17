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
        <Link href="/register" onClick={() => setIsOpen(false)} style={{ display: 'none' }}>Register</Link>
        <Link href="/login" onClick={() => setIsOpen(false)} style={{ display: 'none' }}>Login</Link>
        <Link href="/dashboard" className="btnSecondary" style={{ display: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setIsOpen(false)}>
          Dashboard
        </Link>
      </div>


    </nav>
  );
}