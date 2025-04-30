import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
})

export async function POST(req: Request) {
  const body = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'xaf',
          product_data: {
            name: `Réservation chambre Hôtel - NovaCore`
          },
          unit_amount: body.montant * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      reservation_id: body.reservation_id
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?ref=${body.reservation_id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/crm/hotel/reservations`
  })

  return NextResponse.json({ url: session.url })
}
