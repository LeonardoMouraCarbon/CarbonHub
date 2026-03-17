# Integração SSO - Carbon Hub & Developer

## Visão Geral

Este documento descreve como integrar a autenticação Single Sign-On (SSO) do **Carbon Hub & Developer** nos projetos externos.

Quando um usuário clica em "Acessar Projeto" no dashboard, o sistema:
1. Gera um token SSO válido por 30 minutos
2. Anexa o token à URL do projeto (`?sso_token=...`)
3. Abre o projeto em uma nova aba

## Para Desenvolvedores dos Projetos

### 1. Receber o Token SSO

Quando o projeto é acessado via Hub, a URL virá com dois parâmetros:
```
https://seu-projeto.vercel.app?sso_token=eyJhbGc...&hub_origin=https://hub.exemplo.com
```

**Parâmetros:**
- `sso_token`: Token JWT com dados do usuário (válido por 30 minutos)
- `hub_origin`: URL de origem do Hub (para validação)

### 2. Validar o Token

Faça uma requisição para a API de validação do Hub:

#### Opção 1: POST (Recomendado)
```typescript
const response = await fetch('https://hub-develop.vercel.app/api/auth/validate-sso', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: ssoToken })
})

const data = await response.json()

if (data.valid) {
  // Token válido - usuário autenticado
  console.log('Usuário:', data.user)
  // {
  //   id: "uuid-do-usuario",
  //   email: "usuario@exemplo.com",
  //   name: "Nome do Usuário"
  // }
} else {
  // Token inválido ou expirado
  console.error('Erro:', data.error)
}
```

#### Opção 2: GET (Para testes)
```typescript
const response = await fetch(
  `https://hub-develop.vercel.app/api/auth/validate-sso?token=${ssoToken}`
)
```

### 3. Implementação Exemplo - Next.js

#### Criar Middleware de SSO
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const ssoToken = request.nextUrl.searchParams.get('sso_token')
  
  // Se tem token SSO, valida
  if (ssoToken) {
    try {
      const response = await fetch('https://hub-develop.vercel.app/api/auth/validate-sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ssoToken })
      })

      const data = await response.json()

      if (data.valid) {
        // Cria sessão local para o usuário
        const sessionResponse = NextResponse.redirect(
          new URL('/', request.url)
        )
        
        // Salva dados do usuário em cookie
        sessionResponse.cookies.set('user_session', JSON.stringify(data.user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 30 // 30 minutos
        })

        return sessionResponse
      }
    } catch (error) {
      console.error('Erro ao validar SSO:', error)
    }
  }

  // Verifica se tem sessão local
  const session = request.cookies.get('user_session')
  
  if (!session) {
    // Redireciona para página de login local
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
}
```

#### Criar Página de Login Local
```typescript
// app/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verifica se veio do Hub com token SSO
    const ssoToken = searchParams.get('sso_token')
    
    if (ssoToken) {
      // Middleware vai processar o token
      return
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-4">
          Este projeto requer autenticação através do Carbon Hub.
        </p>
        <a 
          href="https://hub-develop.vercel.app"
          className="px-6 py-3 bg-[#00d2c7] text-white rounded-lg hover:bg-[#00a89e]"
        >
          Acessar Carbon Hub
        </a>
      </div>
    </div>
  )
}
```

### 4. Implementação Exemplo - React (Vite) com React Router

#### AuthContext.tsx (Exemplo do SISCON)
```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, validateSSOToken, getCurrentUser, signOut as authSignOut, signIn as authSignIn } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithSSO: (token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // ⚠️ CRÍTICO: Verifica SSO PRIMEIRO
      const params = new URLSearchParams(window.location.search);
      const ssoToken = params.get('sso_token');

      if (ssoToken) {
        console.log('🔑 SSO Token detectado, validando...');
        const response = await validateSSOToken(ssoToken);
        
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('auth-user', JSON.stringify(response.user));
          
          // Remove token da URL
          window.history.replaceState({}, '', window.location.pathname);
          console.log('✅ SSO autenticado com sucesso!');
        }
      } else {
        // Verifica sessão local
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signInWithSSO = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await validateSSOToken(token);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('auth-user', JSON.stringify(response.user));
        return { success: true };
      }

      return { success: false, error: response.error || 'Erro ao autenticar via SSO' };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authSignIn(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('auth-user', JSON.stringify(response.user));
        return { success: true };
      }

      return { success: false, error: response.error || 'Erro ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    authSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signInWithSSO, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
```

#### ProtectedRoute.tsx (CRÍTICO - Espera isLoading)
```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // ⚠️ CRÍTICO: ESPERA isLoading terminar ANTES de redirecionar
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d2c7] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Só redireciona se NÃO está carregando E não tem usuário
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

#### App.tsx (Rotas Configuradas)
```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Outras rotas protegidas */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

#### lib/auth.ts (Validação SSO)
```typescript
// lib/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // ... outros campos
}

export async function validateSSOToken(token: string): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const response = await fetch('https://hub-develop.vercel.app/api/auth/validate-sso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      return {
        success: false,
        error: data.error || 'Token SSO inválido'
      };
    }

    // ⚠️ IMPORTANTE: Busca dados completos do usuário no seu banco
    // O Hub retorna apenas id, email, name
    // Você precisa buscar permissões, role, etc. do seu próprio banco
    const fullUser = await fetchUserFromDatabase(data.user.id);

    return {
      success: true,
      user: fullUser
    };
  } catch (error) {
    console.error('Erro ao validar SSO:', error);
    return {
      success: false,
      error: 'Erro ao conectar com servidor SSO'
    };
  }
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('auth-user');
  return userJson ? JSON.parse(userJson) : null;
}

export async function signIn(email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  // Seu login local existente
  // ...
}

export function signOut(): void {
  localStorage.removeItem('auth-user');
}

async function fetchUserFromDatabase(userId: string): Promise<User> {
  // Busca dados completos do usuário no seu banco de dados
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  return user;
}
```

#### Login.tsx (Página de Login)
```typescript
// pages/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já está autenticado, redireciona
    if (!isLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-4">
          Este projeto requer autenticação através do Carbon Hub.
        </p>
        <a 
          href="https://hub-develop.vercel.app"
          className="px-6 py-3 bg-[#00d2c7] text-white rounded-lg hover:bg-[#00a89e] inline-block"
        >
          Acessar Carbon Hub
        </a>
      </div>
    </div>
  );
}
```

## Resposta da API de Validação

### Sucesso (200)
```json
{
  "valid": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

### Token Inválido (401)
```json
{
  "valid": false,
  "error": "Token inválido"
}
```

### Token Expirado (401)
```json
{
  "valid": false,
  "error": "Token expirado"
}
```

### Token Não Fornecido (400)
```json
{
  "valid": false,
  "error": "Token não fornecido"
}
```

## Segurança

1. **Validação Obrigatória**: Sempre valide o token SSO no servidor, nunca confie apenas no cliente
2. **HTTPS**: Use apenas HTTPS em produção
3. **Origem**: Verifique o parâmetro `hub_origin` para garantir que o token veio do Hub oficial
4. **Expiração**: Tokens SSO expiram em 30 minutos
5. **Sessão Local**: Crie uma sessão local após validar o token para evitar múltiplas validações

## Endpoints do Hub

### Produção
- Validação: `https://hub-develop.vercel.app/api/auth/validate-sso`
- Hub: `https://hub-develop.vercel.app`

### Desenvolvimento Local
- Validação: `http://localhost:3000/api/auth/validate-sso`
- Hub: `http://localhost:3000`

## Suporte

Para dúvidas ou problemas com a integração SSO:
- Email: suporte@carbonhub.com
- Documentação: https://hub-develop.vercel.app/docs
- GitHub: https://github.com/leonardomoura

## Checklist de Integração

- [ ] Detectar parâmetro `sso_token` na URL
- [ ] Validar token via API do Hub
- [ ] Criar sessão local após validação bem-sucedida
- [ ] Implementar fallback para login local se token inválido
- [ ] Remover token da URL após processar
- [ ] Testar fluxo completo: Hub → Projeto → Sessão
- [ ] Implementar logout que limpa sessão local
- [ ] Adicionar link de retorno ao Hub no projeto

## Exemplo de Fluxo Completo

```
1. Usuário faz login no Carbon Hub
   ↓
2. Usuário clica em "Acessar Projeto"
   ↓
3. Hub gera token SSO
   ↓
4. Hub abre projeto: projeto.com?sso_token=xyz&hub_origin=hub.com
   ↓
5. Projeto recebe token e valida com Hub
   ↓
6. Hub responde: { valid: true, user: {...} }
   ↓
7. Projeto cria sessão local
   ↓
8. Usuário está autenticado no projeto
```

## Notas Importantes

- Tokens SSO são de uso único e expiram em 30 minutos
- Sempre crie uma sessão local após validar o token
- Não armazene o token SSO - use apenas para validação inicial
- Implemente renovação de sessão se necessário
- Forneça opção de logout que redireciona para o Hub
