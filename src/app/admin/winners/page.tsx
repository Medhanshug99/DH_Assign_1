import * as React from 'react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Trophy, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'
import { WinnerActionButtons } from './WinnerActionButtons'

export default async function AdminWinnersPage() {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return redirect('/dashboard')

  // Get all winners
  const { data: winners } = await supabase
    .from('draw_results')
    .select(`
      id,
      matches_count,
      won_amount,
      verified,
      proof_url,
      payment_status,
      created_at,
      user_id,
      draw:draw_id (month_year),
      profiles:user_id (email, display_name)
    `)
    .gte('matches_count', 3)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-red-500" />
          Winners Management
        </h1>
        <p className="text-muted mt-2">
          Verify uploaded score proofs and manage payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {winners && winners.length > 0 ? (
          winners.map((winner) => {
            const draw = winner.draw as any
            const wProfile = winner.profiles as any

            return (
              <Card key={winner.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-red-500/20 bg-black/40">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {draw.month_year}
                    </span>
                    <span className="text-muted text-sm">
                      {wProfile.email}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Won ${winner.won_amount}</h3>
                  <div className="text-sm text-muted">
                    {winner.matches_count} Number Match
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  {winner.payment_status === 'paid' ? (
                    <div className="text-emerald-500 flex items-center gap-2 font-bold px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <CheckCircle className="w-5 h-5" />
                      Verified & Paid
                    </div>
                  ) : winner.proof_url ? (
                    <div className="flex flex-col gap-3 w-full">
                      <a href={winner.proof_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:underline bg-blue-500/10 px-4 py-2 rounded-xl">
                        <ExternalLink className="w-4 h-4" /> View Proof
                      </a>
                      <WinnerActionButtons resultId={winner.id} />
                    </div>
                  ) : (
                    <div className="text-amber-500 flex items-center gap-2 font-bold px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      Waiting for Proof
                    </div>
                  )}
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-12 text-center text-muted border-dashed border-red-500/20">
            No winners found yet.
          </Card>
        )}
      </div>
    </div>
  )
}
