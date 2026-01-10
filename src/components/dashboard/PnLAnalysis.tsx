"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
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
    const supabase = createClient();
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
                <div className="custom-tooltip" style={{
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                }}>
                    <p className="tooltip-date" style={{
                        margin: '0 0 4px 0',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>{date}</p>
                    <p className="tooltip-value" style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: pnl >= 0 ? '#00ff88' : '#ff3c3c'
                    }}>
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
                                tick={{ fill: 'rgba(104, 104, 104, 1)', fontSize: 10 }}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.29)' }} content={<CustomTooltip />} />
                            <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.19)" />
                            <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#0095f8ff' : '#b90000ff'} />
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
          color: #ffffffff;
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
          background: rgba(209, 209, 209, 0.1);
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
            color: rgba(255, 255, 255, 1);
        }


      `}</style>
        </div>
    );
}
