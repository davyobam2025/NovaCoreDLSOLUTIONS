'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function StatsCM() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('cm_posts').select('*')
      const grouped: Record<string, number> = {}

      data?.forEach((p) => {
        const reseau = p.reseau || 'Autre'
        grouped[reseau] = (grouped[reseau] || 0) + 1
      })

      const chartData = Object.entries(grouped).map(([reseau, count]) => ({
        reseau,
        posts: count,
      }))

      setStats(chartData)
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📊 Statistiques réseaux sociaux</h1>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="reseau" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="posts" fill="#5C27FE" />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-4">
        Nombre total de publications enregistrées par plateforme.
      </p>
    </div>
  )
}
