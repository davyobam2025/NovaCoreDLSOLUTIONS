"use client";

import { Menu } from '@headlessui/react';
import { useUser, SignOutButton } from "@clerk/nextjs";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from "next/link";

export default function RoleBasedMenu() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || "user";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative inline-flex items-center justify-center gap-2 rounded-full border-2 border-indigo-600 p-1 hover:bg-indigo-50">
        <div className="relative">
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full ${role === "admin" ? "bg-red-600" : "bg-green-600"} text-white`}>
            {role === "admin" ? "Admin" : "User"}
          </span>
        </div>
        <ChevronDownIcon className="w-5 h-5 text-indigo-600" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="p-2">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account"
                className={`block px-4 py-2 rounded-md ${active ? "bg-indigo-100" : ""}`}
              >
                Mon Profil
              </Link>
            )}
          </Menu.Item>

          {role === "admin" && (
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/admin/dashboard"
                  className={`block px-4 py-2 rounded-md ${active ? "bg-indigo-100" : ""}`}
                >
                  Admin Dashboard
                </Link>
              )}
            </Menu.Item>
          )}

          <Menu.Item>
            {({ active }) => (
              <SignOutButton>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md ${active ? "bg-red-100 text-red-600" : ""}`}
                >
                  Déconnexion
                </button>
              </SignOutButton>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
