'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyProof(resultId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Unauthorized' }

  // Update
  if (status === 'approved') {
    const { error } = await supabase
      .from('draw_results')
      .update({ verified: true, payment_status: 'paid' })
      .eq('id', resultId)
    
    if (error) return { error: error.message }
  } else {
    // If rejected, clear proof making them submit again
    const { error } = await supabase
      .from('draw_results')
      .update({ verified: false, proof_url: null, payment_status: 'pending' })
      .eq('id', resultId)
      
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/winners')
  return { success: true }
}
