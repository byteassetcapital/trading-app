import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        console.log('🔵 Checkout API: Starting...');

        const body = await request.json();
        const { priceId, userId, userEmail, tierCode, billingCycle } = body;

        console.log('📥 Checkout API: Request body:', { priceId, userId, userEmail, tierCode, billingCycle });

        if (!priceId || !userId || !userEmail) {
            console.error('❌ Missing required fields:', { priceId: !!priceId, userId: !!userId, userEmail: !!userEmail });
            return NextResponse.json(
                { error: 'Missing required fields: priceId, userId, userEmail' },
                { status: 400 }
            );
        }

        console.log('🔵 Initializing Stripe...');
        const stripe = getStripe();
        console.log('✅ Stripe initialized');

        // Check if customer already exists
        console.log('🔍 Checking for existing customer:', userEmail);
        const existingCustomers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        let customerId: string;

        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
            console.log('✅ Found existing customer:', customerId);
        } else {
            // Create new customer
            console.log('🔵 Creating new customer for:', userEmail);
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    supabase_user_id: userId,
                },
            });
            customerId = customer.id;
            console.log('✅ Created new customer:', customerId);
        }

        // Create checkout session
        console.log('🔵 Creating checkout session...');

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/?canceled=true`,
            metadata: {
                supabase_user_id: userId,
                tier_code: tierCode || '',
                billing_cycle: billingCycle || 'monthly',
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: userId,
                    tier_code: tierCode || '',
                    billing_cycle: billingCycle || 'monthly',
                },
            },
            allow_promotion_codes: true,
            billing_address_collection: 'required',
        });

        console.log('✅ Checkout session created:', session.id);
        console.log('✅ Session URL:', session.url);

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('❌ Checkout session creation error:', error);

        // More detailed error message
        let errorMessage = 'Failed to create checkout session';
        if (error instanceof Error) {
            errorMessage = error.message;
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
