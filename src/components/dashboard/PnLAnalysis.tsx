"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getDailyPnL, DailyPnLData } from '@/app/actions/trading';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';

export default function PnLAnalysis({ onLoaded }: { onLoaded?: () => void }) {
    const [data, setData] = useState<DailyPnLData[]>([]);
    const [days, setDays] = useState<number>(7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    const result = await getDailyPnL(session.access_token, days);
                    if (isMounted && result) {
                        setData(result);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Daily PnL", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    if (onLoaded) onLoaded();
                }
            }
        }
        fetchData();

        return () => { isMounted = false; };
    }, [days, onLoaded]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const pnl = payload[0].value;
            const date = payload[0].payload.date;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{date}</p>
                    <p className={`tooltip-value ${pnl >= 0 ? 'positive' : 'negative'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} USDT
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="pnl-analysis glass-panel">
            <div className="pnl-header">
                <span className="pnl-title">P/L Analysis</span>
                <div className="pnl-toggles">
                    <button
                        className={`toggle-btn ${days === 7 ? 'active' : ''}`}
                        onClick={() => setDays(7)}
                    >
                        7D
                    </button>
                    <button
                        className={`toggle-btn ${days === 14 ? 'active' : ''}`}
                        onClick={() => setDays(14)}
                    >
                        14D
                    </button>
                </div>
            </div>

            <div className="chart-container">
                {loading ? (
                    <div className="loading-chart">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="no-data">No trades in this period</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="dayLabel"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                            <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#00ff88' : '#ff3c3c'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <style jsx>{`
        .pnl-analysis {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 200px;
          padding: 1rem;
        }

        .pnl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .pnl-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }

        .pnl-toggles {
          display: flex;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px;
          border-radius: 6px;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7rem;
          padding: 2px 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .chart-container {
          flex: 1;
          min-height: 0; /* Flexbox trick */
          width: 100%;
        }

        .loading-chart, .no-data {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: rgba(255,255,255,0.3);
        }

        .custom-tooltip {
            background: rgba(18, 18, 24, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .tooltip-date {
            margin: 0;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.5);
            margin-bottom: 2px;
        }

        .tooltip-value {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .tooltip-value.positive { color: #00ff88; }
        .tooltip-value.negative { color: #ff3c3c; }

      `}</style>
        </div>
    );
}
