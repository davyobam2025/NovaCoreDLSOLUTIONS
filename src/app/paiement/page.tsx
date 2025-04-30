import React from "react";

export default function PaiementsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4 md:px-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Solutions de Paiement</h1>
        <p className="text-lg text-gray-600">Payez en toute sécurité et rapidement avec NovaCore.</p>
      </section>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Carte Bancaire</h2>
          <p className="text-gray-600 mb-4">Visa, Mastercard, American Express</p>
          <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Payer</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Mobile Money</h2>
          <p className="text-gray-600 mb-4">Orange Money, Moov, MTN</p>
          <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Payer</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">PayPal</h2>
          <p className="text-gray-600 mb-4">Simple et rapide avec PayPal</p>
          <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Payer</button>
        </div>
      </div>
    </main>
  );
}
