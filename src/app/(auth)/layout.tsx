import * as React from 'react'
import Link from 'next/link'
import { Flag } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between bg-surface p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 group w-fit">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Flag className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-xl">Fairway Impact</span>
        </Link>
        
        <div className="relative z-10 max-w-sm mt-auto">
          <h2 className="text-3xl font-bold mb-4">Elevate your game. <br /> Empower your cause.</h2>
          <p className="text-muted font-light leading-relaxed">
            Join a network of golfers who turn their performance into tangible rewards and meaningful global impact.
          </p>
        </div>
      </div>
      
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden absolute top-8 left-6 md:left-12 flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Flag className="w-5 h-5 text-primary" />
          </div>
        </Link>
        {children}
      </div>
    </div>
  )
}
