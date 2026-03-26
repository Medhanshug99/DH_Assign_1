'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { runMonthlyDraw } from './actions'
import { Dices, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDrawsPage() {
  const [isPending, startTransition] = React.useTransition()
  const [result, setResult] = React.useState<{error?: string; success?: boolean; message?: string} | null>(null)

  function handleRunDraw() {
    startTransition(async () => {
      const res = await runMonthlyDraw()
      setResult(res)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-red-50">
          <Dices className="w-6 h-6 text-red-500" />
          Draw Execution
        </h2>
        <p className="text-muted text-sm max-w-xl">
          Run the monthly draw simulation. This will generate 5 random numbers, compare them against all active subscribers' latest 5 scores, and distribute rewards to matching users.
        </p>
      </div>

      <Card className="border-red-500/20 bg-red-500/5 p-8 text-center flex flex-col items-center">
        <Dices className="w-16 h-16 text-red-400 mb-6" />
        <h3 className="text-xl font-bold text-red-50 mb-2">Simulate Monthly Draw</h3>
        <p className="text-red-200/50 text-sm mb-8 max-w-md">
          Warning: This action triggers the actual logic. Results will be stored in the database and visible to users. Can only run once per month.
        </p>
        
        {result?.error ? (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm w-full max-w-md">
            {result.error}
          </div>
        ) : result?.success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-4 bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 rounded-xl text-sm w-full max-w-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {result.message || 'Draw executed successfully!'}
          </motion.div>
        ) : null}

        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleRunDraw} 
          isLoading={isPending}
          disabled={result?.success}
          className="bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] w-full sm:w-auto"
        >
          Execute Draw
        </Button>
      </Card>
    </div>
  )
}
