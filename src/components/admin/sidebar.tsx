'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ShieldAlert, Users, HeartPulse, Dices, LogOut, Trophy } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: ShieldAlert },
  { name: 'Run Draw', href: '/admin/draws', icon: Dices },
  { name: 'Winners', href: '/admin/winners', icon: Trophy },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
  { name: 'Charities', href: '/admin/charities', icon: HeartPulse },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full bg-black/80 border-r border-border/50 p-6">
      <div className="flex items-center gap-2 mb-12">
        <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <span className="font-bold tracking-tight text-xl text-red-50">Admin Panel</span>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.name} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : "text-muted hover:text-red-300 hover:bg-white/5 border border-transparent"
              )}>
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="pt-8 border-t border-border/50 mt-auto">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors font-medium text-sm">
          Return to User App
        </Link>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors font-medium text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  )
}
