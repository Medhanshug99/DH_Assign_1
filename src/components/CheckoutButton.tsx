'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // IMPORTANT: Replace this with your actual Stripe Price ID!
        body: JSON.stringify({ priceId: 'price_XXXXXX' }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error in checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="primary" 
      className="mt-6 sm:mt-0 whitespace-nowrap"
      onClick={handleCheckout}
      isLoading={loading}
    >
      Subscribe Now
    </Button>
  )
}
