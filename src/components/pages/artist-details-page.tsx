'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTabStore } from '@/store/tab-store'
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
  Music,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Globe
} from 'lucide-react'
import { SkeletonPlaylistHeader, SkeletonSongList } from '@/components/ui/skeleton'
import { PlayButton, IconButton, ActionButton } from '@/components/ui/action-button'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'
import { Tabs } from '@/components/ui/tabs'
import { Artist, Song } from '@/types'
import { artistService } from '@/services/artist-service'
import { songService } from '@/services/song-service'
import { usePlayerStore } from '@/store/player-store'
import { formatDuration } from '@/lib/utils'

interface ArtistDetailsPageProps {
  artistId?: string
}

export function ArtistDetailsPage({ artistId: propArtistId }: ArtistDetailsPageProps) {
  const params = useParams()
  const router = useRouter()
  const { setCurrentTab } = useTabStore()
  const artistId = propArtistId || params?.id as string
  
  const [artist, setArtist] = useState<Artist | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'about'>('songs')
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
    if (artistId) {
      loadArtistData()
    }
  }, [artistId])

  const loadArtistData = async () => {
    try {
      setIsLoading(true)
      const artistData = await artistService.fetchArtistById(artistId)
      
      if (artistData) {
        setArtist(artistData)
        
        // Load songs for the artist
        const artistSongs = await songService.fetchSongsByArtist(artistId)
        setSongs(artistSongs)
      }
    } catch (error) {
      console.error('Error loading artist:', error)
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleDownload = () => {
    // Implement download functionality
    console.log('Download artist songs')
  }

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: artist?.name,
        text: `Check out ${artist?.name} on Bhajan Sarovar`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
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

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background-primary">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Music className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Artist not found</h2>
            <p className="text-text-secondary">The artist you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleBackClick = () => {
    setCurrentTab(0) // Go back to home page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background-primary">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="relative z-20 p-6 pt-16">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Artist Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center">
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Music className="w-24 h-24 text-white" />
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0 text-white">
              <div className="mb-2">
                <span className="text-sm font-medium uppercase tracking-wider">
                  {artist.isVerified && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>Verified Artist</span>
                    </div>
                  )}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {artist.name}
              </h1>
              
              {artist.bio && (
                <p className="text-lg text-gray-300 mb-4 max-w-2xl">
                  {artist.bio}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{artist.monthlyListeners.toLocaleString()} monthly listeners</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{songs.length} songs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                {artist.genres.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span>Genres: {artist.genres.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {Object.keys(artist.socialLinks).length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  {Object.entries(artist.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}

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

                <ActionButton
                  onClick={handleFollow}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="md"
                >
                  {isFollowing ? (
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-current" />
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

      {/* Tabs */}
      <div className="px-6 pb-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg">
          <Tabs
            tabs={[
              {
                id: 'songs',
                label: 'Songs',
                count: songs.length,
                content: (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-text-primary">Popular Songs ({songs.length})</h2>
                    </div>

                    {songs.length === 0 ? (
                      <div className="text-center py-12">
                        <Music className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-text-primary mb-2">No songs yet</h3>
                        <p className="text-text-secondary">This artist hasn't uploaded any songs yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-text-secondary border-b border-white/10">
                          <div className="col-span-1 text-center">#</div>
                          <div className="col-span-5">Title</div>
                          <div className="col-span-3">Album</div>
                          <div className="col-span-2">Date Added</div>
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
                              {song.album}
                            </div>

                            <div className="col-span-2 text-text-secondary">
                              {song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'Unknown'}
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
                )
              },
              {
                id: 'albums',
                label: 'Albums',
                count: 0,
                content: (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">No albums yet</h3>
                    <p className="text-text-secondary">This artist hasn't released any albums yet.</p>
                  </div>
                )
              },
              {
                id: 'about',
                label: 'About',
                content: (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-4">About {artist.name}</h3>
                      {artist.bio ? (
                        <p className="text-text-secondary leading-relaxed">{artist.bio}</p>
                      ) : (
                        <p className="text-text-secondary">No biography available.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-text-primary mb-3">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {artist.genres.length > 0 ? (
                            artist.genres.map((genre, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                              >
                                {genre}
                              </span>
                            ))
                          ) : (
                            <span className="text-text-secondary">No genres specified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-text-primary mb-3">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {artist.categories.length > 0 ? (
                            artist.categories.map((category, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-surface-variant text-text-primary rounded-full text-sm"
                              >
                                {category}
                              </span>
                            ))
                          ) : (
                            <span className="text-text-secondary">No categories specified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <StatsGrid
                      stats={[
                        {
                          title: 'Songs',
                          value: songs.length,
                          icon: <Music className="w-5 h-5" />
                        },
                        {
                          title: 'Monthly Listeners',
                          value: artist.monthlyListeners.toLocaleString(),
                          icon: <Users className="w-5 h-5" />
                        },
                        {
                          title: 'Total Duration',
                          value: formatDuration(totalDuration),
                          icon: <Clock className="w-5 h-5" />
                        }
                      ]}
                      columns={3}
                    />
                  </div>
                )
              }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  )
}
