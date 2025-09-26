'use client'

import { useState } from 'react'
import { X, Home, Search, Library, User, Settings, MessageCircle, LogOut, Music, BarChart3, Heart, Clock, Plus } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useTabStore } from '@/store/tab-store'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const { user, signOut } = useAuthStore()
  const { currentTab, setCurrentTab } = useTabStore()

  const handleNavigation = (tabId: number) => {
    setCurrentTab(tabId)
    onClose()
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const navigationItems = [
    { id: 0, label: 'Home', icon: Home },
    { id: 1, label: 'Search', icon: Search },
    { id: 2, label: 'Library', icon: Library },
  ]

  const userItems = [
    { id: 3, label: 'Profile', icon: User },
    { id: 4, label: 'Settings', icon: Settings },
    { id: 5, label: 'Contact Us', icon: MessageCircle },
  ]

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (!isOpen && isMobile) return null

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed left-0 top-0 bottom-0 w-80 z-50' : 'w-full h-full'} bg-white/95 backdrop-blur-xl shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🕉️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bhajan Sarovar</h1>
                <p className="text-xs text-gray-600">Spiritual Music</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Main Navigation */}
          <div className="px-3 mb-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* User Section */}
          {user && (
            <div className="px-3 mb-6">
              <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium text-sm">
                    {user?.displayName || user?.email || 'User'}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {user?.role === 'admin' ? 'Administrator' : 
                     user?.role === 'artist' ? 'Artist' : 'Member'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Liked Songs</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Recently Played</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Create Playlist</span>
                </button>
              </div>
            </div>
          )}

          {/* User Management */}
          <div className="px-3 mb-6">
            {userItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Special Features */}
          {user && (
            <div className="px-3 mb-6">
              {(user?.role === 'member' || user?.role === 'artist' || user?.role === 'admin') && (
                <button
                  onClick={() => handleNavigation(7)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Music className="w-5 h-5" />
                  <span className="font-medium">Apply to be Artist</span>
                </button>
              )}

              {user?.role === 'artist' && (
                <button
                  onClick={() => handleNavigation(8)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Artist Dashboard</span>
                </button>
              )}
            </div>
          )}

          {/* Sign Out */}
          {user && (
            <div className="px-3 mt-auto mb-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
