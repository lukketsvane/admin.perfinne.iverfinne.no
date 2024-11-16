import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if the user has the super_admin role
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (error || userData.role !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: '/admin/:path*',
}