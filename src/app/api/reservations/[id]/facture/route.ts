import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = context.params

  const { data: reservation, error: rError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (rError || !reservation) {
    return new Response('Réservation non trouvée', { status: 404 })
  }

  const { data: paiement } = await supabase
    .from('paiements_hotel')
    .select('*')
    .eq('reservation_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const draw = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
  }

  draw('🧾 FACTURE SÉJOUR HÔTELIER', 50, 760, 18)
  draw(`Client: ${reservation.client_prenom} ${reservation.client_nom}`, 50, 720)
  draw(`Email: ${reservation.email}`, 50, 700)
  draw(`Téléphone: ${reservation.telephone}`, 50, 680)
  draw(`Séjour: du ${reservation.date_arrivee} au ${reservation.date_depart}`, 50, 660)
  draw(`Chambre: ${reservation.chambre_type}`, 50, 640)
  draw(`Statut Réservation: ${reservation.statut}`, 50, 620)

  draw(`Montant payé: ${paiement?.montant || '—'} FCFA`, 50, 580)
  draw(`Mode: ${paiement?.mode || '—'}`, 50, 560)
  draw(`Date Paiement: ${paiement?.created_at?.slice(0, 10) || '—'}`, 50, 540)

  draw(`Facture générée le ${new Date().toLocaleDateString()}`, 50, 500, 10)

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${id}.pdf"`
    }
  })
}
