'use client'

import CalendarHotel from '../../components/CalendarHotel'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardHotel() {
  const [stats, setStats] = useState({
    occupationRate: 0,
    topChambre: '',
    totalReservations: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      const now = moment()
      const past = moment().subtract(30, 'days')

      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .gte('date_arrivee', past.format('YYYY-MM-DD'))
        .lte('date_depart', now.format('YYYY-MM-DD'))
        .eq('statut', 'confirmée')

      const { data: chambres } = await supabase
        .from('chambres')
        .select('*')

      // 🔢 Taux d'occupation
      const totalJoursOccupés = reservations?.reduce((sum, r) => {
        const a = moment(r.date_arrivee)
        const b = moment(r.date_depart)
        return sum + b.diff(a, 'days')
      }, 0) || 0

      const totalJoursDisponibles = (chambres?.length || 1) * 30

      const occupationRate = Math.round((totalJoursOccupés / totalJoursDisponibles) * 100)

      // 🔝 Chambre la plus demandée
      const freq: Record<string, number> = {}
      reservations?.forEach((r) => {
        if (!freq[r.chambre_type]) freq[r.chambre_type] = 0
        freq[r.chambre_type]++
      })
      const topChambre = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

      setStats({
        occupationRate,
        topChambre,
        totalReservations: reservations?.length || 0
      })
    }

    loadStats()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">📊 Tableau de bord IA — Hôtel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-700">📈 Taux d’occupation</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.occupationRate}%</p>
        </div>

        <div className="p-4 bg-white rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-700">🏆 Chambre préférée</h2>
          <p className="text-xl font-bold text-blue-600 mt-2">{stats.topChambre}</p>
        </div>

        <div className="p-4 bg-white rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-700">📅 Réservations (30j)</h2>
          <p className="text-xl font-bold text-pink-600 mt-2">{stats.totalReservations}</p>
        </div>
      </div>

      <CalendarHotel />
    </div>
  )
}
