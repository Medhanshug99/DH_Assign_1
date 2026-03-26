import * as React from 'react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Fetch users with their subscription details
  const { data: users } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      display_name,
      subscription_status,
      contribution_percentage,
      is_admin,
      created_at
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-red-50">
          <Users className="w-6 h-6 text-red-500" />
          Manage Users
        </h2>
        <p className="text-muted text-sm max-w-xl">
          View all registered users on the platform and their subscription statuses.
        </p>
      </div>

      <Card className="border-border/50 bg-surface/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-black/40 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Impact %</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-border/20 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{u.display_name || 'Anonymous'}</div>
                    <div className="text-muted text-xs">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {u.subscription_status === 'none' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface text-muted border border-border">
                        Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {u.subscription_status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.contribution_percentage}%
                  </td>
                  <td className="px-6 py-4">
                    {u.is_admin ? (
                      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Admin</span>
                    ) : (
                      <span className="text-muted text-xs uppercase tracking-wider">User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
