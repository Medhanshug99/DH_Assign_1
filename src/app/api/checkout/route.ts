import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 })
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${origin}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard`,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
