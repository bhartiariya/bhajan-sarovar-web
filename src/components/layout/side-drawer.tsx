'use client'

import { useState } from 'react'
import { X, Music, BarChart3, Settings, MessageCircle, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useTabStore } from '@/store/tab-store'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { user, signOut } = useAuthStore()
  const { setCurrentTab } = useTabStore()

  const handleNavigation = (tabId: number) => {
    setCurrentTab(tabId)
    onClose()
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-background-primary z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🕉️</span>
              </div>
              <div>
                <h2 className="font-semibold text-text-primary">Bhajan Sarovar</h2>
                <p className="text-sm text-text-secondary">Spiritual Music</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-variant transition-colors"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 bg-surface-primary">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {user?.displayName || user?.email || 'User'}
                </h3>
                <p className="text-sm text-text-secondary">
                  {user?.role === 'admin' ? 'Administrator' : 
                   user?.role === 'artist' ? 'Artist' : 'Member'}
                </p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex justify-around mt-4 pt-4 border-t border-border-light">
              <div className="text-center">
                <div className="text-lg font-semibold text-text-primary">0</div>
                <div className="text-xs text-text-secondary">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-text-primary">0</div>
                <div className="text-xs text-text-secondary">Playlists</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {/* Apply to be Artist */}
              {(user?.role === 'member' || user?.role === 'artist' || user?.role === 'admin') && (
                <button
                  onClick={() => handleNavigation(7)} // Apply Artist tab
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-variant transition-colors"
                >
                  <Music className="w-5 h-5 text-text-primary" />
                  <span className="text-text-primary font-medium">Apply to be Artist</span>
                </button>
              )}

              {/* Artist Dashboard */}
              {user?.role === 'artist' && (
                <button
                  onClick={() => handleNavigation(8)} // Artist Dashboard tab
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-variant transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-text-primary" />
                  <span className="text-text-primary font-medium">Artist Dashboard</span>
                </button>
              )}

              {/* Settings */}
              <button
                onClick={() => handleNavigation(4)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-variant transition-colors"
              >
                <Settings className="w-5 h-5 text-text-primary" />
                <span className="text-text-primary font-medium">Settings</span>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNavigation(5)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-variant transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-text-primary" />
                <span className="text-text-primary font-medium">Contact Us</span>
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-border-light">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-variant transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
