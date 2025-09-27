'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  count?: number
  content: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className,
  variant = 'default'
}: TabsProps) {
  const variantClasses = {
    default: 'border-b border-white/10',
    pills: 'bg-black/20 rounded-lg p-1',
    underline: 'border-b-2 border-primary/20'
  }

  const tabButtonClasses = {
    default: 'px-6 py-4 font-medium transition-colors',
    pills: 'px-4 py-2 rounded-md font-medium transition-colors',
    underline: 'px-6 py-4 font-medium transition-colors border-b-2'
  }

  const activeClasses = {
    default: 'text-primary border-b-2 border-primary',
    pills: 'bg-primary text-white',
    underline: 'text-primary border-primary'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex', variantClasses[variant])}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              tabButtonClasses[variant],
              activeTab === tab.id
                ? activeClasses[variant]
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 text-sm text-text-secondary">
                ({tab.count})
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

interface TabButtonProps {
  id: string
  label: string
  count?: number
  isActive: boolean
  onClick: (id: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

export function TabButton({ 
  id, 
  label, 
  count, 
  isActive, 
  onClick, 
  variant = 'default',
  className 
}: TabButtonProps) {
  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variantClasses = {
    default: 'px-6 py-4 border-b-2',
    pills: 'px-4 py-2 rounded-md',
    underline: 'px-6 py-4 border-b-2'
  }

  const activeClasses = {
    default: 'text-primary border-primary',
    pills: 'bg-primary text-white',
    underline: 'text-primary border-primary'
  }

  const inactiveClasses = {
    default: 'text-text-secondary border-transparent hover:text-text-primary hover:border-text-secondary',
    pills: 'text-text-secondary hover:text-text-primary hover:bg-white/10',
    underline: 'text-text-secondary border-transparent hover:text-text-primary hover:border-text-secondary'
  }

  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        baseClasses,
        variantClasses[variant],
        isActive ? activeClasses[variant] : inactiveClasses[variant],
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 text-sm text-text-secondary">
          ({count})
        </span>
      )}
    </button>
  )
}

interface TabContentProps {
  children: ReactNode
  className?: string
}

export function TabContent({ children, className }: TabContentProps) {
  return (
    <div className={cn('mt-6', className)}>
      {children}
    </div>
  )
}
