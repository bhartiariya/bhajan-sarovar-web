'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  className,
  variant = 'default'
}: StatsCardProps) {
  const variantClasses = {
    default: 'bg-black/20 text-text-primary',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-surface-variant text-text-primary'
  }

  return (
    <div className={cn(
      'p-4 rounded-lg text-center transition-all duration-200 hover:scale-105',
      variantClasses[variant],
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-2">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold mb-1">
        {value}
      </div>
      <div className="text-sm font-medium text-text-secondary">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-text-secondary mt-1">
          {subtitle}
        </div>
      )}
    </div>
  )
}

interface StatsGridProps {
  stats: Array<{
    title: string
    value: string | number
    subtitle?: string
    icon?: ReactNode
    variant?: 'default' | 'primary' | 'secondary'
  }>
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function StatsGrid({ 
  stats, 
  columns = 3, 
  className 
}: StatsGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-4',
      gridClasses[columns],
      className
    )}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: ReactNode
  className?: string
}

export function MetricCard({ 
  label, 
  value, 
  change, 
  icon, 
  className 
}: MetricCardProps) {
  const changeColors = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-text-secondary'
  }

  const changeIcons = {
    increase: '↗',
    decrease: '↘',
    neutral: '→'
  }

  return (
    <div className={cn(
      'p-4 bg-black/20 rounded-lg backdrop-blur-sm',
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">{label}</span>
        {icon && (
          <div className="text-text-secondary">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">
        {value}
      </div>
      {change && (
        <div className={cn(
          'text-sm font-medium flex items-center gap-1',
          changeColors[change.type]
        )}>
          <span>{changeIcons[change.type]}</span>
          <span>{Math.abs(change.value)}%</span>
        </div>
      )}
    </div>
  )
}
