'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

export const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Subtle top glare effect for a premium glassy feel */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {children as any}
      </motion.div>
    )
  }
)
Card.displayName = 'Card'
