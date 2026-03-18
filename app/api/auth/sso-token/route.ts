import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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
      acessos: string[]
      role: string
    }

    // Generate SSO token with shorter expiration (30 minutes)
    const ssoToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        acessos: decoded.acessos || [],
        role: decoded.role || 'user',
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
