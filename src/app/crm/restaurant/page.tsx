'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardRestoPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReservations: 0,
    tauxOccupation: 0,
    fideliteMoyenne: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: clients } = await supabase.from('restaurant_clients').select('*')
      const { data: reservations } = await supabase.from('restaurant_reservations').select('*')

      const totalResa = reservations?.length || 0
      const places = 20 // Capacité max (modifiable)
      const jours = 30
      const tauxOccupation = Math.round((totalResa / (places * jours)) * 100)

      const fideliteMoyenne = clients?.reduce((acc, c) => acc + (c.fidelite || 0), 0) / (clients?.length || 1)

      setStats({
        totalClients: clients?.length || 0,
        totalReservations: totalResa,
        tauxOccupation,
        fideliteMoyenne: Math.round(fideliteMoyenne)
      })
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#5C27FE] mb-6">Dashboard CRM – Restaurant</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Stat label="Total clients" value={stats.totalClients} />
        <Stat label="Réservations" value={stats.totalReservations} />
        <Stat label="Taux d’occupation" value={`${stats.tauxOccupation}%`} />
        <Stat label="Fidélité moyenne" value={stats.fideliteMoyenne} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Quick href="/crm/restaurant/reservations" label="📅 Réservations" />
        <Quick href="/crm/restaurant/clients" label="👤 Clients" />
        <Quick href="/crm/restaurant/stats" label="📈 Statistiques" />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-[#5C27FE]">{value}</p>
    </div>
  )
}

function Quick({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="bg-indigo-50 text-[#5C27FE] hover:bg-indigo-100 p-4 rounded-lg shadow text-sm font-semibold text-center">
      {label}
    </Link>
  )
}
