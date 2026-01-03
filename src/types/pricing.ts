export interface PlanPrice {
    id: string;
    tier_id: string;
    billing_period: 'monthly' | 'yearly';
    currency: string;
    amount: number;
    stripe_price_id: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface PlanTier {
    id: string;
    plan_id: string;
    tier_code: string;
    name: string;
    description: string | null;
    min_capital: number | null;
    max_capital: number | null;
    max_position_size: number | null;
    max_systems: number | null;
    max_exchanges: number | null;
    management_fee: number | null;
    performance_fee: number | null;
    is_active: boolean;
    sort_order: number;
    prices?: PlanPrice[];
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string | null;
    account_type: 'autonomous' | 'managed';
    price_monthly: number;
    price_yearly: number;
    features: string[]; // JSON array in DB, parsed to string[]
    max_systems: number | null;
    max_exchanges: number | null;
    max_capital: number | null;
    min_capital: number | null;
    priority_support: boolean;
    custom_strategies: boolean;
    api_access: boolean;
    is_active: boolean;
    trial_days: number;
    sort_order: number;
    tiers?: PlanTier[];
}
