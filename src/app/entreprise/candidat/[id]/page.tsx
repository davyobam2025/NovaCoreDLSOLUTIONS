'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CandidateDetail {
  id: string
  candidate_name: string
  candidate_email: string
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  candidate_message: string
  candidate_cv_text: string
}

export default function CandidateDetailPage() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('*')
        .eq('id', id)
        .single()

      if (error) console.error('Erreur chargement candidat:', error)
      else setCandidate(data as CandidateDetail)
    }

    fetchCandidate()
  }, [id])

  if (!candidate) {
    return <p className="text-center mt-10 text-gray-600">Chargement...</p>
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">{candidate.candidate_name}</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Email :</h2>
          <p>{candidate.candidate_email}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Score IA :</h2>
          <p>{candidate.score}%</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Résumé IA :</h2>
          <p>{candidate.summary}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Message du candidat :</h2>
          <p className="whitespace-pre-wrap">{candidate.candidate_message}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Analyse CV :</h2>
          <p className="whitespace-pre-wrap text-sm">{candidate.candidate_cv_text}</p>
        </div>
      </div>
    </div>
  )
}
