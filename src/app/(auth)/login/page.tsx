'use client'

import * as React from 'react'
import { sendOtp, verifyOtp } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Mail, ArrowRight, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [step, setStep] = React.useState<'email' | 'otp'>('email')
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  async function handleSendOtp(formData: FormData) {
    const inputEmail = formData.get('email') as string
    setEmail(inputEmail)
    setError(null)
    
    startTransition(async () => {
      const result = await sendOtp(inputEmail)
      if (result?.error) {
        setError(result.error)
      } else {
        setStep('otp')
      }
    })
  }

  async function handleVerifyOtp(formData: FormData) {
    const code = formData.get('code') as string
    setError(null)

    startTransition(async () => {
      const result = await verifyOtp(email, code)
      if (result?.error) {
        setError("Invalid or expired code. Please try again.")
      }
    })
  }

  function handleResend() {
    startTransition(async () => {
      const result = await sendOtp(email)
      if (result?.error) {
        setError(result.error)
      } else {
        setError("Code resent successfully! Check your inbox.")
      }
    })
  }

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Email Input */}
        {step === 'email' && (
          <motion.div 
            key="email-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome</h1>
              <p className="text-muted text-sm">Enter your email to continue to Fairway Impact. No password required.</p>
            </div>

            <form action={handleSendOtp} className="space-y-6">
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com"
                defaultValue={email}
                required 
                autoFocus
                className="text-lg py-6"
              />

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full group"
                isLoading={isPending}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <motion.div 
            key="otp-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <button 
                onClick={() => { setStep('email'); setError(null); }}
                className="mb-4 text-muted hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to email
              </button>
              
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Check your mail</h1>
              <p className="text-muted text-sm">
                We've sent a secure login code to <strong className="text-foreground">{email}</strong>. Enter the 6-digit code below to log in securely.
              </p>
            </div>

            <form action={handleVerifyOtp} className="space-y-6">
              <Input 
                id="code" 
                name="code" 
                type="text" 
                placeholder="6-digit code" 
                required 
                autoComplete="one-time-code"
                maxLength={6}
                className="text-center tracking-widest text-2xl py-6 font-mono font-bold uppercase"
              />

              {error && (
                <div className={`p-3 border rounded-xl text-sm ${
                  error.includes('resent') 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  {error.includes('resent') ? <CheckCircle2 className="w-4 h-4 inline mr-2" /> : null}
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  isLoading={isPending}
                >
                  Verify Code
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-muted"
                  onClick={handleResend}
                  disabled={isPending}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
