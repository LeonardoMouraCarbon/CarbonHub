'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Trash2, X, Check, Settings, ExternalLink, Tag, Loader2, ArrowUpRight, LogOut, Shield } from 'lucide-react'

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
        if (!d.authenticated || d.user?.email !== ADMIN_EMAIL) {
          router.push('/dashboard')
          return
        }
        setUserEmail(d.user.email)
        loadProjects()
      })
      .catch(() => router.push('/dashboard'))
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
    // Normalizar URL — adiciona https:// se não tiver protocolo
    const normalizedUrl = form.url.startsWith('http') ? form.url : `https://${form.url}`
    const payload = { ...form, url: normalizedUrl, tags }

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const statusDotColor: Record<string, string> = {
    online: 'bg-[#00d2c7]',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-400',
  }
  const statusTextColor: Record<string, string> = {
    online: 'text-[#00d2c7]',
    offline: 'text-red-500',
    maintenance: 'text-yellow-500',
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tracking-[0.15em] text-black">CARBON HUB</span>
        <span className="text-xl text-[#00d2c7] italic">&</span>
        <span className="text-2xl font-bold tracking-[0.15em] text-black">DEVELOPER</span>
      </div>
      <Loader2 className="animate-spin w-6 h-6 text-[#00d2c7] mt-4" />
      <span className="text-[11px] tracking-[0.35em] uppercase text-[#999999]">CARREGANDO SISTEMAS</span>
    </div>
  )

  return (
    <main className="min-h-screen bg-white text-black">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-12 py-6 transition-all duration-400 backdrop-blur-md bg-white/90 border-b border-black/5">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-[0.15em] text-black">CARBON HUB</span>
            <span className="text-xl text-[#00d2c7] italic">&</span>
            <span className="text-2xl font-bold tracking-[0.15em] text-black">DEVELOPER</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#00d2c7]">
              <Shield className="w-3 h-3" />
              PAINEL ADMIN
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[10px] tracking-[0.2em] uppercase text-[#999999] hover:text-[#00d2c7] transition-colors relative group"
            >
              ← VOLTAR AO HUB
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#00d2c7] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-[#00d2c7] text-[#00d2c7] hover:bg-[#00d2c7] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <PlusCircle className="w-3 h-3" />
              NOVO SISTEMA
            </button>
            <button
              onClick={handleLogout}
              className="text-[10px] tracking-[0.2em] uppercase px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              SAIR
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-40 pb-16 px-12 max-w-[1800px] mx-auto">
        <div className="inline-flex items-center gap-4 mb-8 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
          <div className="w-10 h-[1px] bg-[#00d2c7]"></div>
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#00d2c7]">ÁREA RESTRITA — {userEmail}</span>
        </div>

        <h1 className="mb-6 opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_0.5s_forwards]">
          <span className="block text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.04em] font-bold">
            GERENCIAR
          </span>
          <span className="block text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[0.04em] font-bold text-[#00d2c7]">
            SISTEMAS
          </span>
        </h1>

        <p className="text-base leading-[1.8] text-[#999999] max-w-[480px] opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.7s_forwards]">
          Cadastre, edite e remova sistemas do Carbon Hub. Todas as alterações são sincronizadas automaticamente com o banco de dados.
        </p>
      </section>

      {/* Feedback */}
      {msg && (
        <div className="max-w-[1800px] mx-auto px-12 mb-2">
          <div className={`flex items-center justify-between px-6 py-4 text-[11px] tracking-[0.15em] uppercase font-medium border ${
            msg.type === 'ok'
              ? 'border-[#00d2c7] text-[#00d2c7] bg-[#00d2c7]/5'
              : 'border-red-400 text-red-500 bg-red-50'
          }`}>
            {msg.text}
            <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Marquee separator */}
      <div className="py-6 border-t border-b border-black/10 overflow-hidden mb-12">
        <div className="flex animate-[marqueeScroll_30s_linear_infinite] w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-10 whitespace-nowrap">
              <span className="text-sm tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">{projects.length} SISTEMAS</span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
              <span className="text-sm tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">
                {projects.filter(p => p.status === 'online').length} ONLINE
              </span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
              <span className="text-sm tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">CARBON CAPITAL S.A.</span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <section className="max-w-[1800px] mx-auto px-12 pb-32">
        {projects.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-[#999999]" />
            </div>
            <div className="text-black text-xl font-bold tracking-wide mb-3">NENHUM SISTEMA CADASTRADO</div>
            <p className="text-[#666666] text-sm mb-8">Clique em &quot;NOVO SISTEMA&quot; para começar.</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-4 bg-[#00d2c7] text-white px-10 py-4 text-[11px] font-semibold tracking-[0.25em] uppercase hover:bg-[#161616] transition-all duration-400"
            >
              <PlusCircle className="w-4 h-4" />
              NOVO SISTEMA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl p-6 hover:bg-white/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Status */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${statusDotColor[project.status] || 'bg-[#999999]'}`}></div>
                  <span className={`text-[10px] tracking-wider uppercase ${statusTextColor[project.status] || 'text-[#999999]'}`}>
                    {project.status}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-black/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#00d2c7]/10 transition-colors duration-300">
                  <ExternalLink className="w-7 h-7 text-[#00d2c7]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#00d2c7] transition-colors duration-300 tracking-wide pr-16">
                  {project.name}
                </h3>
                <p className="text-sm text-[#666666] mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Access Key */}
                <div className="mb-4">
                  <code className="text-[11px] bg-black/5 px-3 py-1 rounded-lg text-[#666666] tracking-wider">
                    {project.accessKey || '—'}
                  </code>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/5 text-[11px] text-[#666666] rounded-lg border border-black/5 tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-black/10">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#999999]">{project.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(project)}
                      className="p-2 text-[#999999] hover:text-[#00d2c7] hover:bg-[#00d2c7]/10 rounded-lg transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {deleteConfirm === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-2 text-[#999999] hover:text-black rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#999999] hover:text-[#00d2c7] hover:bg-[#00d2c7]/10 rounded-lg transition-all duration-200"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info card */}
        <div className="mt-16 bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl px-8 py-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-[1px] bg-[#00d2c7]"></div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#00d2c7]">REFERÊNCIA</span>
          </div>
          <p className="text-sm text-[#666666] leading-relaxed">
            <span className="text-black font-semibold">Access Key</span>: chave usada no banco de dados (coluna{' '}
            <code className="bg-black/5 px-2 py-0.5 rounded text-[#666666] text-xs">acessos</code> do usuário). Ex:{' '}
            <code className="bg-black/5 px-2 py-0.5 rounded text-[#666666] text-xs">CRM Desligados</code>
          </p>
          <p className="text-sm text-[#666666] leading-relaxed mt-2">
            <span className="text-black font-semibold">Project Key</span>: chave que o sistema usa ao chamar{' '}
            <code className="bg-black/5 px-2 py-0.5 rounded text-[#666666] text-xs">/api/auth/validate-sso</code>. Deve ser idêntica à Access Key.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-[#fafafa] py-10">
        <div className="max-w-[1800px] mx-auto px-12 text-center text-sm text-[#999999] tracking-wider">
          <p>© 2026 DEVELOPER HUB · PAINEL DE ADMINISTRAÇÃO · CARBON CAPITAL S.A.</p>
        </div>
      </footer>

      {/* Modal Criar / Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards' }}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-black/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-6 h-[1px] bg-[#00d2c7]"></div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#00d2c7]">
                    {modal === 'create' ? 'NOVO SISTEMA' : 'EDITAR SISTEMA'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-black tracking-wide">
                  {modal === 'create' ? 'Cadastrar Sistema' : form.name}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="text-[#999999] hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Nome do Sistema *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                  placeholder="Ex: CRM Desligados"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none resize-none transition-all"
                  placeholder="Breve descrição do sistema..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">URL de Produção *</label>
                <input
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                  placeholder="https://meu-sistema.vercel.app"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Access Key *</label>
                  <input
                    value={form.accessKey}
                    onChange={e => setForm(f => ({ ...f, accessKey: e.target.value }))}
                    className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                    placeholder="Ex: CRM Desligados"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Project Key (SSO) *</label>
                  <input
                    value={form.projectKey}
                    onChange={e => setForm(f => ({ ...f, projectKey: e.target.value }))}
                    className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                    placeholder="Ex: CRM Desligados"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Categoria</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999999] mb-2">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Tags (separadas por vírgula)
                </label>
                <input
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full border border-black/10 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00d2c7]/30 focus:border-[#00d2c7] outline-none transition-all"
                  placeholder="Ex: crm, leads, automação"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-black/10 flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#999999] border border-black/10 hover:border-black/30 hover:text-black transition-all duration-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#00d2c7] hover:bg-[#161616] text-white text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-60 rounded-xl"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                {modal === 'create' ? 'CRIAR SISTEMA' : 'SALVAR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
