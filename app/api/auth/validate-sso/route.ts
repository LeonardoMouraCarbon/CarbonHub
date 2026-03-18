import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'carbon-hub-secret-key-2026-secure'

// Configuração CORS para permitir requisições dos projetos
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handler para requisições OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, projectKey } = body

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token não fornecido' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Verify SSO token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      name: string
      acessos: string[]
      role: string
      type: string
      timestamp: number
    }

    // Check if it's a valid SSO token
    if (decoded.type !== 'sso') {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Verificar acesso ao projeto, se projectKey foi informado
    if (projectKey) {
      const acessos = decoded.acessos || []
      const role = decoded.role || 'user'
      const isAdmin = role === 'admin'
      const isAdminProject = projectKey === 'Carbon ID'
      const hasAccess = acessos.includes(projectKey) || (isAdmin && isAdminProject)

      if (!hasAccess) {
        return NextResponse.json(
          { valid: false, error: 'Acesso negado a este sistema' },
          { status: 403, headers: corsHeaders }
        )
      }
    }

    // Token is valid
    return NextResponse.json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        acessos: decoded.acessos || [],
        role: decoded.role || 'user'
      }
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('SSO token validation error:', error)
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { valid: false, error: 'Token expirado' },
        { status: 401, headers: corsHeaders }
      )
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { valid: false, error: 'Erro ao validar token' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET method for easier testing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token não fornecido' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Verify SSO token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      name: string
      acessos: string[]
      role: string
      type: string
      timestamp: number
    }

    // Check if it's a valid SSO token
    if (decoded.type !== 'sso') {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Token is valid
    return NextResponse.json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        acessos: decoded.acessos || [],
        role: decoded.role || 'user'
      }
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('SSO token validation error:', error)
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { valid: false, error: 'Token expirado' },
        { status: 401, headers: corsHeaders }
      )
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { valid: false, error: 'Erro ao validar token' },
      { status: 500, headers: corsHeaders }
    )
  }
}
