'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PublierPostPage() {
  const [auteur, setAuteur] = useState('')
  const [contenu, setContenu] = useState('')
  const [hashtags, setHashtags] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auteur || !contenu) return alert('Auteur et contenu requis.')

    const { error } = await supabase.from('posts').insert([
      {
        auteur,
        contenu,
        hashtags: hashtags
          .split(' ')
          .map((tag) => tag.trim())
          .filter((t) => t),
      },
    ])

    if (error) return alert('Erreur : ' + error.message)
    router.push('/novaworld')
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-4 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">✍️ Publier sur NovaWorld</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l’auteur</label>
          <input
            type="text"
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="Entreprise, profil..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu du post</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            rows={4}
            placeholder="Votre annonce, actualité, message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags (séparés par espace)</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="#crm #recrutement"
          />
        </div>

        <button
          type="submit"
          className="bg-[#5C27FE] hover:bg-[#4721c5] text-white font-bold px-6 py-3 rounded-md"
        >
          Publier
        </button>
      </form>
    </div>
  )
}
