import * as React from 'react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Gift, Calendar, ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'
import { UploadProofForm } from './UploadProofForm'

export default async function UserDrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')

  // Get user's draw results with the draw details
  const { data: results } = await supabase
    .from('draw_results')
    .select(`
      id,
      matches_count,
      won_amount,
      verified,
      proof_url,
      payment_status,
      created_at,
      draw:draw_id (month_year, numbers)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-primary" />
          Monthly Draws
        </h2>
        <p className="text-muted text-sm max-w-xl">
          Your participation history in the monthly draws. Match 3, 4, or 5 numbers from your latest 5 scores to win rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results && results.length > 0 ? (
          results.map((result) => {
            const draw = result.draw as any
            const hasWon = result.matches_count >= 3
            const needsProof = hasWon && !result.verified && !result.proof_url

            return (
              <Card key={result.id} className={`flex flex-col gap-4 p-6 ${hasWon ? 'border-primary/50 bg-primary/5' : ''}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center flex-col shrink-0">
                      <span className="text-xs text-muted uppercase font-bold">{draw.month_year.split('-')[0]}</span>
                      <span className="text-lg font-bold text-foreground">{draw.month_year.split('-')[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Draw Results</h3>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        Winning numbers: 
                        <div className="flex gap-1 ml-2">
                          {draw.numbers.map((n: number, i: number) => (
                            <span key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-foreground border border-white/5">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Side */}
                  <div className="flex items-center gap-6 w-full md:w-auto p-4 md:p-0 bg-surface/50 md:bg-transparent rounded-xl border border-border/50 md:border-none">
                    <div className="text-center">
                      <div className="text-sm text-muted mb-1">Matches</div>
                      <div className={`text-2xl font-bold ${hasWon ? 'text-primary' : 'text-foreground'}`}>
                        {result.matches_count}
                      </div>
                    </div>
                    
                    <div className="w-px h-12 bg-border mx-2 hidden md:block" />
                    
                    <div className="text-center">
                      <div className="text-sm text-muted mb-1">Reward</div>
                      <div className={`text-xl font-bold ${hasWon ? 'text-primary' : 'text-foreground'}`}>
                        {hasWon ? '$' + result.won_amount : '-'}
                      </div>
                    </div>
                    
                    <div className="w-px h-12 bg-border mx-2 hidden md:block" />
                    
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm text-muted mb-1">Status</div>
                      {result.payment_status === 'paid' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Paid
                        </span>
                      ) : result.verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent font-semibold border border-accent/20">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proof Section if won */}
                {hasWon && (
                  <div className="pt-4 border-t border-border/50">
                    {needsProof ? (
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div>
                          <strong className="block mb-1">Action Required: Upload Proof</strong>
                          <span className="text-sm">Please provide a link to a screenshot of your scores to claim your reward.</span>
                        </div>
                        <div className="w-full md:w-auto">
                          <UploadProofForm resultId={result.id} />
                        </div>
                      </div>
                    ) : result.proof_url && !result.verified ? (
                      <div className="text-sm text-muted flex items-center justify-between">
                        <span>Proof submitted and pending admin review.</span>
                        <a href={result.proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          View Submission <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-border/50">
            <Gift className="w-12 h-12 text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Draw History</h3>
            <p className="text-muted text-sm max-w-sm">
              You haven't participated in any draws yet. Ensure you have an active subscription and 5 scores logged before the next monthly draw.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
