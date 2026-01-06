"use client";

import React from 'react';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function MainChart() {
    return (
        <div className="main-chart-container glass-panel">
            <div className="chart-wrapper" id="tradingview-container">
                <AdvancedRealTimeChart
                    theme="dark"
                    symbol="BINANCE:BTCUSDC.P"
                    container_id="tradingview-container"
                    autosize={true}
                    hide_side_toolbar={false}
                    hide_top_toolbar={false}
                    allow_symbol_change={true}
                    interval="D"
                    key="btc-chart-main"
                    copyrightStyles={{ parent: { display: 'none' } }}
                />
            </div>

            <style jsx>{`
        .main-chart-container {
            width: 100%;
            height: 450px;
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.05);
        }
        
        .chart-wrapper {
            width: 100%;
            height: 100%;
        }
      `}</style>
        </div>
    );
}
