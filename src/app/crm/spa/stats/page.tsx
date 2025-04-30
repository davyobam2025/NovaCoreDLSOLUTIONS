'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SpaStatsPage() {
  const [data, setData] = useState([])
  const [fidelite, setFidelite] = useState(0)
  const [soinPopulaire, setSoinPopulaire] = useState('—')

  useEffect(() => {
    const fetchStats = async () => {
      const { data: rdvs } = await supabase.from('spa_reservations').select('*')
      const { data: clients } = await supabase.from('spa_clients').select('*')

      const jours = Array(7).fill(0)
      const soins = {}
      let scoreTotal = 0

      rdvs?.forEach((r) => {
        const d = new Date(r.date_rdv).getDay()
        jours[d]++
        soins[r.soin] = (soins[r.soin] || 0) + 1
      })

      clients?.forEach((c) => {
        scoreTotal += c.fidelite || 0
      })

      const chartData = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((j, i) => ({
        jour: j,
        visites: jours[i],
      }))

      const topSoin = Object.entries(soins).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

      setFidelite(Math.round(scoreTotal / (clients?.length || 1)))
      setSoinPopulaire(topSoin)
      setData(chartData)
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📈 Statistiques soins & fidélité</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatBox label="Fidélité moyenne" value={fidelite} />
        <StatBox label="Soin le plus populaire" value={soinPopulaire} />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visites" fill="#5C27FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#5C27FE]">{value}</p>
    </div>
  )
}
