import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function logAdminAction({
  user_id,
  action,
  cible_type,
  cible_id,
  details = {}
}: {
  user_id: string
  action: string
  cible_type: string
  cible_id: string
  details?: object
}) {
  const { error } = await supabase.from('logs_admin').insert({
    user_id,
    action,
    cible_type,
    cible_id,
    details
  })

  if (error) console.error('Erreur insertion log admin:', error)
}
