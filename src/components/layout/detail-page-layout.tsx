'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { usePlayerStore } from '@/store/player-store'
import { SideDrawer } from '@/components/layout/side-drawer'
import { MiniPlayer } from '@/components/player/mini-player'
import { FullPlayer } from '@/components/player/full-player'
import { Toaster } from 'react-hot-toast'
import { UI_CONFIG } from '@/lib/constants'

interface DetailPageLayoutProps {
  children: React.ReactNode
  title: string
}

export function DetailPageLayout({ children, title }: DetailPageLayoutProps) {
  const { user } = useAuthStore()
  const { isFullPlayerVisible } = usePlayerStore()
  const router = useRouter()

  const handleBack = () => {
    router.back()
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
