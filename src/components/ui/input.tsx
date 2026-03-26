'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helperText?: string
  error?: string
}

type MotionInputProps = HTMLMotionProps<"input"> & Omit<InputProps, keyof HTMLMotionProps<"input">>

export const Input = React.forwardRef<HTMLInputElement, MotionInputProps>(
  ({ className, helperText, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-2">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted/50",
            error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {(helperText || error) && (
          <span className={cn("text-xs px-1", error ? "text-red-400" : "text-muted")}>
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
