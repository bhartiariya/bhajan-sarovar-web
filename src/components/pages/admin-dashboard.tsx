'use client'

import { useState } from 'react'
import { Shield, Users, Music, BarChart3, Settings, Upload } from 'lucide-react'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'analytics'>('overview')

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users },
    { label: 'Total Songs', value: '5,678', icon: Music },
    { label: 'Total Artists', value: '89', icon: Users },
    { label: 'Total Plays', value: '123,456', icon: BarChart3 },
  ]

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content', icon: Music },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
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
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-text-secondary">New user registered: john@example.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-text-secondary">New song uploaded: "Shri Ram Stuti"</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-text-secondary">Artist application received</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'users':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-2 text-text-primary">User</th>
                    <th className="text-left py-2 text-text-primary">Role</th>
                    <th className="text-left py-2 text-text-primary">Status</th>
                    <th className="text-left py-2 text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-light">
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">J</span>
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">john@example.com</div>
                          <div className="text-sm text-text-secondary">Member</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-text-primary">Member</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                    </td>
                    <td className="py-2">
                      <button className="text-primary hover:underline text-sm">Manage</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'content':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Content Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
                <div>
                  <h4 className="font-medium text-text-primary">Pending Artist Applications</h4>
                  <p className="text-sm text-text-secondary">3 applications waiting for review</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
                <div>
                  <h4 className="font-medium text-text-primary">Content Moderation</h4>
                  <p className="text-sm text-text-secondary">2 items flagged for review</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                  Review
                </button>
              </div>
            </div>
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
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Admin Dashboard</h2>
        </div>
        <p className="text-text-secondary">Manage your platform</p>
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
