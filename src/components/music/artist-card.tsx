'use client'

import { useRouter } from 'next/navigation'

interface ArtistCardProps {
  artist: {
    id: string
    name: string
    image: string
    songCount: number
  }
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const router = useRouter()

  const handleArtistClick = () => {
    router.push(`/artist/${artist.id}`)
  }

  return (
    <div className="group cursor-pointer" onClick={handleArtistClick}>
      <div className="relative">
        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-2 mx-auto">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🎤</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <h4 className="font-medium text-gray-900 truncate">{artist.name}</h4>
        <p className="text-sm text-gray-600">{artist.songCount} songs</p>
      </div>
    </div>
  )
}
