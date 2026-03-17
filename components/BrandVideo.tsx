'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandVideoProps {
  videoUrl?: string
  title?: string
  description?: string
}

export function BrandVideo({ 
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title = 'Sobre Nossa Empresa',
  description = 'Conheça mais sobre nossa marca e nossos valores'
}: BrandVideoProps) {
  return (
    <Card className={cn(
      "border-grey bg-white shadow-lg hover:shadow-xl transition-all duration-300",
      "hover:border-cyano/50"
    )}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyano/10">
            <Play className="w-5 h-5 text-cyano" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-black">
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border border-grey">
          <iframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>🎥 Vídeo institucional</span>
          <span>Assista em HD</span>
        </div>
      </CardContent>
    </Card>
  )
}
