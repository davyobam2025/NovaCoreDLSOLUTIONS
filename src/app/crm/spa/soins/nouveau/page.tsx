'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouveauSoinPage() {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState(0)
  const [duree, setDuree] = useState(30)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!titre || prix <= 0 || duree <= 0) {
      alert('Veuillez remplir tous les champs.')
      return
    }

    setLoading(true)
    const session = await supabase.auth.getSession()
    const email = session.data.session?.user.email

    const { data: entreprise } = await supabase
      .from('entreprises')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!entreprise) {
      alert('Entreprise introuvable.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('soins').insert([
      {
        entreprise_id: entreprise.id,
        titre,
        description,
        prix,
        duree
      }
    ])

    if (error) {
      alert('Erreur lors de l’enregistrement.')
      console.error(error)
    } else {
      alert('💄 Soin ajouté avec succès.')
      router.push('/crm/spa/soins')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">Créer un nouveau soin</h1>

      <input
        type="text"
        placeholder="Nom du soin"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        className="w-full mb-4 p-3 border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-3 border rounded min-h-[100px]"
      />

      <input
        type="number"
        placeholder="Prix (FCFA)"
        value={prix}
        onChange={(e) => setPrix(parseInt(e.target.value))}
        className="w-full mb-4 p-3 border rounded"
      />

      <input
        type="number"
        placeholder="Durée (en minutes)"
        value={duree}
        onChange={(e) => setDuree(parseInt(e.target.value))}
        className="w-full mb-6 p-3 border rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer le soin'}
      </button>
    </div>
  )
}
