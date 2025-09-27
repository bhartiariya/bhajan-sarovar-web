'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { usePlayerStore } from '@/store/player-store'
import { useTabStore } from '@/store/tab-store'
import { SideDrawer } from '@/components/layout/side-drawer'
import { Header } from '@/components/layout/header'
import { BottomNavigation } from '@/components/layout/bottom-navigation'
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

export function MainLayout() {
  const { user } = useAuthStore()
  const { currentTab, selectedArtistId } = useTabStore()
  const { currentSong, isFullPlayerVisible } = usePlayerStore()
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
      case 9:
        return selectedArtistId ? <ArtistDetailsPage artistId={selectedArtistId} /> : <HomePage />
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
      case 9:
        return 'Artist Details'
      default:
        return 'Home'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-white/95 backdrop-blur-xl border-r border-gray-200 z-30 shadow-lg">
        <SideDrawer isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile Header - Fixed */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30">
        <Header
          title={getHeaderTitle(currentTab)}
          showMenuButton={true}
          onMenuClick={() => setIsDrawerOpen(true)}
        />
      </div>

      {/* Mobile Side Drawer - Fixed */}
      <div className="md:hidden">
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>

      {/* Main Content - With proper spacing for fixed elements */}
      <main 
        className={`${user ? 'md:ml-64' : 'md:ml-0'} transition-all duration-300`} 
        style={{ 
          paddingTop: '0px', // No top padding for desktop
          paddingBottom: '80px', // Space for mini player
          minHeight: '100vh'
        }}
      >
        {/* Mobile top spacing */}
        <div className="md:hidden h-16"></div>
        
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

      {/* Bottom Navigation - Mobile Only, Fixed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigation />
      </div>

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
