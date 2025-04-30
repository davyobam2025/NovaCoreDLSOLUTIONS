'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const COLORS = ['#ec4899', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']

export default function FicheClientSpa() {
  const { id } = useParams()
  const [client, setClient] = useState<any>(null)
  const [rdvs, setRdvs] = useState<any[]>([])

  useEffect(() => {
    const fetchClient = async () => {
      const { data } = await supabase
        .from('clients_spa')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setClient(data)
    }

    const fetchRDVs = async () => {
      const { data } = await supabase
        .from('rdv_spa')
        .select('*, soins_spa(nom), paiements_spa(montant, statut, mode)')
        .eq('client_id', id)
        .order('date_rdv', { ascending: false })
      setRdvs(data || [])
    }

    fetchClient()
    fetchRDVs()
  }, [id])

  const calculerPreferencesIA = () => {
    const map: Record<string, number> = {}

    rdvs.forEach((r) => {
      const soin = r.soins_spa?.nom
      if (!soin) return
      if (!map[soin]) map[soin] = 0
      map[soin] += 1
    })

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
      .slice(0, 5)
  }

  if (!client) return <p className="p-6">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">
        👩‍⚕️ Fiche cliente : {client.prenom} {client.nom}
      </h1>

      <div className="mb-6">
        <p><strong>Email :</strong> {client.email}</p>
        <p><strong>Téléphone :</strong> {client.telephone}</p>
        <p><strong>Date de naissance :</strong> {client.date_naissance}</p>
      </div>

      {calculerPreferencesIA().length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-pink-500 mb-4">
            🧠 Soins préférés (IA) + Visualisation
          </h2>

          <ul className="list-disc pl-5 text-sm text-gray-700 mb-6">
            {calculerPreferencesIA().map((item, index) => (
              <li key={index}>
                {item.name} ({item.value} fois)
              </li>
            ))}
          </ul>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculerPreferencesIA()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {calculerPreferencesIA().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <h2 className="text-xl font-semibold text-pink-500 mt-10 mb-2">📅 Historique RDV</h2>

      {rdvs.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {rdvs.map((r) => (
            <li key={r.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Soin :</strong> {r.soins_spa?.nom}</p>
              <p><strong>Date :</strong> {r.date_rdv} à {r.heure_rdv}</p>
              <p><strong>Montant :</strong> {r.montant} FCFA</p>
              <p><strong>Paiement :</strong> {r.paiements_spa?.statut || 'Non payé'} ({r.paiements_spa?.mode || '-'})</p>
              <p><strong>Statut :</strong> {r.statut}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
