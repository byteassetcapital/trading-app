"use client";

import React, { useEffect, useRef } from 'react';

interface MiniChartProps {
  symbol: string;
  description?: string;
}

const MiniChartWidget = ({ symbol, description }: MiniChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove existing script if any (cleanup/re-render safety)
    const existingScript = containerRef.current.querySelector("script");
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": "dark",
      "trendLineColor": "rgba(147, 51, 234, 1)", // primary-purple
      "underLineColor": "rgba(147, 51, 234, 0.3)",
      "underLineBottomColor": "rgba(147, 51, 234, 0)",
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="mini-chart-wrapper">
      <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      </div>
      <style jsx>{`
        .mini-chart-wrapper {
          width: 100%;
          height: 160px; /* Fixed height for consistency */
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        
        .mini-chart-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default function Watchlist({ onLoaded }: { onLoaded?: () => void }) {
  const symbols = [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum" },
    { symbol: "BINANCE:SOLUSDT", name: "Solana" },
    { symbol: "BINANCE:XRPUSDT", name: "XRP" },
    { symbol: "BINANCE:BNBUSDT", name: "BNB" },
    { symbol: "BINANCE:DOGEUSDT", name: "Dogecoin" }
  ];

  useEffect(() => {
    // Notify parent that we are "loaded" immediately as widgets handle themselves
    if (onLoaded) {
      // Small delay to allow render
      setTimeout(onLoaded, 500);
    }
  }, [onLoaded]);

  return (
    <div className="watchlist-container glass-panel">
      <div className="watchlist-header">
        <h3>Market Overview</h3>
        <span className="subtitle">Watchlist & Trends</span>
      </div>

      <div className="watchlist-grid">
        {symbols.map((s) => (
          <MiniChartWidget key={s.symbol} symbol={s.symbol} description={s.name} />
        ))}
      </div>

      <style jsx>{`
        .watchlist-container {
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
        }

        .watchlist-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .watchlist-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }

        .subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .watchlist-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          flex: 1;
        }

        @media (min-width: 640px) {
          .watchlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* On very large screens or specific layout needs, maybe 4 in a row? 
           But 2x2 is usually good for a "Chart Area" replacements */
      `}</style>
    </div>
  );
}
