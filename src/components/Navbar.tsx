'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()

  let logo = {
    src: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745886218/Pink_Circle_Lotus_Yoga_Instructor_Logo_plv7yr.jpg',
    alt: 'DL Solutions',
    bg: 'bg-white',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Connexion', href: '/sign-in' },
    ]
  }

  if (pathname.startsWith('/novacore')) {
    logo = {
      src: 'https://res.cloudinary.com/dko5sommz/image/upload/v1744370550/logo-novacore_iqi2pd.png',
      alt: 'NovaCore',
      bg: 'bg-[#5C27FE]',
      links: [
        { label: 'Dashboard', href: '/novacore' },
        { label: 'CRM', href: '/novacore/crm' },
        { label: 'IA', href: '/novacore/ia' },
        { label: 'NovaWorld', href: '/novaworld' },
      ]
    }
  }

  if (pathname.startsWith('/novaworld')) {
    logo = {
      src: 'https://res.cloudinary.com/dko5sommz/image/upload/v1745950544/novaworld-logo-generated_gqmjwf.png',
      alt: 'NovaWorld',
      bg: 'bg-[#F6F7FB]',
      links: [
        { label: 'Fil d’actu', href: '/novaworld' },
        { label: 'Salons', href: '/novaworld/salons' },
        { label: 'Messages', href: '/novaworld/messages' },
        { label: 'Mon Profil', href: '/profile' },
      ]
    }
  }

  return (
    <nav className={`${logo.bg} shadow-md px-6 py-4 flex justify-between items-center`}>
      <div className="flex items-center gap-4">
        <Image src={logo.src} alt={logo.alt} width={40} height={40} className="rounded-full" />
        <h1 className="text-lg font-bold text-gray-800">{logo.alt}</h1>
      </div>
      <div className="flex items-center gap-6 text-sm">
        {logo.links.map((link, i) => (
          <Link key={i} href={link.href} className="text-gray-700 hover:underline">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
