"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AgendaCRMPage() {
  const supabase = createClient();
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRDVs() {
      const { data, error } = await supabase.from("rendezvous").select("*");
      if (!error) {
        setRdvs(data || []);
      }
      setLoading(false);
    }
    fetchRDVs();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2 animate-fadeInUp">📅 Agenda & Rendez-vous</h1>
        <p className="text-lg text-gray-600 animate-fadeInUp">Planning intelligent connecté NovaCore CRM.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-bounce">Chargement...</div>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rdvs.map((rdv) => (
            <div key={rdv.id} className="p-6 rounded-lg shadow-md bg-white hover:shadow-2xl transition transform hover:scale-105 animate-zoomIn">
              <h2 className="text-xl font-semibold">{rdv.service}</h2>
              <p className="text-gray-600">Date : {rdv.date} à {rdv.heure}</p>
              <p className="text-gray-600">Patient/Client : {rdv.nom_patient || rdv.nom_client}</p>
              <p className="text-gray-600">Statut : {rdv.statut}</p>
            </div>
          ))}
        </section>
      )}

      <footer className="mt-16 text-center text-gray-500 text-sm animate-fadeInUp">
        &copy; {new Date().getFullYear()} NovaCore CRM - Tous droits réservés.
      </footer>
    </main>
  );
}
