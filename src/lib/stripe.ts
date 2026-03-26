import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_build_key', {
  apiVersion: '2023-10-16' as any, // Bypass strict type inference // or '2024-04-10' if using newer stripe versions
  typescript: true,
})
