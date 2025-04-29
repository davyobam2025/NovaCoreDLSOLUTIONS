"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { role });
    setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
    toast.success("Rôle mis à jour !");
  };

  const filteredUsers = users.filter(
    (u) => u.email.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">👥 Gestion Utilisateurs Firebase</h1>

      <input
        type="text"
        placeholder="🔍 Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded-md w-full max-w-md"
      />

      <div className="grid gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">{u.username}</h2>
              <p className="text-gray-600">{u.email}</p>
              <p className="text-sm text-indigo-600">{u.role}</p>
            </div>
            <select
              value={u.role}
              onChange={(e) => updateRole(u.id, e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </main>
  );
}
