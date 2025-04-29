'use client'

import HeaderNovaCore from '@/components/HeaderNovaCore'
import HeroNovaCore from '@/components/HeroNovaCore'
import ModulesNovaCore from '@/components/ModulesNovaCore'
import FooterNovaCore from '@/components/FooterNovaCore'
import ChatbotDavy from '@/components/ChatbotDavy'
import { useEffect, useState } from 'react'

export default function NovaCorePage() {
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAssistant(true)
    }, 1500) // délai léger avant affichage

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col relative">
      {/* Header NovaCore */}
      <HeaderNovaCore />

      {/* Contenu principal */}
      <main className="flex-1">
        <HeroNovaCore />
        <ModulesNovaCore />
      </main>

      {/* Assistant IA en bas à droite */}
      {showAssistant && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatbotDavy />
        </div>
      )}

      {/* Footer NovaCore */}
      <FooterNovaCore />
    </div>
  )
}
