'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 🧠 Score fidélité IA
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

// 🔮 Recommandation IA de chambre
function recommanderChambreIdeale(rdvs: any[], score: number) {
  if (!rdvs || rdvs.length === 0) return 'Standard'

  const count: Record<string, number> = {}
  rdvs.forEach((r) => {
    if (!count[r.chambre_type]) count[r.chambre_type] = 0
    count[r.chambre_type]++
  })

  const pref = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Standard'

  if (score > 80) {
    if (pref === 'Standard') return 'Double'
    if (pref === 'Double') return 'Suite'
    if (pref === 'Suite') return 'Luxe'
  }

  return pref
}

// 🏅 Détection VIP
function isVIP(score: number) {
  return score >= 80
}

export default function FicheClientHotel() {
  const { id } = useParams()
  const [client, setClient] = useState<any>(null)
  const [rdvs, setRdvs] = useState<any[]>([])
  const [scoreFidelite, setScoreFidelite] = useState(0)
  const [chambreRecommandee, setChambreRecommandee] = useState('')

  useEffect(() => {
    const fetchClient = async () => {
      const { data } = await supabase
        .from('clients_hotel')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setClient(data)
    }

    const fetchRDVs = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('*, paiements_hotel(montant)')
        .eq('client_id', id)
        .order('date_arrivee', { ascending: false })

      setRdvs(data || [])
      const score = calculerFideliteClient(data || [])
      setScoreFidelite(score)
      setChambreRecommandee(recommanderChambreIdeale(data || [], score))
    }

    fetchClient()
    fetchRDVs()
  }, [id])

  if (!client) return <p className="p-6">Chargement client...</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-2">
        👤 Fiche client : {client.prenom} {client.nom}
      </h1>

      {/* 🏅 Badge VIP */}
      {isVIP(scoreFidelite) && (
        <div className="inline-flex items-center gap-2 text-yellow-600 text-sm font-semibold mb-4 bg-yellow-50 px-3 py-1 rounded-full shadow border border-yellow-300">
          🏅 Statut : Client VIP
        </div>
      )}

      <div className="mb-6">
        <p><strong>Email :</strong> {client.email}</p>
        <p><strong>Téléphone :</strong> {client.telephone}</p>
        <p><strong>Date de naissance :</strong> {client.date_naissance}</p>
      </div>

      {/* 🎖️ SCORE FIDÉLITÉ */}
      <div className="mt-6 p-4 bg-white rounded shadow border">
        <h2 className="text-lg font-semibold text-pink-600">🎖️ Score fidélité client</h2>
        <p className="text-2xl font-bold mt-2">{scoreFidelite} / 100</p>
        <p className="text-sm text-gray-600">
          Basé sur {rdvs.length} séjour(s) et{' '}
          {rdvs.reduce((sum, r) => sum + (r.paiements_hotel?.montant || 0), 0)} FCFA
        </p>
      </div>

      {/* 🔮 RECOMMANDATION CHAMBRE + Bouton */}
      <div className="mt-6 p-4 bg-white rounded shadow border">
        <h2 className="text-lg font-semibold text-pink-600">🔮 Chambre idéale recommandée</h2>
        <p className="text-xl font-bold mt-2">{chambreRecommandee}</p>
        <p className="text-sm text-gray-600">
          Calculée selon l’historique de séjour et le score fidélité ({scoreFidelite}/100)
        </p>

        {/* ✅ BOUTON ACTION */}
        <a
          href={`/crm/hotel/reservations/creer?client_id=${id}&chambre_type=${encodeURIComponent(chambreRecommandee)}`}
          className="inline-block mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded shadow transition"
        >
          ➕ Réserver cette chambre
        </a>
      </div>

      {/* 📅 HISTORIQUE DES RÉSERVATIONS */}
      <h2 className="text-xl font-semibold text-pink-600 mt-10 mb-2">📅 Historique des réservations</h2>

      {rdvs.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {rdvs.map((r) => (
            <li key={r.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Chambre :</strong> {r.chambre_type}</p>
              <p><strong>Séjour :</strong> {r.date_arrivee} → {r.date_depart}</p>
              <p><strong>Montant :</strong> {r.paiements_hotel?.montant || '-'} FCFA</p>
              <p><strong>Statut :</strong> {r.statut}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
