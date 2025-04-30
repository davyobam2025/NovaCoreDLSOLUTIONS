import nodemailer from 'nodemailer'

export async function sendReceiptMail({
  to,
  prenom,
  nom,
  rdvId,
  montant,
  datePaiement
}: {
  to: string
  prenom: string
  nom: string
  rdvId: string
  montant: number
  datePaiement: string
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🧾 Reçu de paiement NovaCore SPA',
    html: `
      <h2>Bonjour ${prenom} ${nom},</h2>
      <p>Merci pour votre paiement concernant le RDV <strong>${rdvId}</strong>.</p>
      <p><strong>Montant :</strong> ${montant} FCFA</p>
      <p><strong>Date :</strong> ${datePaiement}</p>
      <br />
      <p>💎 L’équipe NovaCore vous remercie pour votre confiance.</p>
    `
  }

  await transporter.sendMail(mailOptions)
}
