'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ListeSoinsPage() {
  const [soins, setSoins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSoins = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { data, error } = await supabase
        .from('soins')
        .select('*')
        .eq('entreprise_id', entreprise?.id)
        .order('created_at', { ascending: false })

      if (!error) setSoins(data || [])
      setLoading(false)
    }

    fetchSoins()
  }, [])

  const supprimer = async (id: string) => {
    if (!confirm('Supprimer ce soin ?')) return

    const { error } = await supabase.from('soins').delete().eq('id', id)
    if (!error) {
      setSoins((prev) => prev.filter((s) => s.id !== id))
      alert('Soin supprimé ✅')
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">💄 Liste des soins</h1>
        <Link href="/crm/spa/soins/nouveau">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            + Nouveau soin
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : soins.length === 0 ? (
        <p>Aucun soin enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soins.map((soin) => (
            <div key={soin.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="font-bold text-lg">{soin.titre}</h2>
              <p className="text-sm text-gray-600">{soin.description}</p>
              <p className="mt-2">💰 {soin.prix} FCFA – 🕒 {soin.duree} min</p>
              <button
                onClick={() => supprimer(soin.id)}
                className="mt-4 text-red-600 text-sm underline"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
