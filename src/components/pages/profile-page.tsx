'use client'

import { useAuthStore } from '@/store/auth-store'
import { PlaylistCard } from '@/components/music/playlist-card'

export function ProfilePage() {
  const { user } = useAuthStore()

  // Mock user playlists
  const userPlaylists = [
    {
      id: '1',
      name: 'My Favorites',
      description: 'My personal collection',
      image: '/api/placeholder/200/200',
      songCount: 25,
    },
    {
      id: '2',
      name: 'Meditation Music',
      description: 'Peaceful melodies for meditation',
      image: '/api/placeholder/200/200',
      songCount: 12,
    },
  ]

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-2xl">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {user?.displayName || user?.email || 'User'}
            </h2>
            <p className="text-text-secondary">{user?.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-text-primary">0</div>
                <div className="text-xs text-text-secondary">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-text-primary">{userPlaylists.length}</div>
                <div className="text-xs text-text-secondary">Playlists</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Your Playlists</h3>
          <button className="text-primary hover:underline text-sm">Create New</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  )
}
