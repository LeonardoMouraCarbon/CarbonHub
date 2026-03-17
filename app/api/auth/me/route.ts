import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    // Verificar token JWT
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!)

    return Response.json({ 
      authenticated: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        acessos: decoded.acessos || []
      }
    })

  } catch (error) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
}
