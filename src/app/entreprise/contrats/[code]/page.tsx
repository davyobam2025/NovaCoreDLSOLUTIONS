'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ContratDetailPage() {
  const { code } = useParams()
  const router = useRouter()
  const [contrat, setContrat] = useState<any>(null)

  useEffect(() => {
    const fetchContrat = async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select('*, candidat:candidat_id(candidate_name, candidate_email)')
        .eq('code_contrat', code)
        .single()

      if (error) console.error('Erreur contrat:', error)
      else setContrat(data)
    }

    fetchContrat()
  }, [code])

  const updateStatut = async (newStatut: string) => {
    await supabase.from('contrats').update({ statut: newStatut }).eq('code_contrat', code)
    setContrat((prev: any) => ({ ...prev, statut: newStatut }))
  }

  if (!contrat) return <p className="text-center mt-10 text-gray-500">Chargement contrat...</p>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">Contrat : {contrat.code_contrat}</h1>

      <div className="space-y-3 text-sm text-gray-700">
        <p><strong>Candidat :</strong> {contrat.candidat?.candidate_name} ({contrat.candidat?.candidate_email})</p>
        <p><strong>Poste :</strong> {contrat.poste}</p>
        <p><strong>Salaire :</strong> {contrat.salaire}</p>
        <p><strong>Lieu :</strong> {contrat.lieu}</p>
        <p><strong>Début :</strong> {new Date(contrat.date_debut).toLocaleDateString()}</p>
        <p><strong>Durée :</strong> {contrat.duree}</p>
        <p><strong>Statut actuel :</strong> <span className="capitalize">{contrat.statut}</span></p>
        <p>
          <strong>Document :</strong>{' '}
          <a href={contrat.pdf_url} target="_blank" className="text-indigo-600 underline">Télécharger PDF</a>
        </p>
      </div>

      {/* Actions RH */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => updateStatut('signe')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Marquer comme signé
        </button>
        <button
          onClick={() => updateStatut('rejete')}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Rejeter le contrat
        </button>
        <button
          onClick={() => router.push('/entreprise/contrats')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  )
}
