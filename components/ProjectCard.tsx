'use client'

import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface Project {
  id: string
  name: string
  description: string
  url: string
  status: 'online' | 'maintenance'
  category: string
  tags: string[]
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleProjectAccess = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)

    console.log('🎯 [HUB] CLIQUE DETECTADO! Projeto:', project.name)

    try {
      console.log('🔑 [HUB] Gerando token SSO...')
      
      // Get SSO token from the hub
      const response = await fetch('/api/auth/sso-token')
      
      console.log('📡 [HUB] Resposta da API:', response.status, response.ok)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ [HUB] Erro da API:', errorData)
        throw new Error('Falha ao gerar token SSO: ' + (errorData.error || response.statusText))
      }

      const data = await response.json()
      console.log('✅ [HUB] Token gerado com sucesso!')
      console.log('👤 [HUB] Usuário:', data.user)
      console.log('🔐 [HUB] Token (primeiros 50 chars):', data.token.substring(0, 50) + '...')
      
      // Add SSO token to project URL
      const projectUrl = new URL(project.url)
      projectUrl.searchParams.set('sso_token', data.token)
      projectUrl.searchParams.set('hub_origin', window.location.origin)
      
      const finalUrl = projectUrl.toString()
      console.log('🌐 [HUB] URL completa construída')
      console.log('📍 [HUB] URL (primeiros 150 chars):', finalUrl.substring(0, 150) + '...')
      console.log('🚀 [HUB] Abrindo nova aba...')
      
      // Open project in new tab with SSO token
      const newWindow = window.open(finalUrl, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        console.log('✅ [HUB] Nova aba aberta com sucesso!')
      } else {
        console.warn('⚠️ [HUB] Popup bloqueado pelo navegador!')
      }
    } catch (error) {
      console.error('❌ [HUB] ERRO COMPLETO:', error)
      console.error('❌ [HUB] Tipo do erro:', typeof error)
      console.error('❌ [HUB] Stack:', error instanceof Error ? error.stack : 'N/A')
      
      // Fallback: open without SSO if there's an error
      console.log('🔄 [HUB] Abrindo sem SSO (fallback)...')
      window.open(project.url, '_blank', 'noopener,noreferrer')
    } finally {
      setIsLoading(false)
      console.log('🏁 [HUB] Processo finalizado')
    }
  }

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        "border-grey bg-white backdrop-blur-sm",
        "hover:border-cyano/50 hover:shadow-cyano/20"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-bold text-black group-hover:text-cyano transition-colors">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={project.status === 'online' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  project.status === 'online' 
                    ? "bg-cyano text-white" 
                    : "bg-orange-500 text-white"
                )}
              >
                {project.status === 'online' ? '● Online' : '● Manutenção'}
              </Badge>
              <Badge variant="outline" className="text-xs border-grey text-cyano">
                {project.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-grey"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <a
          href={project.url}
          onClick={handleProjectAccess}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md",
            "bg-cyano text-white font-semibold text-sm",
            "transition-all duration-200",
            "hover:bg-cyano/90 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "group-hover:shadow-lg group-hover:shadow-cyano/30",
            isLoading && "opacity-50 cursor-wait"
          )}
        >
          {isLoading ? 'Acessando...' : 'Acessar Projeto'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyano/5 via-transparent to-transparent" />
      </div>
    </Card>
  )
}
