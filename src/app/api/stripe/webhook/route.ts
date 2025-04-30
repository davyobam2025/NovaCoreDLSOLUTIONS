import { sendReceiptMail } from '@/lib/email/sendReceiptMail'

await sendReceiptMail({
  to: session.customer_email!,
  prenom: 'Client',
  nom: 'Test',
  rdvId: metadata.rdv_id,
  montant: session.amount_total / 100,
  datePaiement: new Date().toISOString().split('T')[0]
})
