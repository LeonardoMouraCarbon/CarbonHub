export async function POST(request: Request) {
  const response = Response.json({ success: true })
  
  // Remover cookie de autenticação
  response.headers.set(
    'Set-Cookie',
    'token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
  )
  
  return response
}
