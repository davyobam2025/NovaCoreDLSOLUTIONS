'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nos Réalisations | DL Solutions NovaCore",
  description: "Découvrez nos réalisations exclusives NovaCore : CRM, ERP, IA, Digitalisation.",
  openGraph: {
    title: "Réalisations Premium NovaCore",
    description: "Les meilleures réalisations DL Solutions propulsées par NovaCore.",
    url: "https://tonsite.com/projects",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dko5sommz/image/upload/v1743945170/p_gqhepl.png",
        width: 1200,
        height: 630,
        alt: "NovaCore - DL Solutions Projets",
      },
    ],
  },
};

const videos = [
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725502/v09044g40000cuv13nfog65iu678r05g_m3wife.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725416/v09044g40000cvbhh1fog65mg3c2elp0_gr06yh.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725411/v09044g40000cvffb47og65slfddol40_hpit8y.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725403/v09044g40000cutjranog65nbngb8uig_sbhw3q.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725401/v09044g40000cuub0d7og65j6kvqvbl0_kcmmqh.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725396/v09044g40000cv33g0fog65ukueqn5ag_k5fich.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725398/v09044g40000cuv13nfog65iu678r05g_ji1suo.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725388/v09044g40000cvi1phnog65rtaq403rg_ir6wil.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725376/v09044g40000cvkpsj7og65kfl47jqfg_hzhmxq.mp4",
  "https://res.cloudinary.com/dko5sommz/video/upload/v1745725385/v09044g40000cv07u0nog65naddro8vg_yelt76.mp4",
];

export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 6000); // Changement toutes les 6s
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6 space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-10"
      >
        <Image
          src="https://res.cloudinary.com/dko5sommz/image/upload/v1743945170/p_gqhepl.png"
          alt="Logo The Famous Beauty Spa Gym"
          width={200}
          height={200}
          className="rounded-full object-contain border-4 border-white shadow-2xl"
          priority
        />
      </motion.div>

      {/* Présentation */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <h1 className="text-4xl font-bold">The Famous Beauty Spa Gym</h1>
        <p className="text-gray-400 text-lg">
          Excellence client, branding immersif, vidéos premium signées DL Solutions NovaCore.
        </p>
      </motion.div>

      {/* Slideshow Vidéo */}
      <motion.div
        className="w-full max-w-5xl overflow-hidden rounded-xl shadow-xl bg-gray-900 p-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <video
          key={videos[currentIndex]}
          src={videos[currentIndex]}
          controls
          muted
          loop
          autoPlay
          playsInline
          className="w-full h-[480px] object-cover rounded-xl"
        />
      </motion.div>

      {/* CTA - Call To Action Contact */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Link href="/contact">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition">
            📩 Contactez-nous pour votre projet
          </button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
