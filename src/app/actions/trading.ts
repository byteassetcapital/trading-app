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

// --- DATABASE TYPES ---
// Based on user provided schema
export type DbTrade = {
    id: string;
    user_id: string;
    trading_account_id: string;
    exchange_platform: 'binance' | 'bybit'; // extended as needed
    exchange_order_id: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    executed_quantity: number;
    executed_price: number;
    fee: number;
    fee_currency: string;
    profit_loss: number;
    opened_at: string;
    closed_at: string;
    metadata: any;
    created_at: string;
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

export type DailyPnLData = {
    date: string; // YYYY-MM-DD
    pnl: number;
    tradesCount: number;
    dayLabel: string; // "Mon", "Tue"...
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

const mapBinanceTradeToDb = (connId: string, userId: string, trade: any): Partial<DbTrade> => {
    // Map CCXT trade to DB schema
    // info.realizedPnl is string in Binance Futures
    const pnl = trade.info && trade.info.realizedPnl ? parseFloat(trade.info.realizedPnl) : 0;

    // We use trade.id as exchange_order_id to satisfy unique constraint on (trading_account_id, exchange_order_id)
    // and distinct individual executions.
    // metadata will store the actual Order ID.

    return {
        user_id: userId,
        trading_account_id: connId,
        exchange_platform: 'binance',
        exchange_order_id: trade.id, // Using Trade ID for uniqueness per execution
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.amount, // For an execution, quantity = executed
        price: trade.price,
        executed_quantity: trade.amount,
        executed_price: trade.price,
        fee: trade.fee ? parseFloat(trade.fee.cost) : 0,
        fee_currency: trade.fee ? trade.fee.currency : 'USDT',
        profit_loss: pnl,
        opened_at: new Date(trade.timestamp).toISOString(),
        closed_at: new Date(trade.timestamp).toISOString(), // Executions are instant
        metadata: {
            original_order_id: trade.order,
            raw: trade.info,
            commission_asset: trade.info?.commissionAsset
        }
    };
};


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
                        recvWindow: 60000,
                        adjustForTimeDifference: true
                    }
                });
                // Explicitly set options to ensure they are respected
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

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
                        recvWindow: 60000,
                        adjustForTimeDifference: true
                    }
                });
                // Explicitly set options to ensure they are respected
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();
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
                        recvWindow: 60000,
                        adjustForTimeDifference: true
                    }
                });
                // Explicitly set options to ensure they are respected
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

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

const TRADING_PAIRS = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT',
    'DOGE/USDT', 'ADA/USDT', 'AVAX/USDT', 'LINK/USDT', 'MATIC/USDT',
    'DOT/USDT', 'LTC/USDT', 'SHIB/USDT', 'TRX/USDT',
    'BTC/USDC', 'ETH/USDC', 'SOL/USDC', 'BNB/USDC'
];

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
                        recvWindow: 60000,
                        adjustForTimeDifference: true,
                        warnOnFetchOpenOrdersWithoutSymbol: false
                    }
                });
                // Explicitly set options to ensure they are respected
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;
                exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

                // Load markets is crucial for symbol mapping
                try { await exchange.loadMarkets(); } catch (e) { console.error("Load markets failed", e); }

                let orders: any[] = [];

                // We skip the bulk fetchOpenOrders() as it often fails with "ExchangeError" or strict rate limits.
                // Instead, we iterate over known major pairs which is more reliable.

                // Filter for symbols that actually exist in the loaded markets
                const activeSymbols = TRADING_PAIRS.filter(s => exchange.markets && exchange.markets[s]);

                await Promise.all(activeSymbols.map(async (sym) => {
                    try {
                        const pairOrders = await exchange.fetchOpenOrders(sym);
                        if (pairOrders && pairOrders.length > 0) {
                            orders.push(...pairOrders);
                        }
                    } catch { /* Ignore individual symbol errors */ }
                }));

                // Deduplicate orders by ID
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
                        recvWindow: 60000,
                        adjustForTimeDifference: true
                    }
                });
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();
                try { await exchange.loadMarkets(); } catch { }

                const symbols = TRADING_PAIRS;
                await Promise.all(symbols.map(async (symbol) => {
                    try {
                        // fetch 50 trades to get a decent history for "Total PnL"
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

// NEW: Sync Action
export async function syncBinanceTrades(accessToken: string) {
    if (!accessToken) return { success: false, error: 'No token' };

    const connections = await getUserConnections(accessToken);
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No user' };

    let totalSynced = 0;

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey, secret, enableRateLimit: true,
                    options: {
                        defaultType: 'future',
                        adjustForTimeDifference: true,
                        recvWindow: 60000,
                        warnOnFetchOpenOrdersWithoutSymbol: false
                    }
                });
                exchange.options['recvWindow'] = 60000;
                exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

                // 1. Get last synced trade timestamp for this connection
                const { data: lastTrade } = await supabase
                    .from('trades')
                    .select('opened_at')
                    .eq('trading_account_id', conn.id)
                    .order('opened_at', { ascending: false })
                    .limit(1)
                    .single();

                // Start from 1 year ago or last trade time + 1ms
                let since = lastTrade ? new Date(lastTrade.opened_at).getTime() + 1 : Date.now() - (365 * 24 * 60 * 60 * 1000);

                await exchange.loadMarkets();

                // Use the expanded TRADING_PAIRS list
                const symbols = TRADING_PAIRS;

                for (const symbol of symbols) {
                    try {
                        let fetchMore = true;
                        let batchSince = since;

                        while (fetchMore) {
                            const trades = await exchange.fetchMyTrades(symbol, batchSince, undefined, { limit: 50 });
                            if (trades.length === 0) {
                                fetchMore = false;
                                break;
                            }

                            // Prepare upsert payload
                            const rows = trades.map(t => mapBinanceTradeToDb(conn.id, user.id, t));

                            // Upsert
                            const { error: upsertError } = await supabase
                                .from('trades')
                                .upsert(rows, { onConflict: 'trading_account_id, exchange_order_id', ignoreDuplicates: true });

                            if (upsertError) {
                                console.error('Upsert failed', upsertError);
                            } else {
                                totalSynced += trades.length;
                            }

                            const lastTimestamp = trades[trades.length - 1]?.timestamp || 0;
                            if (lastTimestamp > batchSince) {
                                batchSince = lastTimestamp + 1;
                            } else {
                                fetchMore = false;
                            }

                            // Safety break
                            if (trades.length < 50) fetchMore = false;
                        }
                    } catch (err) {
                        console.error(`Sync error for ${symbol}`, err);
                    }
                }

            } catch (e) { console.error('Sync Connect Error', e); }
        }
    }

    return { success: true, count: totalSynced };
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
                        recvWindow: 60000,
                        adjustForTimeDifference: true
                    }
                });
                // Explicitly set options to ensure they are respected
                exchange.options['adjustForTimeDifference'] = true;
                exchange.options['recvWindow'] = 60000;

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

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

// --- CHARTS ---

export async function getDailyPnL(accessToken: string, days: number = 14): Promise<DailyPnLData[]> {
    if (!accessToken) return [];

    // Normalize days
    const rangeDays = days > 0 ? days : 14;

    const connections = await getUserConnections(accessToken);
    const dailyMap = new Map<string, { pnl: number, count: number }>();

    // Initialize map with empty days to ensure continuous chart
    for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyMap.set(dateStr, { pnl: 0, count: 0 });
    }

    // Calculate "since" timestamp (start of the first day in range)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);
    startDate.setHours(0, 0, 0, 0);
    const since = startDate.getTime();

    for (const conn of connections) {
        if (conn.exchange_platform === 'binance') {
            const apiKey = decrypt(conn.api_key_encrypted);
            const secret = decrypt(conn.api_secret_encrypted);
            if (!apiKey || !secret) continue;

            const isTestnet = String(conn.is_testnet) === 'true' || conn.is_testnet === true;

            try {
                const exchange = new ccxt.binance({
                    apiKey, secret, enableRateLimit: true,
                    options: { defaultType: 'future', adjustForTimeDifference: true, recvWindow: 60000 }
                });
                exchange.options['recvWindow'] = 60000;
                exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false; // Silence warning

                if (isTestnet) exchange.setSandboxMode(true);
                await exchange.loadTimeDifference();

                const symbols = TRADING_PAIRS; // Use the minor subset for speed, or fetch all if needed

                await Promise.all(symbols.map(async (symbol) => {
                    try {
                        let fetchMore = true;
                        let batchSince = since;

                        while (fetchMore) {
                            const trades = await exchange.fetchMyTrades(symbol, batchSince, undefined, { limit: 50 });
                            if (!trades || trades.length === 0) {
                                fetchMore = false;
                                break;
                            }

                            trades.forEach(t => {
                                const pnl = t.info && t.info.realizedPnl ? parseFloat(t.info.realizedPnl) : 0;
                                const feeCost = (t.fee && t.fee.cost) ? t.fee.cost : 0;

                                // Only count trades that have PnL or are significant
                                if (pnl !== 0 || feeCost > 0) {
                                    // Use execution time
                                    const ts = t.timestamp || Date.now();
                                    const dateStr = new Date(ts).toISOString().split('T')[0];

                                    if (dailyMap.has(dateStr)) {
                                        const current = dailyMap.get(dateStr)!;
                                        current.pnl += pnl;
                                        if (pnl !== 0) current.count += 1;
                                        dailyMap.set(dateStr, current);
                                    }
                                }
                            });

                            const lastTs = trades[trades.length - 1]?.timestamp;
                            if (lastTs && lastTs > batchSince) {
                                batchSince = lastTs + 1;
                            } else {
                                fetchMore = false;
                            }

                            if (trades.length < 50) fetchMore = false;
                        }
                    } catch { }
                }));

            } catch (e) { console.error('Daily PnL Error', e); }
        }
    }

    // Convert map to array
    const result: DailyPnLData[] = Array.from(dailyMap.entries()).map(([date, data]) => {
        const d = new Date(date);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
        return {
            date, // 2024-01-01
            pnl: data.pnl,
            tradesCount: data.count,
            dayLabel
        };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return result;
}
