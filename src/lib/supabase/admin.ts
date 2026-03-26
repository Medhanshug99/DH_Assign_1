import { createClient } from '@supabase/supabase-js'

// Use the service role key to bypass RLS during webhooks
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_build_key'
)
