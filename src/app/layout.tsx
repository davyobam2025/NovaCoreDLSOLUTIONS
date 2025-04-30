'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthRedirector({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    const checkAbonnement = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return

      const { data } = await supabase
        .from('abonnements')
        .select('crm_type')
        .eq('user_email', user.primaryEmailAddress.emailAddress)
        .single()

      if (data?.crm_type) {
        router.push(`/crm/${data.crm_type}`)
      } else {
        router.push('/crm/choose')
      }
    }

    checkAbonnement()
  }, [user, router])

  return <>{children}</>
}
