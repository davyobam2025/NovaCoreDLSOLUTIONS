'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F7FB] flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <div className="flex items-center gap-4">
          <Image
            src="https://res.cloudinary.com/dko5sommz/image/upload/v1745886218/Pink_Circle_Lotus_Yoga_Instructor_Logo_plv7yr.jpg"
            alt="DL Solutions Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold text-gray-800">DL Solutions</h1>
        </div>
        <Link
          href="/sign-in"
          className="bg-[#5C27FE] hover:bg-[#4721c5] text-white font-bold px-5 py-2 rounded-md"
        >
          Connexion
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <motion.h2
          className="text-4xl sm:text-6xl font-extrabold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          La plateforme IA tout-en-un pour l'élite du digital.
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          CRM, IA, RH, Réseau Social Pro, Formations et bien plus. Propulsez votre entreprise avec NovaCore.
        </p>
        <Link
          href="/novacore"
          className="mt-8 bg-[#5C27FE] hover:bg-[#4721c5] text-white font-semibold px-6 py-3 rounded-xl text-lg transition"
        >
          Découvrir NovaCore
        </Link>
      </section>

      {/* Services */}
      <section className="py-16 bg-white px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Nos Solutions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'CRM Intelligent', desc: 'Adapté à chaque métier' },
            { title: 'NovaWorld', desc: 'Réseau social professionnel' },
            { title: 'IA RH & Scoring', desc: 'Triage et présélection automatique des candidats' },
            { title: 'Formations métiers', desc: 'Développez vos compétences clés' },
            { title: 'Génération de devis IA', desc: 'Rapide, interactif et personnalisé' },
            { title: 'Assistant IA Davy', desc: 'Toujours là pour vous guider' },
          ].map((s, i) => (
            <div key={i} className="bg-[#F6F7FB] p-6 rounded-xl shadow hover:shadow-md transition">
              <h4 className="text-xl font-bold mb-2 text-[#5C27FE]">{s.title}</h4>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500 bg-white border-t">
        &copy; {new Date().getFullYear()} DL Solutions — Tous droits réservés.
      </footer>
    </main>
  )
}
