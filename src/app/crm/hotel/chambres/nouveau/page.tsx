'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouvelleChambreHotel() {
  const router = useRouter()

  const [form, setForm] = useState({
    numero: '',
    type: '',
    description: '',
    prix_journalier: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const session = await supabase.auth.getSession()
    const email = session.data.session?.user.email

    const { data: entreprise } = await supabase
      .from('entreprises')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!entreprise) {
      alert('Erreur : entreprise non trouvée.')
      return
    }

    const { error } = await supabase.from('chambres_hotel').insert([
      {
        entreprise_id: entreprise.id,
        ...form,
        prix_journalier: parseInt(form.prix_journalier, 10),
        disponibilite: true
      }
    ])

    if (error) {
      console.error(error)
      alert('Erreur lors de la création.')
    } else {
      alert('✅ Chambre créée avec succès.')
      router.push('/crm/hotel/chambres')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">🏨 Ajouter une chambre</h1>

      <input
        name="numero"
        value={form.numero}
        onChange={handleChange}
        placeholder="Numéro de chambre"
        className="w-full p-3 mb-4 border rounded"
      />

      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Type (simple, double, suite...)"
        className="w-full p-3 mb-4 border rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-3 mb-4 border rounded"
      />

      <input
        name="prix_journalier"
        value={form.prix_journalier}
        onChange={handleChange}
        type="number"
        placeholder="Prix par nuit (en FCFA)"
        className="w-full p-3 mb-6 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Ajouter la chambre
      </button>
    </div>
  )
}
