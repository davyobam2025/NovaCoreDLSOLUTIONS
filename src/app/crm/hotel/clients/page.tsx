'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ListeClientsHotel() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { data } = await supabase
        .from('clients_hotel')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
        .order('created_at', { ascending: false })

      setClients(data || [])
      setLoading(false)
    }

    fetchClients()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">👥 Clients enregistrés</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : clients.length === 0 ? (
        <p>Aucun client pour l’instant.</p>
      ) : (
        <ul className="space-y-4">
          {clients.map((c) => (
            <li key={c.id} className="border p-4 rounded bg-white shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.prenom} {c.nom}</p>
                <p className="text-sm text-gray-600">{c.email} • {c.telephone}</p>
              </div>
              <Link href={`/crm/hotel/clients/${c.id}`}>
                <button className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">
                  ➡️ Voir fiche
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
