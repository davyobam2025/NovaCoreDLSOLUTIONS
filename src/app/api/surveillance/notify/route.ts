import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { alerts, user_id, timestamp } = await req.json()

  const { error } = await supabase.from('alerts_admin').insert({
    user_id,
    messages: alerts,
    cible: 'système',
    created_at: timestamp
  })

  if (error) {
    console.error('Erreur insertion alerte IA', error)
    return NextResponse.json({ error: 'Erreur enregistrement alerte' }, { status: 500 })
  }

  return NextResponse.json({ status: 'notified' })
}
