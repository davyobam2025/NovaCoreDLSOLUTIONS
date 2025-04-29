'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PrivateMessagesPage() {
  // Simule si l'utilisateur est abonné ou pas
  const [isSubscribed, setIsSubscribed] = useState(false)

  const conversations = [
    {
      id: 1,
      user: 'Hotel Marriot',
      lastMessage: 'Merci pour votre réponse, à bientôt !'
    },
    {
      id: 2,
      user: 'Fournisseur DecoPro',
      lastMessage: 'Nous avons envoyé le devis.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Messagerie Privée</h1>

      {!isSubscribed ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <p className="text-lg font-semibold text-gray-700">
            La messagerie privée est réservée aux membres Premium.
          </p>
          <p className="text-sm text-gray-500">
            Abonnez-vous pour échanger directement avec d'autres professionnels, sous supervision IA.
          </p>
          <Link href="/abonnement">
            <button className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">
              S'abonner maintenant
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{conv.user}</h2>
                <p className="text-sm text-gray-500">{conv.lastMessage}</p>
              </div>
              <Link
                href={`/novaworld/messages/${conv.id}`}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                Ouvrir
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
