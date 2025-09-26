'use client'

import { useTabStore } from '@/store/tab-store'

interface ArtistCardProps {
  artist: {
    id: string
    name: string
    image: string
    songCount: number
  }
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { setCurrentTab } = useTabStore()

  const handleArtistClick = () => {
    // Navigate to artist details - for now just go to search
    setCurrentTab(1)
  }

  return (
    <div className="group cursor-pointer" onClick={handleArtistClick}>
      <div className="relative">
        <div className="w-full h-32 bg-surface-variant rounded-lg overflow-hidden mb-2">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🎤</span>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-text-primary truncate">{artist.name}</h4>
        <p className="text-sm text-text-secondary">{artist.songCount} songs</p>
      </div>
    </div>
  )
}
