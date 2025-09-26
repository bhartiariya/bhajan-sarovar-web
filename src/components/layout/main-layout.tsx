'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { usePlayerStore } from '@/store/player-store'
import { useTabStore } from '@/store/tab-store'
import { SideDrawer } from '@/components/layout/side-drawer'
import { Header } from '@/components/layout/header'
import { BottomNavigation } from '@/components/layout/bottom-navigation'
import { MiniPlayer } from '@/components/player/mini-player'
import { HomePage } from '@/components/pages/home-page'
import { SearchPage } from '@/components/pages/search-page'
import { LibraryPage } from '@/components/pages/library-page'
import { ProfilePage } from '@/components/pages/profile-page'
import { SettingsPage } from '@/components/pages/settings-page'
import { ContactPage } from '@/components/pages/contact-page'
import { AdminDashboard } from '@/components/pages/admin-dashboard'
import { ApplyArtistPage } from '@/components/pages/apply-artist-page'
import { ArtistDashboard } from '@/components/pages/artist-dashboard'
import { Toaster } from 'react-hot-toast'

export function MainLayout() {
  const { user } = useAuthStore()
  const { currentTab } = useTabStore()
  const { currentSong } = usePlayerStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 0:
        return <HomePage />
      case 1:
        return <SearchPage />
      case 2:
        return <LibraryPage />
      case 3:
        return <ProfilePage />
      case 4:
        return <SettingsPage />
      case 5:
        return <ContactPage />
      case 6:
        return <AdminDashboard />
      case 7:
        return <ApplyArtistPage />
      case 8:
        return <ArtistDashboard />
      default:
        return <HomePage />
    }
  }

  const getHeaderTitle = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return 'Home'
      case 1:
        return 'Search'
      case 2:
        return 'Library'
      case 3:
        return 'Profile'
      case 4:
        return 'Settings'
      case 5:
        return 'Contact Us'
      case 6:
        return 'Admin Dashboard'
      case 7:
        return 'Apply to be Artist'
      case 8:
        return 'Artist Dashboard'
      default:
        return 'Home'
    }
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <Header
        title={getHeaderTitle(currentTab)}
        showMenuButton={true}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Main Content */}
      <main className="pb-20">
        {renderCurrentPage()}
      </main>

      {/* Mini Player */}
      {currentSong && <MiniPlayer />}

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}
