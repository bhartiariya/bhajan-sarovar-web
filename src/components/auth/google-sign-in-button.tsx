'use client'

import { useAuthStore } from '@/store/auth-store'
import { Chrome } from 'lucide-react'

export function GoogleSignInButton() {
  const { signInWithGoogle, isLoading } = useAuthStore()

  return (
    <button
      onClick={signInWithGoogle}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-3 py-2 px-4 border border-border-light rounded-lg hover:bg-surface-variant focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Chrome className="w-5 h-5" />
      <span className="text-text-primary font-medium">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  )
}
