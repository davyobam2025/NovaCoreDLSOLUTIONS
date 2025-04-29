'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { sendOfferMail } from '@/lib/email/sendOfferMail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Candidate {
  id: string
  candidate_name: string
  candidate_email: string
  score: number
}

export default function OffersDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [title, setTitle] = useState('')
  const [salary, setSalary] = useState('')
  const [details, setDetails] = useState('')

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('id, candidate_name, candidate_email, score')
        .gte('score', 70) // uniquement top candidats
        .order('score', { ascending: false })

      if (error) console.error('Erreur chargement top candidats:', error)
      else setCandidates(data as Candidate[])
    }

    fetchCandidates()
  }, [])

  const handleSendOffer = async () => {
    if (!selectedCandidate || !title || !salary || !details) return

    await sendOfferMail(selectedCandidate.candidate_email, selectedCandidate.candidate_name, title, salary, details)

    alert('Offre de contrat envoyée avec succès 🚀')

    // Reset
    setSelectedCandidate(null)
    setTitle('')
    setSalary('')
    setDetails('')
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Envoyer une offre directe</h1>

      {/* Liste des meilleurs candidats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-gray-100 p-6 rounded-xl shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">{candidate.candidate_name}</h2>
              <p className="text-sm text-gray-600">{candidate.score}%</p>
            </div>
            <button
              onClick={() => setSelectedCandidate(candidate)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Proposer un contrat
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire d'Offre */}
      {selectedCandidate && (
        <div className="bg-indigo-50 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Nouvelle offre pour {selectedCandidate.candidate_name}</h2>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="Titre du Poste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Salaire proposé"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Détails de l'offre (missions, avantages...)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSendOffer}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold"
            >
              Envoyer l'offre
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
