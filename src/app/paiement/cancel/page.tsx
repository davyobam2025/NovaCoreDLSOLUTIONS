'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Paiement annulé</h1>
      <p className="text-lg mb-6">Le paiement n’a pas été finalisé. Vous pouvez réessayer ou revenir plus tard.</p>
      <Link href="/crm/spa/rdv">
        <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
          ↩️ Retour à l'agenda Spa
        </button>
      </Link>
    </div>
  )
}
