'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { GoogleSignInButton } from './google-sign-in-button'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'
import { ForgotPasswordForm } from './forgot-password-form'

type AuthMode = 'signin' | 'signup' | 'forgot'

export function AuthWrapper() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const { isLoading, error } = useAuthStore()

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">🕉️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Bhajan Sarovar</h1>
          <p className="text-text-secondary">Spiritual Music Platform</p>
        </div>

        {/* Auth Forms */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {mode === 'signin' && (
            <>
              <SignInForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setMode('signup')}
                  className="text-primary hover:underline text-sm"
                >
                  Don't have an account? Sign up
                </button>
              </div>
              <div className="mt-2 text-center">
                <button
                  onClick={() => setMode('forgot')}
                  className="text-text-secondary hover:underline text-sm"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <>
              <SignUpForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary hover:underline text-sm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <ForgotPasswordForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary hover:underline text-sm"
                >
                  Back to sign in
                </button>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-text-secondary">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-text-secondary">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
