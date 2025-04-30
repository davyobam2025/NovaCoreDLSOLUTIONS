'use client'

import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">🚫 Accès interdit</h1>
        <p className="text-gray-700 text-lg mb-6">
          Vous n’avez pas les autorisations nécessaires pour accéder à cette page.
        </p>
        <Link href="/crm">
          <button className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition">
            Retour au CRM
          </button>
        </Link>
      </div>
    </div>
  )
}
