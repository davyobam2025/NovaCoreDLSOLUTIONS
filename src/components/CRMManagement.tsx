"use client";

import React, { useState } from 'react';

const initialOpportunities = [
  { id: 1, title: "Vente CRM 50K€", status: "En cours" },
  { id: 2, title: "Projet ERP 120K€", status: "Terminé" },
  { id: 3, title: "Consulting IA 30K€", status: "En attente" },
];

export default function CRMManagement() {
  const [opportunities, setOpportunities] = useState(initialOpportunities);

  const updateStatus = (id: number, newStatus: string) => {
    setOpportunities(opportunities.map(opp => opp.id === id ? { ...opp, status: newStatus } : opp));
  };

  const deleteOpportunity = (id: number) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  return (
    <div className="space-y-4">
      {opportunities.map(opp => (
        <div key={opp.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{opp.title}</p>
            <p className="text-gray-500 text-sm">{opp.status}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => updateStatus(opp.id, "Terminé")}
              className="px-4 py-2 bg-green-600 text-white rounded-full"
            >
              Marquer Terminé
            </button>
            <button
              onClick={() => deleteOpportunity(opp.id)}
              className="px-4 py-2 bg-gray-800 text-white rounded-full"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
