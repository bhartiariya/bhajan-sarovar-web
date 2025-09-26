'use client'

import { Home, Search, Library, User, Settings, MessageCircle, Shield } from 'lucide-react'
import { useTabStore } from '@/store/tab-store'
import { useAuthStore } from '@/store/auth-store'

export function BottomNavigation() {
  const { currentTab, setCurrentTab } = useTabStore()
  const { user } = useAuthStore()

  const tabs = [
    { id: 0, icon: Home, label: 'Home' },
    { id: 1, icon: Search, label: 'Search' },
    { id: 2, icon: Library, label: 'Library' },
    { id: 3, icon: User, label: 'Profile' },
    { id: 4, icon: Settings, label: 'Settings' },
    { id: 5, icon: MessageCircle, label: 'Contact' },
  ]

  // Add admin tab if user is admin
  if (user?.role === 'admin') {
    tabs.push({ id: 6, icon: Shield, label: 'Admin' })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-primary border-t border-border-light">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
