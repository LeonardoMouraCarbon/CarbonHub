# 🔐 Guia de Integração SSO — Carbon Hub

## Visão Geral

O Carbon Hub é o ponto de entrada único para todos os sistemas da empresa.
Ao clicar em um card no Hub, o usuário é redirecionado para o sistema com um **token SSO temporário (30 min)** já embutido na URL.

O sistema deve detectar esse token, validá-lo com o Hub e criar a sessão local do usuário **sem precisar que ele faça login novamente**.

---

## Fluxo Completo

```
[Usuário clica no card do Hub]
        ↓
Hub gera sso_token (JWT 30min) e redireciona para:
  https://SEU-SISTEMA.vercel.app/?sso_token=eyJ...&hub_origin=https://carboncapital.vercel.app
        ↓
SEU-SISTEMA recebe os parâmetros na URL
        ↓
SEU-SISTEMA chama POST /api/auth/validate-sso no Hub
  body: { token: sso_token, projectKey: "SUA_PROJECT_KEY" }
        ↓
Hub verifica o token e retorna os dados do usuário
  { valid: true, user: { id, email, name, acessos, role } }
        ↓
SEU-SISTEMA cria a sessão local e redireciona para /dashboard
```

---

## Passo 1 — Informar dados ao administrador

Envie ao administrador do Hub (leonardo.moura@carboncapital.com.br):

| Campo        | Descrição                                                   | Exemplo              |
|-------------|--------------------------------------------------------------|----------------------|
| Nome         | Nome exibido no card do Hub                                 | `CRM Desligados`     |
| Descrição    | Breve descrição do sistema                                  | `Gestão de clientes` |
| URL          | URL de produção do sistema                                  | `https://meu-sistema.vercel.app` |
| Access Key   | Chave usada na coluna `acessos` no banco do Hub             | `CRM Desligados`     |
| Project Key  | Chave enviada ao validate-sso (geralmente igual ao Access Key) | `CRM Desligados`  |
| Categoria    | `BI & Analytics`, `Gestão & CRM`, `Data & Infrastructure`, `Automação` |  |

---

## Passo 2 — Implementação no seu sistema

### 2.1 Detectar e processar o token SSO na página de login/entrada

O Hub abre a URL raiz do sistema com os parâmetros:
- `sso_token`: JWT temporário
- `hub_origin`: URL base do Hub (ex: `https://carboncapital.vercel.app`)

#### Exemplo para React/Vite (SPA)

```tsx
// src/pages/Login.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const ssoToken = searchParams.get('sso_token')
    const hubOrigin = searchParams.get('hub_origin')

    if (ssoToken && hubOrigin) {
      // ✅ Limpar a URL imediatamente para não expor o token
      window.history.replaceState({}, '', window.location.pathname)
      handleSSO(ssoToken, hubOrigin)
    }
  }, [searchParams])

  async function handleSSO(ssoToken: string, hubOrigin: string) {
    const res = await fetch(`${hubOrigin}/api/auth/validate-sso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: ssoToken,
        projectKey: 'SUA_PROJECT_KEY', // ← substituir pela sua chave
      }),
    })

    const data = await res.json()

    if (data.valid) {
      // Criar sessão local com os dados do usuário
      // data.user = { id, email, name, acessos, role }
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } else {
      console.error('SSO inválido:', data.error)
    }
  }

  // ... restante do formulário de login manual
}
```

#### Exemplo para Next.js (App Router)

```tsx
// app/page.tsx — Página raiz que redireciona preservando os parâmetros SSO
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth' // sua função de sessão

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sso_token?: string; hub_origin?: string }>
}) {
  const session = await auth()
  const params = await searchParams

  const qs = new URLSearchParams()
  if (params.sso_token) qs.set('sso_token', params.sso_token)
  if (params.hub_origin) qs.set('hub_origin', params.hub_origin)
  const query = qs.toString()

  if (session) redirect('/dashboard')
  else redirect(`/auth/signin${query ? `?${query}` : ''}`)
}
```

```tsx
// app/auth/signin/page.tsx — Processar SSO
'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const ssoToken = searchParams.get('sso_token')
    const hubOrigin = searchParams.get('hub_origin')

    if (ssoToken && hubOrigin) {
      // Limpar URL imediatamente
      window.history.replaceState({}, '', window.location.pathname)

      signIn('sso', { ssoToken, hubOrigin, redirect: false })
        .then(result => {
          if (!result?.error) router.push('/dashboard')
        })
    }
  }, [searchParams])

  // ... formulário de login manual
}
```

```ts
// lib/auth.ts — Provider SSO no NextAuth
Credentials({
  id: 'sso',
  name: 'SSO',
  credentials: {
    ssoToken: { type: 'text' },
    hubOrigin: { type: 'text' },
  },
  async authorize(credentials) {
    const res = await fetch(`${credentials.hubOrigin}/api/auth/validate-sso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: credentials.ssoToken,
        projectKey: 'SUA_PROJECT_KEY', // ← substituir pela sua chave
      }),
    })

    const data = await res.json()
    if (!data.valid) return null

    // Buscar ou criar usuário local pelo email
    const user = await buscarUsuarioPorEmail(data.user.email)
    if (!user) return null

    return { id: user.id, email: user.email, name: user.name }
  },
})
```

---

## Passo 3 — Resposta do validate-sso

Ao chamar `POST https://carboncapital.vercel.app/api/auth/validate-sso`:

```json
// Body da requisição
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "projectKey": "SUA_PROJECT_KEY"
}
```

```json
// Resposta de sucesso
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "usuario@empresa.com",
    "name": "Nome do Usuário",
    "acessos": ["CRM Desligados", "SISCON"],
    "role": "user"
  }
}
```

```json
// Resposta de erro (token inválido, expirado ou sem acesso)
{
  "valid": false,
  "error": "Token inválido ou expirado"
}
```

---

## Passo 4 — Limpeza da URL

É obrigatório limpar os parâmetros SSO da URL assim que forem capturados para não expor o token:

```ts
window.history.replaceState({}, '', window.location.pathname)
```

---

## Passo 5 — Rota protegida (ProtectedRoute)

Se o usuário não estiver autenticado e tentar acessar uma rota protegida, redirecione para login **preservando os parâmetros SSO** caso existam na URL atual:

```tsx
// React/Vite — ProtectedRoute
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div>Carregando...</div>

  if (!user) {
    // Preservar parâmetros SSO ao redirecionar para login
    const params = new URLSearchParams(location.search)
    const ssoToken = params.get('sso_token')
    const hubOrigin = params.get('hub_origin')

    const loginUrl = ssoToken && hubOrigin
      ? `/login?sso_token=${ssoToken}&hub_origin=${encodeURIComponent(hubOrigin)}`
      : '/login'

    return <Navigate to={loginUrl} replace />
  }

  return <>{children}</>
}
```

---

## Checklist de Integração

- [ ] Definir a `PROJECT_KEY` do sistema (informar ao admin do Hub)
- [ ] Página de login detecta `sso_token` e `hub_origin` na URL
- [ ] URL é limpa imediatamente após capturar os parâmetros
- [ ] Chamada para `POST /api/auth/validate-sso` com `projectKey` correto
- [ ] Sessão local criada a partir dos dados retornados pelo Hub
- [ ] Página raiz (`/`) redireciona preservando parâmetros SSO (Next.js)
- [ ] ProtectedRoute preserva parâmetros SSO ao redirecionar
- [ ] Após login, redireciona para `/` ou `/dashboard` (sem parâmetros na URL)
- [ ] Testado no ambiente de produção via clique no card do Hub

---

## Dúvidas e Suporte

Entre em contato com: **leonardo.moura@carboncapital.com.br**
