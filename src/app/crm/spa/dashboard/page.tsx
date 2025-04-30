'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardSpa() {
  const [nbClients, setNbClients] = useState(0)
  const [nbRdv, setNbRdv] = useState(0)
  const [revenu, setRevenu] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { count: totalClients } = await supabase
        .from('clients_spa')
        .select('*', { count: 'exact', head: true })
        .eq('entreprise_id', entreprise?.id)
      setNbClients(totalClients || 0)

      const { count: totalRdv } = await supabase
        .from('rdv_spa')
        .select('*', { count: 'exact', head: true })
        .eq('entreprise_id', entreprise?.id)
      setNbRdv(totalRdv || 0)

      const { data: paiements } = await supabase
        .from('paiements_spa')
        .select('montant')
        .eq('statut', 'validé')
        .in('rdv_id',
          supabase
            .from('rdv_spa')
            .select('id')
            .eq('entreprise_id', entreprise?.id)
            .then(res => res.data?.map(r => r.id) || [])
        )

      const total = paiements?.reduce((sum, p) => sum + p.montant, 0) || 0
      setRevenu(total)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">🌸 Tableau de bord - Institut Beauté</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 shadow rounded-lg">
          <p className="text-sm text-gray-500">Clients total</p>
          <p className="text-2xl font-bold">{nbClients}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <p className="text-sm text-gray-500">RDV enregistrés</p>
          <p className="text-2xl font-bold">{nbRdv}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <p className="text-sm text-gray-500">Revenu généré</p>
          <p className="text-2xl font-bold text-green-600">{revenu} FCFA</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/crm/spa/rdv/nouveau">
          <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
            ➕ Nouveau RDV
          </button>
        </Link>
        <Link href="/crm/spa/rdv">
          <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
            📅 Voir les rendez-vous
          </button>
        </Link>
        <Link href="/crm/spa/clients">
          <button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">
            👥 Liste des clients
          </button>
        </Link>
      </div>
    </div>
  )
}
