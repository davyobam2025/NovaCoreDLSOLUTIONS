'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Contrat {
  id: string
  code_contrat: string
  poste: string
  salaire: string
  date_debut: string
  lieu: string
  duree: string
  pdf_url: string
  statut: string
  candidat: {
    candidate_name: string
    candidate_email: string
  }
}

export default function ContratsDashboard() {
  const [contrats, setContrats] = useState<Contrat[]>([])

  useEffect(() => {
    const fetchContrats = async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select('*, candidat:candidat_id(candidate_name, candidate_email)')
        .order('created_at', { ascending: false })

      if (error) console.error('Erreur chargement contrats:', error)
      else setContrats(data as Contrat[])
    }

    fetchContrats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Tous les contrats émis</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-sm rounded-xl border">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Candidat</th>
              <th className="px-4 py-2 text-left">Poste</th>
              <th className="px-4 py-2 text-left">Début</th>
              <th className="px-4 py-2 text-left">Durée</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Fichier</th>
            </tr>
          </thead>
          <tbody>
            {contrats.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-bold">{c.code_contrat}</td>
                <td className="px-4 py-3">
                  {c.candidat?.candidate_name}<br />
                  <span className="text-sm text-gray-500">{c.candidat?.candidate_email}</span>
                </td>
                <td className="px-4 py-3">{c.poste}</td>
                <td className="px-4 py-3">{new Date(c.date_debut).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.duree}</td>
                <td className="px-4 py-3 capitalize">{c.statut}</td>
                <td className="px-4 py-3">
                  <a href={c.pdf_url} target="_blank" className="text-indigo-600 underline">
                    Voir PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
