'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouveauRdvSpa() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [soins, setSoins] = useState<any[]>([])
  const [form, setForm] = useState({
    client_id: '',
    soin_id: '',
    date_rdv: '',
    heure_rdv: '',
    montant: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { data: c } = await supabase
        .from('clients_spa')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
      setClients(c || [])

      const { data: s } = await supabase
        .from('soins_spa')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
      setSoins(s || [])
    }

    fetchData()
  }, [])

  const handleChange = (e: any) => {
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

    const { error } = await supabase.from('rdv_spa').insert([
      {
        ...form,
        montant: parseInt(form.montant, 10),
        entreprise_id: entreprise?.id
      }
    ])

    if (error) {
      alert('❌ Erreur de création')
      console.error(error)
    } else {
      alert('✅ RDV ajouté')
      router.push('/crm/spa/rdv')
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-xl font-bold text-pink-600 mb-6">📅 Nouveau RDV Spa</h1>

      <select
        name="client_id"
        onChange={handleChange}
        className="w-full mb-4 p-3 border rounded"
      >
        <option value="">Sélectionner un client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.prenom} {c.nom}
          </option>
        ))}
      </select>

      <select
        name="soin_id"
        onChange={handleChange}
        className="w-full mb-4 p-3 border rounded"
      >
        <option value="">Choisir un soin</option>
        {soins.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nom} — {s.prix} FCFA
          </option>
        ))}
      </select>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          name="date_rdv"
          onChange={handleChange}
          className="flex-1 p-3 border rounded"
        />
        <input
          type="time"
          name="heure_rdv"
          onChange={handleChange}
          className="flex-1 p-3 border rounded"
        />
      </div>

      <input
        name="montant"
        type="number"
        onChange={handleChange}
        placeholder="Montant total"
        className="w-full mb-6 p-3 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
      >
        Enregistrer le rendez-vous
      </button>
    </div>
  )
}
