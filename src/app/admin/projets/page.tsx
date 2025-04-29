'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  logo: string;
  videos: string[];
}

export default function AdminProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: '', description: '', logo: '', videos: '' });
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || user.publicMetadata?.role !== 'admin') {
      toast.error("Accès interdit 🔒");
      router.push('/');
    } else {
      fetchProjects();
    }
  }, [user, isLoaded]);

  async function fetchProjects() {
    const querySnapshot = await getDocs(collection(db, 'projets'));
    const projetsData: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      projetsData.push({ id: docSnap.id, ...docSnap.data() } as Project);
    });
    setProjects(projetsData);
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.logo || !form.videos) {
      toast.error("Tous les champs sont obligatoires.");
      return;
    }
    try {
      await addDoc(collection(db, 'projets'), {
        title: form.title,
        description: form.description,
        logo: form.logo,
        videos: form.videos.split(',').map((url) => url.trim()),
        createdAt: new Date(),
      });
      toast.success("Projet ajouté ✅");
      setForm({ title: '', description: '', logo: '', videos: '' });
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Erreur ajout projet ❌");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await deleteDoc(doc(db, 'projets', id));
      toast.success("Projet supprimé 🗑️");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Erreur suppression ❌");
    }
  };

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        ⛔ Accès non autorisé
      </div>
    );
  }

  return (
    <motion.section
      className="min-h-screen bg-black text-white p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl font-bold mb-10 text-center">🔧 Admin Gestion Projets</h1>

      {/* Formulaire Ajout */}
      <form onSubmit={handleAddProject} className="bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6 mb-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau projet</h2>

        <input
          type="text"
          placeholder="Titre du projet"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-4 rounded-md bg-gray-800 text-white"
          required
        />
        <textarea
          placeholder="Description du projet"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-4 rounded-md bg-gray-800 text-white"
          required
        />
        <input
          type="url"
          placeholder="URL du logo (Cloudinary)"
          value={form.logo}
          onChange={(e) => setForm({ ...form, logo: e.target.value })}
          className="w-full p-4 rounded-md bg-gray-800 text-white"
          required
        />
        <textarea
          placeholder="URLs vidéos (séparées par virgule)"
          value={form.videos}
          onChange={(e) => setForm({ ...form, videos: e.target.value })}
          className="w-full p-4 rounded-md bg-gray-800 text-white"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          Ajouter Projet
        </button>
      </form>

      {/* Liste Projets */}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-gray-900 p-6 rounded-xl shadow-md space-y-4">
            <img src={proj.logo} alt={proj.title} className="w-full h-40 object-contain mb-4 bg-white rounded-xl" />
            <h2 className="text-2xl font-bold">{proj.title}</h2>
            <p className="text-gray-400">{proj.description}</p>
            <button
              onClick={() => handleDeleteProject(proj.id)}
              className="mt-4 bg-red-600 hover:bg-red-700 py-2 px-6 rounded-full font-bold transition"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
