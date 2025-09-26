export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLoginAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  audioQuality: 'low' | 'medium' | 'high'
  autoPlay: boolean
  selectedArtists?: string[]
  selectedCategories?: string[]
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: string
  favoriteArtists: string[]
  favoriteCategories: string[]
  preferences: {
    selectedArtists: string[]
    selectedCategories: string[]
  }
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Song {
  id: string
  name: string
  type: string
  album: string
  year: string
  releaseDate?: string
  duration: string
  label: string
  artists: string
  artistsId: string
  featuredArtists: string
  featuredArtistsId: string
  explicitContent: number
  playCount: string
  language: string
  hasLyrics: string
  url: string
  copyright: string
  image: string
  downloadUrl: string
}

export interface Bhajan {
  id: string
  filename: string
  title: string
  artist: string
  category?: string
  s3Url: string
  thumbnail?: string
  fileSize: number
  searchKeywords: string[]
  isActive: boolean
  playCount: number
  uploadDate?: Date
  uploadedBy?: string
  uploadedByRole?: string
  createdAt: Date
  updatedAt: Date
}

export interface Artist {
  id: string
  name: string
  songCount: number
  songs: string[]
  categories: string[]
  totalDuration: number
  genres: string[]
  monthlyListeners: number
  isVerified: boolean
  socialLinks: Record<string, any>
  bio: string
  image?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  displayName: string
  songCount: number
  songs: string[]
  artists: string[]
  totalDuration: number
  description: string
  image?: string
  color?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Playlist {
  id: string
  name: string
  description?: string
  songs: string[]
  isPublic: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  image?: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  repeatMode: 'none' | 'one' | 'all'
  shuffleMode: boolean
  currentIndex: number
  queue: Song[]
  currentSong: Song | null
}

export interface AudioPlayerActions {
  play: () => void
  pause: () => void
  stop: () => void
  skipToNext: () => void
  skipToPrevious: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void
  setShuffleMode: (enabled: boolean) => void
  loadTrack: (song: Song) => void
  loadPlaylist: (songs: Song[], startIndex?: number) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadState {
  isUploading: boolean
  progress: UploadProgress | null
  error: string | null
}

export interface SearchFilters {
  category?: string
  artist?: string
  language?: string
  duration?: {
    min?: number
    max?: number
  }
  dateRange?: {
    start?: Date
    end?: Date
  }
}

export interface SearchResult {
  songs: Song[]
  artists: Artist[]
  playlists: Playlist[]
  total: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
