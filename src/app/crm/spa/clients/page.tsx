'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ListeClientsSpa() {
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
        .from('clients_spa')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
        .order('created_at', { ascending: false })

      setClients(data || [])
      setLoading(false)
    }

    fetchClients()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">👥 Liste des clients Spa</h1>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : clients.length === 0 ? (
        <p>Aucun client enregistré.</p>
      ) : (
        <ul className="space-y-4">
          {clients.map((client) => (
            <li key={client.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{client.prenom} {client.nom}</p>
                <p className="text-sm text-gray-600">{client.email} • {client.telephone}</p>
              </div>
              <Link href={`/crm/spa/clients/${client.id}`}>
                <button className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700">
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
