'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@supabase/auth-helpers-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function AdminAlertBadge() {
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    const fetchAlertes = async () => {
      const { data } = await supabase
        .from('alerts_admin')
        .select('id')
        .eq('vue', false)

      setAlertCount(data?.length || 0)
    }

    fetchAlertes()
    const interval = setInterval(fetchAlertes, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/crm/admin/alertes" className="relative inline-block">
      <span className="text-sm text-gray-700">🛡️ Alertes</span>
      {alertCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
          {alertCount}
        </span>
      )}
    </Link>
  )
}

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useUser()

  const links = [
    { href: '/crm/hotel/dashboard', label: '📊 Dashboard' },
    { href: '/crm/admin/alertes', label: '🛡️ Alertes' },
    { href: '/crm/admin/utilisateurs', label: '👥 Utilisateurs' },
    { href: '/crm/admin/historique', label: '🧾 Historique' }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // ou autre page publique
  }

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : 'A'

  return (
    <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link href="/crm/hotel/dashboard" className="text-xl font-bold text-pink-700">
        🏨 CRM Hôtel Admin
      </Link>

      <nav className="flex items-center gap-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm ${
              pathname === l.href ? 'text-pink-600 font-semibold' : 'text-gray-700'
            } hover:underline`}
          >
            {l.label}
          </Link>
        ))}

        <AdminAlertBadge />

        {user && (
          <div className="relative group ml-4">
            <div className="w-9 h-9 bg-pink-600 text-white rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold">
              {initials}
            </div>
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border shadow rounded-md p-2 z-50">
              <p className="text-xs text-gray-500 px-2">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 w-full text-left text-sm text-red-600 hover:underline px-2"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
