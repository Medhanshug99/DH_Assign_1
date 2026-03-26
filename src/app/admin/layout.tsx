import * as React from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden">
      {/* Admin Sidebar - fixed left */}
      <div className="w-64 hidden md:block h-full shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative bg-black">
        {/* Subtle red tint for admin area */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-red-900/5 blur-[200px] rounded-full -z-10 pointer-events-none" />
        
        <div className="container p-6 md:p-12 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
