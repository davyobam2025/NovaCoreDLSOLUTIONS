import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(req: Request) {
  const body = await req.json()
  const { montant, user_email, rdv_id } = body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user_email,
    line_items: [{
      price_data: {
        currency: 'XAF',
        product_data: {
          name: `Paiement RDV Spa (${rdv_id})`,
        },
        unit_amount: montant * 100,
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/success?rdv_id=${rdv_id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/cancel`,
    metadata: {
      rdv_id,
      user_email
    }
  })

  return NextResponse.json({ url: session.url })
}
