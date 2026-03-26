import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateCharity } from './actions'
import { createClient } from '@/lib/supabase/server'
import { HeartHandshake } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function CharityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_charity_id, contribution_percentage, subscription_status')
    .eq('id', user.id)
    .single()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <HeartHandshake className="w-6 h-6 text-primary" />
          Impact Settings
        </h2>
        <p className="text-muted text-sm max-w-xl">
          A portion of your subscription fuels meaningful causes. Choose where your impact goes and what percentage (minimum 10%).
        </p>
      </div>

      <form action={updateCharity as any} className="space-y-8">
        
        {/* Contribution Percentage slider/input */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Your Contribution</h3>
              <p className="text-sm text-muted">Set the percentage of your monthly fee to donate.</p>
            </div>
            <div className="w-full sm:w-48 relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold pointer-events-none">%</div>
              <Input 
                type="number"
                name="percentage"
                min="10"
                max="100"
                defaultValue={profile?.contribution_percentage || 10}
                required
                className="text-xl font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Charity Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charities?.map((charity) => {
            const isSelected = profile?.selected_charity_id === charity.id
            return (
              <label key={charity.id} className="cursor-pointer group relative">
                <input 
                  type="radio" 
                  name="charity_id" 
                  value={charity.id} 
                  defaultChecked={isSelected}
                  className="peer sr-only"
                />
                <Card className={`
                  h-full transition-all duration-300
                  peer-checked:border-primary peer-checked:bg-primary/5
                  group-hover:border-primary/50 group-hover:bg-surface/60
                  ${isSelected ? '' : 'border-border/50 opacity-80 group-hover:opacity-100'}
                `}>
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-border peer-checked:border-primary flex items-center justify-center transition-colors">
                    {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  <h4 className="font-bold text-lg mb-2 mr-8">{charity.name}</h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {charity.description}
                  </p>
                </Card>
              </label>
            )
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button type="submit" variant="primary">
            Save Impact Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
