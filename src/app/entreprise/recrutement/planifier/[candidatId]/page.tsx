'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { sendInterviewMail } from '@/lib/email/sendInterviewMail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PlanifierEntretienPage() {
  const { candidatId } = useParams()
  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('')
  const [lien, setLien] = useState('')
  const [sujet, setSujet] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullDate = new Date(`${date}T${heure}`)

    const { data, error } = await supabase
      .from('entretiens')
      .insert([{ candidat_id: candidatId, date_entretien: fullDate, lien, sujet }])

    if (error) {
      console.error('Erreur insertion entretien:', error)
      return
    }

    // récupérer infos du candidat
    const { data: candidat } = await supabase
      .from('candidatures')
      .select('candidate_email, candidate_name')
      .eq('id', candidatId)
      .single()

    if (candidat) {
      await sendInterviewMail(candidat.candidate_email, candidat.candidate_name, fullDate, lien, sujet)
      alert('Entretien planifié et email envoyé 🚀')
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Planifier un entretien</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Sujet de l’entretien"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <input
          type="time"
          value={heure}
          onChange={(e) => setHeure(e.target.value)}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <input
          type="url"
          placeholder="Lien Calendly / Zoom / Google Meet"
          value={lien}
          onChange={(e) => setLien(e.target.value)}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-bold"
        >
          Planifier l’entretien
        </button>
      </form>
    </div>
  )
}
