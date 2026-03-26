'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Flag } from 'lucide-react'

export function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Flag className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-xl">Fairway Impact</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted hover:text-foreground transition-colors mix-blend-difference">
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="#charities" className="hover:text-foreground transition-colors">Our Charities</Link>
          <Link href="#rewards" className="hover:text-foreground transition-colors">Rewards</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden md:flex">Sign in</Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
