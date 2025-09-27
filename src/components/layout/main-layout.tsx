'use client'

import { useAuthStore } from '@/store/auth-store'
import { usePlayerStore } from '@/store/player-store'
import { useTabStore } from '@/store/tab-store'
import { SideDrawer } from '@/components/layout/side-drawer'
import { MiniPlayer } from '@/components/player/mini-player'
import { FullPlayer } from '@/components/player/full-player'
import { HomePage } from '@/components/pages/home-page'
import { SearchPage } from '@/components/pages/search-page'
import { LibraryPage } from '@/components/pages/library-page'
import { ProfilePage } from '@/components/pages/profile-page'
import { SettingsPage } from '@/components/pages/settings-page'
import { ContactPage } from '@/components/pages/contact-page'
import { AdminDashboard } from '@/components/pages/admin-dashboard'
import { ApplyArtistPage } from '@/components/pages/apply-artist-page'
import { ArtistDashboard } from '@/components/pages/artist-dashboard'
import { ArtistDetailsPage } from '@/components/pages/artist-details-page'
import { Toaster } from 'react-hot-toast'
import { TAB_INDICES, TAB_TITLES, UI_CONFIG } from '@/lib/constants'

export function MainLayout() {
  const { user } = useAuthStore()
  const { currentTab, selectedArtistId } = useTabStore()
  const { currentSong, isFullPlayerVisible } = usePlayerStore()

  const renderCurrentPage = () => {
    switch (currentTab) {
      case TAB_INDICES.HOME:
        return <HomePage />
      case TAB_INDICES.SEARCH:
        return <SearchPage />
      case TAB_INDICES.LIBRARY:
        return <LibraryPage />
      case TAB_INDICES.PROFILE:
        return <ProfilePage />
      case TAB_INDICES.SETTINGS:
        return <SettingsPage />
      case TAB_INDICES.CONTACT:
        return <ContactPage />
      case TAB_INDICES.ADMIN:
        return <AdminDashboard />
      case TAB_INDICES.APPLY_ARTIST:
        return <ApplyArtistPage />
      case TAB_INDICES.ARTIST_DASHBOARD:
        return <ArtistDashboard />
      case TAB_INDICES.ARTIST_DETAILS:
        return selectedArtistId ? <ArtistDetailsPage artistId={selectedArtistId} /> : <HomePage />
      default:
        return <HomePage />
    }
  }

  const getHeaderTitle = (tabIndex: number) => {
    return TAB_TITLES[tabIndex as keyof typeof TAB_TITLES] || 'Home'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Desktop Sidebar - Always visible */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-white/95 backdrop-blur-xl border-r border-gray-200 z-30 shadow-lg">
        <SideDrawer isOpen={true} onClose={() => {}} />
      </div>

      {/* Main Content */}
      <main 
        className={`${user ? 'ml-64' : 'ml-0'} transition-all duration-300`} 
        style={{ 
          paddingBottom: '80px', // Space for mini player
          minHeight: '100vh',
          marginLeft: user ? `${UI_CONFIG.SIDEBAR_WIDTH}px` : '0px'
        }}
      >
        <div className="min-h-screen">
          {renderCurrentPage()}
        </div>
      </main>

      {/* Mini Player - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <MiniPlayer />
      </div>

      {/* Full Player - Fixed overlay */}
      {isFullPlayerVisible && (
        <div className="fixed inset-0 z-50">
          <FullPlayer />
        </div>
      )}


      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  )
}
