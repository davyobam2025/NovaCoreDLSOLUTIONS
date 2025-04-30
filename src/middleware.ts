import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // Protéger les routes admin
  if (pathname.startsWith('/crm/admin')) {
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url)) // page d’erreur personnalisée
    }
  }

  return res
}

export const config = {
  matcher: ['/crm/admin/:path*']
}
