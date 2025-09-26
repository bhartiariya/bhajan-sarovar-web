'use client'

import { useState } from 'react'
import { Heart, Clock, Download } from 'lucide-react'
import { SongList } from '@/components/music/song-list'
import { usePlayerStore } from '@/store/player-store'

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'liked' | 'recent' | 'downloaded'>('liked')
  const { loadTrack } = usePlayerStore()

  // Mock data
  const likedSongs = [
    {
      id: '1',
      title: 'Shri Ram Stuti',
      artist: 'Anuradha Paudwal',
      duration: 180,
      image: '/api/placeholder/50/50',
    },
    {
      id: '2',
      title: 'Hanuman Chalisa',
      artist: 'Hariharan',
      duration: 240,
      image: '/api/placeholder/50/50',
    },
  ]

  const recentSongs = [
    {
      id: '3',
      title: 'Gayatri Mantra',
      artist: 'Deva Premal',
      duration: 200,
      image: '/api/placeholder/50/50',
    },
  ]

  const downloadedSongs = [
    {
      id: '4',
      title: 'Om Namah Shivaya',
      artist: 'Krishna Das',
      duration: 300,
      image: '/api/placeholder/50/50',
    },
  ]

  const handlePlaySong = (song: any) => {
    loadTrack({
      id: song.id,
      title: song.title,
      artist: song.artist,
      url: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
      image: song.image,
      duration: song.duration,
    })
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'liked':
        return <SongList songs={likedSongs} onPlay={handlePlaySong} />
      case 'recent':
        return <SongList songs={recentSongs} onPlay={handlePlaySong} />
      case 'downloaded':
        return <SongList songs={downloadedSongs} onPlay={handlePlaySong} />
      default:
        return <SongList songs={likedSongs} onPlay={handlePlaySong} />
    }
  }

  const tabs = [
    { key: 'liked', label: 'Liked Songs', icon: Heart, count: likedSongs.length },
    { key: 'recent', label: 'Recently Played', icon: Clock, count: recentSongs.length },
    { key: 'downloaded', label: 'Downloaded', icon: Download, count: downloadedSongs.length },
  ]

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Your Library</h2>
        <p className="text-text-secondary">Manage your music collection</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface-variant p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="bg-surface-primary text-text-secondary px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-4">
        {renderContent()}
      </div>
    </div>
  )
}
