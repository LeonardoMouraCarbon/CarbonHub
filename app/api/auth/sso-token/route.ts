import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

const JWT_SECRET = process.env.JWT_SECRET || 'carbon-hub-secret-key-2026-secure'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verify the main token
    const decoded = jwt.verify(token.value, JWT_SECRET) as { 
      userId: string
      email: string
      name: string
    }

    // Buscar acessos e role frescos do banco
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT acessos, role FROM users WHERE email = ${decoded.email} LIMIT 1
    `
    const dbUser = users[0] ?? {}
    const acessos: string[] = dbUser.acessos || []
    const role: string = dbUser.role || 'user'

    // Generate SSO token with shorter expiration (30 minutes)
    const ssoToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        acessos,
        role,
        type: 'sso',
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '30m' }
    )

    return NextResponse.json({ 
      token: ssoToken,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    })
  } catch (error) {
    console.error('SSO token generation error:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar token SSO' },
      { status: 500 }
    )
  }
}
