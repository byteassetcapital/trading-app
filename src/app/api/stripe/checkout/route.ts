import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const stripe = getStripe();
        const body = await request.json();
        const { priceId, userId, userEmail } = body;

        if (!priceId || !userId || !userEmail) {
            return NextResponse.json(
                { error: 'Missing required fields: priceId, userId, userEmail' },
                { status: 400 }
            );
        }

        // Check if customer already exists
        const existingCustomers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        let customerId: string;

        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
        } else {
            // Create new customer
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    supabase_user_id: userId,
                },
            });
            customerId = customer.id;
        }

        // Create checkout session
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
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: userId,
                },
            },
            allow_promotion_codes: true,
            billing_address_collection: 'required',
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Checkout session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
