'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Conversation {
  id: string
  with_user_name: string
  with_user_id: string
  last_message: string
  last_time: string
  blocked: boolean
}

export default function MessageriePage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const auth = await supabase.auth.getUser()
      const userId = auth.data?.user?.id

      const { data: sub } = await supabase
        .from('abonnements')
        .select('plan')
        .eq('utilisateur_id', userId)
        .single()

      setHasAccess(sub?.plan === 'pro' || sub?.plan === 'entreprise')

      if (sub?.plan === 'pro' || sub?.plan === 'entreprise') {
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .or(`user_1.eq.${userId},user_2.eq.${userId}`)

        if (data) {
          const formatted = data.map((conv: any) => ({
            id: conv.id,
            with_user_name: conv.user_1 === userId ? conv.user2_name : conv.user1_name,
            with_user_id: conv.user_1 === userId ? conv.user_2 : conv.user_1,
            last_message: conv.last_message,
            last_time: conv.updated_at,
            blocked: conv.blocked
          }))
          setConversations(formatted)
        }
      }
    }

    fetchData()
  }, [])

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h1 className="text-xl font-bold text-gray-700 mb-4">💬 Messagerie privée réservée aux membres Pro</h1>
        <Link href="/novaworld/abonnement" className="text-indigo-600 underline font-semibold">Passer à Pro</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-8">Vos messages privés</h1>
      <div className="space-y-6">
        {conversations.map(conv => (
          <Link key={conv.id} href={`/novaworld/messages/${conv.id}`} className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-indigo-50">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">{conv.with_user_name}</h2>
              <span className="text-xs text-gray-400">{new Date(conv.last_time).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{conv.blocked ? '🔒 Contenu bloqué (payer pour débloquer)' : conv.last_message}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
