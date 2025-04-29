'use client';

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

export const metadata = {
  title: "Dashboard Admin - NovaCore",
  description: "Administration et gestion avancée NovaCore",
  keywords: "Admin, Dashboard, CRM, NovaCore",
  openGraph: {
    title: "Admin Panel NovaCore",
    description: "Gérez votre plateforme NovaCore avec puissance.",
    url: "https://tonsite.com/admin/dashboard",
    type: "website",
  },
};

export default function AdminDashboard() {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.publicMetadata?.role || "user";

  if (!userId || role !== "admin") {
    redirect("/"); // 🔥 Blocage : seuls Admins passent
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-10">
          🔥 Admin Dashboard - NovaCore
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat Box 1 */}
          <div className="p-8 bg-white rounded-xl shadow-2xl hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-primary mb-4">Utilisateurs</h2>
            <p className="text-gray-600 text-lg">128 utilisateurs enregistrés</p>
          </div>

          {/* Stat Box 2 */}
          <div className="p-8 bg-white rounded-xl shadow-2xl hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-primary mb-4">Opportunités CRM</h2>
            <p className="text-gray-600 text-lg">34 opportunités ouvertes</p>
          </div>

          {/* Stat Box 3 */}
          <div className="p-8 bg-white rounded-xl shadow-2xl hover:scale-105 transition">
            <h2 className="text-2xl font-bold text-primary mb-4">Tâches en cours</h2>
            <p className="text-gray-600 text-lg">12 tâches assignées</p>
          </div>
        </div>

        {/* Zone Alertes Admin */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">🚨 Alertes importantes</h2>
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
            Maintenance prévue le 5 Mai 2025 de 02:00 à 05:00 (GMT).
          </div>
        </div>
      </div>
    </motion.div>
  );
}
