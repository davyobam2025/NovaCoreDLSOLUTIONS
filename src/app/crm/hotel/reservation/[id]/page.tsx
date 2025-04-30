'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FicheReservation() {
  const { id } = useParams()
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchReservation = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setReservation(data)
    }

    fetchReservation()
  }, [id])

  const confirmerReservation = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('reservations')
      .update({ statut: 'confirmée' })
      .eq('id', id)

    if (!error) {
      setMessage('✅ Réservation confirmée')
      setReservation({ ...reservation, statut: 'confirmée' })
    } else {
      setMessage('❌ Erreur lors de la confirmation')
    }

    setLoading(false)
  }

  if (!reservation) return <p className="p-6">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">📄 Détail Réservation</h1>

      <div className="space-y-2 bg-white p-4 border rounded shadow">
        <p><strong>Client :</strong> {reservation.client_prenom} {reservation.client_nom}</p>
        <p><strong>Email :</strong> {reservation.email}</p>
        <p><strong>Téléphone :</strong> {reservation.telephone}</p>
        <p><strong>Chambre :</strong> {reservation.chambre_type}</p>
        <p><strong>Séjour :</strong> du {reservation.date_arrivee} au {reservation.date_depart}</p>
        <p><strong>Adultes / Enfants :</strong> {reservation.adultes} / {reservation.enfants}</p>
        <p><strong>Commentaire :</strong> {reservation.commentaire || '—'}</p>
        <p><strong>Statut :</strong> {reservation.statut}</p>
      </div>

      <div className="flex gap-4 mt-6">
        {reservation.statut !== 'confirmée' && (
          <button
            onClick={confirmerReservation}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirmer
          </button>
        )}

        <Link
          href={`/crm/hotel/paiement?reservation_id=${reservation.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Procéder au paiement
        </Link>

        <Link
          href={`/api/reservations/${reservation.id}/facture`}
          target="_blank"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          📄 Télécharger facture
        </Link>
      </div>

      {message && <p className="text-sm mt-3">{message}</p>}
    </div>
  )
}
