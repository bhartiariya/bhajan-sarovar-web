'use client'

import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePlayerStore } from '@/store/player-store'

interface ContentCardProps {
  item: {
    id: string
    title: string
    artist?: string
    image: string
    type: string
  } | undefined
  onPlay?: () => void
  onClick?: () => void
}

export function ContentCard({ item, onPlay, onClick }: ContentCardProps) {
  const { currentSong } = usePlayerStore()
  const router = useRouter()
  
  // Safety check for undefined item
  if (!item) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-32 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-1" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    )
  }
  
  const isPlaying = currentSong?.id === item.id
  
  const handleClick = () => {
    console.log('ContentCard clicked:', { type: item.type, id: item.id })
    
    if (onClick) {
      onClick()
    } else if (item.type === 'playlist') {
      console.log('Navigating to playlist:', `/playlist/${item.id}`)
      router.push(`/playlist/${item.id}`)
    } else if (item.type === 'artist') {
      console.log('Navigating to artist:', `/artist/${item.id}`)
      router.push(`/artist/${item.id}`)
    } else if (onPlay) {
      onPlay()
    }
  }

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="relative">
        <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden mb-2">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🎵</span>
            </div>
          )}
        </div>
        
        {/* Play Button Overlay - only show for songs */}
        {item.type === 'song' && onPlay && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPlay()
              }}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
        {item.artist && (
          <p className="text-sm text-gray-600 truncate">{item.artist}</p>
        )}
      </div>
    </div>
  )
}
