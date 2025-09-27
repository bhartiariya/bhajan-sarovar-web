'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { APP_CONFIG } from '@/lib/constants'

export function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuthStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, APP_CONFIG.SPLASH_DURATION)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!authLoading && !isLoading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth')
      }
    }
  }, [user, authLoading, isLoading, router])

  return (
    <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="w-24 h-24 mx-auto mb-6">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
        
        {/* App Logo */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl mr-3">🕉️</span>
          <h1 className="text-3xl font-bold text-primary">Bhajan Sarovar</h1>
        </div>
        
        {/* Loading Text */}
        <p className="text-text-secondary animate-pulse">Loading spiritual melodies...</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}
