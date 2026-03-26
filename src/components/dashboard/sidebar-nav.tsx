'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Target, HeartHandshake, Gift, LogOut, Flag } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Scores', href: '/dashboard/scores', icon: Target },
  { name: 'Charity Impact', href: '/dashboard/charity', icon: HeartHandshake },
  { name: 'Monthly Draws', href: '/dashboard/draws', icon: Gift },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full bg-surface/30 border-r border-border/50 backdrop-blur-xl p-6">
      <Link href="/dashboard" className="flex items-center gap-2 group mb-12">
        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Flag className="w-5 h-5 text-primary" />
        </div>
        <span className="font-bold tracking-tight text-xl">Fairway Impact</span>
      </Link>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.name} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                isActive ? "text-primary flex-none" : "text-muted hover:text-foreground hover:bg-white/5"
              )}>
                <item.icon className="w-4 h-4" />
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="pt-8 border-t border-border/50 mt-auto">
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  )
}
