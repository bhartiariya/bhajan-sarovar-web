# Bhajan Sarovar - Professional Spiritual Music Platform

A complete web version of the Flutter mobile app "Bhajan Sarovar" - a professional-grade spiritual music platform built with Next.js 14, TypeScript, Firebase, and AWS S3.

## 🎵 Features

### Core Functionality
- **Authentication**: Google OAuth and Email/Password with Firebase Auth
- **Music Player**: Professional audio playback with Howler.js
- **Content Management**: Songs, artists, playlists, and categories
- **Search**: Advanced search with filters and categories
- **User Management**: Profiles, favorites, and personal playlists
- **Artist Dashboard**: Upload and manage content for verified artists
- **Admin Panel**: Complete admin dashboard for platform management

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live data synchronization with Firebase
- **Audio Streaming**: High-quality audio streaming with AWS S3 + CloudFront
- **State Management**: Zustand for client state, React Query for server state
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with Next.js 14 and modern React patterns
- **Testing**: Jest, React Testing Library, and Cypress for comprehensive testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Firebase project
- AWS S3 bucket (optional for audio streaming)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd bhajan-sarovar-web
npm install
```

**If you encounter dependency conflicts, try:**
```bash
npm install --legacy-peer-deps
```

**Or use the setup script:**
```bash
# On Windows
setup.bat

# On Mac/Linux
chmod +x setup.sh
./setup.sh
```

2. **Set up environment variables**
```bash
cp env.example .env.local
```

Fill in your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# AWS S3 Configuration (optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain"
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/        # Main app pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (header, navigation)
│   ├── music/             # Music-related components
│   ├── pages/             # Page components
│   ├── player/            # Audio player components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── aws.ts             # AWS S3 configuration
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod validation schemas
├── services/              # Business logic services
│   ├── auth-service.ts    # Authentication service
│   └── audio-service.ts   # Audio playback service
├── store/                 # Zustand state stores
│   ├── auth-store.ts      # Authentication state
│   ├── player-store.ts    # Audio player state
│   └── tab-store.ts       # Navigation state
└── types/                 # TypeScript type definitions
    └── index.ts           # Main type definitions
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run type-check       # Run TypeScript type checking
npm run clean            # Clean build artifacts

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests with Cypress
npm run test:e2e:headless # Run E2E tests headlessly

# Storybook
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook

# Analysis
npm run analyze          # Analyze bundle size
```

## 🎨 Design System

The app uses a custom design system based on the original Flutter app:

### Colors
- **Primary**: `#84090B` (Deep red)
- **Background**: `#FFF0DF` (Cream)
- **Surface**: `#FFF8F0` (Light cream)
- **Text Primary**: `#1A1A1A` (Dark gray)
- **Text Secondary**: `#4A4A4A` (Medium gray)

### Typography
- **Font Family**: Circular Std (matching Flutter app)
- **Fallback**: Inter, system fonts

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary and secondary variants
- **Forms**: Consistent input styling
- **Navigation**: Bottom tab navigation (mobile-first)

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google + Email/Password)
3. Create Firestore database
4. Set up Storage (optional)
5. Add your web app to Firebase
6. Copy configuration to `.env.local`

### AWS S3 Setup (Optional)
1. Create S3 bucket
2. Set up CloudFront distribution
3. Configure CORS for web uploads
4. Add AWS credentials to `.env.local`

### Tailwind CSS
The app uses Tailwind CSS with custom configuration matching the Flutter app's design system.

## 🧪 Testing

### Unit Tests
```bash
npm run test
```
Tests are written with Jest and React Testing Library.

### E2E Tests
```bash
npm run test:e2e
```
End-to-end tests are written with Cypress.

### Storybook
```bash
npm run storybook
```
Component documentation and testing with Storybook.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📱 Mobile App Parity

This web version maintains complete feature parity with the Flutter mobile app:

- ✅ **Authentication**: Google OAuth + Email/Password
- ✅ **Music Player**: Full-featured audio player with controls
- ✅ **Navigation**: Bottom tab navigation matching mobile
- ✅ **Content**: Songs, artists, playlists, categories
- ✅ **Search**: Advanced search with filters
- ✅ **User Profiles**: Personal playlists and favorites
- ✅ **Artist Dashboard**: Content upload and management
- ✅ **Admin Panel**: Platform administration
- ✅ **Responsive Design**: Works on all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: dadiji.bhajans@gmail.com
- Create an issue in the repository

## 🙏 Acknowledgments

- Original Flutter app design and functionality
- Firebase for backend services
- AWS for cloud storage and CDN
- Next.js team for the amazing framework
- All open-source contributors

---

**Bhajan Sarovar** - Bringing spiritual music to the web with modern technology and beautiful design. 🕉️