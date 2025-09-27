'use client'

import { useRouter } from 'next/navigation'
import { ContentCard } from '@/components/music/content-card'

// Test component to verify playlist navigation is working
export function PlaylistNavigationTest() {
  const router = useRouter()

  const testPlaylist = {
    id: 'test-playlist-123',
    title: 'Test Playlist',
    artist: '5 Songs',
    image: '/api/placeholder/200/200',
    type: 'playlist'
  }

  const handleDirectNavigation = () => {
    router.push('/playlist/test-playlist-123')
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Playlist Navigation Test</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Test 1: ContentCard with playlist navigation</p>
        <div className="w-48">
          <ContentCard
            item={testPlaylist}
            onPlay={() => {}}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Test 2: Direct navigation button</p>
        <button
          onClick={handleDirectNavigation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Navigate to Test Playlist
        </button>
      </div>

      <div className="text-xs text-gray-500">
        <p>Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Clicking the playlist card should navigate to /playlist/test-playlist-123</li>
          <li>Direct navigation button should also work</li>
          <li>Both should show the playlist details page</li>
        </ul>
      </div>
    </div>
  )
}
