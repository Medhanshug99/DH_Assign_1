'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function sendOtp(email: string) {
  const supabase = await createClient()

  // Use PKCE flow with emailRedirectTo so users can just click the link if they prefer.
  // Next.js requires absolute URL for redirect
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
