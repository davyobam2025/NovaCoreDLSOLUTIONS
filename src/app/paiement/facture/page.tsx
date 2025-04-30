"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function FacturesPage() {
  const supabase = createClient();
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFactures() {
      const { data, error } = await supabase.from("factures").select("*").order("date", { ascending: false });
      if (!error) {
        setFactures(data || []);
      }
      setLoading(false);
    }
    fetchFactures();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold animate-fadeInUp">📄 Factures Clients</h1>
        <p className="text-lg text-gray-600 animate-fadeInUp">Gérez vos facturations clients dans NovaCore CRM.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-bounce">Chargement...</div>
        </div>
      ) : (
        <section className="overflow-x-auto animate-zoomIn">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6">Montant (€)</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Statut</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-6">{facture.nom_client}</td>
                  <td className="py-3 px-6">{facture.montant}</td>
                  <td className="py-3 px-6">{new Date(facture.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6">{facture.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer className="mt-16 text-center text-gray-500 text-sm animate-fadeInUp">
        &copy; {new Date().getFullYear()} NovaCore CRM - Tous droits réservés.
      </footer>
    </main>
  );
}
