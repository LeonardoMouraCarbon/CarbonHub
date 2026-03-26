'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Trash2, X, Check, Shield, ExternalLink, Tag, Loader2 } from 'lucide-react'

const ADMIN_EMAIL = 'leonardo.moura@carboncapital.com.br'
const CATEGORIES = ['BI & Analytics', 'Gestão & CRM', 'Data & Infrastructure', 'Automação', 'Outros']
const STATUSES = ['online', 'offline', 'maintenance']

interface Project {
  id: string
  name: string
  description: string
  url: string
  status: string
  category: string
  tags: string[]
  accessKey: string
  projectKey: string
}

const empty: Omit<Project, 'id'> = {
  name: '', description: '', url: '', status: 'online',
  category: 'Gestão & CRM', tags: [], accessKey: '', projectKey: '',
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Modal
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Project, 'id'>>(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user?.email !== ADMIN_EMAIL) {
          router.push('/dashboard')
          return
        }
        setUserEmail(d.user.email)
        loadProjects()
      })
      .catch(() => router.push('/login'))
  }, [])

  async function loadProjects() {
    setLoading(true)
    const r = await fetch('/api/admin/projects')
    if (!r.ok) { router.push('/dashboard'); return }
    const d = await r.json()
    setProjects(d.projects || [])
    setLoading(false)
  }

  function openCreate() {
    setForm(empty)
    setTagsInput('')
    setEditId(null)
    setModal('create')
  }

  function openEdit(p: Project) {
    setForm({ name: p.name, description: p.description, url: p.url, status: p.status,
      category: p.category, tags: p.tags, accessKey: p.accessKey || '', projectKey: p.projectKey || '' })
    setTagsInput(p.tags.join(', '))
    setEditId(p.id)
    setModal('edit')
  }

  async function handleSave() {
    if (!form.name || !form.url || !form.accessKey || !form.projectKey) {
      setMsg({ type: 'err', text: 'Nome, URL, Chave de Acesso e Project Key são obrigatórios.' })
      return
    }
    setSaving(true)
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...form, tags }

    const r = modal === 'create'
      ? await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...payload }) })

    setSaving(false)
    if (r.ok) {
      setMsg({ type: 'ok', text: modal === 'create' ? 'Sistema criado com sucesso!' : 'Sistema atualizado!' })
      setModal(null)
      loadProjects()
    } else {
      const d = await r.json()
      setMsg({ type: 'err', text: d.error || 'Erro ao salvar.' })
    }
  }

  async function handleDelete(id: string) {
    setSaving(true)
    const r = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
    setSaving(false)
    setDeleteConfirm(null)
    if (r.ok) { setMsg({ type: 'ok', text: 'Sistema removido.' }); loadProjects() }
    else setMsg({ type: 'err', text: 'Erro ao remover.' })
  }

  const statusBadge: Record<string, string> = {
    online: 'bg-emerald-100 text-emerald-700',
    offline: 'bg-red-100 text-red-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Gerenciar Sistemas</h1>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border hover:bg-gray-50 transition">
              ← Voltar ao Hub
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition">
              <PlusCircle className="w-4 h-4" /> Novo Sistema
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Feedback */}
        {msg && (
          <div className={`mb-4 flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
            <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Sistema</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">URL</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Access Key</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Categoria</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{p.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 max-w-[180px] truncate">
                      {p.url.replace('https://', '')} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{p.accessKey || '—'}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded transition">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-12 text-gray-400">Nenhum sistema cadastrado.</div>
          )}
        </div>

        {/* Info card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">📋 Access Key vs Project Key</p>
          <p><strong>Access Key</strong>: chave usada no banco de dados (coluna <code className="bg-blue-100 px-1 rounded">acessos</code> do usuário). Ex: <code className="bg-blue-100 px-1 rounded">CRM Desligados</code></p>
          <p className="mt-1"><strong>Project Key</strong>: chave que o sistema usa ao chamar <code className="bg-blue-100 px-1 rounded">/api/auth/validate-sso</code>. Deve ser idêntica à Access Key.</p>
        </div>
      </div>

      {/* Modal Criar / Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">
                {modal === 'create' ? '➕ Novo Sistema' : '✏️ Editar Sistema'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Sistema *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Ex: CRM Desligados" />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none resize-none"
                  placeholder="Breve descrição do sistema..." />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Produção *</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="https://meu-sistema.vercel.app" />
              </div>

              {/* Access Key + Project Key */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Key (banco) *</label>
                  <input value={form.accessKey} onChange={e => setForm(f => ({ ...f, accessKey: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="Ex: CRM Desligados" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Key (SSO) *</label>
                  <input value={form.projectKey} onChange={e => setForm(f => ({ ...f, projectKey: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="Ex: CRM Desligados" />
                </div>
              </div>

              {/* Categoria + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none bg-white">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Tag className="w-3.5 h-3.5 inline mr-1" />Tags (separadas por vírgula)
                </label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Ex: crm, leads, automação" />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {modal === 'create' ? 'Criar Sistema' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
