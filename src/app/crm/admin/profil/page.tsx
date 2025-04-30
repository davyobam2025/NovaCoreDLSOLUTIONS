'use client'

import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProfilAdmin() {
  const user = useUser()
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name)
    }
  }, [user])

  if (!user) return <p className="p-6">Chargement...</p>

  const handleUpdateName = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name }
    })

    if (error) {
      setMessage('❌ Erreur mise à jour nom : ' + error.message)
    } else {
      setMessage('✅ Nom mis à jour avec succès.')
    }
  }

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage('❌ Erreur : ' + error.message)
    } else {
      setMessage('✅ Mot de passe mis à jour.')
      setNewPassword('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getInitials = (fullName: string) =>
    fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">👤 Mon Profil Administrateur</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {getInitials(name || user.user_metadata?.name || 'Admin')}
        </div>
        <div>
          <p className="text-lg font-semibold">{name || user.email}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Nom complet</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleUpdateName}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
          >
            Enregistrer
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="******"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordChange}
            className="mt-2 bg-gray-700 text-white px-4 py-1 rounded"
          >
            Modifier mot de passe
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
