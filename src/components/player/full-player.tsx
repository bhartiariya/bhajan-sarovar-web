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
  X,
  Download,
  Share2,
  List,
  ChevronDown
} from 'lucide-react'
import { usePlayerStore } from '@/store/player-store'
import { useAuthStore } from '@/store/auth-store'
import { formatDuration } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export function FullPlayer() {
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
    queue,
    currentIndex,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    setVolume,
    setRepeatMode,
    setShuffleMode,
    seek,
    hideFullPlayer,
  } = usePlayerStore()

  const [isLiked, setIsLiked] = useState(false)
  const [isQueueVisible, setIsQueueVisible] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={hideFullPlayer}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h3 className="text-white text-sm font-medium">Now Playing</h3>
            <p className="text-gray-400 text-xs">From {currentSong.album || 'Unknown Album'}</p>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
          {/* Album Art */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl group">
            {currentSong.image ? (
              <img
                src={currentSong.image}
                alt={currentSong.name}
                className="w-full h-full object-cover album-art-hover"
              />
            ) : (
              <div className="w-full h-full music-player-gradient flex items-center justify-center">
                <span className="text-white font-bold text-4xl sm:text-6xl">🎵</span>
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="text-center mb-6 sm:mb-8 max-w-md px-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
              {currentSong.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-1 truncate">
              {currentSong.artists}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {currentSong.album} • {currentSong.year}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-6 sm:mb-8 px-4">
            <div 
              className="w-full h-1 bg-gray-700 rounded-full cursor-pointer progress-bar-hover" 
              onClick={handleProgressClick} 
              ref={progressRef}
            >
              <div
                className="h-full music-player-gradient rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Shuffle Button */}
            <button
              onClick={handleShuffleToggle}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                shuffleMode 
                  ? 'text-orange-500 bg-orange-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={skipToPrevious}
              className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <SkipBack className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="p-3 sm:p-4 music-player-gradient text-white rounded-full hover:music-player-glow transition-all duration-200 shadow-2xl play-button-animation"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5 sm:ml-1" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={skipToNext}
              className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <SkipForward className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Repeat Button */}
            <button
              onClick={handleRepeatMode}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                repeatMode !== 'none' 
                  ? 'text-orange-500 bg-orange-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Repeat className={`w-5 h-5 sm:w-6 sm:h-6 ${repeatMode === 'one' ? 'text-orange-500' : ''}`} />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-3 sm:space-x-6 mt-6 sm:mt-8">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Heart 
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} 
              />
            </button>

            <button className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => setIsQueueVisible(!isQueueVisible)}
              className="p-2 sm:p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <List className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center space-x-4 max-w-md mx-auto">
            <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
              {volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
              }}
            />
          </div>
        </div>

        {/* Queue Sidebar */}
        {isQueueVisible && (
          <div className="absolute right-0 top-0 h-full w-72 sm:w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <div className="p-3 sm:p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm sm:text-base">Queue</h3>
                <button
                  onClick={() => setIsQueueVisible(false)}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-1 sm:p-2">
              {queue.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentIndex 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <span className="text-white text-xs">🎵</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-xs sm:text-sm">
                      {song.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artists}
                    </p>
                  </div>
                  
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {song.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
