'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Salon {
  id: string
  nom: string
  description: string
  secteur: string
  acces: 'public' | 'prive'
}

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([])

  useEffect(() => {
    const fetchSalons = async () => {
      const { data, error } = await supabase.from('salons').select('*')
      if (error) console.error('Erreur chargement salons:', error)
      else setSalons(data as Salon[])
    }

    fetchSalons()
  }, [])

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Salons NovaWorld</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salons.map((salon) => (
          <div key={salon.id} className="bg-gray-100 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{salon.nom}</h2>
            <p className="text-sm text-gray-600">{salon.secteur}</p>
            <p className="text-gray-700 mt-2">{salon.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                salon.acces === 'public' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {salon.acces === 'public' ? 'Public' : 'Privé / Premium'}
              </span>
              <Link
                href={
                  salon.acces === 'public'
                    ? `/novaworld/salons/${salon.id}`
                    : `/novaworld/abonnement`
                }
                className="text-indigo-600 font-semibold hover:underline"
              >
                {salon.acces === 'public' ? 'Entrer' : 'S’abonner'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
