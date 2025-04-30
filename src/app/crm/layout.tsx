'use client'

import AdminHeader from '@/components/AdminHeader'
import { ReactNode } from 'react'

export default function CRMAdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <title>CRM Hôtel Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100 text-gray-800 min-h-screen">
        <AdminHeader />
        <main className="pt-4 px-4 md:px-8">{children}</main>
      </body>
    </html>
  )
}
