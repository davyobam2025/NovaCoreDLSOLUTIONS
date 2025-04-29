'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RestoStatsPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const { data: reservations } = await supabase
        .from('restaurant_reservations')
        .select('date_reservation')

      const stats = Array(7).fill(0)

      reservations?.forEach(r => {
        const day = new Date(r.date_reservation).getDay() // 0-6
        stats[day]++
      })

      const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      const chartData = labels.map((label, i) => ({
        jour: label,
        reservations: stats[i],
      }))

      setData(chartData)
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📈 Statistiques hebdomadaires</h1>

      <div className="bg-gray-50 p-6 rounded-xl shadow">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reservations" fill="#5C27FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
