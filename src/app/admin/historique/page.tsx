'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HistoriqueAdmin() {
  const [logs, setLogs] = useState<any[]>([])
  const [allLogs, setAllLogs] = useState<any[]>([])
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    from: '',
    to: ''
  })

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('logs_admin')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    setLogs(data || [])
    setAllLogs(data || [])
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const applyFilters = () => {
    let filtered = allLogs

    if (filters.user) {
      filtered = filtered.filter((l) =>
        l.user_id.toLowerCase().includes(filters.user.toLowerCase())
      )
    }

    if (filters.action) {
      filtered = filtered.filter((l) =>
        l.action.toLowerCase().includes(filters.action.toLowerCase())
      )
    }

    if (filters.from) {
      filtered = filtered.filter((l) =>
        new Date(l.created_at) >= new Date(filters.from)
      )
    }

    if (filters.to) {
      filtered = filtered.filter((l) =>
        new Date(l.created_at) <= new Date(filters.to)
      )
    }

    setLogs(filtered)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">📜 Historique des actions utilisateurs</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Filtrer par user ID"
          className="border p-2 rounded"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />
        <input
          type="text"
          placeholder="🔍 Filtrer par action"
          className="border p-2 rounded"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
      </div>

      <button
        onClick={applyFilters}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Appliquer les filtres
      </button>

      <div className="grid gap-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 bg-white border rounded shadow">
            <p><strong>🔧 Action :</strong> {log.action}</p>
            <p><strong>👤 User ID :</strong> {log.user_id}</p>
            <p><strong>📌 Cible :</strong> {log.cible_type} / {log.cible_id}</p>
            <p><strong>🕒 Date :</strong> {moment(log.created_at).format('DD/MM/YYYY HH:mm')}</p>
            {log.details && (
              <pre className="bg-gray-100 text-xs mt-2 p-2 rounded overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
