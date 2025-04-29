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
  summary: string
  strengths: string[]
  weaknesses: string[]
}

export default function EnterpriseDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [minScore, setMinScore] = useState(0)

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('id, candidate_name, candidate_email, score, summary, strengths, weaknesses')
        .order('score', { ascending: false })

      if (error) console.error('Erreur chargement candidatures:', error)
      else setCandidates(data as Candidate[])
    }

    fetchCandidates()
  }, [])

  const filteredCandidates = candidates.filter((c) => c.score >= minScore)

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Candidatures reçues</h1>

      {/* Filtres */}
      <div className="flex items-center gap-6 mb-8">
        <label className="font-semibold text-gray-700">Score minimum :</label>
        <select
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value={0}>Tous</option>
          <option value={60}>60%</option>
          <option value={70}>70%</option>
          <option value={80}>80%</option>
          <option value={90}>90%</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{candidate.candidate_name}</h2>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                candidate.score >= 80 ? 'bg-green-500' :
                candidate.score >= 60 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}>
                {candidate.score}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">{candidate.candidate_email}</p>
            <p className="text-gray-700">{candidate.summary}</p>

            <a
              href={`/entreprise/candidat/${candidate.id}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Voir le profil complet →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
