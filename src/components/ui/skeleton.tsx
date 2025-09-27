'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className, 
  variant = 'default', 
  width, 
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700'
  
  const variantClasses = {
    default: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  }

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}

// Predefined skeleton components for common use cases
export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '75%' : '100%'}
          className="h-4"
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <Skeleton height="200px" className="w-full rounded-lg" />
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonPlaylistHeader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-6 p-6', className)}>
      <Skeleton height="256px" width="256px" className="rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="4rem" width="100%" />
        <Skeleton height="1.5rem" width="75%" />
        <div className="flex gap-4">
          <Skeleton height="3rem" width="3rem" className="rounded-full" />
          <Skeleton height="3rem" width="3rem" className="rounded-full" />
          <Skeleton height="3rem" width="3rem" className="rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonSongList({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton height="1rem" width="1rem" />
          <Skeleton height="2.5rem" width="2.5rem" className="rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton height="1rem" width="60%" />
            <Skeleton height="0.875rem" width="40%" />
          </div>
          <Skeleton height="1rem" width="3rem" />
        </div>
      ))}
    </div>
  )
}
