"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getOpenOrders, OrderItem } from '@/app/actions/trading';

export default function WaitingTrades({ onLoaded }: { onLoaded?: () => void }) {
    const supabase = createClient();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                const data = await getOpenOrders(session.access_token);
                setOrders(data);
            }
        } catch (e) {
            console.error("Error fetching open orders:", e);
        } finally {
            setLoading(false);
            if (onLoaded) onLoaded();
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every 1 minute
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="glass-panel p-4">Loading open orders...</div>;

    return (
        <div className="waiting-trades glass-panel">
            <div className="section-header">
                <h3>Waiting Trades (Limit Orders)</h3>
                <span className="refresh-info">Update: 60s</span>
            </div>

            <div className="table-container">
                {orders.length === 0 ? (
                    <div className="no-data">No open orders</div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Pair</th>
                                <th>Type</th>
                                <th>Side</th>
                                <th>Price</th>
                                <th className="hide-mobile">Amount</th>
                                <th className="hide-mobile">Filled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="text-muted">{order.time}</td>
                                    <td className="font-bold">{order.pair}</td>
                                    <td className="text-muted uppercase">{order.type}</td>
                                    <td>
                                        <span className={`side-badge ${order.side}`}>
                                            {order.side.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="hide-mobile">{order.amount}</td>
                                    <td className="hide-mobile">{(order.filled / order.amount * 100).toFixed(0)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
        .waiting-trades {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          min-height: 250px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .refresh-info {
           font-size: 0.7rem;
           color: rgba(255,255,255,0.3);
           background: rgba(255,255,255,0.05);
           padding: 2px 6px;
           border-radius: 4px;
        }

        .no-data {
            text-align: center;
            padding: 3rem 0;
            color: rgba(255,255,255,0.3);
        }

        .table-container {
            overflow-x: auto;
        }

        .orders-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }

        .orders-table th {
            text-align: left;
            color: rgba(255,255,255,0.4);
            font-weight: 500;
            padding-bottom: 0.75rem;
            font-size: 0.75rem;
        }

        .orders-table td {
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: #fff;
        }

        .orders-table tr:last-child td {
            border-bottom: none;
        }

        .text-muted { color: rgba(255,255,255,0.5); }
        .font-bold { font-weight: 600; }
        .uppercase { text-transform: uppercase; }

        .side-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 700;
        }
        .side-badge.buy { background: rgba(0,255,136,0.1); color: #00ff88; }
        .side-badge.sell { background: rgba(255,60,60,0.1); color: #ff3c3c; }

        @media (max-width: 600px) {
            .hide-mobile { display: none; }
        }
      `}</style>
        </div>
    );
}
