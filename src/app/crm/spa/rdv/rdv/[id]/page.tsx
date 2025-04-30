'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RdvDetailPage() {
  const { id } = useParams()
  const [rdv, setRdv] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email
      setUserEmail(email || '')

      const { data } = await supabase
        .from('rdv_spa')
        .select('*, soins_spa(nom), clients_spa(prenom, nom)')
        .eq('id', id)
        .maybeSingle()

      setRdv(data)
    }

    fetchData()
  }, [id])

  const lancerPaiement = async () => {
    const response = await fetch('/api/paiement/rdv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        montant: rdv.montant,
        user_email: userEmail,
        rdv_id: rdv.id
      })
    })

    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('❌ Erreur lors de la création du paiement.')
    }
  }

  if (!rdv) return <p className="p-6">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">📋 Détail du RDV Spa</h1>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Client :</strong> {rdv.clients_spa?.prenom} {rdv.clients_spa?.nom}</p>
        <p><strong>Soin :</strong> {rdv.soins_spa?.nom}</p>
        <p><strong>Date :</strong> {rdv.date_rdv}</p>
        <p><strong>Heure :</strong> {rdv.heure_rdv}</p>
        <p><strong>Montant :</strong> {rdv.montant} FCFA</p>
        <p><strong>Statut :</strong> {rdv.statut}</p>
      </div>

      <button
        onClick={lancerPaiement}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        💳 Payer en ligne
      </button>
    </div>
  )
}
