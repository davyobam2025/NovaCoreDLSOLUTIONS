'use client'

import { useState } from 'react'

export default function CheckoutCinetPay() {
  const [loading, setLoading] = useState(false)

  const payer = async () => {
    setLoading(true)
    const res = await fetch('/api/cinetpay/init', { method: 'POST' })
    const json = await res.json()

    if (json.redirect) {
      window.location.href = json.redirect
    } else {
      alert("Erreur paiement CinetPay")
      setLoading(false)
    }
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-6">💳 Paiement CinetPay</h1>
      <button
        onClick={payer}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        {loading ? "Redirection..." : "Payer 10 000 FCFA"}
      </button>
    </div>
  )
}
