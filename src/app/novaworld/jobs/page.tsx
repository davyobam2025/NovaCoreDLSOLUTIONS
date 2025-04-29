'use client'

import Link from 'next/link'

const jobs = [
  {
    id: 1,
    title: 'Responsable Commercial B2B',
    company: 'DL Solutions',
    location: 'Yaoundé, Cameroun',
    description: 'Nous recherchons un expert commercial orienté SaaS pour développer notre portefeuille clients.'
  },
  {
    id: 2,
    title: 'Manager Réception Hôtel',
    company: 'Hotel Royal Palace',
    location: 'Douala, Cameroun',
    description: 'Manager expérimenté pour gérer l\'accueil et la satisfaction client dans un hôtel 5 étoiles.'
  },
  {
    id: 3,
    title: 'Community Manager Freelance',
    company: 'Agence Connect',
    location: 'Remote',
    description: 'Création de contenu réseaux sociaux et animation de communautés pour des marques africaines.'
  }
]

export default function JobBoardPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-10">Offres d'emploi NovaWorld</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <p className="text-gray-500">{job.description}</p>
            <Link
              href={`/novaworld/jobs/${job.id}`}
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Postuler
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
