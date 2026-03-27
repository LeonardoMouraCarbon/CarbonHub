import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isLoginPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const hasSsoToken = request.nextUrl.searchParams.has('sso_token')

  // Se está tentando acessar o dashboard sem token, redireciona para login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se está na página de login com token válido, redireciona para dashboard
  // MAS se há sso_token na URL, deixa passar (pode ser callback de outro sistema)
  if (isLoginPage && token && !hasSsoToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
}
