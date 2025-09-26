# Firebase Integration for Bhajan Sarovar Web App

This document describes the Firebase integration setup for the Bhajan Sarovar web application.

## Firebase Configuration

The Firebase configuration has been set up with the following details:

- **Project ID**: `dadiji-bhajan-sangrah-62543`
- **Auth Domain**: `dadiji-bhajan-sangrah-62543.firebaseapp.com`
- **Storage Bucket**: `dadiji-bhajan-sangrah-62543.firebasestorage.app`

## Files Structure

### Core Firebase Files

1. **`js/firebase-config.js`** - Main Firebase configuration and service wrapper
2. **`js/firebase-test.js`** - Integration test suite
3. **`js/config.js`** - Updated with actual Firebase configuration
4. **`js/services/auth-service.js`** - Updated to work with new Firebase setup

### Firebase Services Available

The Firebase integration provides the following services:

#### Authentication
- Google Sign-In
- Email/Password Authentication
- User state management
- Sign-out functionality

#### Firestore Database
- Collection management
- Document CRUD operations
- Query capabilities
- Real-time listeners

#### Storage
- File upload/download
- Image storage for covers and avatars

## Firebase Collections

The app uses the following Firestore collections:

- `bhajans` - Spiritual songs and bhajans
- `artists` - Artist information
- `playlists` - User playlists
- `users` - User profiles
- `userPlaylists` - User-specific playlists
- `likedSongs` - User's liked songs
- `recentlyPlayed` - Recently played tracks
- `categories` - Music categories
- `featuredContent` - Featured content

## Usage Examples

### Authentication
```javascript
// Sign in with Google
const user = await window.firebaseService.signInWithGoogle();

// Sign out
await window.firebaseService.signOut();

// Listen to auth state changes
window.firebaseService.onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user.uid);
    } else {
        console.log('User signed out');
    }
});
```

### Firestore Operations
```javascript
// Get bhajans
const bhajans = await window.firebaseService.getBhajans(20);

// Get user playlists
const playlists = await window.firebaseService.getUserPlaylists(userId, 10);

// Create a playlist
const playlistId = await window.firebaseService.createPlaylist(userId, {
    name: 'My Favorites',
    description: 'My favorite bhajans'
});

// Add song to playlist
await window.firebaseService.addSongToPlaylist(playlistId, songId);
```

### Search Functionality
```javascript
// Search bhajans
const results = await window.firebaseService.searchBhajans('krishna', 20);
```

## Testing

The Firebase integration includes a comprehensive test suite that verifies:

1. Firebase configuration loading
2. Service availability
3. Authentication setup
4. Firestore connectivity

To run the tests, open the browser console and look for the test results. The tests run automatically when the page loads.

## Security Rules

Make sure to configure appropriate Firestore security rules for your collections:

```javascript
// Example security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for bhajans and artists
    match /bhajans/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /artists/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Environment Variables

For production deployment, consider moving sensitive configuration to environment variables:

```javascript
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
```

## Troubleshooting

### Common Issues

1. **Firebase not loading**: Check browser console for errors
2. **Authentication failing**: Verify Firebase Auth is enabled in console
3. **Firestore access denied**: Check security rules
4. **CORS errors**: Ensure domain is added to authorized domains

### Debug Mode

Enable debug logging by setting:
```javascript
window.DebugLogger.config.enabled = true;
window.DebugLogger.config.logLevel = 'debug';
```

## Support

For Firebase-related issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
