'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, Palette, Volume2 } from 'lucide-react'

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [volume, setVolume] = useState(80)

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Settings', description: 'Manage your profile information' },
        { label: 'Privacy Settings', description: 'Control your privacy preferences' },
        { label: 'Account Security', description: 'Password and security settings' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', description: 'Get notified about new content' },
        { label: 'Email Notifications', description: 'Receive updates via email' },
        { label: 'Sound Notifications', description: 'Play sounds for notifications' },
      ],
    },
    {
      title: 'Audio',
      icon: Volume2,
      items: [
        { label: 'Audio Quality', description: 'Choose your preferred audio quality' },
        { label: 'Equalizer', description: 'Customize your audio experience' },
        { label: 'Crossfade', description: 'Smooth transitions between songs' },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', description: 'Choose your preferred theme' },
        { label: 'Language', description: 'Select your language' },
        { label: 'Font Size', description: 'Adjust text size' },
      ],
    },
    {
      title: 'About',
      icon: Shield,
      items: [
        { label: 'Terms of Service', description: 'Read our terms of service' },
        { label: 'Privacy Policy', description: 'Learn about our privacy policy' },
        { label: 'App Version', description: 'Version 1.0.0' },
      ],
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Settings</h2>
        <p className="text-text-secondary">Customize your experience</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-text-primary">{item.label}</div>
                      <div className="text-sm text-text-secondary">{item.description}</div>
                    </div>
                    {item.label === 'Push Notifications' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    )}
                    {item.label === 'Auto Play' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={(e) => setAutoPlay(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    )}
                    {item.label === 'Theme' && (
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                        className="px-3 py-1 border border-border-light rounded-md text-sm"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    )}
                    {item.label === 'Audio Quality' && (
                      <select className="px-3 py-1 border border-border-light rounded-md text-sm">
                        <option value="low">Low (128kbps)</option>
                        <option value="medium">Medium (256kbps)</option>
                        <option value="high">High (320kbps)</option>
                      </select>
                    )}
                    {item.label === 'Volume' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-20 h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-text-secondary w-8">{volume}%</span>
                      </div>
                    )}
                    {!['Push Notifications', 'Auto Play', 'Theme', 'Audio Quality', 'Volume'].includes(item.label) && (
                      <button className="text-primary hover:underline text-sm">
                        Manage
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
