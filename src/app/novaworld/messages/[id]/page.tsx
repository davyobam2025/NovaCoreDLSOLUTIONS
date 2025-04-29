'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: string
  contenu: string
  auteur_id: string
  created_at: string
  flagged_by_ia: boolean
}

export default function ConversationPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [blocked, setBlocked] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) return

      setUserId(user.id)

      const { data: conv } = await supabase
        .from('conversations')
        .select('blocked')
        .eq('id', id)
        .single()

      if (conv) setBlocked(conv.blocked)

      const { data: msgs } = await supabase
        .from('messages_prives')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

      setMessages(msgs as Message[])
    }

    fetchData()
  }, [id])

  const checkIA = (text: string) => {
    const forbidden = /(email|@|tel|whatsapp|numéro|contact|téléphone|+237|https?:\/\/)/gi
    return forbidden.test(text.toLowerCase())
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const isFlagged = checkIA(newMessage)

    const { error, data } = await supabase.from('messages_prives').insert([{
      conversation_id: id,
      auteur_id: userId,
      contenu: newMessage,
      flagged_by_ia: isFlagged
    }])

    if (!error && data) {
      setMessages([...messages, data[0]])
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-indigo-700">Discussion Privée</h1>

      <div className="bg-gray-50 border rounded-xl p-4 h-[60vh] overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="p-3 rounded-md bg-white border border-gray-100">
            <p className="text-sm text-gray-800">{msg.contenu}</p>
            {msg.flagged_by_ia && (
              <p className="text-xs text-red-500 mt-1">⚠️ Ce message contient une information bloquée par IA.</p>
            )}
            <p className="text-xs text-gray-400 text-right">{new Date(msg.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {blocked ? (
        <div className="text-center bg-yellow-50 p-4 border rounded-lg text-sm text-yellow-800">
          🔒 Cette conversation est bloquée.  
          <br />Payez l’accès Premium pour débloquer les échanges de contacts et informations sensibles.
          <br /><br />
          <a href="/novaworld/abonnement" className="text-indigo-600 font-bold underline">Débloquer avec NovaPro →</a>
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 border border-gray-300 rounded-md p-3"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700"
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  )
}
