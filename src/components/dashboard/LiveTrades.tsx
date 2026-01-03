"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getAccountData, getBinanceUserStreamKey, PositionItem } from '@/app/actions/trading';

export default function LiveTrades({ onLoaded }: { onLoaded?: () => void }) {
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Ref for positions to access current state in WS callback
  const positionsRef = useRef<PositionItem[]>([]);

  // 1. Fetch initial positions
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const data = await getAccountData(session.access_token);
          if (data && data.positions) {
            setPositions(data.positions);
            positionsRef.current = data.positions;
          }
        }
      } catch (e) {
        console.error("Error fetching positions:", e);
      } finally {
        setLoading(false);
        if (onLoaded) onLoaded();
      }
    }
    fetchInitialData();
  }, []);

  // 2. Connect to Streams (User Data & Market Price)
  useEffect(() => {
    let wsMarket: WebSocket | null = null;
    let wsUser: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | undefined;

    async function connectStreams() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      // --- A. Market Price Stream (All Tickers 1s) ---
      // We acturally only need tickers for our positions, but !markPrice@arr@1s covers all
      // and eliminates the need to restart WS when new positions open.
      wsMarket = new WebSocket('wss://fstream.binance.com/ws/!markPrice@arr@1s');

      wsMarket.onopen = () => {
        console.log('Connected to Binance Market Stream');
        setIsWsConnected(true);
      };

      wsMarket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // data is Array of objects: { s: symbol, p: markPrice, ... }
        if (Array.isArray(data)) {
          const newPrices: Record<string, number> = {};
          let hasUpdates = false;

          // Create map of current prices
          data.forEach((ticker: any) => {
            newPrices[ticker.s] = parseFloat(ticker.p);
          });

          setPrices(prev => ({ ...prev, ...newPrices }));
        }
      };

      // --- B. User Data Stream (For Add/Remove Positions) ---
      const streamData = await getBinanceUserStreamKey(session.access_token);
      if (streamData && streamData.listenKey) {
        const wsUrl = streamData.isTestnet
          ? `wss://stream.binancefuture.com/ws/${streamData.listenKey}`
          : `wss://fstream.binance.com/ws/${streamData.listenKey}`;

        wsUser = new WebSocket(wsUrl);

        wsUser.onopen = () => console.log('Connected to User Stream');

        wsUser.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.e === 'ACCOUNT_UPDATE') {
            const updatedPositions = msg.a?.P; // Positions array
            if (updatedPositions && Array.isArray(updatedPositions)) {
              handleAccountUpdate(updatedPositions);
            }
          }
        };

        // Keep alive ListenKey (usually needed every 60 mins), 
        // but strictly for this demo component lifecycle it might be overkill.
      }
    }

    function handleAccountUpdate(updatedPositions: any[]) {
      // We need to merge these updates into our local positions state
      // Binance pushes ALL positions that changed.
      // If amount (pa) becomes 0, it means closed.

      const current = [...positionsRef.current];
      let changed = false;

      updatedPositions.forEach(p => {
        const symbol = p.s;
        const amount = parseFloat(p.pa);
        const entryPrice = parseFloat(p.ep);
        const side = amount > 0 ? 'long' : 'short';

        const existingIdx = current.findIndex(pos => pos.pair === symbol);

        if (amount === 0) {
          // Remove if exists
          if (existingIdx !== -1) {
            current.splice(existingIdx, 1);
            changed = true;
          }
        } else {
          // Update or Add
          const newPos: PositionItem = {
            id: symbol, // Simple ID
            pair: symbol,
            side,
            size: Math.abs(amount),
            entryPrice: entryPrice,
            // Use last known price or entry if unknown yet
            currentPrice: entryPrice,
            pnl: 0, // Recalc later
            pnlPercent: 0
          };

          if (existingIdx !== -1) {
            // Update existing
            current[existingIdx] = { ...current[existingIdx], ...newPos };
          } else {
            // Add new
            current.push(newPos);
          }
          changed = true;
        }
      });

      if (changed) {
        setPositions(current);
        positionsRef.current = current;
      }
    }

    connectStreams();

    return () => {
      if (wsMarket) wsMarket.close();
      if (wsUser) wsUser.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, []); // Run once


  // HELPER: Merge positions with live prices to calculate PnL
  const livePositions = positions.map(pos => {
    // Find live price from map
    // Binance symbols in stream are like 'BTCUSDT' (no slash)
    // Our pos.pair usually comes from CCXT as 'BTC/USDT' or 'BTCUSDT'.
    // Normalize to 'BTCUSDT'
    const cleanSymbol = pos.pair.replace('/', '').replace('-', '').toUpperCase();
    const currentPrice = prices[cleanSymbol] || pos.currentPrice;

    let pnl = pos.pnl;
    let pnlPercent = pos.pnlPercent;

    if (currentPrice && pos.entryPrice) {
      const rawPnL = (currentPrice - pos.entryPrice) * pos.size;
      pnl = pos.side === 'long' ? rawPnL : -rawPnL;

      const rawPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
      pnlPercent = pos.side === 'long' ? rawPercent : -rawPercent;
    }

    return {
      ...pos,
      currentPrice,
      pnl,
      pnlPercent
    };
  });

  if (loading) return <div className="glass-panel p-4">Loading positions...</div>;

  return (
    <div className="live-trades glass-panel">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3>Live Positions</h3>
          {isWsConnected && <span className="live-indicator"></span>}
        </div>
      </div>

      <div className="table-container">
        {positions.length === 0 ? (
          <div className="no-data">No open positions</div>
        ) : (
          <table className="positions-table">
            <thead>
              <tr>
                <th>Pair</th>
                <th>Side</th>
                <th className="hide-mobile">Size</th>
                <th>Entry</th>
                <th>Mark</th>
                <th className="text-right">PnL (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {livePositions.map((pos) => (
                <tr key={pos.id}>
                  <td className="font-bold">{pos.pair.replace('USDT', '')}</td>
                  <td>
                    <span className={`side-badge ${pos.side}`}>
                      {pos.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-muted hide-mobile">{pos.size}</td>
                  <td>{pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  <td className="text-muted">{pos.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  <td className="text-right">
                    <div className={`pnl-value ${pos.pnl >= 0 ? 'positive' : 'negative'}`}>
                      {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}$
                    </div>
                    <div className={`pnl-percent ${pos.pnlPercent >= 0 ? 'positive' : 'negative'}`}>
                      {pos.pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .live-trades {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          min-height: 250px;
        }

        .live-indicator {
            width: 8px;
            height: 8px;
            background-color: #00ff88;
            border-radius: 50%;
            box-shadow: 0 0 8px #00ff88;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.5; transform: scale(1); }
        }

        .section-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .no-data {
            text-align: center;
            padding: 3rem 0;
            color: rgba(255,255,255,0.3);
        }

        .table-container {
            overflow-x: auto;
        }

        .positions-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }

        .positions-table th {
            text-align: left;
            color: rgba(255,255,255,0.4);
            font-weight: 500;
            padding-bottom: 0.75rem;
            font-size: 0.75rem;
        }

        .positions-table td {
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: #fff;
        }

        .positions-table tr:last-child td {
            border-bottom: none;
        }

        .text-right { text-align: right; }
        .text-muted { color: rgba(255,255,255,0.5); }
        .font-bold { font-weight: 600; }

        .side-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 700;
        }
        .side-badge.long { background: rgba(0,255,136,0.1); color: #00ff88; }
        .side-badge.short { background: rgba(255,60,60,0.1); color: #ff3c3c; }

        .pnl-value { font-weight: 600; font-size: 0.9rem; }
        .pnl-percent { font-size: 0.7rem; opacity: 0.7; }

        .positive { color: #00ff88; }
        .negative { color: #ff3c3c; }

        @media (max-width: 600px) {
            .hide-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}
