import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default function CRMPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in"); // Redirige vers page connexion Clerk
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4 md:px-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Gestion CRM Ultra-Performante</h1>
        <p className="text-lg text-gray-600">Pilotez votre clientèle, vos opportunités et votre business.</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Clients</h2>
          <p className="text-gray-600">Gérez vos clients facilement avec toutes leurs données en un clic.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Prospects</h2>
          <p className="text-gray-600">Convertissez vos leads en clients rapidement.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Suivi Commercial</h2>
          <p className="text-gray-600">Suivez vos ventes, contrats, paiements et relances.</p>
        </div>
      </div>
    </main>
  );
}
