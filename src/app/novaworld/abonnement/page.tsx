'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const plans = [
  {
    id: 'free',
    nom: 'Gratuit',
    prix: '0 FCFA',
    avantages: [
      'Accès aux salons publics',
      'Navigation réseau social',
      'Profil entreprise visible'
    ]
  },
  {
    id: 'pro',
    nom: 'Pro',
    prix: '9 000 FCFA / mois',
    avantages: [
      'Messagerie privée débloquée',
      'IA modérateur active',
      'Salons privés CRM',
      'Promotion entreprise boostée'
    ]
  },
  {
    id: 'entreprise',
    nom: 'Entreprise',
    prix: '29 000 FCFA / mois',
    avantages: [
      'Tous les modules IA RH',
      'Dashboard CRM intelligent',
      'Contrats, Recrutement, Formations',
      'Support 24h/24 + API NovaCore'
    ]
  }
]

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleChoix = async (planId: string) => {
    setSelectedPlan(planId)

    const user = await supabase.auth.getUser()
    const userId = user.data?.user?.id

    if (!userId) return alert('Utilisateur non connecté.')

    await supabase.from('abonnements').upsert({
      utilisateur_id: userId,
      plan: planId,
      statut: 'en_attente_paiement'
    })

    alert(`Plan "${planId}" sélectionné. Redirection vers paiement à venir.`)
    // TODO: rediriger vers Stripe / CinetPay
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-10 text-center">Choisissez votre abonnement NovaWorld</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan.id} className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-700">{plan.nom}</h2>
              <p className="text-lg font-semibold text-gray-800 mb-4">{plan.prix}</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {plan.avantages.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleChoix(plan.id)}
              className={`mt-6 w-full py-2 rounded-md font-bold ${
                selectedPlan === plan.id
                  ? 'bg-green-600 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {selectedPlan === plan.id ? 'Sélectionné' : 'Choisir'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
