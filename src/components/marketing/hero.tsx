'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, HeartHandshake, Gift, CheckCircle2 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Premium Deep Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full -z-10 mix-blend-screen opacity-40 pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full -z-10 mix-blend-screen opacity-30 pointer-events-none -translate-x-1/3 translate-y-1/4" />
      
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        
        {/* Text Content - Asymmetric layout taking 6 columns */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border text-sm text-muted mb-8 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              Elevating Golf. Empowering Change.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Master Your Game. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-emerald-200">
                Drive True Impact.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-lg mb-10 leading-relaxed font-light">
              The exclusive digital platform linking your golf performance to monthly elite rewards, while seamlessly funding global charities with every round you log.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-10">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-shadow">
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="glass" size="lg" className="w-full sm:w-auto text-muted hover:text-foreground">
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Trust / Impact Line */}
            <div className="flex items-center gap-4 text-sm text-muted/80 font-medium">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center text-xs font-bold text-foreground`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Join <span className="text-foreground">1,200+</span> elite members driving <span className="text-primary">$45k+</span> in impact.</p>
            </div>
          </motion.div>
        </div>

        {/* Visual Element - 6 columns - Live Dashboard Mock */}
        <div className="lg:col-span-6 relative hidden lg:flex items-center justify-center h-[600px]">
          {/* Layer 1: Charity Impact (Background Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 50, y: -20, rotate: 2 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 4 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-12 w-72 bg-surface/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs font-bold text-muted bg-white/5 px-2 py-1 rounded-md">15% Impact</span>
            </div>
            <p className="text-sm text-muted mb-1">Total Donated</p>
            <h3 className="text-3xl font-bold text-foreground">$2,450</h3>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary"/> Fairway Foundation</p>
            </div>
          </motion.div>

          {/* Layer 2: Score Input (Middle Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -50, y: 20, rotate: -2 }}
            animate={{ opacity: 1, x: -40, y: 40, rotate: -6 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="absolute left-0 top-32 w-80 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Latest Round</h4>
                <p className="text-xs text-muted">Oct 24, 2026</p>
              </div>
            </div>
            <div className="flex items-end gap-3 h-24 mb-2">
              {[22, 35, 18, 41, 44].map((score, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group">
                  <div 
                    className={`w-full rounded-t-sm transition-all ${i === 4 ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}
                    style={{ height: `${(score / 45) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted mt-2 font-mono">
              <span>Log 1</span>
              <span className="text-primary font-bold">Log 5 (44)</span>
            </div>
          </motion.div>

          {/* Layer 3: Draw Result (Front Center) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 80 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="absolute w-96 bg-black/60 backdrop-blur-2xl border border-primary/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
          >
            {/* Top glass reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-primary" />
                <h4 className="font-bold tracking-tight">October Draw</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                Verified Win
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-3">Winning Sequence</p>
                <div className="flex justify-between gap-2">
                  {[12, 18, 35, 41, 44].map((num, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-mono font-bold text-lg shadow-inner">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/50 flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted font-medium mb-1">Matches found</p>
                  <p className="text-2xl font-bold text-foreground">4 <span className="text-sm font-normal text-muted">/ 5</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted font-medium mb-1">Reward</p>
                  <p className="text-3xl font-bold text-primary">$500</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
