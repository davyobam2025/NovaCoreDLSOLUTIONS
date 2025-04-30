import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, prenom, chambre, date_arrivee, date_depart } = await req.json()

  const { error } = await resend.emails.send({
    from: 'crm@tonhotel.com',
    to: [email],
    subject: '🎁 Votre privilège VIP chez Hôtel Royal Spa',
    html: `
      <div style="font-family:Arial,sans-serif; padding:20px">
        <h2 style="color:#d63384">Bonjour ${prenom},</h2>

        <p>Votre réservation pour la chambre <strong>${chambre}</strong> du <strong>${date_arrivee}</strong> au <strong>${date_depart}</strong> est confirmée. 🎉</p>

        <p style="margin-top:20px">En tant que <strong>client VIP</strong>, nous vous offrons :</p>
        <ul>
          <li>🛀 <strong>1 accès gratuit au SPA</strong></li>
          <li>🍷 <strong>Une boisson de bienvenue</strong></li>
          <li>⬆️ <strong>Possibilité de surclassement</strong> selon disponibilité</li>
        </ul>

        <p style="margin-top:20px">
          <a href="https://tonhotel.com/vip/bonus?email=${encodeURIComponent(email)}" 
             style="background:#d63384; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
            🎁 J'accepte mon bonus VIP
          </a>
        </p>

        <p style="margin-top:30px; font-size:12px; color:#888">Merci pour votre fidélité, à très bientôt 🌟</p>
      </div>
    `
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'email envoyé avec bonus' })
}
