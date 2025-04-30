'use client'

import ChambreForm from '../../components/ChambreForm'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PageChambres() {
  const [chambres, setChambres] = useState<any[]>([])

  const loadChambres = async () => {
    const { data } = await supabase
      .from('chambres')
      .select('*')
      .order('numero')

    setChambres(data || [])
  }

  useEffect(() => {
    loadChambres()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">🛏️ Gestion des Chambres</h1>

      <ChambreForm onSuccess={loadChambres} />

      <div className="mt-6 grid gap-4">
        {chambres.map((c) => (
          <div key={c.id} className="p-4 border rounded bg-white shadow">
            <p><strong>Numéro :</strong> {c.numero}</p>
            <p><strong>Type :</strong> {c.type}</p>
            <p><strong>Vue :</strong> {c.vue}</p>
            <p><strong>Statut :</strong> {c.statut}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
