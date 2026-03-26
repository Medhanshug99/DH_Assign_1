import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription
    
    // Using the userId we stored in metadata during checkout creation
    const userId = session.metadata?.userId

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'monthly', // or 'yearly' depending on Price ID logic
          subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    
    // In a full implementation, you'd look up the user by stripe_customer_id, 
    // but here we can see if subscription is cancelled
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      // Find the user by using Stripe subscription metadata or customer email if needed
      // Since we didn't store stripe_customer_id, let's retrieve the customer email
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (customer.email) {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'none',
            subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          })
          .eq('email', customer.email)
      }
    } else if (subscription.status === 'active') {
       const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
       if (customer.email) {
         await supabaseAdmin
           .from('profiles')
           .update({
             subscription_status: 'monthly',
             subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
           })
           .eq('email', customer.email)
       }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    if (customer.email) {
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'none',
        })
        .eq('email', customer.email)
    }
  }

  return new NextResponse('Webhook processed successfully', { status: 200 })
}
