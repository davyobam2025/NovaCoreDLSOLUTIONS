'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Candidate {
  id: string
  candidate_name: string
  candidate_email: string
  score: number
  statut: string
}

const statutLabels: Record<string, string> = {
  en_attente: 'En attente',
  entretien: 'Entretien programmé',
  accepte: 'Accepté',
  rejete: 'Rejeté'
}

export default function RecrutementCRM() {
  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('id, candidate_name, candidate_email, score, statut')
        .order('created_at', { ascending: false })

      if (error) console.error('Erreur chargement CRM RH:', error)
      else setCandidates(data as Candidate[])
    }

    fetchCandidates()
  }, [])

  const updateStatut = async (id: string, newStatut: string) => {
    await supabase.from('candidatures').update({ statut: newStatut }).eq('id', id)
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, statut: newStatut } : c))
    )
  }

  const grouped = ['en_attente', 'entretien', 'accepte', 'rejete'].map(statut => ({
    statut,
    items: candidates.filter(c => c.statut === statut)
  }))

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-10">Pipeline de recrutement NovaWorld</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {grouped.map(({ statut, items }) => (
          <div key={statut} className="bg-gray-50 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{statutLabels[statut]}</h2>
            <div className="space-y-3">
              {items.map((c) => (
                <div key={c.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <p className="font-semibold">{c.candidate_name}</p>
                  <p className="text-sm text-gray-500">{c.score}%</p>
                  <select
                    value={c.statut}
                    onChange={(e) => updateStatut(c.id, e.target.value)}
                    className="mt-2 w-full border-gray-300 rounded-md"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="entretien">Entretien</option>
                    <option value="accepte">Accepté</option>
                    <option value="rejete">Rejeté</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
