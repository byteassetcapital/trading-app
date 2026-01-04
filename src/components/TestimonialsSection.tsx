"use client";

import React from 'react';

const testimonials = [
    {
        id: 1,
        text: "Konečně trading bez stresu. AI se drží plánu, který bych já porušil při prvním poklesu. Vidět portfolio růst bez mých zásahů je osvobozující.",
        author: "Petr Novák",
        role: "IT Specialista",
        gradient: "linear-gradient(135deg, #2D0A10 0%, #0D0105 100%)"
    },
    {
        id: 2,
        text: "Sleduju to už 3 měsíce a ta konzistence je neuvěřitelná. Žádné FOMO, prostě výsledky. Systém obchoduje přesně tak, jak slibovali.",
        author: "Jana Králová",
        role: "Podnikatelka",
        gradient: "linear-gradient(135deg, #46212C 0%, #0D0105 100%)"
    },
    {
        id: 3,
        text: "Dlouho jsem hledal něco, co funguje skutečně pasivně. Jedem Trading mi ušetřil hodiny času denně, které bych jinak strávil u grafů.",
        author: "Martin Svoboda",
        role: "Investor",
        gradient: "linear-gradient(135deg, #130307 0%, #2D0A10 100%)"
    },
    {
        id: 4,
        text: "Nejlepší rozhodnutí pro mé portfolio. Diverzifikace do algoritmického tradingu mi dává smysl, zvlášť v tak volatilním prostředí jako je krypto.",
        author: "Tomáš Dvořák",
        role: "Architekt",
        gradient: "linear-gradient(135deg, #2D0A10 0%, #46212C 100%)"
    },
    {
        id: 5,
        text: "Líbí se mi transparentnost. Vím přesně, co se děje, ale nemusím do toho zasahovat. Reporty jsou jasné a přehledné.",
        author: "Lucie Veselá",
        role: "Marketing Manager",
        gradient: "linear-gradient(135deg, #0D0105 0%, #2D0A10 100%)"
    },
    {
        id: 6,
        text: "Výkonostně stabilní, support funguje skvěle. Nemám co vytknout. Doporučuji každému, kdo chce zhodnotit kapitál bez emocí.",
        author: "David Procházka",
        role: "Trader",
        gradient: "linear-gradient(135deg, #46212C 0%, #130307 100%)"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="testimonials-section">
            <div className="section-header">
                <h2 className="title">Co říkají naši klienti</h2>
                <p className="subtitle">Přidejte se k investorům, kteří obchodují chytřeji.</p>
            </div>

            <div className="masonry-grid">
                {testimonials.map((item) => (
                    <div key={item.id} className="testimonial-card">
                        {/* Quote Icon */}
                        <div className="quote-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 11L8 6H6C6 8.21 7.79 10 10 10V11ZM10 11H8V18H14V11H10ZM18 11L16 6H14C14 8.21 15.79 10 18 10V11ZM18 11H16V18H22V11H18Z" fill="currentColor" />
                            </svg>
                        </div>

                        <p className="testimonial-text">"{item.text}"</p>

                        <div className="author-block">
                            <div className="avatar-placeholder">
                                {item.author.charAt(0)}
                            </div>
                            <div className="author-info">
                                <span className="name">{item.author}</span>
                                <span className="role">{item.role}</span>
                            </div>
                        </div>

                        <div className="card-glow" style={{ background: item.gradient }}></div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .testimonials-section {
          width: 100%;
          padding: 4rem 1.5rem;
          background-color: var(--background);
          position: relative;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 1rem;
        }

        .subtitle {
          color: #b0b0b0;
          font-size: clamp(1rem, 4vw, 1.2rem);
        }

        /* Mobile First: Single Column Stack */
        .masonry-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          border-color: rgba(228, 158, 172, 0.2);
        }

        .quote-icon {
          color: var(--rosewood);
          margin-bottom: 1.5rem;
          opacity: 0.8;
          background: rgba(149, 77, 95, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quote-icon svg {
             fill: var(--pink-mist);
        }

        .testimonial-text {
          color: #e0e0e0;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-style: italic;
          position: relative;
          z-index: 2;
        }

        .author-block {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          z-index: 2;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rosewood), var(--night-bordeaux));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
          font-size: 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .name {
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
        }

        .role {
          color: var(--pink-mist);
          font-size: 0.85rem;
          margin-top: 2px;
        }

        .card-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.15;
          z-index: 1;
          transition: opacity 0.3s ease;
          pointer-events: none;
          mask-image: linear-gradient(to top, black, transparent);
        }

        .testimonial-card:hover .card-glow {
          opacity: 0.25;
        }

        /* Desktop: Masonry Layout using CSS Columns */
        @media (min-width: 768px) {
          .masonry-grid {
            display: block; /* Reset flex */
            column-count: 2;
            column-gap: 1.5rem;
          }
          
          .testimonial-card {
            break-inside: avoid;
            margin-bottom: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 3;
          }
        }
      `}</style>
        </section>
    );
}
