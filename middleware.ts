import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isLoginPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  // Se está tentando acessar o dashboard sem token, redireciona para login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se está na página de login com token válido, redireciona para dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
}
