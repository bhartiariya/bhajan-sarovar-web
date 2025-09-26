import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/types';
import { readString, safeStringList, parseTimestamp } from '@/utils/firestore-helpers';

class UserService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          email: readString(data, 'email'),
          displayName: readString(data, 'displayName'),
          photoURL: readString(data, 'photoURL'),
          role: readString(data, 'role'),
          favoriteArtists: safeStringList(data, 'favoriteArtists'),
          favoriteCategories: safeStringList(data, 'favoriteCategories'),
          preferences: {
            selectedArtists: safeStringList(data.preferences, 'selectedArtists'),
            selectedCategories: safeStringList(data.preferences, 'selectedCategories'),
          },
          createdAt: parseTimestamp(data, 'createdAt'),
          updatedAt: parseTimestamp(data, 'updatedAt'),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

export { UserService };
