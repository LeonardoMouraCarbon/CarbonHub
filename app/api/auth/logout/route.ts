export async function POST(request: Request) {
  const response = Response.json({ success: true })
  
  // Remover cookie de autenticação
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieFlags = isProduction
    ? `HttpOnly; Secure; SameSite=Strict`
    : `HttpOnly; SameSite=Lax`
  response.headers.set(
    'Set-Cookie',
    `token=; ${cookieFlags}; Max-Age=0; Path=/`
  )
  
  return response
}
