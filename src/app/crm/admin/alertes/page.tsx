'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AlertesIA() {
  const [alertes, setAlertes] = useState<any[]>([])

  const chargerAlertes = async () => {
    const { data } = await supabase
      .from('alerts_admin')
      .select('*')
      .order('created_at', { ascending: false })

    setAlertes(data || [])
  }

  const marquerVue = async (id: string) => {
    await supabase.from('alerts_admin').update({ vue: true }).eq('id', id)
    chargerAlertes()
  }

  useEffect(() => {
    chargerAlertes()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600">🛡️ Alertes IA — Sécurité du système</h1>

      {alertes.length === 0 ? (
        <p>Aucune alerte détectée.</p>
      ) : (
        <div className="grid gap-4">
          {alertes.map((a) => (
            <div key={a.id} className={`p-4 border rounded shadow ${a.vue ? 'bg-gray-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-600">
                <strong>🕒</strong> {moment(a.created_at).format('DD/MM/YYYY HH:mm')} — <strong>👤 User:</strong> {a.user_id}
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                {a.messages?.map((msg: string, i: number) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
              {!a.vue && (
                <button
                  onClick={() => marquerVue(a.id)}
                  className="mt-3 bg-green-600 text-white px-4 py-1 rounded text-sm"
                >
                  Marquer comme vu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
