'use client'

import { useState } from 'react'
import { Upload, Music, BarChart3, Settings, Plus } from 'lucide-react'

export function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'analytics' | 'settings'>('overview')

  const stats = [
    { label: 'Total Songs', value: '25', icon: Music },
    { label: 'Total Plays', value: '12,345', icon: BarChart3 },
    { label: 'Followers', value: '1,234', icon: Settings },
    { label: 'Revenue', value: '$456', icon: BarChart3 },
  ]

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'upload', label: 'Upload', icon: Upload },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                      </div>
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Uploads</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-border-light rounded-lg">
                  <div className="w-12 h-12 bg-surface-variant rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">Shri Ram Stuti</h4>
                    <p className="text-sm text-text-secondary">Uploaded 2 days ago</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">1,234 plays</div>
                    <div className="text-xs text-text-secondary">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'upload':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Upload New Song</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="audioFile" className="block text-sm font-medium text-text-primary mb-1">
                  Audio File
                </label>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  required
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter song title"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your song..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="bhajan">Bhajan</option>
                    <option value="mantra">Mantra</option>
                    <option value="aarti">Aarti</option>
                    <option value="kirtan">Kirtan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-1">
                    Language
                  </label>
                  <select
                    id="language"
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select language</option>
                    <option value="hindi">Hindi</option>
                    <option value="sanskrit">Sanskrit</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="english">English</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                Upload Song
              </button>
            </form>
          </div>
        )
      case 'analytics':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Analytics</h3>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">Analytics dashboard coming soon</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Artist Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="artistName" className="block text-sm font-medium text-text-primary mb-1">
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistName"
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue="Your Artist Name"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue="Tell your story..."
                />
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Music className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Artist Dashboard</h2>
        </div>
        <p className="text-text-secondary">Manage your music and track your performance</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface-variant p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
