'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // délai de 1.5 sec pour laisser Navbar charger

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: serverTimestamp(),
      });
      toast.success("Merci pour votre inscription !");
      setEmail('');
      closePopup();
    } catch (error) {
      console.error("Erreur d'inscription newsletter:", error);
      toast.error("Erreur, veuillez réessayer.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl z-50 w-[90%] max-w-md text-center">
      <button
        onClick={closePopup}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Fermer"
      >
        ❌
      </button>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          📩 Rejoignez la Révolution NovaCore
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Recevez nos actualités exclusives et avant-premières IA 🚀
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition"
          >
            M'inscrire
          </button>
        </form>
      </motion.div>
    </div>
  );
}
