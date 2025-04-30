import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateReceiptPDF({
  nom,
  prenom,
  montant,
  rdvId,
  datePaiement
}: {
  nom: string
  prenom: string
  montant: number
  rdvId: string
  datePaiement: string
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 400])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const draw = (text: string, x: number, y: number) =>
    page.drawText(text, { x, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) })

  draw('🧾 Reçu de Paiement NovaCore Spa', 150, 360)
  draw(`Nom : ${prenom} ${nom}`, 50, 320)
  draw(`Montant : ${montant} FCFA`, 50, 290)
  draw(`Date : ${datePaiement}`, 50, 260)
  draw(`Numéro RDV : ${rdvId}`, 50, 230)
  draw(`Merci pour votre confiance.`, 50, 190)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
