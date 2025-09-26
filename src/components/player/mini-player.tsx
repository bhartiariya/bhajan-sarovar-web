'use client'

import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { usePlayerStore } from '@/store/player-store'
import { useAuthStore } from '@/store/auth-store'
import { formatDuration } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export function MiniPlayer() {
  const { user } = useAuthStore()
  const {
    currentSong,
    isPlaying,
    isPaused,
    currentTime,
    duration,
    volume,
    repeatMode,
    shuffleMode,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    setVolume,
    setRepeatMode,
    setShuffleMode,
    seek,
    showFullPlayer,
  } = usePlayerStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // Always show the player bar, even when no song is playing
  // This ensures the fixed bottom bar is always visible

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width
    const newTime = percentage * duration
    
    seek(newTime)
  }

  const handleRepeatMode = () => {
    const modes = ['none', 'one', 'all'] as const
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }

  const handleShuffleToggle = () => {
    setShuffleMode(!shuffleMode)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Main Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 player-backdrop border-t border-gray-200 music-player-shadow" style={{ height: '80px' }}>
        {/* Progress Bar - Always visible */}
        <div className="w-full h-1 bg-gray-200 cursor-pointer progress-bar-hover" onClick={handleProgressClick} ref={progressRef}>
          <div
            className="h-full music-player-gradient transition-all duration-200 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between px-2 sm:px-4 h-full">
          {/* Left Section - Song Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Song Image */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-lg group">
              {currentSong?.image ? (
                <img
                  src={currentSong.image}
                  alt={currentSong.name}
                  className="w-full h-full object-cover album-art-hover"
                />
              ) : (
                <div className="w-full h-full music-player-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">🎵</span>
                </div>
              )}
            </div>

            {/* Song Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate text-xs sm:text-sm group-hover:text-orange-600 transition-colors">
                {currentSong?.name || 'No song selected'}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                {currentSong?.artists || 'Choose a song to play'}
              </p>
            </div>

            {/* Like Button - Hidden on mobile */}
            {currentSong && (
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="hidden sm:block p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                />
              </button>
            )}
          </div>

          {/* Center Section - Main Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Shuffle Button - Hidden on mobile */}
            <button
              onClick={handleShuffleToggle}
              className={`hidden sm:block p-2 rounded-full transition-colors ${
                shuffleMode 
                  ? 'text-orange-500 bg-orange-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous Button */}
            <button
              onClick={skipToPrevious}
              disabled={!currentSong}
              className={`p-1.5 sm:p-2 rounded-full transition-colors button-hover-scale ${
                currentSong 
                  ? 'hover:bg-gray-100' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              disabled={!currentSong}
              className={`p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl play-button-animation ${
                currentSong 
                  ? 'music-player-gradient text-white hover:music-player-glow' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={skipToNext}
              disabled={!currentSong}
              className={`p-1.5 sm:p-2 rounded-full transition-colors button-hover-scale ${
                currentSong 
                  ? 'hover:bg-gray-100' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Repeat Button - Hidden on mobile */}
            <button
              onClick={handleRepeatMode}
              className={`hidden sm:block p-2 rounded-full transition-colors ${
                repeatMode !== 'none' 
                  ? 'text-orange-500 bg-orange-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Repeat className={`w-4 h-4 ${repeatMode === 'one' ? 'text-orange-500' : ''}`} />
            </button>
          </div>

          {/* Right Section - Volume & More */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-end">
            {/* Time Display - Hidden on mobile */}
            <div className="hidden sm:block text-xs text-gray-600 font-mono">
              {currentSong ? `${formatDuration(currentTime)} / ${formatDuration(duration)}` : '--:-- / --:--'}
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setIsVolumeVisible(!isVolumeVisible)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {volume === 0 ? (
                  <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                ) : (
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                )}
              </button>
              
              {isVolumeVisible && (
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              )}
            </div>

            {/* More Options - Hidden on mobile */}
            <button className="hidden sm:block p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>

            {/* Expand Button */}
            <button
              onClick={showFullPlayer}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  )
}
