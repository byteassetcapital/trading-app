'use server'

import ccxt from 'ccxt';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://albctslyvkmfvpaerapn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYmN0c2x5dmttZnZwYWVyYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ2MDcsImV4cCI6MjA4MTMxMDYwN30.etiDDeMIwEpf1MnE6aAaqpvb45EbSeplPdBlwDyGcks';

function decrypt(text: string) {
    if (!text) return '';
    return text;
}

// --- TYPES ---

export type QuickStatsData = {
    winRate: string;
    totalTrades: string;
    bestTrade: string;
};

export type TradeItem = {
    id: string;
    type: 'buy' | 'sell';
    pair: string;
    amount: number;
    price: number;
    time: string;
    profit?: number;
    timestamp?: number;
};

export type PositionItem = {
    id: string;
    pair: string;
    side: 'long' | 'short';
    entryPrice: number;
    currentPrice: number;
    size: number;
    pnl: number;
    pnlPercent: number;
};

export type OrderItem = {
    id: string;
    pair: string;
    type: string;
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    filled: number;
    status: string;
    time: string;
    timestamp: number;
};

export type AccountData = {
    totalBalance: number;
    availableBalance: number;
    inPositions: number;
    unrealizedPnL: number;
    positions: PositionItem[];
};

export type RealizedPnLData = {
    totalPnL: number;
    breakdown: { label: string; value: number }[];
};

export type PortfolioHistoryPoint = {
    timestamp: number;
    value: number;
};

export type PortfolioHistoryData = {
    currentValue: number;
    changePercent: number;
    changeAmount: number;
    history: PortfolioHistoryPoint[];
};

// --- HELPER: Get Connections ---
async function getUserConnections(accessToken: string) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('user_exchange_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

    return data || [];
}

// --- ACTIONS ---

export async function getQuickStats(accessToken: string, filterAsset?: string): Promise<QuickStatsData | null> {
    if (!accessToken) return null;
    const connections = await getUserConnections(accessToken);

    if (!connections || connections.length === 0) {
        return {
            winRate: '0.00%',
            totalTrades: '0',
            bestTrade: '$0'
        };
    }

    let totalTradesCount = 0;
    let winningTradesCount = 0;
    let bestTradePnl = -Infinity;

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);

                try { await exchange.loadMarkets(); } catch { }

                let symbolsToFetch: string[] = [];
                if (filterAsset && filterAsset.trim() !== '' && filterAsset !== 'ALL') {
                    const cleanFilter = filterAsset.replace('/', '').replace('-', '').toLowerCase();
                    const market = Object.values(exchange.markets).find(m =>
                        (m.id && m.id.toLowerCase() === cleanFilter) ||
                        (m.symbol && m.symbol.replace('/', '').toLowerCase() === cleanFilter)
                    );
                    if (market) symbolsToFetch.push(market.symbol);
                    else symbolsToFetch.push(filterAsset.toUpperCase());
                } else {
                    symbolsToFetch = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'BTC/USDC', 'ETH/USDC'];
                }

                await Promise.all(symbolsToFetch.map(async (symbol) => {
                    try {
                        const trades = await exchange.fetchMyTrades(symbol, undefined, undefined, { limit: 100 });
                        for (const trade of trades) {
                            let pnl = trade.info && trade.info.realizedPnl ? parseFloat(trade.info.realizedPnl) : 0;
                            if (pnl !== 0) {
                                totalTradesCount++;
                                if (pnl > 0) winningTradesCount++;
                                if (pnl > bestTradePnl) bestTradePnl = pnl;
                            }
                        }
                    } catch { }
                }));
            } catch { }
        }
    }

    if (bestTradePnl === -Infinity) bestTradePnl = 0;
    const winRate = totalTradesCount > 0 ? (winningTradesCount / totalTradesCount) * 100 : 0;

    return {
        winRate: winRate.toFixed(2) + '%',
        totalTrades: totalTradesCount.toLocaleString(),
        bestTrade: `$${bestTradePnl.toFixed(2)}`
    };
}

export async function getRecentTrades(accessToken: string): Promise<TradeItem[]> {
    if (!accessToken) return [];
    const connections = await getUserConnections(accessToken);
    const allTrades: TradeItem[] = [];

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);
                try { await exchange.loadMarkets(); } catch { }

                // Fetch trades for major pairs
                const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDC', 'ETH/USDC'];

                await Promise.all(symbols.map(async (symbol) => {
                    try {
                        const trades = await exchange.fetchMyTrades(symbol, undefined, undefined, { limit: 20 });

                        trades.forEach((t: any) => {
                            const realizedPnl = t.info?.realizedPnl ? parseFloat(t.info.realizedPnl) : 0;

                            // Filter OUT trades with 0$ PnL
                            if (Math.abs(realizedPnl) > 0) {
                                // Format date: DD.MM. HH:mm
                                const date = new Date(t.timestamp);
                                const dateStr = `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                                // Remove :USDC / :USDT suffix
                                const cleanPair = t.symbol.split(':')[0];

                                allTrades.push({
                                    id: t.id,
                                    type: (t.side || 'buy') as 'buy' | 'sell',
                                    pair: cleanPair,
                                    amount: t.amount,
                                    price: t.price,
                                    time: dateStr,
                                    profit: realizedPnl,
                                    timestamp: t.timestamp // useful for sort
                                });
                            }
                        });
                    } catch { }
                }));
            } catch { }
        }
    }

    // Sort by timestamp desc
    return allTrades.sort((a: any, b: any) => b.timestamp - a.timestamp).slice(0, 20);
}

export async function getAccountData(accessToken: string): Promise<AccountData | null> {
    if (!accessToken) return null;
    const connections = await getUserConnections(accessToken);

    let totalBalance = 0;
    let availableBalance = 0;
    let totalUnrealizedPnL = 0;
    const positions: PositionItem[] = [];

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);

                // Balance
                const balance = await exchange.fetchBalance();

                // Safe & Cleaner: Check specific assets directly instead of iterating everything
                const assets = ['USDT', 'USDC'];

                for (const asset of assets) {
                    const assetBalance = balance[asset];
                    if (assetBalance) {
                        // CCXT standardizes: .total = Wallet Balance, .free = Available Balance
                        totalBalance += assetBalance.total || 0;
                        availableBalance += assetBalance.free || 0;
                    }
                }

                // Try getting unrealized PnL from info
                if (balance.info?.totalUnrealizedProfit) {
                    totalUnrealizedPnL += parseFloat(balance.info.totalUnrealizedProfit);
                }

                // Positions
                const rawPositions = await exchange.fetchPositions();
                const active = rawPositions.filter((p: any) => parseFloat(p.info.positionAmt) !== 0);

                active.forEach((p: any) => {
                    const size = parseFloat(p.info.positionAmt);
                    positions.push({
                        id: `${conn.id}-${p.symbol}`,
                        pair: p.symbol,
                        side: size > 0 ? 'long' : 'short',
                        entryPrice: parseFloat(p.entryPrice),
                        currentPrice: p.markPrice || p.lastPrice || 0,
                        size: Math.abs(size),
                        pnl: parseFloat(p.unrealizedPnl),
                        pnlPercent: parseFloat(p.percentage || '0')
                    });
                });

            } catch (e) { console.error('Account Data Error:', e); }
        }
    }

    // Fallback calculation for pnlPercent if missing (CCXT sometimes gives it, sometimes not)
    positions.forEach(p => {
        if (p.pnlPercent === 0 && p.entryPrice && p.currentPrice) {
            const rawDiff = ((p.currentPrice - p.entryPrice) / p.entryPrice) * 100;
            p.pnlPercent = p.side === 'long' ? rawDiff : -rawDiff;
        }
    });

    return {
        totalBalance,
        availableBalance,
        inPositions: totalBalance - availableBalance,
        unrealizedPnL: totalUnrealizedPnL,
        positions
    };
}

export async function getOpenOrders(accessToken: string): Promise<OrderItem[]> {
    if (!accessToken) return [];
    const connections = await getUserConnections(accessToken);
    const allOrders: OrderItem[] = [];

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);

                // Load markets is crucial for symbol mapping
                try { await exchange.loadMarkets(); } catch (e) { console.error("Load markets failed", e); }

                let orders: any[] = [];
                let bulkSuccess = false;

                // 1. Try fetching ALL open orders
                try {
                    orders = await exchange.fetchOpenOrders();
                    bulkSuccess = true;
                } catch (e) {
                    console.error('Bulk fetchOpenOrders failed, attempting fallback', e);
                }

                // 2. Fallback: If bulk failed or returned 0, try specific major symbols.
                // Sometimes USDC pairs or specific new pairs aren't returned in the bulk call on some account types or API versions.
                if (!bulkSuccess || orders.length === 0) {
                    const fallbackSymbols = [
                        'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT',
                        'BTC/USDC', 'ETH/USDC', 'SOL/USDC', 'BNB/USDC', // USDC Pairs (BTCUSDCPERP maps to BTC/USDC)
                        'BTC/USDC:USDC', 'ETH/USDC:USDC' // Explicit precision variants just in case
                    ];

                    // Filter for symbols that actually exist in the loaded markets
                    const activeSymbols = fallbackSymbols.filter(s => exchange.markets[s]);

                    await Promise.all(activeSymbols.map(async (sym) => {
                        try {
                            const pairOrders = await exchange.fetchOpenOrders(sym);
                            if (pairOrders && pairOrders.length > 0) {
                                orders.push(...pairOrders);
                            }
                        } catch { /* Ignore individual symbol errors */ }
                    }));
                }

                // Deduplicate orders by ID (in case fallback overlapped or multiple calls found same order)
                const uniqueIds = new Set();

                orders.forEach((o: any) => {
                    if (uniqueIds.has(o.id)) return;
                    uniqueIds.add(o.id);

                    // Format date: DD.MM. HH:mm
                    const date = new Date(o.timestamp);
                    const dateStr = `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                    // Determine pair name - ensure it's clean
                    let pairName = o.symbol;
                    if (pairName.endsWith(':USDC')) pairName = pairName.replace(':USDC', '');
                    if (pairName.endsWith(':USDT')) pairName = pairName.replace(':USDT', '');

                    allOrders.push({
                        id: o.id,
                        pair: pairName,
                        type: o.type,
                        side: o.side,
                        price: parseFloat(o.price),
                        amount: parseFloat(o.amount),
                        filled: parseFloat(o.filled),
                        status: o.status,
                        time: dateStr,
                        timestamp: o.timestamp
                    });
                });

            } catch (e) { console.error('Get Open Orders General Error:', e); }
        }
    }

    // Sort by timestamp desc
    return allOrders.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getRealizedPnLStats(accessToken: string): Promise<RealizedPnLData | null> {
    if (!accessToken) return null;
    const connections = await getUserConnections(accessToken);

    let futuresPnL = 0;
    let feesPaid = 0;

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);
                try { await exchange.loadMarkets(); } catch { }

                const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDC', 'ETH/USDC'];
                await Promise.all(symbols.map(async (symbol) => {
                    try {
                        // fetch 500 trades to get a decent history for "Total PnL"
                        const trades = await exchange.fetchMyTrades(symbol, undefined, undefined, { limit: 50 });
                        trades.forEach((t: any) => {
                            if (t.info?.realizedPnl) futuresPnL += parseFloat(t.info.realizedPnl);
                            if (t.commission) feesPaid += parseFloat(t.commission.cost || 0);
                        });
                    } catch { }
                }));
            } catch { }
        }
    }

    const totalPnL = futuresPnL - feesPaid;

    return {
        totalPnL,
        breakdown: [
            { label: 'Futures P&L', value: futuresPnL },
            { label: 'Fees Paid', value: -feesPaid },
        ]
    };
}

export async function getPortfolioHistory(accessToken: string, timeframe: string = '1M'): Promise<PortfolioHistoryData | null> {
    if (!accessToken) return null;
    const connections = await getUserConnections(accessToken);

    let currentBalance = 0;
    const allTrades: any[] = [];

    const timeframeMap: Record<string, number> = {
        '1D': 24 * 60 * 60 * 1000,
        '1W': 7 * 24 * 60 * 60 * 1000,
        '1M': 30 * 24 * 60 * 60 * 1000,
        '3M': 90 * 24 * 60 * 60 * 1000,
        '1Y': 365 * 24 * 60 * 60 * 1000,
    };
    const lookback = timeframeMap[timeframe] || timeframeMap['1M'];
    const since = Date.now() - lookback;

    // 1. Get Current Balance & Income History
    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);

                // A. Fetch Current Balance
                const balance = await exchange.fetchBalance();
                ['USDT', 'USDC'].forEach(asset => {
                    if (balance[asset]) currentBalance += balance[asset].total || 0;
                });

                // B. Fetch Income History (Realized PnL, Commission, Funding, Transfers)
                // fetchIncome is supported by CCXT for Binance Futures (fapi/v1/income)
                // usage: fetchIncome (symbol = undefined, since = undefined, limit = 1000, params = {})
                let incomeFetched = false;
                // Try to fetch income. If it fails (permissions/API), fallback to trades logic?
                // Note: 'limit' max is usually 1000. For longer timeframes we might miss data if >1000 events.
                if (typeof (exchange as any).fetchIncome === 'function') {
                    try {
                        const income = await (exchange as any).fetchIncome(undefined, since, 1000);
                        allTrades.push(...income);
                        incomeFetched = true;
                    } catch (err) {
                        console.log('Fetch Income failed, will use fallback', err);
                    }
                }

                if (!incomeFetched) {
                    // Fallback to trades if income fails, but income is preferred for PnL
                    await exchange.loadMarkets();
                    const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDC', 'ETH/USDC'];
                    await Promise.all(symbols.map(async (symbol) => {
                        try {
                            const trades = await (exchange as any).fetchMyTrades(symbol, since, undefined, { limit: 100 });
                            // Map trade to similar structure as income for processing
                            trades.forEach((t: any) => {
                                const pnl = t.info && t.info.realizedPnl ? parseFloat(t.info.realizedPnl) : 0;
                                const fee = t.fee ? parseFloat(t.fee.cost || 0) : 0; // Fee is negative effect
                                // Create a synthetic "income" item
                                allTrades.push({
                                    timestamp: t.timestamp,
                                    income: pnl - fee, // simplified net effect
                                    asset: 'USDT' // assume
                                });
                            });
                        } catch { }
                    }));
                }

            } catch (e) { console.error('Portfolio History Error:', e); }
        }
    }

    if (currentBalance === 0 && allTrades.length === 0) return null;

    // 2. Sort DESC (newest first)
    allTrades.sort((a, b) => b.timestamp - a.timestamp);

    // 3. Reconstruct history backwards
    const history: PortfolioHistoryPoint[] = [];

    // Add "Now" point
    let runningBalance = currentBalance;
    history.push({ timestamp: Date.now(), value: runningBalance });

    for (const item of allTrades) {
        // Income item structure: { income: number (string), asset: string, ... }
        // We need to parse 'income' value.
        let change = 0;

        // CCXT fetchIncome returns 'amount' in 'income' sometimes or 'amount' field? 
        // CCXT: .amount is the value.
        if (item.amount !== undefined) {
            change = item.amount;
        } else if (item.income !== undefined) {
            // Fallback/Synthetic
            change = typeof item.income === 'string' ? parseFloat(item.income) : item.income;
        }

        // Logic: Balance_before = Balance_after - Change
        runningBalance = runningBalance - change;

        // Only add point if it's within our window (it should be, due to 'since' filter, but double check)
        if (item.timestamp >= since) {
            history.push({
                timestamp: item.timestamp,
                value: runningBalance
            });
        }
    }

    // Add Start Point (at 'since')
    // The last calculated runningBalance is roughly the balance at the start of the timeframe (or end of list).
    // We should clamp it to 'since' time for the chart to look like it starts at the edge.
    history.push({ timestamp: since, value: runningBalance });

    // 4. Reverse to ASC
    history.reverse();

    // 5. Stats
    const firstPoint = history[0];
    const lastPoint = history[history.length - 1];

    const changeAmount = lastPoint.value - firstPoint.value;
    const changePercent = firstPoint.value !== 0 ? (changeAmount / firstPoint.value) * 100 : 0;

    return {
        currentValue: currentBalance,
        changeAmount,
        changePercent,
        history
    };
}

// --- STREAMING ---

export async function getBinanceUserStreamKey(accessToken: string): Promise<{ listenKey: string, isTestnet: boolean } | null> {
    if (!accessToken) return null;
    const connections = await getUserConnections(accessToken);

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                // We use CCXT to leverage the existing configuration logic, 
                // but specifically call the Futures ListenKey endpoint.
                const exchange = new ccxt.binance({
                    apiKey,
                    secret,
                    enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        recvWindow: 10000
                    }
                });
                if (isTestnet) exchange.setSandboxMode(true);

                // Usually for Futures it is fapiPrivatePostListenKey
                // Note: CCXT types might not explicitly list all implicit API methods in TS, 
                // but they exist at runtime. If this fails TS check, we might need a @ts-ignore or any cast.
                // Alternatively, we can use a direct fetch for simplicity if we want to be 100% sure about TS without any casts.
                // However, let's try the CCXT way first as it handles URLs (testnet vs mainnet) automatically.

                // Using 'any' cast to bypass TS checks for implicit methods
                const ex = exchange as any;

                let response;
                if (ex.fapiPrivatePostListenKey) {
                    response = await ex.fapiPrivatePostListenKey();
                } else if (ex.v1UserDataStreamPost) { // Sometimes mapped differently
                    response = await ex.v1UserDataStreamPost();
                } else {
                    // Fallback to manual implicit method call if specific property not found
                    // or standard public request if signed not needed (Post ListenKey usually needs API Key header)
                    // Let's try to trust fapiPrivatePostListenKey is generated.
                    throw new Error('Method fapiPrivatePostListenKey not found');
                }

                if (response && response.listenKey) {
                    return { listenKey: response.listenKey, isTestnet };
                }
            } catch (e) {
                console.error('Error fetching ListenKey:', e);
            }
        }
    }
    return null;
}
