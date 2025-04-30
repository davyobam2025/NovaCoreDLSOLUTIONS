'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ChambreForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ numero: '', type: 'Standard', vue: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.from('chambres').insert({
      numero: Number(form.numero),
      type: form.type,
      vue: form.vue
    })

    if (error) {
      setMessage("❌ Erreur à l'enregistrement")
    } else {
      setMessage('✅ Chambre ajoutée')
      setForm({ numero: '', type: 'Standard', vue: '' })
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <h2 className="text-lg font-semibold">➕ Ajouter une chambre</h2>

      <input
        name="numero"
        placeholder="Numéro"
        value={form.numero}
        onChange={handleChange}
        required
        type="number"
        className="w-full border p-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option>Standard</option>
        <option>Double</option>
        <option>Suite</option>
        <option>Luxe</option>
      </select>

      <input
        name="vue"
        placeholder="Vue (optionnel)"
        value={form.vue}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
        Ajouter
      </button>

      {message && <p className="text-sm pt-1">{message}</p>}
    </form>
  )
}
