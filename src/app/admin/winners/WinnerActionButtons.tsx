'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { verifyProof } from './actions'

export function WinnerActionButtons({ resultId }: { resultId: string }) {
  const [loading, setLoading] = useState<'approved' | 'rejected' | null>(null)

  async function handleAction(status: 'approved' | 'rejected') {
    setLoading(status)
    await verifyProof(resultId, status)
    setLoading(null)
  }

  return (
    <div className="flex gap-2 w-full">
      <Button 
        variant="outline" 
        className="flex-1 border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-500"
        onClick={() => handleAction('approved')}
        isLoading={loading === 'approved'}
        disabled={loading !== null}
      >
        <CheckCircle className="w-4 h-4 mr-2" /> Approve
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 border-red-500/50 hover:bg-red-500/20 text-red-500"
        onClick={() => handleAction('rejected')}
        isLoading={loading === 'rejected'}
        disabled={loading !== null}
      >
        <XCircle className="w-4 h-4 mr-2" /> Reject
      </Button>
    </div>
  )
}
