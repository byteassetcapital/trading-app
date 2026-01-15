
"use client";

import React from 'react';

interface TextPageLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const TextPageLayout: React.FC<TextPageLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="section-screen" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
            <div
                className="glass-panel"
                style={{
                    margin: '0 auto',
                    width: '90%',
                    maxWidth: '900px',
                    padding: 'clamp(2rem, 5vw, 4rem)',
                }}
            >
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 className="h1 glow-text" style={{ marginBottom: '1rem' }}>{title}</h1>
                    {subtitle && <p className="subtitle2" style={{ margin: '0 auto' }}>{subtitle}</p>}
                </div>

                <div className="text-content">
                    {children}
                </div>
            </div>

            <style jsx global>{`
        .text-content h2 {
          font-size: 1.8rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
          font-weight: 600;
        }
        
        .text-content h3 {
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 0.8rem;
          color: var(--pink-mist);
          font-weight: 500;
        }

        .text-content p {
          color: #cccccc;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          font-size: 1rem;
        }

        .text-content ul {
          margin-bottom: 1.2rem;
          padding-left: 1.5rem;
        }

        .text-content li {
          color: #cccccc;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }

        .text-content strong {
          color: white;
        }

        .text-content a {
          color: var(--pink-mist);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        
        .text-content a:hover {
          color: white;
        }
      `}</style>
        </div>
    );
};

export default TextPageLayout;
