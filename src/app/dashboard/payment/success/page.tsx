import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-6 border-emerald-500/20 bg-emerald-500/5">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted text-sm">
            Thank you for subscribing to Fairway Impact. Your account has been upgraded and you can now access all premium features!
          </p>
        </div>
        <Link href="/dashboard" className="w-full">
          <Button variant="primary" className="w-full">Return to Dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}
