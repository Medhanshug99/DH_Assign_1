import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Target, HeartHandshake, Gift, ArrowRight } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user data
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      subscription_status,
      contribution_percentage,
      charities:selected_charity_id (name)
    `)
    .eq('id', user.id)
    .single()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const hasActiveSub = profile?.subscription_status !== 'none'

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Subscription Call to Action if inactive */}
      {!hasActiveSub && (
        <Card className="col-span-full bg-gradient-to-r from-surface to-surface border-border flex flex-col sm:flex-row items-center justify-between p-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
            <p className="text-muted text-sm max-w-xl">
              Unlock the core features: log your scores, enter monthly draws, and contribute {profile?.contribution_percentage || 10}% of your fee directly to charity.
            </p>
          </div>
          <CheckoutButton />
        </Card>
      )}

      {/* Latest Scores Quick View */}
      <Card className="col-span-1 md:col-span-8 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted">
            <Target className="w-4 h-4" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Your Latest Scores</h2>
          </div>
          <Link href="/dashboard/scores" className="text-xs text-primary hover:underline flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        {scores && scores.length > 0 ? (
          <div className="flex items-end gap-3 h-32">
            {scores.slice().reverse().map((score, idx) => (
              <div key={score.id} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                {/* Visual bar relative to 45 */}
                <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">{score.score}</span>
                <div 
                  className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all relative border-t border-primary/50"
                  style={{ height: `${(score.score / 45) * 100}%`, minHeight: '10%' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/50 rounded-xl">
            <p className="text-muted text-sm mb-4">No scores recorded yet.</p>
            <Link href="/dashboard/scores">
              <Button variant="outline" size="sm">Add First Score</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Charity Impact Quick View */}
      <Card className="col-span-1 md:col-span-4 flex flex-col justify-between bg-accent/5 border-accent/10">
        <div className="flex items-center justify-between mb-6 text-muted">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Current Impact</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-3xl font-light mb-1">
            {profile?.contribution_percentage || 10}<span className="text-xl text-muted">%</span>
          </h3>
          <p className="text-sm text-foreground/70 mb-4">
            donated to <br/>
            <strong className="text-foreground font-medium">
              {/* @ts-ignore */}
              {profile?.charities?.name || 'No charity selected'}
            </strong>
          </p>
          
          <Link href="/dashboard/charity">
            <Button variant="ghost" size="sm" className="w-full justify-start px-0 text-primary hover:bg-transparent hover:text-primary-dark">
              Change setup <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Draw Banner */}
      <Card className="col-span-full border-border/30 bg-white/5 overflow-hidden relative group">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Monthly Draw is Active</h3>
              <p className="text-sm text-muted">Submit 5 scores to qualify for this month's rewards.</p>
            </div>
          </div>
          <Link href="/dashboard/draws">
            <Button variant="glass">View Details</Button>
          </Link>
        </div>
      </Card>

    </div>
  )
}
