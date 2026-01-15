import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://albctslyvkmfvpaerapn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYmN0c2x5dmttZnZwYWVyYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ2MDcsImV4cCI6MjA4MTMxMDYwN30.etiDDeMIwEpf1MnE6aAaqpvb45EbSeplPdBlwDyGcks';

// In-memory cache as fallback (for development)
const memoryCache = new Map<string, { data: any; expiresAt: number }>();

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
    QUICK_STATS: 60,        // 1 minute
    ACCOUNT_DATA: 30,       // 30 seconds
    POSITIONS: 30,          // 30 seconds
    OPEN_ORDERS: 45,        // 45 seconds
    RECENT_TRADES: 60,      // 1 minute
    REALIZED_PNL: 120,      // 2 minutes
    DAILY_PNL: 300,         // 5 minutes
    AGGREGATED: 30,         // 30 seconds for aggregated data
} as const;

/**
 * Generate cache key from endpoint and parameters
 */
function generateCacheKey(userId: string, endpoint: string, params?: any): string {
    const paramsHash = params
        ? crypto.createHash('md5').update(JSON.stringify(params)).digest('hex')
        : 'default';
    return `user:${userId}:${endpoint}:${paramsHash}`;
}

/**
 * Get data from cache (Supabase or memory fallback)
 */
export async function getFromCache<T>(
    accessToken: string,
    endpoint: string,
    params?: any
): Promise<T | null> {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const cacheKey = generateCacheKey(user.id, endpoint, params);

        // Try memory cache first (faster)
        const memCached = memoryCache.get(cacheKey);
        if (memCached && memCached.expiresAt > Date.now()) {
            return memCached.data as T;
        }

        // Try Supabase cache
        const { data, error } = await supabase
            .from('cache_entries')
            .select('data, expires_at')
            .eq('user_id', user.id)
            .eq('cache_key', cacheKey)
            .single();

        if (error || !data) return null;

        // Check if expired
        const expiresAt = new Date(data.expires_at).getTime();
        if (expiresAt < Date.now()) {
            // Clean up expired entry
            await supabase
                .from('cache_entries')
                .delete()
                .eq('user_id', user.id)
                .eq('cache_key', cacheKey);
            return null;
        }

        // Store in memory cache for faster subsequent access
        memoryCache.set(cacheKey, {
            data: data.data,
            expiresAt
        });

        return data.data as T;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
}

/**
 * Set data in cache (Supabase + memory)
 */
export async function setInCache(
    accessToken: string,
    endpoint: string,
    data: any,
    ttlSeconds: number,
    params?: any
): Promise<boolean> {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const cacheKey = generateCacheKey(user.id, endpoint, params);
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

        // Store in memory cache
        memoryCache.set(cacheKey, {
            data,
            expiresAt: expiresAt.getTime()
        });

        // Store in Supabase cache
        const { error } = await supabase
            .from('cache_entries')
            .upsert({
                user_id: user.id,
                cache_key: cacheKey,
                data,
                expires_at: expiresAt.toISOString()
            }, {
                onConflict: 'user_id,cache_key'
            });

        if (error) {
            console.error('Cache set error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Cache set error:', error);
        return false;
    }
}

/**
 * Invalidate cache for specific endpoint or all user cache
 */
export async function invalidateCache(
    accessToken: string,
    endpoint?: string,
    params?: any
): Promise<boolean> {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        if (endpoint) {
            // Invalidate specific cache entry
            const cacheKey = generateCacheKey(user.id, endpoint, params);

            // Remove from memory cache
            memoryCache.delete(cacheKey);

            // Remove from Supabase
            await supabase
                .from('cache_entries')
                .delete()
                .eq('user_id', user.id)
                .eq('cache_key', cacheKey);
        } else {
            // Invalidate all user cache
            // Clear memory cache for this user
            for (const key of memoryCache.keys()) {
                if (key.startsWith(`user:${user.id}:`)) {
                    memoryCache.delete(key);
                }
            }

            // Clear Supabase cache
            await supabase
                .from('cache_entries')
                .delete()
                .eq('user_id', user.id);
        }

        return true;
    } catch (error) {
        console.error('Cache invalidate error:', error);
        return false;
    }
}

/**
 * Wrapper function to cache any async function result
 */
export async function withCache<T>(
    accessToken: string,
    endpoint: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>,
    params?: any
): Promise<T | null> {
    // Try to get from cache first
    const cached = await getFromCache<T>(accessToken, endpoint, params);
    if (cached !== null) {
        return cached;
    }

    // Cache miss - fetch fresh data
    try {
        const freshData = await fetchFn();

        // Store in cache
        await setInCache(accessToken, endpoint, freshData, ttlSeconds, params);

        return freshData;
    } catch (error) {
        console.error('Fetch error in withCache:', error);
        return null;
    }
}

/**
 * Clean up expired cache entries (should be called periodically)
 */
export async function cleanupExpiredCache(accessToken: string): Promise<void> {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });

        // Clean up memory cache
        const now = Date.now();
        for (const [key, value] of memoryCache.entries()) {
            if (value.expiresAt < now) {
                memoryCache.delete(key);
            }
        }

        // Clean up Supabase cache (this is also handled by DB function)
        await supabase
            .from('cache_entries')
            .delete()
            .lt('expires_at', new Date().toISOString());
    } catch (error) {
        console.error('Cache cleanup error:', error);
    }
}
