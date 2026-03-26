import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const rows = await sql`SELECT * FROM projects WHERE status = 'online' OR status != 'deleted' ORDER BY id`

  const projects = rows.map((row: any) => ({
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    url: row.url,
    status: row.status,
    category: row.category,
    tags: row.tags || [],
    accessKey: row.access_key,
    projectKey: row.project_key,
  }))

  return NextResponse.json({
    projects,
    stats: {
      totalProjects: projects.length,
      activeProjects: projects.filter((p: any) => p.status === 'online').length,
    },
  })
}
