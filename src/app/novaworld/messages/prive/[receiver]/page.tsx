'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MessagePrivePage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [allowed, setAllowed] = useState(false)
  const params = useParams()
  const receiver = params.receiver as string

  useEffect(() => {
    const checkAbonnement = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email
      if (!email) return

      const { data } = await supabase
        .from('abonnements_prives')
        .select('*')
        .eq('user_email', email)
        .eq('statut', 'actif')
        .maybeSingle()

      if (data) {
        setAllowed(true)
      } else {
        setResult('❌ Vous devez souscrire à la messagerie privée pour utiliser cette fonctionnalité.')
      }
    }

    checkAbonnement()
  }, [])

  const envoyer = async () => {
    if (!text) return

    const moderation = await fetch('/api/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })

    const json = await moderation.json()
    if (!json.allowed) {
      setResult('❌ Message bloqué par IA.')
      return
    }

    const session = await supabase.auth.getSession()
    const sender = session.data.session?.user.email

    if (!sender) {
      setResult('Erreur : utilisateur non connecté.')
      return
    }

    await supabase.from('messages_prives').insert([
      {
        sender,
        receiver,
        contenu: text,
        statut: 'envoyé',
        is_flagged: false,
      }
    ])

    setResult('✅ Message envoyé avec succès.')
    setText('')
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-xl font-bold text-blue-600 mb-4">🔒 Messagerie privée NovaWorld</h1>

      {!allowed ? (
        <p className="text-red-600 text-sm mb-4">{result}</p>
      ) : (
        <>
          <textarea
            className="w-full min-h-[120px] border border-gray-300 p-4 rounded-md mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez votre message ici..."
          />

          <button
            onClick={envoyer}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Envoyer
          </button>

          {result && <p className="mt-4 text-sm">{result}</p>}
        </>
      )}
    </div>
  )
}
