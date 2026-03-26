'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addScore(formData: FormData) {
  const supabase = await createClient()
  const score = parseInt(formData.get('score') as string)
  const date = formData.get('date') as string

  if (isNaN(score) || score < 1 || score > 45) {
    return { error: 'Score must be between 1 and 45' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check how many scores current user has
  const { data: currentScores, error: fetchError } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }) // oldest first

  if (fetchError) {
    return { error: fetchError.message }
  }

  // If already 5 or more, delete the oldest ones until we have 4 (so we can add 1 making it 5)
  if (currentScores && currentScores.length >= 5) {
    const overflowCount = currentScores.length - 4
    const idsToDelete = currentScores.slice(0, overflowCount).map(s => s.id)
    
    await supabase
      .from('scores')
      .delete()
      .in('id', idsToDelete)
  }

  // Insert new score
  const { error: insertError } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      date: date || new Date().toISOString().split('T')[0]
    })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/scores')
  return { success: true }
}

export async function deleteScore(scoreId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/scores')
  return { success: true }
}
