import * as React from 'react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to verify if we need to show admin link or just load state
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden selection:bg-primary selection:text-black">
      {/* Sidebar - fixed left */}
      <div className="w-64 hidden md:block h-full shrink-0">
        <SidebarNav />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative">
        {/* Subtle background glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
        
        <div className="container p-6 md:p-12 mx-auto max-w-5xl">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.display_name || 'Golfer'}</h1>
              <p className="text-muted text-sm mt-1">Here is your performance and impact overview.</p>
            </div>
            
            {/* Top right actions / profile indicator */}
            <div className="flex items-center gap-4">
              {profile?.subscription_status === 'none' ? (
                <div className="px-3 py-1 bg-surface border border-border rounded-full text-xs text-muted flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Inactive Plan
                </div>
              ) : (
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Premium Active
                </div>
              )}
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  )
}
