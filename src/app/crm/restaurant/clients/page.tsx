'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { PlusCircle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Client {
  id: string
  nom: string
  email: string
  tel: string
  fidelite: number
  created_at: string
}

export default function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from('restaurant_clients')
        .select('*')
        .order('created_at', { ascending: false })

      setClients(data || [])
    }

    fetchClients()
  }, [])

  const ajouterClient = async () => {
    const nom = prompt('Nom du client ?')
    const tel = prompt('Téléphone ?')
    const email = prompt('Email ?')

    if (!nom) return

    const { data, error } = await supabase
      .from('restaurant_clients')
      .insert([{ nom, tel, email, fidelite: 0 }])
      .select()
      .single()

    if (!error && data) setClients([data, ...clients])
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#5C27FE]">👤 Clients du restaurant</h1>
        <button
          onClick={ajouterClient}
          className="flex items-center gap-2 text-white bg-[#5C27FE] px-4 py-2 rounded-md hover:bg-[#4721c5]"
        >
          <PlusCircle size={18} />
          Ajouter
        </button>
      </div>

      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-[#F6F7FB] text-left">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Fidélité</th>
            <th className="p-3">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-800">{c.nom}</td>
              <td className="p-3">{c.tel || '—'}</td>
              <td className="p-3 text-[#5C27FE] font-bold">{c.fidelite}</td>
              <td className="p-3 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
