'use client';

import { motion } from 'framer-motion';
import Image from "next/image";

export const metadata = {
  title: "Notre Équipe | DL Solutions",
  description: "Rencontrez notre équipe de passionnés, experts en CRM, ERP, IA et Digitalisation chez DL Solutions.",
};

export default function EquipePage() {
  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-700 via-purple-700 to-pink-700 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-2xl max-w-4xl w-full text-center space-y-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Image
            src="https://res.cloudinary.com/dko5sommz/image/upload/v1745726808/Design_sans_titre_x3pcna.png"
            alt="Photo Samuel OBAM"
            width={200}
            height={200}
            className="mx-auto rounded-full border-4 border-indigo-500 shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-indigo-700">Samuel OBAM</h1>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Associé Gérant | Expert CX & Formateur Télé-opération | Programmeur
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Fort de 9 ans d'expérience en gestion, optimisation et cartographie de l'expérience client (CX),
            je suis également programmeur passionné basé à Yaoundé.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Président du <span className="font-bold text-indigo-600">Global Tech Ambassador</span>, une initiative nationale
            promouvant le développement du Cameroun via la transformation digitale et l'intelligence artificielle, regroupant plus de 100 professionnels IT.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
