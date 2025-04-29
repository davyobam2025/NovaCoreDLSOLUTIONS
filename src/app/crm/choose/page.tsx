'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const crmOptions = [
  { value: 'hotel', label: 'CRM Hôtellerie' },
  { value: 'spa', label: 'CRM Spa & Beauté' },
  { value: 'restaurant', label: 'CRM Restauration' },
  { value: 'community-manager', label: 'CRM Communication Digitale' },
  { value: 'hopital', label: 'CRM Hôpital' },
  { value: 'location', label: 'CRM Immobilier' }
]

export default function ChooseCRMPage() {
  const [selectedCRM, setSelectedCRM] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCRM) {
      // Stockage temporaire (peut être remplacé par un appel API Supabase)
      localStorage.setItem('user_crm_activity', selectedCRM)
      router.push(`/crm/${selectedCRM}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Choisissez votre activité</h1>
        <select
          value={selectedCRM}
          onChange={(e) => setSelectedCRM(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
        >
          <option value="">-- Sélectionner une activité --</option>
          {crmOptions.map((crm) => (
            <option key={crm.value} value={crm.value}>
              {crm.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selectedCRM}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Accéder à mon CRM
        </button>
      </form>
    </div>
  )
}
