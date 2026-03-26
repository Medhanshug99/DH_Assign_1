import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addScore, deleteScore } from './actions'
import { createClient } from '@/lib/supabase/server'
import { Target, Trash2, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) // Reverse chronological order

  const isSubscribed = profile?.subscription_status !== 'none'
  const maxScoresReached = scores && scores.length >= 5

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Score Input Form */}
        <Card className="flex-1 h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Log Round
            </h2>
            <p className="text-sm text-muted">Enter your performance score (1-45).</p>
          </div>

          {!isSubscribed ? (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
              You must have an active subscription to log scores and enter draws.
            </div>
          ) : (
            <form action={addScore as any} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted uppercase tracking-wider font-medium ml-1">Score</label>
                  <Input 
                    type="number" 
                    name="score" 
                    min="1" 
                    max="45" 
                    required 
                    placeholder="e.g. 24" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted uppercase tracking-wider font-medium ml-1">Date</label>
                  <Input 
                    type="date" 
                    name="date" 
                    required 
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {maxScoresReached && (
                <p className="text-xs text-muted">
                  Logging a new score will automatically replace your oldest score.
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full">
                Save Score
              </Button>
            </form>
          )}
        </Card>

        {/* Recent Scores List */}
        <Card className="flex-1 bg-surface/30">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Latest Scores</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border">
              {scores?.length || 0} / 5
            </span>
          </div>

          <div className="space-y-3">
            {scores && scores.length > 0 ? (
              scores.map((score, index) => (
                <div key={score.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/50 hover:bg-surface/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                      {score.score}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Round {scores.length - index}</p>
                      <p className="text-xs text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <form action={deleteScore.bind(null, score.id) as any}>
                    <Button type="submit" variant="ghost" className="text-muted hover:text-red-400 p-2 h-auto">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted border border-dashed border-border/50 rounded-xl">
                No scores recorded yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
