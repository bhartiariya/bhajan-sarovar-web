'use client'

import { useQuery } from '@tanstack/react-query'
import { ContentCard } from '@/components/music/content-card'
import { ArtistCard } from '@/components/music/artist-card'
import { SongList } from '@/components/music/song-list'
import { usePlayerStore } from '@/store/player-store'
import { useAuthStore } from '@/store/auth-store'
import { songService } from '@/services/song-service'
import { categoryService } from '@/services/category-service'
import { artistService } from '@/services/artist-service'
import { Song } from '@/types'

export function HomePage() {
  const { user } = useAuthStore()
  const { loadTrack } = usePlayerStore()

  const { data: featuredBhajans, isLoading: isLoadingFeaturedBhajans } = useQuery({
    queryKey: ['featuredBhajans'],
    queryFn: () => songService.fetchRandomSongs(10),
  })

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.fetchActiveCategories(),
  })

  const { data: featuredArtists, isLoading: isLoadingFeaturedArtists } = useQuery({
    queryKey: ['featuredArtists'],
    queryFn: () => artistService.fetchFeaturedArtists(5),
  })

  // TODO: Implement fetching user-specific content and recently played
  const { data: forYouContent, isLoading: isLoadingForYou } = useQuery({
    queryKey: ['forYouContent', user?.uid],
    queryFn: async () => {
      // For now, just return some random bhajans
      return songService.fetchRandomSongs(5)
    },
    enabled: !!user,
  })

  const handlePlaySong = (song: Song) => {
    loadTrack(song)
  }

  return (
    <div className="p-4 space-y-8">
      {/* 1. Curated by Editor Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Curated by Editor</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoadingFeaturedBhajans ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                <div className="h-4 bg-surface-variant rounded mb-1" />
                <div className="h-3 bg-surface-variant rounded w-3/4" />
              </div>
            ))
          ) : (
            featuredBhajans?.map((item) => (
              <ContentCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.name,
                  artist: item.artists,
                  image: item.image,
                  type: 'song',
                }}
                onPlay={() => handlePlaySong(item)}
              />
            ))
          )}
        </div>
      </section>

      {/* 2. For You Section - Personalized content based on user preferences */}
      {user && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">For You</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoadingForYou ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                  <div className="h-4 bg-surface-variant rounded mb-1" />
                  <div className="h-3 bg-surface-variant rounded w-3/4" />
                </div>
              ))
            ) : (
              forYouContent?.map((item) => (
                <ContentCard
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.name,
                    artist: item.artists,
                    image: item.image,
                    type: 'song',
                  }}
                  onPlay={() => handlePlaySong(item)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* 3. Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Artists</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoadingFeaturedArtists ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-32 bg-surface-variant rounded-lg mb-2 rounded-full" />
                <div className="h-4 bg-surface-variant rounded mb-1" />
                <div className="h-3 bg-surface-variant rounded w-3/4" />
              </div>
            ))
          ) : (
            featuredArtists?.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))
          )}
        </div>
      </section>

      {/* 4. Bhajan Sangrah Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Bhajan Sangrah</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoadingFeaturedBhajans ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                <div className="h-4 bg-surface-variant rounded mb-1" />
                <div className="h-3 bg-surface-variant rounded w-3/4" />
              </div>
            ))
          ) : (
            featuredBhajans?.slice(0, 5).map((item) => (
              <ContentCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.name,
                  artist: item.artists,
                  image: item.image,
                  type: 'song',
                }}
                onPlay={() => handlePlaySong(item)}
              />
            ))
          )}
        </div>
      </section>

      {/* 5. Discover Section (Your Bhajans) - Personalized bhajans based on user preferences */}
      {user && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">Discover</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoadingForYou ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                  <div className="h-4 bg-surface-variant rounded mb-1" />
                  <div className="h-3 bg-surface-variant rounded w-3/4" />
                </div>
              ))
            ) : (
              forYouContent?.slice(0, 5).map((item) => (
                <ContentCard
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.name,
                    artist: item.artists,
                    image: item.image,
                    type: 'song',
                  }}
                  onPlay={() => handlePlaySong(item)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* 6. Your Playlists Section - Only show if user has playlists */}
      {user && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">Your Playlists</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-text-secondary">No playlists yet. Create your first playlist!</p>
          </div>
        </section>
      )}

      {/* 7. Recently Played Section - Only show if user has recently played songs */}
      {user && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">Recently Played</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-text-secondary">No recently played songs yet.</p>
          </div>
        </section>
      )}

      {/* 8. Explore More Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Explore More</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoadingCategories ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                <div className="h-4 bg-surface-variant rounded mb-1" />
                <div className="h-3 bg-surface-variant rounded w-3/4" />
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <ContentCard
                key={category.id}
                item={{
                  id: category.id,
                  title: category.displayName,
                  image: category.image || '/api/placeholder/200/200',
                  type: 'category',
                }}
                onClick={() => {
                  console.log('Viewing category:', category.displayName)
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Copyright Disclaimer */}
      <section className="bg-surface-primary rounded-lg p-4">
        <h4 className="font-semibold text-text-primary mb-2">Disclaimer</h4>
        <p className="text-sm text-text-secondary">
          The material used in this content is purely for devotional purposes. We do not claim ownership of the music used and no copyright infringement is intended. All music used is sourced from publicly available open sources. We respect intellectual property rights and aim to comply with copyright laws. If anyone has objections or feels any copyright infringement, please contact us at dadiji.bhajans@gmail.com. We will take necessary action within a stipulated time frame and promptly remove infringing content upon receipt of a valid takedown notice.
        </p>
      </section>
    </div>
  )
}