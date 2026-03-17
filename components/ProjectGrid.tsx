'use client'

import { ProjectCard, type Project } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-black">Nenhum projeto encontrado</h3>
          <p className="text-gray-600 text-sm">
            Tente ajustar seus filtros ou termo de busca
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
