'use client';

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import TrackingUser from "./TrackingUser"; // 👈 Tracking Ajouté

export const metadata = {
  title: "Mon Compte - NovaCore",
  description: "Gérez votre profil, votre abonnement et vos informations de facturation NovaCore.",
};

export default function AccountPage() {
  const { user } = useUser();

  return (
    <>
      {/* 👾 Tracking utilisateur activé */}
      <TrackingUser />

      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-700 via-purple-700 to-pink-700 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-2xl max-w-2xl w-full text-center">
          <h1 className="text-4xl font-extrabold text-primary mb-8">👤 Mon Profil</h1>

          {user ? (
            <div className="space-y-6">
              <div>
                <img
                  src={user.imageUrl}
                  alt="Avatar"
                  className="mx-auto w-24 h-24 rounded-full border-4 border-indigo-500"
                />
                <h2 className="text-2xl font-bold mt-4">{user.username || user.firstName}</h2>
                <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                <p className="text-sm mt-2">
                  {user.publicMetadata?.isPremium ? (
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
                      ✅ Abonnement Premium Actif
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white px-3 py-1 rounded-full font-semibold">
                      Compte Standard
                    </span>
                  )}
                </p>
              </div>

              {/* 🎯 Facture PDF visible si disponible */}
              {user.publicMetadata?.lastInvoiceUrl && (
                <div className="mt-6">
                  <a
                    href={user.publicMetadata.lastInvoiceUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-bold underline inline-block"
                  >
                    📄 Télécharger votre dernière facture
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Chargement des informations...</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
