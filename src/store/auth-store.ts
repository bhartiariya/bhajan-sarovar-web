import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authService } from '@/services/auth-service'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null })
        try {
          await authService.signInWithGoogle()
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign in with Google' })
        } finally {
          set({ isLoading: false })
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await authService.signInWithEmail(email, password)
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign in' })
        } finally {
          set({ isLoading: false })
        }
      },

      signUpWithEmail: async (email: string, password: string, displayName?: string) => {
        set({ isLoading: true, error: null })
        try {
          await authService.signUpWithEmail(email, password, displayName)
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign up' })
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await authService.signOut()
          set({ user: null })
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign out' })
        } finally {
          set({ isLoading: false })
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          await authService.resetPassword(email)
        } catch (error: any) {
          set({ error: error.message || 'Failed to reset password' })
        } finally {
          set({ isLoading: false })
        }
      },

      setUser: (user: User | null) => set({ user }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          return localStorage.getItem(name)
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          localStorage.setItem(name, value)
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        },
      },
    }
  )
)

// Initialize auth state listener
authService.addAuthStateListener((user) => {
  useAuthStore.getState().setUser(user)
  useAuthStore.getState().setLoading(false)
})
