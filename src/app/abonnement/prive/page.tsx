'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function AbonnementPrive() {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const handlePayer = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      alert("Veuillez vous connecter.")
      return
    }

    setLoading(true)

    const res = await fetch('/api/cinetpay/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.primaryEmailAddress.emailAddress,
        crm: 'messagerie-privee'
      }),
    })

    const data = await res.json()
    if (data.redirect) {
      window.location.href = data.redirect
    } else {
      alert("Erreur : " + data.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full border shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">💼 Abonnement Messagerie Privée</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          L’accès aux messages privés est payant. Cette souscription permet d’échanger librement avec d'autres entreprises.
        </p>

        <button
          onClick={handlePayer}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded"
        >
          {loading ? "Redirection vers CinetPay..." : "Payer 10 000 FCFA"}
        </button>
      </div>
    </div>
  )
}
