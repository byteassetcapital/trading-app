import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Missing STRIPE_SECRET_KEY environment variable');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            typescript: true,
        });
    }
    return stripeInstance;
}

// Export for convenience (will throw at runtime if env var missing)
export const stripe = {
    get instance() {
        return getStripe();
    }
};

// Price ID mapping for Autonomous plan tiers
export const PRICE_IDS = {
    // Monthly prices
    A1_MONTHLY: 'price_1So1nKCX3wuf0Ms8yHcwLfbL', // €19/month
    A2_MONTHLY: 'price_1SnLoCCX3wuf0Ms8bYWtK9BP', // €29/month
    A3_MONTHLY: 'price_1SnLpwCX3wuf0Ms89rfUI0iA', // €49/month
    A4_MONTHLY: 'price_1SnLqCCX3wuf0Ms8XfATKTbg', // €79/month

    // Yearly prices
    A1_YEARLY: 'price_1SnNDbCX3wuf0Ms8QjmO5o84', // €19 yearly
    A2_YEARLY: 'price_1SnNEhCX3wuf0Ms8fWT3Hnbo', // €29 yearly
    A3_YEARLY: 'price_1SnNFkCX3wuf0Ms8VpcwjJzU', // €49 yearly
    A4_YEARLY: 'price_1SnNGMCX3wuf0Ms8kmhe7YRv', // €79 yearly
} as const;

// Mapping from tier code and billing cycle to price ID
export function getPriceId(tierCode: string, billingCycle: 'monthly' | 'yearly'): string | null {
    const suffix = billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY';
    const key = `${tierCode}_${suffix}` as keyof typeof PRICE_IDS;
    return PRICE_IDS[key] || null;
}

// Reverse mapping from price ID to tier info
export function getTierFromPriceId(priceId: string): { tierCode: string; billingCycle: 'monthly' | 'yearly' } | null {
    for (const [key, value] of Object.entries(PRICE_IDS)) {
        if (value === priceId) {
            const parts = key.split('_');
            const tierCode = parts[0];
            const billingCycle = parts[1].toLowerCase() as 'monthly' | 'yearly';
            return { tierCode, billingCycle };
        }
    }
    return null;
}

// Product ID for Autonomous plan
export const AUTONOMOUS_PRODUCT_ID = 'prod_TkqwSfFDOrUpSw';
