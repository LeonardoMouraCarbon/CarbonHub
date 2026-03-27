import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { sql } from '@/lib/db'

const ADMIN_EMAIL = 'leonardo.moura@carboncapital.com.br'
const JWT_SECRET = process.env.JWT_SECRET || 'carbon-hub-secret-key-2026-secure'

async function verifyAdmin(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null

    const decoded = verify(token, JWT_SECRET) as any
    if (decoded.email !== ADMIN_EMAIL) return null

    return decoded
  } catch {
    return null
  }
}

// Converter row do banco para formato da API
function rowToProject(row: any) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    url: row.url,
    status: row.status,
    category: row.category,
    tags: row.tags || [],
    accessKey: row.access_key,
    projectKey: row.project_key,
  }
}

// GET - Listar projetos
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const rows = await sql`SELECT * FROM projects ORDER BY id`
  return NextResponse.json({ projects: rows.map(rowToProject) })
}

// POST - Criar novo projeto
// Insere em `projects` E em `programas` (fonte de verdade para acessos dos usuários)
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const { name, description, url, status, category, tags, accessKey, projectKey } = body

  if (!name || !url || !accessKey || !projectKey) {
    return NextResponse.json({ error: 'name, url, accessKey e projectKey são obrigatórios' }, { status: 400 })
  }

  // Inserir na tabela projects
  const rows = await sql`
    INSERT INTO projects (name, description, url, status, category, tags, access_key, project_key)
    VALUES (
      ${name},
      ${description || ''},
      ${url},
      ${status || 'online'},
      ${category || 'Outros'},
      ${tags || []},
      ${accessKey},
      ${projectKey}
    )
    RETURNING *
  `

  // Inserir em programas (accessKey é o nome do programa usado em users.acessos)
  // Usa WHERE NOT EXISTS para não depender de UNIQUE constraint no banco
  // try/catch para não bloquear o retorno mesmo se programas falhar
  try {
    await sql`
      INSERT INTO programas (nome)
      SELECT ${accessKey}
      WHERE NOT EXISTS (SELECT 1 FROM programas WHERE nome = ${accessKey})
    `
  } catch (e) {
    console.warn('[admin/projects] Aviso: falha ao inserir em programas:', e)
  }

  return NextResponse.json({ success: true, project: rowToProject(rows[0]) }, { status: 201 })
}

// PUT - Editar projeto existente
// Atualiza `projects` E sincroniza `programas` se access_key mudou
export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const { id, name, description, url, status, category, tags, accessKey, projectKey } = body

  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  // Buscar access_key anterior para atualizar programas se mudou
  const current = await sql`SELECT access_key FROM projects WHERE id = ${id}`
  if (current.length === 0) return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
  const oldAccessKey = current[0].access_key

  // Atualizar projects
  const rows = await sql`
    UPDATE projects SET
      name        = ${name},
      description = ${description || ''},
      url         = ${url},
      status      = ${status || 'online'},
      category    = ${category || 'Outros'},
      tags        = ${tags || []},
      access_key  = ${accessKey},
      project_key = ${projectKey},
      updated_at  = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  // Sincronizar tabela programas se access_key mudou
  if (oldAccessKey !== accessKey) {
    // Renomear o programa antigo para o novo nome
    await sql`UPDATE programas SET nome = ${accessKey} WHERE nome = ${oldAccessKey}`
    // Se não existia ainda, garantir que existe
    await sql`INSERT INTO programas (nome) SELECT ${accessKey} WHERE NOT EXISTS (SELECT 1 FROM programas WHERE nome = ${accessKey})`
  }

  return NextResponse.json({ success: true, project: rowToProject(rows[0]) })
}

// DELETE - Remover projeto
// Remove de `projects` E de `programas`
export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  // Buscar access_key antes de deletar para remover de programas
  const current = await sql`SELECT access_key FROM projects WHERE id = ${id}`
  if (current.length === 0) return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
  const accessKey = current[0].access_key

  // Deletar de projects
  await sql`DELETE FROM projects WHERE id = ${id}`

  // Deletar de programas (accessKey = nome do programa)
  await sql`DELETE FROM programas WHERE nome = ${accessKey}`

  return NextResponse.json({ success: true })
}
