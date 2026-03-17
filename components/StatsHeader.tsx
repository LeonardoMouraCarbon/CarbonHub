'use client'

import { Activity, Code2, Github, Linkedin, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsHeaderProps {
  totalProjects: number
  activeProjects: number
  githubUrl?: string
  linkedinUrl?: string
  docsUrl?: string
}

export function StatsHeader({ 
  totalProjects, 
  activeProjects,
  githubUrl,
  linkedinUrl,
  docsUrl
}: StatsHeaderProps) {
  const stats = [
    {
      label: 'Total de Projetos',
      value: totalProjects,
      icon: Code2,
      color: 'text-cyano'
    },
    {
      label: 'Projetos Ativos',
      value: activeProjects,
      icon: Activity,
      color: 'text-green-400'
    }
  ]

  const links = [
    { 
      label: 'GitHub', 
      url: githubUrl || '#', 
      icon: Github,
      color: 'hover:text-cyano'
    },
    { 
      label: 'LinkedIn', 
      url: linkedinUrl || '#', 
      icon: Linkedin,
      color: 'hover:text-blue-400'
    },
    { 
      label: 'Docs', 
      url: docsUrl || '#', 
      icon: FileText,
      color: 'hover:text-cyano'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label}
            className="border-grey bg-white shadow-sm hover:border-cyano/50 hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <p className={cn("text-3xl font-bold", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn("p-3 rounded-lg bg-gray-100", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Quick Links Card */}
        <Card className="border-grey bg-white shadow-sm md:col-span-2">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-4">
              Links Rápidos
            </p>
            <div className="flex gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md",
                    "bg-gray-100 text-gray-700 text-sm font-medium",
                    "border border-grey",
                    "transition-all duration-200",
                    link.color,
                    "hover:border-current hover:scale-105"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
