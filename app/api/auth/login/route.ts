import { neon } from '@neondatabase/serverless'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    // Conectar ao banco Neon
    const sql = neon(process.env.DATABASE_URL!)
    
    // Buscar usuário na tabela users
    const users = await sql`
      SELECT id, email, password_hash, nome, acessos, role 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha (assumindo que está em texto plano ou hash bcrypt)
    const bcrypt = require('bcryptjs')
    let passwordMatch = false

    // Tentar verificar como hash bcrypt primeiro
    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash)
    } catch {
      // Se falhar, comparar como texto plano (caso as senhas não estejam hasheadas)
      passwordMatch = password === user.password_hash
    }

    if (!passwordMatch) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Criar token JWT
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.nome,
        acessos: user.acessos || [],
        role: user.role || 'user'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Criar resposta com cookie
    const response = Response.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.nome,
        acessos: user.acessos || [],
        role: user.role || 'user'
      }
    })

    // Definir cookie com token
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieFlags = isProduction
      ? `HttpOnly; Secure; SameSite=Strict`
      : `HttpOnly; SameSite=Lax`
    response.headers.set(
      'Set-Cookie',
      `token=${token}; ${cookieFlags}; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    )

    return response

  } catch (error) {
    console.error('Erro no login:', error)
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
