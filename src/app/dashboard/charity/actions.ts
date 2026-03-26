'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCharity(formData: FormData) {
  const supabase = await createClient()
  
  const charityId = formData.get('charity_id') as string
  const percentage = parseInt(formData.get('percentage') as string)
  
  if (isNaN(percentage) || percentage < 10 || percentage > 100) {
    return { error: 'Percentage must be between 10 and 100' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const updateData = {
    contribution_percentage: percentage,
    selected_charity_id: charityId || null,
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/charity')
  return { success: true }
}
