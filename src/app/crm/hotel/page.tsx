'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HotelDashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReservations: 0,
    tauxOccupation: 0,
    fideliteMoyenne: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: clients } = await supabase.from('hotel_clients').select('*')
      const { data: reservations } = await supabase.from('hotel_reservations').select('*')

      const joursOccupes = reservations?.reduce((acc, r) => {
        const d1 = new Date(r.date_debut)
        const d2 = new Date(r.date_fin)
        return acc + Math.max(1, (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
      }, 0) || 0

      const chambres = 10 // TODO: dynamique
      const joursMois = 30
      const tauxOccupation = Math.min(100, (joursOccupes / (chambres * joursMois)) * 100)

      const fideliteMoyenne = clients?.reduce((acc, c) => acc + (c.fidelite || 0), 0) / (clients?.length || 1)

      setStats({
        totalClients: clients?.length || 0,
        totalReservations: reservations?.length || 0,
        tauxOccupation: Math.round(tauxOccupation),
        fideliteMoyenne: Math.round(fideliteMoyenne)
      })
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Dashboard CRM – Hôtel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard label="Total clients" value={stats.totalClients} />
        <StatCard label="Réservations" value={stats.totalReservations} />
        <StatCard label="Taux d’occupation" value={`${stats.tauxOccupation}%`} />
        <StatCard label="Fidélité moyenne" value={stats.fideliteMoyenne} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink href="/crm/hotel/reservations" label="📅 Calendrier Réservations" />
        <QuickLink href="/crm/hotel/clients" label="👤 Liste Clients" />
        <QuickLink href="/crm/hotel/stats" label="📈 Statistiques IA" />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-indigo-700">{value}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-4 rounded-lg shadow text-sm font-semibold text-center">
      {label}
    </Link>
  )
}
