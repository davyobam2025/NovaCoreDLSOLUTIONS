'use client';

import { motion } from "framer-motion";

export default function AbonnementPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600"
    >
      <h1 className="text-5xl font-bold text-white mb-8">Abonnement Premium</h1>
      <p className="text-lg text-gray-300 mb-8">
        Activez votre accès complet à toutes les fonctionnalités NovaCore.
      </p>
      <button className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition">
        S'abonner Maintenant
      </button>
    </motion.section>
  );
}
