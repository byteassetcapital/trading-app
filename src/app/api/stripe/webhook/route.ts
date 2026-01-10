import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getTierFromPriceId } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

// Disable body parsing, we need raw body for webhook verification
export const runtime = 'nodejs';

async function updateUserSubscription(
    userId: string,
    subscription: Stripe.Subscription,
    customerId: string
) {
    const priceId = subscription.items.data[0]?.price?.id;
    const tierInfo = priceId ? getTierFromPriceId(priceId) : null;
    const tierCode = subscription.metadata?.tier_code || tierInfo?.tierCode || null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subAny = subscription as any;
    const currentPeriodEnd = subAny.current_period_end
        ? new Date(subAny.current_period_end * 1000).toISOString()
        : new Date().toISOString();

    const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({
            stripe_customer_id: customerId,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_price_id: priceId || null,
            plan_type: 'autonomous',
            tier_code: tierCode,
            access_until: currentPeriodEnd,
            trial_ends_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user subscription:', error);
        throw error;
    }

    console.log(`Updated subscription for user ${userId}: ${subscription.status}, tier: ${tierCode}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.supabase_user_id;

    if (!userId) {
        console.error('No user ID in subscription metadata');
        return;
    }

    const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({
            subscription_status: 'canceled',
            plan_type: null, // Remove autonomous plan
        })
        .eq('id', userId);

    if (error) {
        console.error('Error canceling user subscription:', error);
        throw error;
    }

    console.log(`Canceled subscription for user ${userId}`);
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret || webhookSecret === 'whsec_placeholder') {
            // For development without webhook secret, parse directly
            console.warn('⚠️ Webhook secret not configured, parsing without verification');
            event = JSON.parse(body) as Stripe.Event;
        } else {
            const stripe = getStripe();
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    console.log(`Received Stripe event: ${event.type}`);

    const stripe = getStripe();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.supabase_user_id;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                if (!userId) {
                    console.error('No user ID in session metadata');
                    break;
                }

                // Fetch full subscription details
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                await updateUserSubscription(userId, subscription, customerId);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.supabase_user_id;
                const customerId = subscription.customer as string;

                if (!userId) {
                    console.error('No user ID in subscription metadata');
                    break;
                }

                await updateUserSubscription(userId, subscription, customerId);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const invoiceAny = invoice as any;
                const subscriptionId = invoiceAny.subscription as string;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const userId = subscription.metadata?.supabase_user_id;

                    if (userId) {
                        await updateUserSubscription(
                            userId,
                            subscription,
                            invoice.customer as string
                        );
                    }
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const invoiceAny = invoice as any;
                const subscriptionId = invoiceAny.subscription as string;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const userId = subscription.metadata?.supabase_user_id;

                    if (userId) {
                        const { error } = await supabaseAdmin
                            .from('user_profiles')
                            .update({
                                subscription_status: 'past_due',
                            })
                            .eq('id', userId);

                        if (error) {
                            console.error('Error updating failed payment status:', error);
                        }
                    }
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
