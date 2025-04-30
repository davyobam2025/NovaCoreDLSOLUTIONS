'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouveauClientSpa() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.telephone) {
      alert('Veuillez remplir tous les champs requis.')
      return
    }

    const session = await supabase.auth.getSession()
    const email = session.data.session?.user.email

    const { data: entreprise } = await supabase
      .from('entreprises')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!entreprise) {
      alert('Entreprise introuvable.')
      return
    }

    const { error } = await supabase.from('clients_spa').insert([
      {
        entreprise_id: entreprise.id,
        ...form
      }
    ])

    if (error) {
      alert('Erreur lors de la création du client.')
      console.error(error)
    } else {
      alert('✅ Client ajouté avec succès.')
      router.push('/crm/spa/clients')
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">👥 Nouveau client Spa</h1>

      <input
        name="prenom"
        value={form.prenom}
        onChange={handleChange}
        placeholder="Prénom"
        className="w-full mb-4 p-3 border rounded"
      />
      <input
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Nom"
        className="w-full mb-4 p-3 border rounded"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email (optionnel)"
        className="w-full mb-4 p-3 border rounded"
      />
      <input
        name="telephone"
        value={form.telephone}
        onChange={handleChange}
        placeholder="Téléphone"
        className="w-full mb-4 p-3 border rounded"
      />
      <input
        name="date_naissance"
        type="date"
        value={form.date_naissance}
        onChange={handleChange}
        placeholder="Date de naissance"
        className="w-full mb-6 p-3 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Enregistrer
      </button>
    </div>
  )
}
