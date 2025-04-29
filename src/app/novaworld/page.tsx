'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Post {
  id: string
  auteur: string
  contenu: string
  hashtags: string[]
  created_at: string
}

export default function NovaWorldFeed() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setPosts(data)
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-gray-800">
      <div className="flex justify-between max-w-7xl mx-auto px-6 pt-8">

        {/* Sidebar gauche */}
        <aside className="w-1/4 hidden lg:block space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <Image
              src="https://res.cloudinary.com/dko5sommz/image/upload/v1745950544/novaworld-logo-generated_gqmjwf.png"
              alt="NovaWorld logo"
              width={50}
              height={50}
              className="mb-2 rounded-full"
            />
            <h2 className="font-bold text-lg">NovaWorld</h2>
            <p className="text-sm text-gray-500">Réseau pro DL Solutions</p>
          </div>
          <nav className="bg-white p-4 rounded-xl shadow space-y-2 text-sm">
            <Link href="/novaworld/salons" className="block hover:underline text-[#5C27FE]">🗨️ Salons publics</Link>
            <Link href="/novaworld/messages" className="block hover:underline">📩 Messagerie</Link>
            <Link href="/novaworld/publier" className="block hover:underline">✍️ Publier</Link>
          </nav>
        </aside>

        {/* Fil d’actualité */}
        <main className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-2xl font-bold text-[#5C27FE] mb-4">Fil d’actualité NovaWorld</h1>
          {posts.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Aucun post pour l’instant...</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
                <p className="font-semibold">{post.auteur}</p>
                <p className="mt-2">{post.contenu}</p>
                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                  <span>{post.hashtags.join(' ')}</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </main>

        {/* Suggestions */}
        <aside className="w-1/4 hidden lg:block space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold text-sm mb-2">🔥 Suggestions</h3>
            <ul className="text-sm space-y-2 text-[#5C27FE]">
              <li><Link href="#">💎 Passer à Premium</Link></li>
              <li><Link href="#">🏨 Hotel Prestige</Link></li>
              <li><Link href="#">📢 Recruter un CM</Link></li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  )
}
