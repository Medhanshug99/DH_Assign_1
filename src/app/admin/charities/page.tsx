import * as React from 'react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { HeartPulse } from 'lucide-react'

export default async function AdminCharitiesPage() {
  const supabase = await createClient()

  // Fetch charities and calculate impact metrics
  const { data: charities } = await supabase
    .from('charities')
    .select(`
      id,
      name,
      description,
      profiles (count)
    `)

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-red-50">
          <HeartPulse className="w-6 h-6 text-red-500" />
          Charities Management
        </h2>
        <p className="text-muted text-sm max-w-xl">
          View supported charities and see how many users have selected them for their impact contribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities?.map((charity) => (
          <Card key={charity.id} className="border-border/50 bg-surface/50 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">{charity.name}</h3>
              <p className="text-muted text-sm leading-relaxed mb-6">{charity.description}</p>
            </div>
            
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-medium text-muted uppercase tracking-widest">Active Supporters</span>
              <span className="text-2xl font-bold text-red-400">
                {/* @ts-ignore */}
                {charity.profiles?.[0]?.count || 0}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
