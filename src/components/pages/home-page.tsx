'use client'

import { useQuery } from '@tanstack/react-query'
import { ContentCard } from '@/components/music/content-card'
import { ArtistCard } from '@/components/music/artist-card'
import { usePlayerStore } from '@/store/player-store'
import { useAuthStore } from '@/store/auth-store'
import { songService } from '@/services/song-service'
import { artistService } from '@/services/artist-service'
import { playlistService } from '@/services/playlist-service'
import { personalizationService } from '@/services/personalization-service'
import { Song } from '@/types'
import { UI_CONFIG } from '@/lib/constants'

export function HomePage() {
  const { user, userData } = useAuthStore()
  const { loadTrack } = usePlayerStore()

  // 1. Curated by Editor Section - Always show with lazy loading
  const { data: curatedPlaylists, isLoading: isLoadingCurated } = useQuery({
    queryKey: ['curatedPlaylists'],
    queryFn: () => playlistService.fetchCuratedPlaylists(),
  })

  // 2. For You Section - Personalized content based on user preferences
  const { data: forYouContent, isLoading: isLoadingForYou } = useQuery({
    queryKey: ['forYouContent', user?.uid],
    queryFn: async () => {
      if (!userData) return { artists: [], playlists: [] }
      return personalizationService.getForYouContent(userData)
    },
    enabled: !!user && !!userData,
  })

  // 3. Artists Section - Always show with lazy loading
  const { data: featuredArtists, isLoading: isLoadingFeaturedArtists } = useQuery({
    queryKey: ['featuredArtists'],
    queryFn: () => artistService.fetchFeaturedArtists(UI_CONFIG.FEATURED_ARTISTS_LIMIT),
  })

  // 4. Bhajan Sangrah Section - Always show with lazy loading
  const { data: bhajanSangrahPlaylists, isLoading: isLoadingBhajanSangrah } = useQuery({
    queryKey: ['bhajanSangrahPlaylists'],
    queryFn: () => playlistService.fetchBhajanSangrahPlaylists(),
  })

  // 5. Discover Section (Your Bhajans) - Personalized bhajans based on user preferences
  const { data: personalizedBhajans, isLoading: isLoadingPersonalizedBhajans } = useQuery({
    queryKey: ['personalizedBhajans', user?.uid],
    queryFn: async () => {
      if (!userData) {
        // If no user data, fetch random songs for discover section
        return songService.fetchRandomSongs(12)
      }
      return personalizationService.getPersonalizedBhajans(userData, 12)
    },
    enabled: !!user,
  })

  // 6. Your Playlists Section - Only show if user has playlists
  const { data: userPlaylists, isLoading: isLoadingUserPlaylists } = useQuery({
    queryKey: ['userPlaylists', user?.uid],
    queryFn: () => playlistService.fetchUserPlaylists(user?.uid || ''),
    enabled: !!user,
  })

  // 7. Recently Played Section - Only show if user has recently played songs
  const { data: recentlyPlayedSongs, isLoading: isLoadingRecentlyPlayed } = useQuery({
    queryKey: ['recentlyPlayed', user?.uid],
    queryFn: () => songService.fetchRandomSongs(9), // Fallback to random songs for now
    enabled: !!user,
  })

  // 8. Explore More Section - Always show with lazy loading
  const { data: exploreMorePlaylists, isLoading: isLoadingExploreMore } = useQuery({
    queryKey: ['exploreMorePlaylists'],
    queryFn: () => playlistService.fetchExploreMorePlaylists(),
  })

  const handlePlaySong = (song: Song) => {
    loadTrack(song)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Main Content - No Hero Section, Direct to Content like Flutter App */}
      <div className="px-4 py-6 space-y-8">
        {/* 1. Curated by Editor Section - Always show with lazy loading */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Curated by Editor</h3>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {isLoadingCurated ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))
            ) : (
              curatedPlaylists?.map((playlist) => (
                <div key={playlist.id} className="flex-shrink-0 w-48">
                  <ContentCard
                    item={{
                      id: playlist.id,
                      title: playlist.name,
                      artist: `${playlist.songCount} Songs`,
                      image: playlist.image || playlist.imageUrl,
                      type: 'playlist',
                    }}
                    onPlay={() => {}}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* 2. For You Section - Personalized content based on user preferences */}
        {user && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">For You</h3>
              <span className="text-gray-600 text-sm">Based on your preferences</span>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {isLoadingForYou ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))
              ) : (
                <>
                  {/* Show artists */}
                  {forYouContent?.artists?.map((artist) => (
                    <div key={`artist-${artist.id}`} className="flex-shrink-0 w-48">
                      <ArtistCard
                        artist={{
                          id: artist.id,
                          name: artist.name,
                          image: artist.image,
                          songCount: artist.songCount,
                        }}
                      />
                    </div>
                  ))}
                  {/* Show playlists */}
                  {forYouContent?.playlists?.map((playlist) => (
                    <div key={`playlist-${playlist.id}`} className="flex-shrink-0 w-48">
                      <ContentCard
                        item={{
                          id: playlist.id,
                          title: playlist.name,
                          artist: `${playlist.songCount} Songs`,
                          image: playlist.image,
                          type: 'playlist',
                        }}
                        onPlay={() => {}}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        )}

        {/* 3. Artists Section - Always show with lazy loading */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Artists</h3>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {isLoadingFeaturedArtists ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-32 animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))
            ) : (
              featuredArtists?.map((artist) => (
                <div key={artist.id} className="flex-shrink-0 w-32">
                  <ArtistCard artist={artist} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4. Bhajan Sangrah Section - Always show with lazy loading */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Bhajan Sangrah</h3>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {isLoadingBhajanSangrah ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))
            ) : (
              bhajanSangrahPlaylists?.map((playlist) => (
                <div key={playlist.id} className="flex-shrink-0 w-48">
                  <ContentCard
                    item={{
                      id: playlist.id,
                      title: playlist.name,
                      artist: `${playlist.songCount} Songs`,
                      image: playlist.image || playlist.imageUrl,
                      type: 'playlist',
                    }}
                    onPlay={() => {}}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* 5. Discover Section (Your Bhajans) - Personalized bhajans based on user preferences */}
        {user && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Discover More of What You Like</h3>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Refresh
              </button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {isLoadingPersonalizedBhajans ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))
              ) : (
                personalizedBhajans && personalizedBhajans.length > 0 ? (
                  personalizedBhajans.map((song) => (
                    <div key={song.id} className="flex-shrink-0 w-48">
                      <ContentCard
                        item={{
                          id: song.id,
                          title: song.name,
                          artist: song.artists,
                          image: song.image,
                          type: 'song',
                        }}
                        onPlay={() => handlePlaySong(song)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-full text-center py-8">
                    <p className="text-gray-600">Loading discover content...</p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* 6. Your Playlists Section - Only show if user has playlists */}
        {user && userPlaylists && userPlaylists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Your Playlists</h3>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {isLoadingUserPlaylists ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))
              ) : (
                userPlaylists?.map((playlist) => (
                  <div key={playlist.id} className="flex-shrink-0 w-48">
                    <ContentCard
                      item={{
                        id: playlist.id,
                        title: playlist.name,
                        artist: `${playlist.songCount} Songs`,
                        image: playlist.image || playlist.imageUrl,
                        type: 'playlist',
                      }}
                      onPlay={() => {}}
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* 7. Recently Played Section - Show for all users */}
        {user && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recently Played</h3>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {isLoadingRecentlyPlayed ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))
              ) : (
                recentlyPlayedSongs && recentlyPlayedSongs.length > 0 ? (
                  recentlyPlayedSongs.map((song) => (
                    <div key={song.id} className="flex-shrink-0 w-48">
                      <ContentCard
                        item={{
                          id: song.id,
                          title: song.name,
                          artist: song.artists,
                          image: song.image,
                          type: 'song',
                        }}
                        onPlay={() => handlePlaySong(song)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-full text-center py-8">
                    <p className="text-gray-600">No recently played songs yet</p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* 8. Explore More Section - Always show with lazy loading */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Explore More</h3>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {isLoadingExploreMore ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))
            ) : (
              exploreMorePlaylists && exploreMorePlaylists.length > 0 ? (
                exploreMorePlaylists.map((playlist) => (
                  <div key={playlist.id} className="flex-shrink-0 w-48">
                    <ContentCard
                      item={{
                        id: playlist.id,
                        title: playlist.name,
                        artist: `${playlist.songCount} Songs`,
                        image: playlist.image || playlist.imageUrl,
                        type: 'playlist',
                      }}
                      onPlay={() => {}}
                    />
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-full text-center py-8">
                  <p className="text-gray-600">No additional playlists available at the moment</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Copyright Disclaimer */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Disclaimer</h4>
          <p className="text-sm text-gray-600">
            The material used in this content is purely for devotional purposes. We do not claim ownership of the music used and no copyright infringement is intended. All music used is sourced from publicly available open sources. We respect intellectual property rights and aim to comply with copyright laws. If anyone has objections or feels any copyright infringement, please contact us at dadiji.bhajans@gmail.com. We will take necessary action within a stipulated time frame and promptly remove infringing content upon receipt of a valid takedown notice.
          </p>
        </section>
      </div>
    </div>
  )
}