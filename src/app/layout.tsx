'use client';

import Navbar from '@/components/Navbar';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className="bg-black text-white">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
