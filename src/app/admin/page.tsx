import * as React from 'react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { ShieldAlert, Users, HeartPulse, Dices } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Basic stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: subCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('subscription_status', 'none')
  const { count: drawCount } = await supabase.from('draws').select('*', { count: 'exact', head: true })
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-50 mb-2">Admin Overview</h1>
        <p className="text-muted text-sm">Monitor platform metrics and manage system rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        <Card className="bg-surface/50 border-border/50">
          <div className="flex items-center gap-3 text-muted mb-4">
            <Users className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-sm">Total Users</h3>
          </div>
          <div className="text-3xl font-bold">{userCount || 0}</div>
        </Card>
        
        <Card className="bg-surface/50 border-border/50">
          <div className="flex items-center gap-3 text-muted mb-4">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-sm">Active Subs</h3>
          </div>
          <div className="text-3xl font-bold">{subCount || 0}</div>
        </Card>

        <Card className="bg-surface/50 border-border/50">
          <div className="flex items-center gap-3 text-muted mb-4">
            <Dices className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-sm">Total Draws</h3>
          </div>
          <div className="text-3xl font-bold">{drawCount || 0}</div>
        </Card>

        <Card className="bg-surface/50 border-border/50">
          <div className="flex items-center gap-3 text-muted mb-4">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-sm">Charities</h3>
          </div>
          <div className="text-3xl font-bold">3</div>
        </Card>
      </div>
    </div>
  )
}
