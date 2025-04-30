'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardSpa() {
  const [stats, setStats] = useState({
    soins: 0,
    clients: 0,
    rdvs: 0,
    rdvsAujourdHui: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (!entreprise) return

      const today = new Date().toISOString().split('T')[0]

      const [soins, clients, rdvs, rdvsToday] = await Promise.all([
        supabase.from('soins').select('*').eq('entreprise_id', entreprise.id),
        supabase.from('clients_spa').select('*').eq('entreprise_id', entreprise.id),
        supabase.from('rdv_spa').select('*').eq('entreprise_id', entreprise.id),
        supabase
          .from('rdv_spa')
          .select('*')
          .eq('entreprise_id', entreprise.id)
          .gte('date_rdv', today + 'T00:00:00')
          .lte('date_rdv', today + 'T23:59:59'),
      ])

      setStats({
        soins: soins.data?.length || 0,
        clients: clients.data?.length || 0,
        rdvs: rdvs.data?.length || 0,
        rdvsAujourdHui: rdvsToday.data?.length || 0,
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">🏠 Dashboard Spa</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Soins actifs" value={stats.soins} />
        <StatCard label="Clients enregistrés" value={stats.clients} />
        <StatCard label="Rendez-vous total" value={stats.rdvs} />
        <StatCard label="RDV aujourd’hui" value={stats.rdvsAujourdHui} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink href="/crm/spa/soins" label="Voir les soins" />
        <QuickLink href="/crm/spa/rdv" label="Voir les RDV" />
        <QuickLink href="/crm/spa/soins/nouveau" label="+ Ajouter un soin" />
        <QuickLink href="/crm/spa/rdv/nouveau" label="+ Nouveau RDV" />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded shadow text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-indigo-700">{value}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded hover:bg-indigo-50 cursor-pointer text-center">
        <span className="text-indigo-600 font-medium">{label}</span>
      </div>
    </Link>
  )
}
