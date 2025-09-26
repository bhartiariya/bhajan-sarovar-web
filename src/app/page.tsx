'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { SplashScreen } from '@/components/ui/splash-screen'
import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { MainLayout } from '@/components/layout/main-layout'

export default function App() {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <SplashScreen />
  }

  if (!user) {
    return <AuthWrapper />
  }

  return <MainLayout />
}