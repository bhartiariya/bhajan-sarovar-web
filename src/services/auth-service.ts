import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { GoogleAuthProvider } from 'firebase/auth'
import { User } from '@/types'

const googleProvider = new GoogleAuthProvider()

export class AuthService {
  private authStateListeners: ((user: User | null) => void)[] = []

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserProfile(firebaseUser.uid)
        this.notifyListeners(user)
      } else {
        this.notifyListeners(null)
      }
    })
  }

  private async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLoginAt: userData.lastLoginAt?.toDate() || new Date(),
          preferences: userData.preferences || {
            theme: 'light',
            language: 'en',
            notifications: true,
            audioQuality: 'medium',
            autoPlay: false,
          },
          role: userData.role || 'member',
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
    return null
  }

  private async createUserProfile(firebaseUser: FirebaseUser, additionalData?: any): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userData = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || additionalData?.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        audioQuality: 'medium',
        autoPlay: false,
      },
      role: 'member',
      ...additionalData,
    }

    await setDoc(userRef, userData)
    return {
      uid: firebaseUser.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt,
      preferences: userData.preferences,
      role: userData.role,
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user profile exists, create if not
      const userProfile = await this.getUserProfile(user.uid)
      if (!userProfile) {
        await this.createUserProfile(user)
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date(),
        }, { merge: true })
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user

      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date(),
      }, { merge: true })
    } catch (error) {
      console.error('Email sign in error:', error)
      throw error
    }
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<void> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      await this.createUserProfile(user, { displayName })
    } catch (error) {
      console.error('Email sign up error:', error)
      throw error
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  addAuthStateListener(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(user: User | null): void {
    this.authStateListeners.forEach(callback => callback(user))
  }

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return null
    
    // This is a simplified version - in a real app, you'd want to get the full profile
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        audioQuality: 'medium',
        autoPlay: false,
      },
      role: 'member',
    }
  }
}

export const authService = new AuthService()
