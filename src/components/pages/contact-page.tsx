'use client'

import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Contact Us</h2>
        <p className="text-text-secondary">Get in touch with our team</p>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-text-primary">Email</div>
                <div className="text-text-secondary">dadiji.bhajans@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-text-primary">Phone</div>
                <div className="text-text-secondary">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-text-primary">Address</div>
                <div className="text-text-secondary">123 Spiritual Street, Divine City, DC 12345</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Send us a Message</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary">How do I upload my own bhajans?</h4>
              <p className="text-text-secondary text-sm mt-1">
                You can apply to become an artist through the side menu. Once approved, you'll have access to the artist dashboard where you can upload your content.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary">Is the app free to use?</h4>
              <p className="text-text-secondary text-sm mt-1">
                Yes, Bhajan Sarovar is completely free to use. We believe in sharing spiritual music with everyone.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary">How can I report copyright issues?</h4>
              <p className="text-text-secondary text-sm mt-1">
                If you believe any content infringes on copyright, please contact us at dadiji.bhajans@gmail.com with details. We take copyright seriously and will respond promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
