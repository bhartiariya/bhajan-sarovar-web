import { create } from 'zustand'
import { Song, AudioPlayerState, AudioPlayerActions } from '@/types'
import { audioService } from '@/services/audio-service'

interface PlayerState extends AudioPlayerState, AudioPlayerActions {
  // Additional player-specific state
  isMiniPlayerVisible: boolean
  isFullPlayerVisible: boolean
  queue: Song[]
  currentSong: Song | null
  currentIndex: number
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'
  
  // Actions
  setCurrentSong: (song: Song | null) => void
  setQueue: (songs: Song[]) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  setCurrentIndex: (index: number) => void
  setShuffled: (shuffled: boolean) => void
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void
  showMiniPlayer: () => void
  hideMiniPlayer: () => void
  showFullPlayer: () => void
  hideFullPlayer: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  repeatMode: 'none',
  shuffleMode: false,
  currentIndex: 0,
  queue: [],
  currentSong: null,
  isMiniPlayerVisible: false,
  isFullPlayerVisible: false,
  isShuffled: false,

  // Player actions
  play: () => {
    audioService.play()
    set({ isPlaying: true, isPaused: false })
  },

  pause: () => {
    audioService.pause()
    set({ isPlaying: false, isPaused: true })
  },

  stop: () => {
    audioService.stop()
    set({ isPlaying: false, isPaused: false, currentTime: 0 })
  },

  skipToNext: () => {
    const { queue, currentIndex, isShuffled } = get()
    if (queue.length === 0) return

    let nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      nextIndex = 0
    }

    const nextSong = queue[nextIndex]
    set({ currentIndex: nextIndex, currentSong: nextSong })
    audioService.loadTrack(nextSong)
  },

  skipToPrevious: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return

    let prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = queue.length - 1
    }

    const prevSong = queue[prevIndex]
    set({ currentIndex: prevIndex, currentSong: prevSong })
    audioService.loadTrack(prevSong)
  },

  seek: (time: number) => {
    audioService.seek(time)
    set({ currentTime: time })
  },

  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audioService.setVolume(clampedVolume)
    set({ volume: clampedVolume })
  },

  setRepeatMode: (mode: 'none' | 'one' | 'all') => {
    set({ repeatMode: mode })
  },

  setShuffleMode: (enabled: boolean) => {
    set({ shuffleMode: enabled, isShuffled: enabled })
  },

  loadTrack: async (song: Song) => {
    console.log('🎵 Player store loading track:', song.name)
    set({ isLoading: true, currentSong: song, isMiniPlayerVisible: true })
    try {
      await audioService.loadTrack(song)
      const duration = audioService.getDuration()
      console.log('✅ Track loaded, duration:', duration)
      set({ duration, isLoading: false })
    } catch (error) {
      console.error('❌ Failed to load track:', error)
      set({ isLoading: false })
      // You could add error state here if needed
    }
  },

  loadPlaylist: (songs: Song[], startIndex = 0) => {
    set({ 
      queue: songs, 
      currentIndex: startIndex, 
      currentSong: songs[startIndex] || null,
      isMiniPlayerVisible: songs.length > 0
    })
    
    if (songs[startIndex]) {
      audioService.loadTrack(songs[startIndex])
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get()
    set({ queue: [...queue, song] })
  },

  removeFromQueue: (index: number) => {
    const { queue, currentIndex } = get()
    const newQueue = queue.filter((_, i) => i !== index)
    let newCurrentIndex = currentIndex

    if (index < currentIndex) {
      newCurrentIndex = currentIndex - 1
    } else if (index === currentIndex && newQueue.length > 0) {
      newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
    }

    set({ 
      queue: newQueue, 
      currentIndex: newCurrentIndex,
      currentSong: newQueue[newCurrentIndex] || null
    })
  },

  // Additional actions
  setCurrentSong: (song: Song | null) => {
    set({ currentSong: song, isMiniPlayerVisible: !!song })
  },

  setQueue: (songs: Song[]) => {
    set({ queue: songs })
  },

  setCurrentIndex: (index: number) => {
    const { queue } = get()
    set({ 
      currentIndex: index, 
      currentSong: queue[index] || null 
    })
  },

  setShuffled: (shuffled: boolean) => {
    set({ isShuffled: shuffled, shuffleMode: shuffled })
  },

  showMiniPlayer: () => set({ isMiniPlayerVisible: true }),
  hideMiniPlayer: () => set({ isMiniPlayerVisible: false }),
  showFullPlayer: () => set({ isFullPlayerVisible: true }),
  hideFullPlayer: () => set({ isFullPlayerVisible: false }),

  // Missing methods for the interface
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setPaused: (paused: boolean) => set({ isPaused: paused }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
}))

// Initialize audio service listeners
audioService.addListener((event, data) => {
  const state = usePlayerStore.getState()
  
  switch (event) {
    case 'loaded':
      console.log('✅ Track loaded in player store')
      state.setLoading(false)
      break
    case 'play':
      console.log('▶️ Track playing in player store')
      state.setLoading(false)
      state.setPlaying(true)
      state.setPaused(false)
      break
    case 'pause':
      console.log('⏸️ Track paused in player store')
      state.setPlaying(false)
      state.setPaused(true)
      break
    case 'stop':
      console.log('⏹️ Track stopped in player store')
      state.setPlaying(false)
      state.setPaused(false)
      state.setCurrentTime(0)
      break
    case 'end':
      console.log('🔚 Track ended in player store')
      // Handle repeat modes
      if (state.repeatMode === 'one') {
        audioService.seek(0)
        audioService.play()
      } else if (state.repeatMode === 'all') {
        state.skipToNext()
      } else {
        state.setPlaying(false)
        state.setPaused(false)
      }
      break
    case 'seek':
      state.setCurrentTime(audioService.getCurrentTime())
      break
    case 'volume':
      state.setVolume(audioService.getVolume())
      break
    case 'loaderror':
      console.error('❌ Track load error in player store:', data)
      state.setLoading(false)
      break
  }
})

// Update current time periodically when playing
setInterval(() => {
  const state = usePlayerStore.getState()
  if (state.isPlaying && audioService.isPlaying()) {
    const currentTime = audioService.getCurrentTime()
    if (currentTime !== state.currentTime) {
      state.setCurrentTime(currentTime)
    }
  }
}, 1000)
