'use client'

import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { usePlayerStore } from '@/store/player-store'
import { formatDuration } from '@/lib/utils'

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    isPaused,
    currentTime,
    duration,
    volume,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    setVolume,
    showFullPlayer,
  } = usePlayerStore()

  if (!currentSong) return null

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 bg-white border-t border-border-light shadow-lg">
      <div className="flex items-center p-3 space-x-3">
        {/* Song Image */}
        <div className="w-12 h-12 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
          {currentSong.image ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">🎵</span>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-text-primary truncate">
            {currentSong.title}
          </h4>
          <p className="text-sm text-text-secondary truncate">
            {currentSong.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={skipToPrevious}
            className="p-2 rounded-full hover:bg-surface-variant transition-colors"
          >
            <SkipBack className="w-4 h-4 text-text-primary" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          <button
            onClick={skipToNext}
            className="p-2 rounded-full hover:bg-surface-variant transition-colors"
          >
            <SkipForward className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-text-secondary" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Expand Button */}
        <button
          onClick={showFullPlayer}
          className="p-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-3 pb-2">
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <span>{formatDuration(currentTime)}</span>
          <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  )
}
