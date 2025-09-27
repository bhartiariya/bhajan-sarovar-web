'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ActionButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'play'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  active?: boolean
}

export function ActionButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className,
  active = false
}: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white/50',
    ghost: 'bg-transparent text-text-primary hover:bg-white/10 focus:ring-primary',
    play: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg hover:shadow-xl hover:scale-105'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-full',
    md: 'px-4 py-2 text-sm rounded-full',
    lg: 'px-6 py-3 text-base rounded-full'
  }

  const activeClasses = active ? 'bg-primary text-white' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        activeClasses,
        className
      )}
    >
      {children}
    </button>
  )
}

interface IconButtonProps {
  icon: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  active?: boolean
  label?: string
}

export function IconButton({
  icon,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className,
  active = false,
  label
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white/50',
    ghost: 'bg-transparent text-text-primary hover:bg-white/10 focus:ring-primary'
  }

  const sizeClasses = {
    sm: 'p-1.5 rounded-full',
    md: 'p-2 rounded-full',
    lg: 'p-3 rounded-full'
  }

  const activeClasses = active ? 'bg-primary text-white' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        activeClasses,
        className
      )}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

interface PlayButtonProps {
  isPlaying?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PlayButton({ 
  isPlaying = false, 
  onClick, 
  size = 'lg',
  className 
}: PlayButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <ActionButton
      onClick={onClick}
      variant="play"
      size={size}
      className={cn(sizeClasses[size], className)}
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      ) : (
        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </ActionButton>
  )
}
