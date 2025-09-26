import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bhajan Sarovar - Spiritual Music Platform',
  description: 'Discover and listen to beautiful spiritual bhajans and devotional music',
  keywords: ['bhajan', 'spiritual music', 'devotional', 'hindu music', 'religious songs'],
  authors: [{ name: 'Bhajan Sarovar Team' }],
  creator: 'Bhajan Sarovar',
  publisher: 'Bhajan Sarovar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Bhajan Sarovar - Spiritual Music Platform',
    description: 'Discover and listen to beautiful spiritual bhajans and devotional music',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Bhajan Sarovar',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bhajan Sarovar - Spiritual Music Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhajan Sarovar - Spiritual Music Platform',
    description: 'Discover and listen to beautiful spiritual bhajans and devotional music',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background-primary`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
