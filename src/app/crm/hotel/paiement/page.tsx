'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PaiementHotel() {
  const params = useSearchParams()
  const router = useRouter()
  const reservation_id = params.get('reservation_id')
  const [reservation, setReservation] = useState<any>(null)
  const [montant, setMontant] = useState('')
  const [mode, setMode] = useState('carte')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservation_id) return
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservation_id)
        .maybeSingle()
      setReservation(data)
    }

    fetchReservation()
  }, [reservation_id])

  const handlePaiement = async () => {
    setLoading(true)
    const { error } = await supabase.from('paiements_hotel').insert({
      reservation_id,
      montant: Number(montant),
      mode,
      statut: 'payé',
      reference: `PAIEMENT-${Date.now()}`
    })

    if (!error) {
      router.push('/crm/hotel/paiement/success')
    } else {
      alert('Erreur lors du paiement')
    }

    setLoading(false)
  }

  if (!reservation) return <p className="p-4">Chargement...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-pink-700">💳 Paiement du séjour</h1>

      <p><strong>Client :</strong> {reservation.client_prenom} {reservation.client_nom}</p>
      <p><strong>Chambre :</strong> {reservation.chambre_type}</p>
      <p><strong>Du :</strong> {reservation.date_arrivee} → {reservation.date_depart}</p>

      <input
        type="number"
        placeholder="Montant (FCFA)"
        value={montant}
        onChange={(e) => setMontant(e.target.value)}
        className="border p-2 w-full mt-4 rounded"
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border p-2 w-full mt-2 rounded"
      >
        <option value="carte">Carte</option>
        <option value="mobile_money">Mobile Money</option>
        <option value="paypal">PayPal</option>
      </select>

      <button
        onClick={handlePaiement}
        disabled={loading || !montant}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Paiement en cours...' : 'Payer'}
      </button>
    </div>
  )
}
