'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HotelDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    topRoom: '—',
    taux: 0,
    revenus: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const { data: reservations } = await supabase
        .from('hotel_reservations')
        .select('*')

      const roomCount = {}
      let totalNuits = 0

      reservations?.forEach(r => {
        const jours = (new Date(r.date_fin).getTime() - new Date(r.date_debut).getTime()) / (1000 * 60 * 60 * 24)
        totalNuits += jours
        roomCount[r.chambre] = (roomCount[r.chambre] || 0) + 1
      })

      const chambreTop = Object.entries(roomCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

      setStats({
        total: reservations?.length || 0,
        topRoom: chambreTop,
        taux: Math.round((totalNuits / (30 * 10)) * 100), // Ex: 10 chambres max sur 30 jours
        revenus: Math.round(totalNuits * 45000) // Prix fixe estimé: 45 000 FCFA / nuit
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#5C27FE] mb-8">🏨 Dashboard CRM Hôtel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card title="📅 Réservations totales" value={stats.total} />
        <Card title="💰 Revenus estimés (FCFA)" value={stats.revenus.toLocaleString()} />
        <Card title="📈 Taux d’occupation" value={`${stats.taux}%`} />
        <Card title="🔥 Chambre la + réservée" value={stats.topRoom} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink href="/crm/hotel/reservations" label="📆 Planning réservations" />
        <QuickLink href="/crm/hotel/chambres" label="🛏️ Chambres" />
        <QuickLink href="/crm/hotel/clients" label="👤 Clients & profils" />
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-[#5C27FE] mt-2">{value}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="bg-indigo-50 hover:bg-indigo-100 text-[#5C27FE] text-sm font-semibold p-4 rounded-lg shadow text-center">
      {label}
    </Link>
  )
}
