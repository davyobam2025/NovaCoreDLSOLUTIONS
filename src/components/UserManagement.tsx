"use client";

import React, { useState } from 'react';

const initialUsers = [
  { id: 1, name: "Alice", email: "alice@novacore.com", role: "admin", status: "active" },
  { id: 2, name: "Bob", email: "bob@novacore.com", role: "user", status: "blocked" },
  { id: 3, name: "Charlie", email: "charlie@novacore.com", role: "user", status: "active" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlock = (id: number) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: user.status === "active" ? "blocked" : "active" } : user));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-xs mt-1">{user.role} • {user.status}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => toggleBlock(user.id)}
              className={`px-4 py-2 rounded-full text-white ${user.status === "active" ? "bg-red-600" : "bg-green-600"}`}
            >
              {user.status === "active" ? "Bloquer" : "Débloquer"}
            </button>
            <button
              onClick={() => deleteUser(user.id)}
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
