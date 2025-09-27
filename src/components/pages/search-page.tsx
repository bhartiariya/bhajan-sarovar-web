'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { ContentCard } from '@/components/music/content-card'
import { ArtistCard } from '@/components/music/artist-card'
import { SongList } from '@/components/music/song-list'
import { songService } from '@/services/song-service'
import { artistService } from '@/services/artist-service'
import { categoryService } from '@/services/category-service'
import { usePlayerStore } from '@/store/player-store'
import { Song, Artist, Category } from '@/types'

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'categories'>('all')
  const { loadTrack } = usePlayerStore()

  // Search songs
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search-songs', searchQuery],
    queryFn: () => songService.searchSongs(searchQuery),
    enabled: searchQuery.length > 2,
  })

  // Search artists
  const { data: artistResults, isLoading: artistLoading } = useQuery({
    queryKey: ['search-artists', searchQuery],
    queryFn: () => artistService.searchArtists(searchQuery),
    enabled: searchQuery.length > 2,
  })

  // Fetch all categories for browsing
  const { data: allCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => categoryService.fetchActiveCategories(),
  })

  // Fetch featured artists for browsing
  const { data: featuredArtists, isLoading: featuredArtistsLoading } = useQuery({
    queryKey: ['featured-artists-search'],
    queryFn: () => artistService.fetchFeaturedArtists(),
  })

  const handlePlaySong = (song: Song) => {
    loadTrack(song)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const hasSearchResults = searchQuery.length > 2 && (searchResults?.length || artistResults?.length)

  return (
    <div className="p-4 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Search</h1>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search bhajans, artists, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Tabs */}
        {hasSearchResults && (
          <div className="flex space-x-1 bg-surface-variant p-1 rounded-lg">
            {(['all', 'songs', 'artists', 'categories'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearchResults ? (
        <div className="space-y-6">
          {/* Songs Results */}
          {(activeTab === 'all' || activeTab === 'songs') && (
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Songs ({searchResults?.length || 0})
              </h3>
              {searchLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-12 h-12 bg-surface-variant rounded" />
                      <div className="flex-1">
                        <div className="h-4 bg-surface-variant rounded mb-1" />
                        <div className="h-3 bg-surface-variant rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SongList
                  songs={searchResults || []}
                  onSongClick={handlePlaySong}
                />
              )}
            </section>
          )}

          {/* Artists Results */}
          {(activeTab === 'all' || activeTab === 'artists') && (
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Artists ({artistResults?.length || 0})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {artistLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                      <div className="h-4 bg-surface-variant rounded mb-1" />
                      <div className="h-3 bg-surface-variant rounded w-3/4" />
                    </div>
                  ))
                ) : (
                  artistResults?.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                    />
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Browse Content */
        <div className="space-y-6">
          {/* Browse Categories */}
          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Browse Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categoriesLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                    <div className="h-4 bg-surface-variant rounded mb-1" />
                    <div className="h-3 bg-surface-variant rounded w-3/4" />
                  </div>
                ))
              ) : (
                allCategories?.map((category) => (
                  <ContentCard
                    key={category.id}
                    type="category"
                    data={category}
                    onClick={() => {
                      console.log('Viewing category:', category.displayName)
                    }}
                  />
                ))
              )}
            </div>
          </section>

          {/* Browse Artists */}
          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Browse Artists</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredArtistsLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full h-32 bg-surface-variant rounded-lg mb-2" />
                    <div className="h-4 bg-surface-variant rounded mb-1" />
                    <div className="h-3 bg-surface-variant rounded w-3/4" />
                  </div>
                ))
              ) : (
                featuredArtists?.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* No Results */}
      {searchQuery.length > 2 && !searchLoading && !artistLoading && 
       (!searchResults?.length && !artistResults?.length) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Results Found</h3>
          <p className="text-text-secondary">
            Try searching with different keywords or browse our categories and artists.
          </p>
        </div>
      )}
    </div>
  )
}