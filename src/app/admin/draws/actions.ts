'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function generateRandomNumbers(count: number, max: number): number[] {
  const numbers = new Set<number>()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export async function runMonthlyDraw() {
  const supabase = await createClient()

  // 1. Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Unauthorized' }

  // 2. Generate month key and check if draw already exists
  const now = new Date()
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { data: existingDraw } = await supabase.from('draws').select('id').eq('month_year', monthYear).maybeSingle()
  if (existingDraw) {
    return { error: 'A draw for this month has already been executed.' }
  }

  // Find previous draw's jackpot rollover
  const { data: previousDraw } = await supabase
    .from('draws')
    .select('jackpot_rollover')
    .order('executed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const carryForwardJackpot = previousDraw?.jackpot_rollover || 0

  // 3. Generate 5 random numbers (1-45)
  const drawNumbers = generateRandomNumbers(5, 45)

  // 4. Fetch all Active Subscribers first to calculate the pool
  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('id, contribution_percentage')
    .neq('subscription_status', 'none')

  if (!activeUsers || activeUsers.length === 0) {
    // We still create the draw record
    await supabase.from('draws').insert({
      month_year: monthYear,
      numbers: drawNumbers,
      status: 'completed',
      jackpot_rollover: carryForwardJackpot // Jackpot carries forward if no active users
    })
    revalidatePath('/admin/draws')
    return { success: true, message: 'Draw executed, but no active subscribers found.' }
  }

  // Calculate dynamic prize pool
  // Assume a base subscription price of $10. After charity, a fixed portion goes to prize pool.
  // Let's say $4 per active subscriber goes to the prize pool.
  const FIXED_POOL_CONTRIBUTION = 4 
  const currentMonthPool = activeUsers.length * FIXED_POOL_CONTRIBUTION
  
  const pool5Match = (currentMonthPool * 0.40) + carryForwardJackpot
  const pool4Match = currentMonthPool * 0.35
  const pool3Match = currentMonthPool * 0.25

  // 5. Create the Draw record initially
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .insert({
      month_year: monthYear,
      numbers: drawNumbers,
      status: 'completed',
      // We will update jackpot_rollover at the end if no 5-match is found
    })
    .select('id')
    .single()

  if (drawError || !draw) return { error: drawError?.message || 'Failed to create draw' }

  // Variables to track winners per tier
  const winners5 = []
  const winners4 = []
  const winners3 = []

  // 6. For each user, fetch scores and calculate matches
  for (const p of activeUsers) {
    // Get latest 5 scores
    const { data: userScores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', p.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!userScores || userScores.length < 5) continue // Only users with 5 scores qualify

    const scoreVals = userScores.map(s => s.score)
    
    // Count matches
    let matchCount = 0
    scoreVals.forEach(val => {
      if (drawNumbers.includes(val)) {
        matchCount++
      }
    })

    if (matchCount === 5) winners5.push(p.id)
    if (matchCount === 4) winners4.push(p.id)
    if (matchCount === 3) winners3.push(p.id)
  }

  // Determine payouts
  const payout5 = winners5.length > 0 ? (pool5Match / winners5.length) : 0
  const payout4 = winners4.length > 0 ? (pool4Match / winners4.length) : 0
  const payout3 = winners3.length > 0 ? (pool3Match / winners3.length) : 0

  const resultsToInsert: any[] = []

  const addResult = (userId: string, matchCount: number, wonAmount: number) => {
    resultsToInsert.push({
      draw_id: draw.id,
      user_id: userId,
      matches_count: matchCount,
      won_amount: parseFloat(wonAmount.toFixed(2)),
      verified: false,           // Set to false for the new Verification flow!
      payment_status: 'pending' 
    })
  }

  winners5.forEach(id => addResult(id, 5, payout5))
  winners4.forEach(id => addResult(id, 4, payout4))
  winners3.forEach(id => addResult(id, 3, payout3))

  // 7. Insert all results
  if (resultsToInsert.length > 0) {
    await supabase.from('draw_results').insert(resultsToInsert)
  }

  // 8. Handle Jackpot Rollover
  let newRollover = 0
  if (winners5.length === 0) {
    newRollover = pool5Match // Carry over the 40% + previous jackpot!
  }

  await supabase.from('draws').update({ jackpot_rollover: newRollover }).eq('id', draw.id)

  revalidatePath('/admin/draws')
  revalidatePath('/dashboard/draws')
  return { success: true }
}
