import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing required field: userId' },
                { status: 400 }
            );
        }

        // Get user's Stripe customer ID from database
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (profileError || !profile?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No subscription found for this user' },
                { status: 404 }
            );
        }

        const stripe = getStripe();
        // Create customer portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${request.headers.get('origin')}/settings`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Portal session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
