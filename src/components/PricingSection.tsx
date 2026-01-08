"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlanPrice, PlanTier, SubscriptionPlan } from '@/types/pricing';

// Price ID mapping for Stripe
const PRICE_IDS: Record<string, Record<'monthly' | 'yearly', string>> = {
    A1: {
        monthly: 'price_1SnLEzCX3wuf0Ms8q7r93xEH',
        yearly: 'price_1SnNDbCX3wuf0Ms8QjmO5o84',
    },
    A2: {
        monthly: 'price_1SnLoCCX3wuf0Ms8bYWtK9BP',
        yearly: 'price_1SnNEhCX3wuf0Ms8fWT3Hnbo',
    },
    A3: {
        monthly: 'price_1SnLpwCX3wuf0Ms89rfUI0iA',
        yearly: 'price_1SnNFkCX3wuf0Ms8VpcwjJzU',
    },
    A4: {
        monthly: 'price_1SnLqCCX3wuf0Ms8XfATKTbg',
        yearly: 'price_1SnNGMCX3wuf0Ms8kmhe7YRv',
    },
};

export default function PricingSection() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedAiTierCode, setSelectedAiTierCode] = useState<string>('A1');
    const [aiAccessPlan, setAiAccessPlan] = useState<SubscriptionPlan | null>(null);
    const [managedPlan, setManagedPlan] = useState<SubscriptionPlan | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Get the selected Stripe price ID
    const getSelectedPriceId = () => {
        const tierPrices = PRICE_IDS[selectedAiTierCode];
        if (!tierPrices) return null;
        return tierPrices[billingCycle];
    };

    // Handle checkout for AI Access plan
    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Redirect unauthenticated users to login
                window.location.href = '/login?redirect=/pricing';
                return;
            }

            const priceId = getSelectedPriceId();
            if (!priceId) {
                alert('Neplatná cenová úroveň');
                return;
            }

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    userId: user.id,
                    userEmail: user.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Nepodařilo se spustit platbu. Zkuste to prosím znovu.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    useEffect(() => {
        async function fetchPlans() {
            try {
                console.log("Fetching plans...");
                // Fetch plans
                const { data: plansData, error: plansError } = await supabase
                    .from('subscription_plans')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (plansError) throw plansError;

                // Fetch tiers
                const { data: tiersData, error: tiersError } = await supabase
                    .from('plan_tiers')
                    .select('*, prices:plan_prices(*)')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (tiersError) throw tiersError;

                // Associate tiers with plans
                const fullPlans = plansData.map((plan) => ({
                    ...plan,
                    features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
                    tiers: tiersData.filter((tier) => tier.plan_id === plan.id),
                }));

                setPlans(fullPlans);
                setAiAccessPlan(fullPlans.find((p) => p.account_type === 'autonomous') || null);
                setManagedPlan(fullPlans.find((p) => p.account_type === 'managed') || null);

            } catch (error) {
                console.error('Error fetching pricing:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPlans();
    }, []);

    // Helper to get price for the selected AI Tier
    const getAiPrice = () => {
        if (!aiAccessPlan || !aiAccessPlan.tiers) return 0;
        const tier = aiAccessPlan.tiers.find(t => t.tier_code === selectedAiTierCode);
        if (!tier || !tier.prices) return 0;

        const monthlyPriceObj = tier.prices.find(p => p.billing_period === 'monthly');
        const basePrice = monthlyPriceObj ? monthlyPriceObj.amount : 0;

        if (billingCycle === 'yearly') {
            // Yearly discout calculation: Monthly * 12 * 0.9 (10% off)
            return Math.round((basePrice * 12) * 0.9);
        }
        return basePrice;
    };

    const getAiTierDetails = () => {
        if (!aiAccessPlan || !aiAccessPlan.tiers) return null;
        return aiAccessPlan.tiers.find(t => t.tier_code === selectedAiTierCode);
    }

    const currentAiTier = getAiTierDetails();


    if (loading) {
        return (
            <section className="pricing-section">
                <div style={{ color: 'var(--accent-purple)', textAlign: 'center' }}>Loading pricing plans...</div>
            </section>
        )
    }

    return (
        <section className="pricing-section">
            <div className="pricing-header">
                <h2 className="section-title">Pricing Plans</h2>
                <div className="billing-toggle">
                    <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
                    <div
                        className={`toggle-switch ${billingCycle}`}
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <div className="toggle-thumb" />
                    </div>
                    <span className={billingCycle === 'yearly' ? 'active' : ''}>Yearly <span className="discount-tag">-10%</span></span>
                </div>
            </div>

            <div className="pricing-container">

                {/* MANAGED AI PORTFOLIO */}
                {managedPlan && (
                    <div className="pricing-card managed-card">
                        <div className="card-header">
                            <h3>{managedPlan.name}</h3>
                            <p>{managedPlan.description}</p>
                        </div>

                        <div className="price-display">
                            <span className="amount">$0</span>
                            <span className="period">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                            <div className="sub-price">Management Fee: 0%</div>
                        </div>

                        <div className="tiers-list">
                            <p className="tiers-title">Performance Fee Structure:</p>
                            {managedPlan.tiers?.map((tier) => (
                                <div key={tier.id} className="tier-row">
                                    <span className="tier-name">{tier.min_capital ? `$${(tier.min_capital / 25).toLocaleString()}k+` : 'Unknown'}</span>
                                    {/* Note: logic for displaying Tier Name vs Capital range can be adjusted. 
                            User SQL uses CZK ranges in name, but capitals are numbers. 
                            Let's use the tier name from DB for accuracy.*/}
                                    <span className="tier-name-db">{tier.name}</span>
                                    <span className="tier-value">{(tier.performance_fee! * 100).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="features-list">
                            <ul>
                                {managedPlan.features.map((feature: string, idx: number) => (
                                    <li key={idx}><span className="check-icon">✓</span> {feature}</li>
                                ))}
                            </ul>
                        </div>
                        <button className="pricing-btn">Start Managed Portfolio ›</button>
                    </div>
                )}

                {/* AI ACCESS PLAN */}
                {aiAccessPlan && (
                    <div className="pricing-card ai-access-card">
                        <div className="shine-effect"></div>
                        <div className="card-header">
                            <h3>{aiAccessPlan.name}</h3>
                            <p>{aiAccessPlan.description}</p>
                        </div>

                        {/* Tier Selector */}
                        <div className="tier-selector">
                            <label>Select Tier:</label>
                            <div className="tier-buttons">
                                {aiAccessPlan.tiers?.map((tier) => (
                                    <button
                                        key={tier.id}
                                        className={`tier-btn ${selectedAiTierCode === tier.tier_code ? 'active' : ''}`}
                                        onClick={() => setSelectedAiTierCode(tier.tier_code)}
                                    >
                                        {tier.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="price-display">
                            <span className="amount">${getAiPrice()}</span>
                            <span className="period">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                            {billingCycle === 'yearly' && <span className="saved-badge">Saved 10%</span>}
                        </div>

                        <div className="plan-limits">
                            <div className="limit-item">
                                <span className="label">Max Capital</span>
                                <span className="value">{currentAiTier?.max_capital ? `$${currentAiTier.max_capital.toLocaleString()}` : 'Unlimited'}</span>
                            </div>
                            <div className="limit-item">
                                <span className="label">Max Positions</span>
                                <span className="value">{currentAiTier?.max_position_size ? `$${currentAiTier.max_position_size.toLocaleString()}` : 'Unlimited'}</span>
                            </div>
                            <div className="limit-item">
                                <span className="label">Systems</span>
                                <span className="value">{currentAiTier?.max_systems}</span>
                            </div>
                        </div>

                        <div className="features-list">
                            <ul>
                                {aiAccessPlan.features.map((feature: string, idx: number) => (
                                    <li key={idx}><span className="check-icon pro-check">✓</span> {feature}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className="pricing-btn pro-btn"
                            onClick={handleCheckout}
                            disabled={checkoutLoading}
                        >
                            {checkoutLoading ? 'Přesměrování...' : 'Get AI Access ›'}
                        </button>
                    </div>
                )}

            </div>

            <style jsx>{`
        .pricing-section {
            width: 100%;
            padding: 4rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--background); /* Using new palette */
        }

        .pricing-header {
            text-align: center;
            margin-bottom: 3rem;
            width: 100%;
        }

        .section-title {
             font-size: clamp(2rem, 5vw, 3rem);
             font-weight: 800;
             margin-bottom: 1.5rem;
             color: #fff;
        }

        /* Toggle */
        .billing-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 1.1rem;
            color: #888;
        }
        .billing-toggle span.active { color: #fff; font-weight: 600; }
        .toggle-switch {
            width: 50px;
            height: 28px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        .toggle-switch.yearly { background: var(--rosewood); }
        .toggle-thumb {
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            position: absolute;
            top: 4px;
            left: 4px;
            transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .toggle-switch.yearly .toggle-thumb { left: 26px; }
        
        .discount-tag {
            background: var(--pink-mist);
            color: var(--rich-mahogany);
            font-size: 0.75rem;
            padding: 2px 6px;
            border-radius: 6px;
            font-weight: 700;
            margin-left: 5px;
            vertical-align: middle;
        }

        /* Container */
        .pricing-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            width: 100%;
            max-width: 1100px;
        }
        
        /* Desktop Grid */
        @media (min-width: 900px) {
            .pricing-container {
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
            }
        }

        /* Cards */
        .pricing-card {
            background: #0d0d12;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pricing-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .managed-card {
             background: linear-gradient(180deg, var(--coffee-bean) 0%, #1a0f12 100%);
             border-color: rgba(149, 77, 95, 0.2); 
        }

        .ai-access-card {
            background: #05050a;
            border: 1px solid var(--rosewood);
            box-shadow: 0 0 40px rgba(149, 77, 95, 0.15); /* Rosewood glow */
        }
        
        .shine-effect {
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, var(--pink-mist), transparent);
            opacity: 0.5;
        }

        .card-header h3 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        .ai-access-card h3 {
             background: linear-gradient(90deg, #fff, var(--pink-mist));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .card-header p {
            color: #999;
            font-size: 0.95rem;
            line-height: 1.5;
            min-height: 50px;
            margin-bottom: 1.5rem;
        }

        /* Tier Selector */
        .tier-selector {
            margin-bottom: 2rem;
        }
        .tier-selector label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            color: #ccc;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .tier-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .tier-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #ccc;
            padding: 6px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        .tier-btn:hover { background: rgba(255,255,255,0.1); }
        .tier-btn.active {
            background: var(--rosewood);
            color: white;
            border-color: var(--rosewood);
            font-weight: 600;
        }

        /* Price */
        .price-display {
            margin-bottom: 2rem;
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        .amount { font-size: 3rem; font-weight: 800; color: #fff; line-height: 1; }
        .period { color: #888; font-size: 1.1rem; }
        .saved-badge {
             background: rgba(149, 77, 95, 0.2);
             color: var(--pink-mist);
             font-size: 0.8rem;
             padding: 4px 8px;
             border-radius: 4px;
             transform: translateY(-8px);
        }

        /* Limits Grid */
        .plan-limits {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 2rem;
            background: rgba(255,255,255,0.03);
            padding: 1rem;
            border-radius: 12px;
        }
        .limit-item { display: flex; flex-direction: column; gap: 4px; }
        .limit-item .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
        .limit-item .value { font-size: 0.95rem; font-weight: 600; color: #fff; }

        /* Tiers List (Managed) */
        .tiers-list {
            margin-bottom: 2rem;
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 1rem;
        }
        .tiers-title { font-size: 0.9rem; color: #aaa; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
        .tier-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            color: #ddd;
        }
        .tier-row:last-child { margin-bottom: 0; }
        .tier-name-db { color: #888; font-size: 0.85rem; margin-right: auto; margin-left: 10px; font-style: italic;}
        .tier-value { font-weight: 700; color: var(--pink-mist); }

        /* Features */
        .features-list ul { list-style: none; padding: 0; margin-bottom: 2rem; }
        .features-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 1rem;
            line-height: 1.5;
            color: #ccc;
            font-size: 0.95rem;
        }
        .check-icon { color: #555; font-weight: bold; }
        .pro-check { color: var(--rosewood); }

        /* Button */
        .pricing-btn {
            width: 100%;
            padding: 1.2rem;
            border-radius: 14px;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            margin-top: auto;
            border: none;
            transition: all 0.3s;
            background: rgba(255,255,255,0.1);
            color: #fff;
        }
        .pricing-btn:hover { background: rgba(255,255,255,0.2); }
        
        .pro-btn {
            background: var(--rosewood);
            box-shadow: 0 4px 20px rgba(149, 77, 95, 0.4);
        }
        .pro-btn:hover {
            background: var(--pink-mist);
            color: var(--rich-mahogany);
            transform: translateY(-2px);
        }

      `}</style>
        </section>
    );
}
