'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CHAMBRES = ['Standard', 'Double', 'Suite', 'Luxe']

export default function ReservationForm() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    chambre_type: 'Standard',
    date_arrivee: '',
    date_depart: '',
    adultes: 1,
    enfants: 0,
    commentaire: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const verifierDisponibilite = async () => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .eq('chambre_type', form.chambre_type)
      .lt('date_arrivee', form.date_depart)
      .gt('date_depart', form.date_arrivee)

    return (data || []).length < 5 // exemple : max 5 chambres par type
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const dispo = await verifierDisponibilite()

    if (!dispo) {
      setMessage('❌ Plus de chambres disponibles sur cette période.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reservations').insert({
      client_prenom: form.prenom,
      client_nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      chambre_type: form.chambre_type,
      date_arrivee: form.date_arrivee,
      date_depart: form.date_depart,
      adultes: Number(form.adultes),
      enfants: Number(form.enfants),
      commentaire: form.commentaire
    })

    if (error) {
      setMessage("❌ Erreur lors de l'enregistrement.")
    } else {
      setMessage('✅ Réservation enregistrée avec succès !')
      setForm({ ...form, prenom: '', nom: '', email: '', telephone: '', commentaire: '' })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">📝 Réservation hôtel</h2>

      <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} required className="w-full border p-2 rounded" />

      <select name="chambre_type" value={form.chambre_type} onChange={handleChange} className="w-full border p-2 rounded">
        {CHAMBRES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <input type="date" name="date_arrivee" value={form.date_arrivee} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="date" name="date_depart" value={form.date_depart} onChange={handleChange} required className="border p-2 rounded w-full" />
      </div>

      <div className="flex gap-2">
        <input type="number" name="adultes" value={form.adultes} onChange={handleChange} min={1} required className="border p-2 rounded w-full" placeholder="Adultes" />
        <input type="number" name="enfants" value={form.enfants} onChange={handleChange} min={0} className="border p-2 rounded w-full" placeholder="Enfants" />
      </div>

      <textarea name="commentaire" value={form.commentaire} onChange={handleChange} placeholder="Commentaire (optionnel)" className="w-full border p-2 rounded" />

      <button type="submit" disabled={loading} className="bg-pink-600 text-white px-4 py-2 rounded">
        {loading ? 'Réservation en cours...' : 'Réserver'}
      </button>

      {message && <p className="text-sm pt-2">{message}</p>}
    </form>
  )
}
