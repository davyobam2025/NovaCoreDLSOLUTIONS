'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

const crms = [
  { id: 'spa', label: 'Spa / Beauté' },
  { id: 'hotel', label: 'Hôtel' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'community', label: 'Community Manager' },
  { id: 'immobilier', label: 'Agence Immobilière' },
  { id: 'medical', label: 'Établissement Médical' },
]

export default function AbonnementPage() {
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const handleSubmit = async () => {
    if (!selected || !user?.primaryEmailAddress?.emailAddress) {
      alert('Sélectionnez un CRM')
      return
    }

    setLoading(true)

    const res = await fetch('/api/cinetpay/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.primaryEmailAddress.emailAddress,
        crm: selected
      })
    })

    const json = await res.json()
    if (json.redirect) {
      window.location.href = json.redirect
    } else {
      alert('Erreur paiement')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📦 Choisir un CRM & S’abonner</h1>

      <div className="space-y-4 mb-6">
        {crms.map((crm) => (
          <label key={crm.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="crm"
              value={crm.id}
              checked={selected === crm.id}
              onChange={() => setSelected(crm.id)}
            />
            <span>{crm.label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !selected}
        className="bg-[#5C27FE] text-white px-6 py-3 rounded hover:bg-[#4721c5] w-full"
      >
        {loading ? 'Redirection vers CinetPay...' : 'Payer 10 000 FCFA'}
      </button>
    </div>
  )
}
