"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { getPortfolioHistory, PortfolioHistoryData, PortfolioHistoryPoint } from '@/app/actions/trading';

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

export default function PortfolioChart({ onLoaded }: { onLoaded?: () => void }) {
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
  const timeFrames: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y'];

  const [data, setData] = useState<PortfolioHistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Don't set loading to true on switch to keep chart visible while updating? 
      // Or set it to show "Updating..."? Let's keep it subtle or just loading.
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const result = await getPortfolioHistory(session.access_token, activeTimeFrame);
          if (result) setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio history", error);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchData();
  }, [activeTimeFrame]);

  // --- CHART GENERATION HELPERS ---
  const chartWidth = 400;
  const chartHeight = 150;

  const { linePath, areaPath } = useMemo(() => {
    if (!data || !data.history || data.history.length === 0) {
      return { linePath: "", areaPath: "" };
    }

    const { history } = data;
    const values = history.map(d => d.value);
    const timestamps = history.map(d => d.timestamp);

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal;

    // Y-axis padding (10%)
    const paddingY = valRange === 0 ? (minVal * 0.1 || 10) : valRange * 0.1;
    const effectiveMin = minVal - paddingY;
    const effectiveMax = maxVal + paddingY;
    const effectiveRange = effectiveMax - effectiveMin;

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime;

    let d = "";

    history.forEach((point, i) => {
      const x = timeRange === 0 ? chartWidth / 2 : ((point.timestamp - minTime) / timeRange) * chartWidth;
      // In SVG, Y=0 is top. So we invert: height - normalized_value
      const y = effectiveRange === 0 ? chartHeight / 2 : chartHeight - ((point.value - effectiveMin) / effectiveRange) * chartHeight;

      if (i === 0) d += `M ${x} ${y}`;
      else d += ` L ${x} ${y}`;
    });

    const linePath = d;
    // Close the area path for the gradient fill
    const areaPath = d + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    return { linePath, areaPath };
  }, [data]);

  if (loading) return <div className="portfolio-chart glass-panel p-4 flex items-center justify-center text-white/50">Loading chart...</div>;

  const currentValue = data ? data.currentValue : 0;
  const changePercent = data ? data.changePercent : 0;
  const changeAmount = data ? data.changeAmount : 0;
  const isPositive = changePercent >= 0;

  return (
    <div className="portfolio-chart glass-panel">
      <div className="chart-header">
        <div className="chart-value-section">
          <span className="chart-label">Portfolio Amount</span>
          <div className="chart-value">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className={`chart-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}% ({isPositive ? '+' : ''}${changeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
          </div>
        </div>
        <div className="timeframe-selector">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              className={`tf-btn ${activeTimeFrame === tf ? 'active' : ''}`}
              onClick={() => setActiveTimeFrame(tf)}
            // Note: Timeframe filtering is purely visual for now as backend returns fixed recent history
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-area">
        {data && data.history.length > 0 ? (
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? "#00ff88" : "#ff3c3c"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? "#00ff88" : "#ff3c3c"} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={isPositive ? "#00ff88" : "#ff3c3c"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Optional: Add dots for points if fewer than 20? */}
          </svg>
        ) : (
          <div className="no-data text-white/30 text-sm">No chart data available</div>
        )}

        {/* Tooltip placeholder - could be made interactive later */}
        {/* <div className="chart-tooltip">
          <span className="tooltip-value">...</span>
        </div> */}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className={`legend-dot ${isPositive ? 'trading' : 'negative-dot'}`}></span>
          <span>Account P&L</span>
        </div>
      </div>

      <style jsx>{`
        .portfolio-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          min-height: 400px;
        }

        .chart-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
        }

        .chart-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .chart-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .chart-change {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .chart-change.positive { color: #00ff88; }
        .chart-change.negative { color: #ff3c3c; }

        .timeframe-selector {
          display: flex;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.25rem;
          border-radius: 8px;
          width: fit-content;
        }

        .tf-btn {
          padding: 0.4rem 0.75rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .tf-btn:hover { color: #fff; }

        .tf-btn.active {
          background: var(--primary-purple);
          color: #fff;
        }

        .chart-area {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-height: 200px;
          width: 100%;
          overflow: hidden; 
        }

        .chart-svg {
          width: 100%;
          height: 100%; /* SVG scaling is tricky, viewBox handles aspects */
        }
        
        .no-data {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chart-legend {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.trading { background: #00ff88; }
        .legend-dot.negative-dot { background: #ff3c3c; }
        .legend-dot.bots { background: var(--primary-purple); }

        @media (min-width: 480px) {
          .chart-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        @media (min-width: 768px) {
          .chart-value { font-size: 2.25rem; }
          .chart-area { min-height: 200px; }
        }
      `}</style>
    </div>
  );
}
