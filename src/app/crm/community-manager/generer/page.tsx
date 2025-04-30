'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GenerateurIA() {
  const [prompt, setPrompt] = useState('')
  const [resultat, setResultat] = useState('')
  const [loading, setLoading] = useState(false)

  const genererPost = async () => {
    if (!prompt) return
    setLoading(true)

    const response = await fetch('/api/openai/post-generator', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })

    const json = await response.json()
    setResultat(json.result)
    setLoading(false)
  }

  const sauvegarder = async () => {
    const titre = prompt.slice(0, 50)
    const reseau = prompt.includes('LinkedIn') ? 'LinkedIn' : 'Général'

    await supabase.from('cm_posts').insert([
      { titre, reseau, date_post: new Date(), statut: 'brouillon' }
    ])
    alert('💾 Brouillon enregistré.')
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-4">🧠 Générateur IA de publications</h1>

      <textarea
        className="w-full border border-gray-300 rounded-md p-4 mb-4 min-h-[100px]"
        placeholder="Décrivez votre idée de post (ex: annonce d’un événement sur Instagram)..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={genererPost}
          disabled={loading}
          className="bg-[#5C27FE] text-white px-6 py-2 rounded hover:bg-[#4721c5]"
        >
          {loading ? 'Génération...' : 'Générer le post'}
        </button>

        {resultat && (
          <button
            onClick={sauvegarder}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Enregistrer en brouillon
          </button>
        )}
      </div>

      {resultat && (
        <div className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">
          <strong className="text-[#5C27FE]">💬 Suggestion IA :</strong><br />
          {resultat}
        </div>
      )}
    </div>
  )
}
