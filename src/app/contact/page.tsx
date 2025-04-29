'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const metadata = {
  title: "Contact | DL Solutions",
  description: "Prenez contact avec DL Solutions pour propulser votre entreprise avec NovaCore CRM ERP IA.",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Merci de remplir tous les champs !");
      return;
    }
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });
      toast.success('Message envoyé avec succès ✅');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      toast.error('Erreur lors de l\'envoi du message ❌');
    }
  };

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center p-10 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-2xl w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8">Nous Contacter</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
            required
          />
          <textarea
            name="message"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </motion.section>
  );
}
