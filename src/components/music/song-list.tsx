'use client'

import { Play, MoreHorizontal } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface SongListProps {
  songs: Array<{
    id: string
    title: string
    artist: string
    duration: number
    image: string
  }>
  onPlay: (song: any) => void
}

export function SongList({ songs, onPlay }: SongListProps) {
  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-variant transition-colors group"
        >
          {/* Index */}
          <div className="w-6 text-center text-text-secondary text-sm">
            {index + 1}
          </div>

          {/* Song Image */}
          <div className="w-10 h-10 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
            {song.image ? (
              <img
                src={song.image}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">🎵</span>
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-text-primary truncate">{song.title}</h4>
            <p className="text-sm text-text-secondary truncate">{song.artist}</p>
          </div>

          {/* Duration */}
          <div className="text-sm text-text-secondary">
            {formatDuration(song.duration)}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onPlay(song)}
              className="p-2 rounded-full hover:bg-surface-primary transition-colors"
            >
              <Play className="w-4 h-4 text-text-primary" />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-primary transition-colors">
              <MoreHorizontal className="w-4 h-4 text-text-primary" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
