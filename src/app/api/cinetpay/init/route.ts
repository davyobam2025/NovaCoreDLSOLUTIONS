import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const { email, crm } = await req.json()
  const transactionId = uuidv4()

  const payload = {
    apikey: process.env.CINETPAY_API_KEY,
    site_id: process.env.CINETPAY_SITE_ID,
    transaction_id: transactionId,
    amount: 10000,
    currency: 'XAF',
    description: `Abonnement NovaCore (${crm})`,
    notify_url: process.env.CINETPAY_NOTIFY_URL,
    return_url: process.env.CINETPAY_RETURN_URL,
    channels: '',
    metadata: JSON.stringify({ email, crm })
  }

  const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const result = await res.json()

  if (result.code === '201') {
    return NextResponse.json({ redirect: result.data.payment_url })
  } else {
    return NextResponse.json({ error: result.message }, { status: 500 })
  }
}
