import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  if (body.transaction_id && body.status === 'ACCEPTED') {
    const meta = JSON.parse(body.metadata)

    await supabase.from('abonnements').insert([{
      transaction_id: body.transaction_id,
      user_email: meta.email,
      crm_type: meta.crm
    }])
  }

  return NextResponse.json({ ok: true })
}
