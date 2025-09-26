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
    <div className="fixed bottom-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
      <div className="flex items-center p-4 space-x-4">
        {/* Song Image */}
        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
          {currentSong.image ? (
            <img
              src={currentSong.image}
              alt={currentSong.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎵</span>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate text-sm">
            {currentSong.name}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {currentSong.artists}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={skipToPrevious}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={skipToNext}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Expand Button */}
        <button
          onClick={showFullPlayer}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center space-x-3 text-xs text-gray-600">
          <span>{formatDuration(currentTime)}</span>
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  )
}
