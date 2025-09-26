'use client'

import { useState } from 'react'
import { Music, Upload, FileText, CheckCircle } from 'lucide-react'

export function ApplyArtistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Application Submitted!</h2>
          <p className="text-text-secondary mb-6">
            Thank you for your interest in becoming an artist. We'll review your application and get back to you within 2-3 business days.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Music className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Apply to be Artist</h2>
          </div>
          <p className="text-text-secondary">
            Share your spiritual music with the world. Apply to become a verified artist on Bhajan Sarovar.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your last name"
                  />
                </div>
              </div>
            </div>

            {/* Artist Information */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Artist Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="artistName" className="block text-sm font-medium text-text-primary mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    id="artistName"
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your stage/artist name"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about yourself and your musical journey..."
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-text-primary mb-1">
                    Musical Experience
                  </label>
                  <textarea
                    id="experience"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe your musical background and experience..."
                  />
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Portfolio</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sampleAudio" className="block text-sm font-medium text-text-primary mb-1">
                    Sample Audio (Optional)
                  </label>
                  <input
                    type="file"
                    id="sampleAudio"
                    accept="audio/*"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-sm text-text-secondary mt-1">
                    Upload a sample of your work (MP3, WAV, or other audio format)
                  </p>
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-1">
                    Website/Social Media (Optional)
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-surface-primary rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-2">Terms and Conditions</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• You must own the rights to all content you upload</li>
                <li>• Content must be appropriate for a spiritual music platform</li>
                <li>• You agree to our terms of service and privacy policy</li>
                <li>• We reserve the right to review and approve all content</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
