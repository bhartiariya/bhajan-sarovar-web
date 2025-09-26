'use client'

interface PlaylistCardProps {
  playlist: {
    id: string
    name: string
    description: string
    image: string
    songCount: number
  }
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative">
        <div className="w-full h-40 bg-surface-variant rounded-lg overflow-hidden mb-2">
          {playlist.image ? (
            <img
              src={playlist.image}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-3xl">📀</span>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-text-primary truncate">{playlist.name}</h4>
        <p className="text-sm text-text-secondary truncate">{playlist.description}</p>
        <p className="text-xs text-text-secondary mt-1">{playlist.songCount} songs</p>
      </div>
    </div>
  )
}
