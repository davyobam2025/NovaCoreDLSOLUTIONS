'use client'

import { useEffect, useState } from 'react'

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchUsers = async () => {
    const res = await fetch('/api/users/update-role')
    const data = await res.json()
    setUsers(data)
  }

  const updateRole = async (id: string, role: string) => {
    setLoading(true)
    const res = await fetch('/api/users/update-role', {
      method: 'POST',
      body: JSON.stringify({ id, role })
    })
    const result = await res.json()
    if (res.ok) {
      setMessage(`✅ Rôle mis à jour pour ${id}`)
      fetchUsers()
    } else {
      setMessage(`❌ Erreur : ${result.error}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">👥 Gestion des utilisateurs</h1>

      {message && <p className="mb-4">{message}</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Email</th>
            <th className="p-2">Rôle actuel</th>
            <th className="p-2">Modifier</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.user_metadata?.role || 'non défini'}</td>
              <td className="p-2">
                <select
                  defaultValue={u.user_metadata?.role || ''}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  disabled={loading}
                  className="border p-1 rounded"
                >
                  <option value="admin">admin</option>
                  <option value="staff">staff</option>
                  <option value="">aucun</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
