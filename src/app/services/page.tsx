'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FaChartLine, FaGraduationCap, FaRobot, FaLaptopCode, FaHandshake, FaGlobe, FaRegCalendarAlt, FaMobileAlt, FaLightbulb, FaRocket, FaUserTie } from 'react-icons/fa';
import Link from 'next/link';

const services = [
  { title: "Optimisation CX", description: "Diagnostic, parcours client, réclamations, fidélisation.", icon: <FaChartLine size={40} /> },
  { title: "Formations CRM & Vente", description: "Service client premium, CRM ultra-intuitif, télé-opération.", icon: <FaGraduationCap size={40} /> },
  { title: "Création CRM Web/App", description: "Développement CRM/Portails clients modernes sur mesure.", icon: <FaLaptopCode size={40} /> },
  { title: "Automatisation IA NovaCore", description: "IA pour ventes, support, data science, scoring prédictif.", icon: <FaRobot size={40} /> },
  { title: "Coaching KPIs & Stratégie", description: "KPIs, dashboard pilotage, stratégie commerciale gagnante.", icon: <FaHandshake size={40} /> },
  { title: "Communication Digitale", description: "Pack visuels réseaux, SEO social, branding QR Code IA.", icon: <FaGlobe size={40} /> },
  { title: "Calendrier Editorial IA", description: "Contenus mensuels automatisés premium pour vos réseaux.", icon: <FaRegCalendarAlt size={40} /> },
  { title: "Content & Publication Auto", description: "Création de posts IA + auto-publieur multi-plateforme.", icon: <FaRocket size={40} /> },
  { title: "Audit Digital & SEO", description: "Audit complet SEO, réseaux, réputation digitale pro.", icon: <FaLightbulb size={40} /> },
  { title: "Déploiement CRM NovaCore", description: "CRM métier, KPI, automatisations stratégiques sur mesure.", icon: <FaUserTie size={40} /> },
  { title: "Accompagnement Premium 3 Mois", description: "Coaching CX, CRM, digitalisation, IA personnalisé.", icon: <FaMobileAlt size={40} /> },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 pt-24">
      <section className="text-center mb-12 px-6">
        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl font-bold text-white mb-6">
          🚀 Nos Services NovaCore
        </motion.h1>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg">
          Votre succès digital commence ici.
        </p>
      </section>

      <section ref={containerRef} className="flex overflow-x-auto gap-6 px-6 pb-12 snap-x snap-mandatory">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="min-w-[280px] bg-white/10 backdrop-blur-lg text-white rounded-xl p-6 shadow-lg flex-shrink-0 snap-center text-center transition-all"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-300 text-sm">{service.description}</p>
          </motion.div>
        ))}
      </section>

      <motion.div
        className="text-center py-10 bg-indigo-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">Un projet ambitieux ?</h2>
        <Link href="/contact" className="inline-block px-6 py-3 mt-4 bg-white text-indigo-700 rounded-full font-bold hover:scale-110 transition">
          Parlez-nous de votre projet
        </Link>
      </motion.div>
    </main>
  );
}
