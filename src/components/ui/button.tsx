'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

// Omit the standard HTML properties that motion also defines to avoid type conflicts
type MotionButtonProps = HTMLMotionProps<"button"> & Omit<ButtonProps, keyof HTMLMotionProps<"button">>

export const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-primary text-black hover:bg-primary-dark shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-primary/50',
      secondary: 'bg-surface text-foreground hover:bg-surface-hover border border-border',
      outline: 'bg-transparent text-foreground border border-border hover:border-primary/50 hover:bg-surface',
      ghost: 'bg-transparent text-foreground hover:bg-surface',
      glass: 'bg-white/5 backdrop-blur-md text-foreground border border-white/10 hover:bg-white/10',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-medium',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children as any}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
