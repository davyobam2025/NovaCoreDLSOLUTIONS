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
  auteur: string
  created_at: string
}

export default function SalonPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [salonNom, setSalonNom] = useState('')
  const [contenu, setContenu] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: salon } = await supabase.from('salons').select('nom').eq('id', id).single()
      setSalonNom(salon?.nom || '')

      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('salon_id', id)
        .order('created_at', { ascending: true })

      setMessages(messages || [])

      const { data: auth } = await supabase.auth.getUser()
      setUserName(auth?.user?.user_metadata?.name || 'Anonyme')
    }

    fetchData()
  }, [id])

  const envoyer = async () => {
    if (!contenu.trim()) return

    const { data, error } = await supabase.from('messages').insert([{
      salon_id: id,
      auteur: userName,
      contenu
    }]).select().single()

    if (!error && data) {
      setMessages([...messages, data])
      setContenu('')
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Salon : {salonNom}</h1>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-xl border">
        {messages.map((m) => (
          <div key={m.id} className="p-3 bg-white rounded shadow-sm">
            <p className="font-semibold text-indigo-600 text-sm">{m.auteur}</p>
            <p>{m.contenu}</p>
            <p className="text-xs text-gray-400 text-right">{new Date(m.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <input
          type="text"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 border p-3 rounded-md"
        />
        <button
          onClick={envoyer}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-bold"
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}
