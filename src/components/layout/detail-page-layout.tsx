'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { usePlayerStore } from '@/store/player-store'
import { SideDrawer } from '@/components/layout/side-drawer'
import { Header } from '@/components/layout/header'
import { BottomNavigation } from '@/components/layout/bottom-navigation'
import { MiniPlayer } from '@/components/player/mini-player'
import { FullPlayer } from '@/components/player/full-player'
import { Toaster } from 'react-hot-toast'

interface DetailPageLayoutProps {
  children: React.ReactNode
  title: string
}

export function DetailPageLayout({ children, title }: DetailPageLayoutProps) {
  const { user } = useAuthStore()
  const { isFullPlayerVisible } = usePlayerStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    router.back()
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
          title={title}
          showMenuButton={true}
          onMenuClick={() => setIsDrawerOpen(true)}
          showBackButton={true}
          onBackClick={handleBack}
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
          {children}
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
