'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SuccessPage() {
  const params = useSearchParams()
  const rdvId = params.get('rdv_id')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (rdvId) {
      setMessage(`✅ Paiement reçu pour le RDV #${rdvId}`)
    }
  }, [rdvId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Paiement réussi !</h1>
      <p className="text-lg mb-6">{message}</p>
      <Link href="/crm/spa/rdv">
        <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          Retour à l'agenda Spa
        </button>
      </Link>
    </div>
  )
}
