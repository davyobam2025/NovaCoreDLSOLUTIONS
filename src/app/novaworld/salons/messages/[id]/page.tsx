'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function PrivateChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState([
    { id: 1, author: 'Hotel Marriot', content: 'Bonjour, nous sommes intéressés par votre offre.', timestamp: 'il y a 2h' },
    { id: 2, author: 'Moi', content: 'Super ! Discutons plus en détail.', timestamp: 'il y a 1h' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim() === '') return

    setMessages([
      ...messages,
      { id: messages.length + 1, author: 'Moi', content: newMessage, timestamp: 'à l’instant' }
    ])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-indigo-600 text-white p-4 shadow-lg">
        <h1 className="text-lg font-bold">Conversation #{id}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg shadow ${
              msg.author === 'Moi' ? 'ml-auto bg-indigo-100' : 'bg-gray-100'
            }`}
          >
            <p className="text-sm text-gray-700 font-semibold">{msg.author}</p>
            <p className="text-gray-800">{msg.content}</p>
            <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
          </div>
        ))}
      </main>

      <footer className="p-4 border-t border-gray-200 flex gap-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
          rows={2}
          className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Envoyer
        </button>
      </footer>
    </div>
  )
}
