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

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('logs_admin')
        .select('*, user_id')
        .order('created_at', { ascending: false })
        .limit(100)

      setLogs(data || [])
    }

    fetchLogs()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">📜 Historique des actions utilisateurs</h1>

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
