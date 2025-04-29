"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function CRMAdminPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "crm_clients"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(data);
    };
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce client ?")) {
      await deleteDoc(doc(db, "crm_clients", id));
      setClients(clients.filter(c => c.id !== id));
    }
  };

  return (
    <main className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">📋 Gestion Clients CRM</h1>

      <div className="grid gap-6">
        {clients.map((client) => (
          <div key={client.id} className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-bold">{client.nom} {client.prenom}</h2>
            <p className="text-gray-600">{client.email}</p>
            <p className="text-gray-600">{client.telephone}</p>
            <button
              onClick={() => handleDelete(client.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
