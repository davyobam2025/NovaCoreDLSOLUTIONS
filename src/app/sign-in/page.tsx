// ✅ Ce fichier est un composant client
'use client'

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <motion.div className="min-h-screen flex items-center justify-center p-4">
      <SignIn />
    </motion.div>
  )
}
