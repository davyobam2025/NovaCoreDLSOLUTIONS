'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function JobDetailPage() {
  const { jobId } = useParams()

  const [candidate, setCandidate] = useState({
    name: '',
    email: '',
    message: '',
    cv: null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Candidature envoyée avec succès ! 🚀')
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto">
      {/* Détail de l'Offre */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Offre #{jobId}</h1>
        <h2 className="text-xl font-semibold mb-2">Titre du Poste</h2>
        <p className="text-gray-700 mb-2">Entreprise : DL Solutions</p>
        <p className="text-gray-700 mb-6">Localisation : Yaoundé, Cameroun</p>
        <p className="text-gray-600">Description détaillée du poste à venir... 📄</p>
      </div>

      {/* Formulaire de Candidature */}
      <div className="bg-gray-50 p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Postuler pour cette offre</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Nom Complet</label>
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={candidate.email}
              onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Votre Message</label>
            <textarea
              value={candidate.message}
              onChange={(e) => setCandidate({ ...candidate, message: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Télécharger votre CV (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCandidate({ ...candidate, cv: e.target.files?.[0] || null })}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-bold"
          >
            Envoyer ma candidature
          </button>
        </form>
      </div>
    </div>
  )
}
