'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Play, 
  Pause, 
  Shuffle, 
  Repeat, 
  Heart, 
  MoreHorizontal, 
  Download, 
  Share2,
  Clock,
  User,
  Calendar,
  Music,
  Plus,
  Check
} from 'lucide-react'
import { SkeletonPlaylistHeader, SkeletonSongList } from '@/components/ui/skeleton'
import { PlayButton, IconButton, ActionButton } from '@/components/ui/action-button'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'
import { Playlist, Song } from '@/types'
import { playlistService } from '@/services/playlist-service'
import { songService } from '@/services/song-service'
import { usePlayerStore } from '@/store/player-store'
import { formatDuration } from '@/lib/utils'

interface PlaylistDetailsPageProps {
  playlistId?: string
}

export function PlaylistDetailsPage({ playlistId: propPlaylistId }: PlaylistDetailsPageProps) {
  const params = useParams()
  const router = useRouter()
  const playlistId = propPlaylistId || params?.id as string
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showAllSongs, setShowAllSongs] = useState(true)
  
  const { 
    currentSong, 
    isPlaying, 
    queue, 
    loadPlaylist, 
    play, 
    pause, 
    setShuffled, 
    isShuffled,
    repeatMode,
    setRepeatMode
  } = usePlayerStore()

  useEffect(() => {
    if (playlistId) {
      loadPlaylistData()
    }
  }, [playlistId])

  const loadPlaylistData = async () => {
    try {
      setIsLoading(true)
      console.log('🎵 Loading playlist data for ID:', playlistId)
      const playlistData = await playlistService.fetchPlaylistById(playlistId)
      console.log('🎵 Playlist data:', playlistData)
      
      if (playlistData) {
        setPlaylist(playlistData)
        
        // Load songs for the playlist
        if (playlistData.songs && playlistData.songs.length > 0) {
          console.log('🎵 Playlist has songs:', playlistData.songs.length, 'song IDs:', playlistData.songs)
          // Fetch songs by their IDs for better performance
          const playlistSongs = await songService.fetchSongsByIds(playlistData.songs)
          console.log('🎵 Fetched songs:', playlistSongs.length, 'songs')
          setSongs(playlistSongs)
        } else {
          console.log('🎵 Playlist has no songs or empty songs array')
          // Fallback: try to fetch songs by playlist name
          console.log('🎵 Trying fallback: fetching songs by playlist name...')
          const playlistSongs = await songService.fetchSongsByPlaylistName(playlistData.name)
          console.log('🎵 Fetched songs by name:', playlistSongs.length, 'songs')
          
          // If still no songs, try fetching some random songs as a last resort
          if (playlistSongs.length === 0) {
            console.log('🎵 No songs found by name, fetching random songs as fallback...')
            const randomSongs = await songService.fetchRandomSongs(20)
            console.log('🎵 Fetched random songs:', randomSongs.length, 'songs')
            setSongs(randomSongs)
          } else {
            setSongs(playlistSongs)
          }
        }
      } else {
        console.log('🎵 No playlist data found')
      }
    } catch (error) {
      console.error('Error loading playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = () => {
    if (songs.length === 0) return
    
    if (currentSong && queue.length === songs.length) {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    } else {
      loadPlaylist(songs, 0)
      play()
    }
  }

  const handleShuffle = () => {
    setShuffled(!isShuffled)
  }

  const handleRepeat = () => {
    const modes = ['none', 'one', 'all'] as const
    const currentIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setRepeatMode(nextMode)
  }

  const handleSongPlay = (song: Song, index: number) => {
    if (currentSong?.id === song.id && isPlaying) {
      pause()
    } else {
      loadPlaylist(songs, index)
      play()
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleDownload = () => {
    // Implement download functionality
    console.log('Download playlist')
  }

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: playlist?.name,
        text: playlist?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const totalDuration = songs.reduce((total, song) => total + parseInt(song.duration || '0'), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background-primary">
        <SkeletonPlaylistHeader />
        <div className="px-6 pb-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <SkeletonSongList count={10} />
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background-primary">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Music className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Playlist not found</h2>
            <p className="text-text-secondary">The playlist you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background-primary">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="relative z-20 p-6 pt-16">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Playlist Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center">
                {playlist.image ? (
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Music className="w-24 h-24 text-white" />
                )}
              </div>
            </div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0 text-white">
              <div className="mb-2">
                <span className="text-sm font-medium uppercase tracking-wider">
                  {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {playlist.name}
              </h1>
              
              {playlist.description && (
                <p className="text-lg text-gray-300 mb-4 max-w-2xl">
                  {playlist.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Created by {playlist.createdBy || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{songs.length} songs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{playlist.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <PlayButton
                  isPlaying={isPlaying && !!currentSong}
                  onClick={handlePlay}
                  size="lg"
                />

                <IconButton
                  icon={<Shuffle className="w-5 h-5" />}
                  onClick={handleShuffle}
                  active={isShuffled}
                  variant="secondary"
                  size="lg"
                />

                <IconButton
                  icon={<Repeat className="w-5 h-5" />}
                  onClick={handleRepeat}
                  active={repeatMode !== 'none'}
                  variant="secondary"
                  size="lg"
                />

                <IconButton
                  icon={<Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />}
                  onClick={handleLike}
                  active={isLiked}
                  variant="secondary"
                  size="lg"
                />

                <ActionButton
                  onClick={handleFollow}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="md"
                >
                  {isFollowing ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Following
                    </div>
                  ) : (
                    'Follow'
                  )}
                </ActionButton>

                <div className="flex items-center gap-2">
                  <IconButton
                    icon={<Download className="w-5 h-5" />}
                    onClick={handleDownload}
                    variant="secondary"
                    size="lg"
                  />
                  
                  <IconButton
                    icon={<Share2 className="w-5 h-5" />}
                    onClick={handleShare}
                    variant="secondary"
                    size="lg"
                  />
                  
                  <IconButton
                    icon={<MoreHorizontal className="w-5 h-5" />}
                    variant="secondary"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6 pb-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Songs ({songs.length})</h2>
          </div>

          {songs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No songs yet</h3>
              <p className="text-text-secondary">This playlist is empty.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-text-secondary border-b border-white/10">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Artist</div>
                <div className="col-span-2">Album</div>
                <div className="col-span-1 text-right">Duration</div>
              </div>

              {/* Songs */}
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group ${
                    currentSong?.id === song.id ? 'bg-primary/20' : ''
                  }`}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    {currentSong?.id === song.id && isPlaying ? (
                      <div className="w-4 h-4">
                        <div className="w-full h-full bg-primary rounded-sm animate-pulse" />
                      </div>
                    ) : (
                      <span className="text-text-secondary group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    <button
                      onClick={() => handleSongPlay(song, index)}
                      className="hidden group-hover:flex items-center justify-center w-4 h-4"
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="w-4 h-4 text-primary" />
                      ) : (
                        <Play className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </div>

                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-variant rounded flex-shrink-0">
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-medium truncate ${
                        currentSong?.id === song.id ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {song.name}
                      </h4>
                      {song.explicitContent > 0 && (
                        <span className="text-xs text-text-secondary">E</span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 text-text-secondary truncate">
                    {song.artists}
                  </div>

                  <div className="col-span-2 text-text-secondary truncate">
                    {song.album}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <span className="text-text-secondary text-sm">
                      {formatDuration(parseInt(song.duration || '0'))}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded transition-all">
                      <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
