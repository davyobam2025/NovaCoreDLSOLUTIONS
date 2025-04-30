'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NouvelleReservationHotel() {
  const [clients, setClients] = useState<any[]>([])
  const [chambres, setChambres] = useState<any[]>([])
  const [form, setForm] = useState({
    client_id: '',
    chambre_id: '',
    date_arrivee: '',
    date_depart: '',
    montant_total: ''
  })

  const router = useRouter()

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
        .from('clients_hotel')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
      setClients(c || [])

      const { data: ch } = await supabase
        .from('chambres_hotel')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
        .eq('disponibilite', true)
      setChambres(ch || [])
    }

    fetchData()
  }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const { error } = await supabase.from('reservations_hotel').insert([
      {
        ...form,
        montant_total: parseInt(form.montant_total, 10),
        statut: 'en_attente'
      }
    ])

    if (error) {
      alert('Erreur de création')
      console.error(error)
    } else {
      alert('✅ Réservation enregistrée')
      router.push('/crm/hotel/reservations')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-xl font-bold text-indigo-600 mb-6">➕ Nouvelle réservation</h1>

      <select name="client_id" onChange={handleChange} className="w-full mb-4 p-3 border rounded">
        <option value="">Choisir un client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.prenom} {c.nom}
          </option>
        ))}
      </select>

      <select name="chambre_id" onChange={handleChange} className="w-full mb-4 p-3 border rounded">
        <option value="">Choisir une chambre</option>
        {chambres.map((ch) => (
          <option key={ch.id} value={ch.id}>
            {ch.numero} - {ch.type}
          </option>
        ))}
      </select>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          name="date_arrivee"
          onChange={handleChange}
          className="flex-1 p-3 border rounded"
          placeholder="Date d'arrivée"
        />
        <input
          type="date"
          name="date_depart"
          onChange={handleChange}
          className="flex-1 p-3 border rounded"
          placeholder="Date de départ"
        />
      </div>

      <input
        type="number"
        name="montant_total"
        onChange={handleChange}
        placeholder="Montant total en FCFA"
        className="w-full mb-6 p-3 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Enregistrer la réservation
      </button>
    </div>
  )
}
