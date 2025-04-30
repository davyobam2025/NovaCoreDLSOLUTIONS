'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function calculerFideliteClient(rdvs: any[]) {
  if (!rdvs || rdvs.length === 0) return 0

  const totalSejours = rdvs.length
  const today = moment()
  const dates = rdvs.map((r) => moment(r.date_arrivee)).sort((a, b) => a.diff(b))
  const dernierSejour = dates[dates.length - 1]
  const ecartMoyen = dates.length > 1
    ? dates.slice(1).reduce((sum, d, i) => sum + d.diff(dates[i], 'days'), 0) / (dates.length - 1)
    : 30

  const joursDepuisDernier = today.diff(dernierSejour, 'days')
  const montantTotal = rdvs.reduce((sum, r) => sum + (r.paiements_hotel?.montant || 0), 0)

  const score =
    Math.min(totalSejours * 10, 40) +
    Math.max(0, 30 - Math.min(ecartMoyen, 30)) +
    (joursDepuisDernier < 30 ? 20 : 0) +
    Math.min(montantTotal / 100000, 10)

  return Math.round(score)
}

export default function ReservationCreatePage() {
  const params = useSearchParams()
  const client_id = params.get('client_id') || ''
  const chambre_type = params.get('chambre_type') || ''

  const [form, setForm] = useState({
    client_id,
    chambre_type,
    date_arrivee: '',
    date_depart: ''
  })

  const [client, setClient] = useState<any>(null)
  const [scoreFidelite, setScoreFidelite] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const chargerClient = async () => {
      const { data: clientData } = await supabase
        .from('clients_hotel')
        .select('*')
        .eq('id', client_id)
        .maybeSingle()

      setClient(clientData)

      const { data: rdvs } = await supabase
        .from('reservations')
        .select('*, paiements_hotel(montant)')
        .eq('client_id', client_id)

      const score = calculerFideliteClient(rdvs || [])
      setScoreFidelite(score)
    }

    if (client_id) chargerClient()
  }, [client_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.from('reservations').insert({
      client_id: form.client_id,
      chambre_type: form.chambre_type,
      date_arrivee: form.date_arrivee,
      date_depart: form.date_depart,
      statut: 'en attente'
    })

    if (error) {
      setMessage('❌ Erreur : ' + error.message)
    } else {
      setMessage('✅ Réservation créée !')

      if (scoreFidelite >= 80 && client?.email) {
        await fetch('/api/reservation/send-vip-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: client.email,
            prenom: client.prenom,
            chambre: form.chambre_type,
            date_arrivee: form.date_arrivee,
            date_depart: form.date_depart
          })
        })
      }

      setForm({ ...form, date_arrivee: '', date_depart: '' })
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">📅 Nouvelle réservation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client ID</label>
          <input
            type="text"
            name="client_id"
            value={form.client_id}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Chambre recommandée</label>
          <input
            type="text"
            name="chambre_type"
            value={form.chambre_type}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date d’arrivée</label>
          <input
            type="date"
            name="date_arrivee"
            value={form.date_arrivee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date de départ</label>
          <input
            type="date"
            name="date_depart"
            value={form.date_depart}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
        >
          ✅ Confirmer réservation
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
