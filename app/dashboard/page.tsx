'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Code2, Activity, Zap, Search, ArrowUpRight, LogOut } from 'lucide-react'
import type { Project } from '@/components/ProjectCard'
import projectsData from '@/data/projects.json'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userAcessos, setUserAcessos] = useState<string[]>([])
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()

  // Mapeamento: chaves no banco → nomes exatos dos projetos no sistema
  const ACESSOS_MAP: Record<string, string> = {
    'SISCON':                  'SISCON',
    'ConsigTrack':             'Consig Carbon',
    'CSVConverter':            'CSV Converter Pro',
    'Bases Higienizadas':      'Gestão de CPFs Enriquecidos',
    'Convênios Consig Priv':   'Gestão de Convênios Privados',
    'PosiFrig':                'Posição Frigomarca',
    'CRM Desligados':          'CRM Desligados',
    'CRM Precatorios':         'CRM Precatórios',
    'Carbon ID':               'Carbon ID',
  }

  const projects = projectsData.projects as Project[]
  const stats = projectsData.stats
  const links = projectsData.links

  useEffect(() => {
    // Buscar dados do usuário autenticado
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserAcessos(data.user.acessos || [])
          setUserRole(data.user.role || 'user')
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      }
    }
    
    fetchUserData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToAnalytics = () => {
    const analyticsSection = document.getElementById('analytics')
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleProjectClick = async (project: Project) => {
    try {
      console.log('🔑 [HUB] Gerando token SSO para:', project.name)
      
      const response = await fetch('/api/auth/sso-token')
      
      if (!response.ok) {
        throw new Error('Falha ao gerar token SSO')
      }

      const data = await response.json()
      console.log('✅ [HUB] Token SSO gerado com sucesso!')
      
      const projectUrl = new URL(project.url)
      projectUrl.searchParams.set('sso_token', data.token)
      projectUrl.searchParams.set('hub_origin', window.location.origin)
      
      console.log('🚀 [HUB] Abrindo:', projectUrl.toString().substring(0, 100) + '...')
      
      window.open(projectUrl.toString(), '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('❌ [HUB] Erro ao gerar SSO:', error)
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !selectedCategory || project.category === selectedCategory

    // Traduzir acessos do banco para nomes dos projetos + Carbon ID para admins
    const projetosPermitidos = [
      ...userAcessos.map(a => ACESSOS_MAP[a] ?? a),
      ...(userRole === 'admin' ? ['Carbon ID'] : [])
    ]

    const hasAccess = projetosPermitidos.length > 0 && projetosPermitidos.includes(project.name)

    return matchesSearch && matchesCategory && hasAccess
  })

  const categories = Array.from(new Set(projects.map(p => p.category)))

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navigation - Barbershop Style */}
      <nav className="fixed top-0 left-0 w-full z-50 px-12 py-6 transition-all duration-400 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-[0.15em] text-black">CARBON HUB</span>
            <span className="text-xl text-[#00d2c7] italic">&</span>
            <span className="text-2xl font-bold tracking-[0.15em] text-black">DEVELOPER</span>
          </div>
          
          <div className="flex items-center gap-10">
            <button onClick={scrollToProjects} className="text-[10px] tracking-[0.2em] uppercase text-[#999999] hover:text-[#00d2c7] transition-colors relative group">
              PROJETOS
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#00d2c7] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={scrollToAnalytics} className="text-[10px] tracking-[0.2em] uppercase text-[#999999] hover:text-[#00d2c7] transition-colors relative group">
              ANALYTICS
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#00d2c7] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={scrollToAbout} className="text-[10px] tracking-[0.2em] uppercase text-[#999999] hover:text-[#00d2c7] transition-colors relative group">
              SAIBA MAIS
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#00d2c7] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="text-[10px] tracking-[0.2em] uppercase px-6 py-2 border border-[#00d2c7] text-[#00d2c7] hover:bg-[#00d2c7] hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <LogOut className="w-3 h-3" />
            SAIR
          </button>
        </div>
      </nav>

      {/* Hero Section - Full Width Video */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Content */}
        <div className="flex flex-col justify-center px-8 lg:px-20 pt-32 pb-20 lg:pt-20 relative z-10 bg-gradient-to-r from-white via-white to-white/80">
          <div className="inline-flex items-center gap-4 mb-10 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.8s_forwards]">
            <div className="w-10 h-[1px] bg-[#00d2c7]"></div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#00d2c7]">CRIADO EM 2026 — CARBON CAPITAL S.A.</span>
          </div>
          
          <h1 className="mb-8">
            <span className="block text-[clamp(3.5rem,7vw,7rem)] leading-[0.95] tracking-[0.04em] opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_1s_forwards] font-bold">
              CARBON HUB
            </span>
            <span className="block text-[clamp(3.5rem,7vw,7rem)] leading-[0.95] tracking-[0.04em] opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_1.15s_forwards] font-bold text-[#00d2c7]">
              &
            </span>
            <span className="block text-[clamp(2.3rem,4.5vw,4.5rem)] leading-[0.95] tracking-[0.04em] italic opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_1.3s_forwards] font-normal">
              DEVELOPER
            </span>
          </h1>
          
          <p className="text-base leading-[1.8] text-[#999999] max-w-[420px] mb-12 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_1.5s_forwards]">
            Console centralizado de inteligência de dados e operações da Carbon Capital SA
          </p>
          
          <div className="flex items-center gap-8 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_1.7s_forwards]">
            <button 
              onClick={scrollToProjects}
              className="inline-flex items-center gap-4 bg-[#00d2c7] text-white px-10 py-4 text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-400 hover:bg-[#161616] relative overflow-hidden group"
            >
              <span className="relative z-10">VER PROJETOS</span>
              <ArrowUpRight className="w-4 h-4 relative z-10" />
            </button>
            
            <button 
              onClick={scrollToAbout}
              className="inline-flex items-center gap-3 text-[12px] tracking-[0.15em] uppercase text-[#666666] hover:text-[#00d2c7] transition-colors group"
            >
              <span>SAIBA MAIS</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Video */}
        <div className="relative overflow-hidden">
          <VideoBackgroundCard />
        </div>
      </section>

      {/* Marquee Stats */}
      <div className="py-8 border-t border-b border-black/10 overflow-hidden">
        <div className="flex animate-[marqueeScroll_30s_linear_infinite] w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-10 whitespace-nowrap">
              <span className="text-xl tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">{stats.totalProjects} PROJETOS</span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
              <span className="text-xl tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">{stats.activeProjects} ATIVOS</span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
              <span className="text-xl tracking-[0.2em] text-[#6B6B6B] uppercase font-bold">100% UPTIME</span>
              <div className="w-1 h-1 bg-[#00d2c7] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-2 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[#999999] ml-4" />
              <input
                type="text"
                placeholder="Buscar projetos por nome, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-black placeholder-[#999999] py-4 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div id="analytics" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 scroll-mt-24">
          <div className="group bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-6">
              <Code2 className="w-10 h-10 text-[#00d2c7]" />
              <div className="w-3 h-3 bg-[#00d2c7] rounded-full animate-pulse"></div>
            </div>
            <div className="text-5xl font-bold text-black mb-3">{stats.totalProjects}</div>
            <div className="text-sm tracking-[0.2em] uppercase text-[#999999]">TOTAL DE PROJETOS</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-6">
              <Activity className="w-10 h-10 text-[#00d2c7]" />
              <div className="w-3 h-3 bg-[#00d2c7] rounded-full animate-pulse"></div>
            </div>
            <div className="text-5xl font-bold text-black mb-3">{stats.activeProjects}</div>
            <div className="text-sm tracking-[0.2em] uppercase text-[#999999]">PRODUÇÃO</div>
          </div>

          <div className="group bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-6">
              <Zap className="w-10 h-10 text-[#00d2c7]" />
              <div className="w-3 h-3 bg-[#00d2c7] rounded-full animate-pulse"></div>
            </div>
            <div className="text-5xl font-bold text-black mb-3">100%</div>
            <div className="text-sm tracking-[0.2em] uppercase text-[#999999]">DISPONIBILIDADE</div>
          </div>
        </div>

        {/* Category Filters */}
        <div id="projects" className="flex flex-wrap gap-3 justify-center mb-16 scroll-mt-24">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-8 py-3 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
              !selectedCategory
                ? 'bg-black text-white'
                : 'bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black/5'
            }`}
          >
            TODOS OS PROJETOS
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`px-8 py-3 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#00d2c7] text-white'
                  : 'bg-white/80 backdrop-blur-md border border-black/10 text-black hover:bg-black/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="group block animate-fade-in text-left w-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl p-6 h-full hover:bg-white/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00d2c7] rounded-full animate-pulse"></div>
                  <span className="text-[10px] tracking-wider uppercase text-[#00d2c7]">{project.status}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-black/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#00d2c7]/10 transition-colors duration-300">
                  <ExternalLink className="w-7 h-7 text-[#00d2c7]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#00d2c7] transition-colors duration-300 tracking-wide">
                  {project.name}
                </h3>
                <p className="text-sm text-[#666666] mb-5 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-black/5 text-[11px] text-[#666666] rounded-lg border border-black/5 tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Category badge */}
                <div className="flex items-center justify-between pt-5 border-t border-black/10">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#999999]">{project.category}</span>
                  <ArrowUpRight className="w-5 h-5 text-[#999999] group-hover:text-[#00d2c7] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            {userAcessos.length === 0 && userRole !== 'admin' ? (
              <>
                <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#999999]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="text-black text-xl font-bold tracking-wide mb-3">ACESSO NÃO CONFIGURADO</div>
                <p className="text-[#666666] text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  Você não possui acesso a nenhum projeto no momento. Entre em contato com o administrador do sistema para solicitar a liberação dos acessos.
                </p>
                <a
                  href="mailto:admin@carboncapital.com.br"
                  className="inline-flex items-center gap-2 bg-[#00d2c7] text-white px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#161616] transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  CONTATAR ADMINISTRADOR
                </a>
              </>
            ) : (
              <>
                <div className="text-[#666666] text-lg mb-4 tracking-wide">NENHUM PROJETO ENCONTRADO</div>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory(null)
                  }}
                  className="text-[#00d2c7] hover:text-[#161616] transition-colors tracking-wider text-sm uppercase"
                >
                  Limpar Filtros
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* Sobre o Sistema */}
      <section id="about" className="max-w-5xl mx-auto px-8 py-32 scroll-mt-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-[#00d2c7]"></div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#00d2c7]">SOBRE O SISTEMA</span>
            <div className="w-10 h-[1px] bg-[#00d2c7]"></div>
          </div>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight mb-8">Sobre o Sistema</h2>
        </div>

        <div className="space-y-8 text-[#666666] leading-relaxed">
          <p className="text-lg">
            Bem-vindo ao portal centralizado de operações e inteligência da <span className="text-black font-semibold">Carbon Capital SA</span>.
          </p>

          <p>
            Este ambiente foi desenvolvido para ser o <span className="text-black font-semibold">ponto único de acesso (Single Source of Truth)</span> a todo o ecossistema de aplicações, dashboards e ferramentas operacionais da empresa. Nosso objetivo é simplificar o fluxo de trabalho, garantir a governança das informações e aumentar a produtividade de todos os times, eliminando a fragmentação de links e acessos.
          </p>

          <p>
            Construído com uma arquitetura moderna e de alta performance, o sistema organiza os recursos da Carbon Capital em <span className="text-black font-semibold">três pilares estratégicos</span>:
          </p>

          <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                <span className="text-[#00d2c7]">●</span> BI & Analytics
              </h3>
              <p>
                O núcleo de inteligência da empresa. Aqui estão consolidados os dashboards que transformam dados complexos em insights acionáveis, permitindo o acompanhamento em tempo real das carteiras, posições de mercado e KPIs fundamentais para a tomada de decisão executiva.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                <span className="text-[#00d2c7]">●</span> Gestão & CRM
              </h3>
              <p>
                O motor da nossa operação comercial. Este módulo centraliza as ferramentas de relacionamento, automação de comunicação e gestão de funil (como precatórios e campanhas de consignado), garantindo que nossa equipe atue sempre com precisão e foco em conversão.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
                <span className="text-[#00d2c7]">●</span> Data & Infrastructure
              </h3>
              <p>
                A base que sustenta nosso crescimento. Um ambiente dedicado à engenharia e governança de dados, onde gerenciamos acessos corporativos (Identity), enriquecimento e higienização de bases, além de utilitários técnicos essenciais para a conciliação e estruturação da informação.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-black mb-4">Tecnologia e Escalabilidade</h3>
            <p>
              Desenvolvido sob uma stack tecnológica robusta e hospedado em infraestrutura de ponta (Vercel), este portal foi desenhado não apenas para atender às demandas atuais da Carbon Capital, mas para <span className="text-black font-semibold">escalar continuamente</span>. Ele permite a rápida integração de novos micro-serviços e produtos à medida que a empresa cresce e inova.
            </p>
          </div>

          <div className="text-center pt-8">
            <p className="text-2xl font-bold text-black tracking-wide">
              Trabalhando de forma inteligente. Decidindo com base em dados.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-[#fafafa] py-16 mt-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1 */}
            <div>
              <div className="text-xl font-bold tracking-wider mb-4">DEVELOPER HUB</div>
              <p className="text-sm text-[#666666] leading-relaxed">
                Centralize o acesso aos seus projetos Full Stack hospedados na Vercel
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5 text-black">PROJETOS</div>
              <div className="space-y-3">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="block text-sm text-[#666666] hover:text-[#00d2c7] transition-colors text-left"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5 text-black">ESTATÍSTICAS</div>
              <div className="space-y-3 text-sm text-[#666666]">
                <div>{stats.totalProjects} Projetos Totais</div>
                <div>{stats.activeProjects} Online</div>
                <div>100% Disponibilidade</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-black/10 text-center text-sm text-[#999999] tracking-wider">
            <p>© 2026 DEVELOPER HUB · DESENVOLVIDO POR LEONARDO MOURA</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Componente de vídeo alternado
function VideoBackgroundCard() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const videos = [
    '/videos/nodes-3.mp4',
    '/videos/nodes-4.mp4'
  ]

  const handleVideoEnd = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % 2)
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <div className="relative w-full h-full">
      <video
        key={currentVideo}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        preload="auto"
        className={`w-full h-full object-cover scale-110 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
      
      {/* Gradient overlay - transição suave */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20 pointer-events-none"></div>
      
      {/* Video indicator */}
      <div className="absolute bottom-8 right-8 flex gap-3 backdrop-blur-sm bg-white/20 px-5 py-3 rounded-full border border-white/30">
        <div className={`w-3 h-3 rounded-full transition-all ${currentVideo === 0 ? 'bg-[#00d2c7] animate-pulse' : 'bg-black/30'}`}></div>
        <div className={`w-3 h-3 rounded-full transition-all ${currentVideo === 1 ? 'bg-[#00d2c7] animate-pulse' : 'bg-black/30'}`}></div>
      </div>
    </div>
  )
}
