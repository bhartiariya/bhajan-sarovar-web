'use client'

import { useState } from 'react'
import { Menu, Search, Bell, ArrowLeft } from 'lucide-react'
import { useTabStore } from '@/store/tab-store'
import { useAuthStore } from '@/store/auth-store'

interface HeaderProps {
  title: string
  showMenuButton?: boolean
  onMenuClick?: () => void
  showBackButton?: boolean
  onBackClick?: () => void
  actions?: React.ReactNode[]
}

export function Header({ 
  title, 
  showMenuButton = false, 
  onMenuClick,
  showBackButton = false,
  onBackClick,
  actions = []
}: HeaderProps) {
  const { currentTab } = useTabStore()
  const { user } = useAuthStore()

  const defaultActions = [
    <button
      key="search"
      className="p-2 rounded-full hover:bg-surface-variant transition-colors"
      onClick={() => {
        // Navigate to search tab
        const { setCurrentTab } = useTabStore.getState()
        setCurrentTab(1)
      }}
    >
      <Search className="w-5 h-5 text-text-primary" />
    </button>,
    <button
      key="notifications"
      className="p-2 rounded-full hover:bg-surface-variant transition-colors"
    >
      <Bell className="w-5 h-5 text-text-primary" />
    </button>,
  ]

  const allActions = [...defaultActions, ...actions]

  return (
    <header className="sticky top-0 z-40 bg-background-primary border-b border-border-light">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="p-2 rounded-full hover:bg-surface-variant transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-text-primary" />
            </button>
          )}
          
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-surface-variant transition-colors"
            >
              <Menu className="w-6 h-6 text-text-primary" />
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🕉️</span>
            </div>
            <h1 className="text-xl font-semibold text-text-primary font-sans">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1">
          {allActions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
          
          {/* User avatar */}
          {user && (
            <div className="ml-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
