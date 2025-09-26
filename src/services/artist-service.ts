import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Artist } from '@/types'

export class ArtistService {
  private readonly artistsCollection = 'artists'

  async fetchArtists(): Promise<Artist[]> {
    try {
      console.log('🎤 Fetching artists from Firebase...')
      
      const snapshot = await getDocs(collection(db, this.artistsCollection))
      const artists = snapshot.docs.map(doc => {
        const data = doc.data()
        
        // Helper function to safely convert to List<String>
        const safeStringList = (value: any): string[] => {
          if (value == null) return []
          if (Array.isArray(value)) {
            return value.map((e) => e.toString())
          }
          if (typeof value === 'number') {
            // If it's a number, return empty list (it's probably a count)
            console.warn('⚠️ Artist.fromFirestore: Found number value where List<String> expected, returning empty list')
            return []
          }
          if (typeof value === 'string') {
            // If it's a single string, wrap it in a list
            return [value]
          }
          console.warn('⚠️ Artist.fromFirestore: Unexpected type for list field, returning empty list')
          return []
        }
        
        // Helper function to parse timestamps
        const parseTimestamp = (timestamp: any): Date | null => {
          if (timestamp == null) return null
          if (timestamp instanceof Date) return timestamp
          if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            return timestamp.toDate()
          }
          return null
        }
        
        return {
          id: doc.id,
          name: data.name ?? '',
          songCount: data.songCount ?? 0,
          songs: safeStringList(data.songs),
          categories: safeStringList(data.categories),
          totalDuration: data.totalDuration ?? 0,
          genres: safeStringList(data.genres),
          monthlyListeners: data.monthlyListeners ?? 0,
          isVerified: data.isVerified ?? false,
          socialLinks: data.socialLinks ? { ...data.socialLinks } : {},
          bio: data.bio ?? '',
          image: data.image,
          userId: data.userId?.toString(),
          createdAt: parseTimestamp(data.createdAt) || new Date(),
          updatedAt: parseTimestamp(data.updatedAt) || new Date(),
        } as Artist
      })
      
      console.log(`🎤 Successfully fetched ${artists.length} artists`)
      return artists
    } catch (error) {
      console.error('❌ Error fetching artists:', error)
      return []
    }
  }

  async fetchArtistById(artistId: string): Promise<Artist | null> {
    try {
      console.log(`🎤 Fetching artist by ID: ${artistId}`)
      
      const docRef = doc(db, this.artistsCollection, artistId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        const artist = {
          id: docSnap.id,
          name: data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          categories: data.categories || [],
          totalDuration: data.totalDuration || 0,
          genres: data.genres || [],
          monthlyListeners: data.monthlyListeners || 0,
          isVerified: data.isVerified || false,
          socialLinks: data.socialLinks || {},
          bio: data.bio || '',
          image: data.image,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Artist
        
        console.log(`🎤 Successfully fetched artist: ${artist.name}`)
        return artist
      }
      
      console.log('❌ Artist not found')
      return null
    } catch (error) {
      console.error('❌ Error fetching artist by ID:', error)
      return null
    }
  }

  async searchArtists(query: string): Promise<Artist[]> {
    try {
      console.log(`🔍 Searching artists with query: ${query}`)
      
      const snapshot = await getDocs(collection(db, this.artistsCollection))
      const allArtists = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          categories: data.categories || [],
          totalDuration: data.totalDuration || 0,
          genres: data.genres || [],
          monthlyListeners: data.monthlyListeners || 0,
          isVerified: data.isVerified || false,
          socialLinks: data.socialLinks || {},
          bio: data.bio || '',
          image: data.image,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Artist
      })
      
      // Filter by search query
      const searchTerm = query.toLowerCase()
      const filteredArtists = allArtists.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm) ||
        artist.bio.toLowerCase().includes(searchTerm) ||
        artist.genres.some(genre => genre.toLowerCase().includes(searchTerm))
      )
      
      console.log(`🔍 Found ${filteredArtists.length} artists matching query`)
      return filteredArtists
    } catch (error) {
      console.error('❌ Error searching artists:', error)
      return []
    }
  }

  async fetchFeaturedArtists(limitCount: number = 10): Promise<Artist[]> {
    try {
      console.log(`⭐ Fetching ${limitCount} featured artists from Firebase...`)
      
      // Simple query without orderBy to avoid index issues - matches mobile app approach
      const snapshot = await getDocs(collection(db, this.artistsCollection))
      const artists = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          categories: data.categories || [],
          totalDuration: data.totalDuration || 0,
          genres: data.genres || [],
          monthlyListeners: data.monthlyListeners || 0,
          isVerified: data.isVerified || false,
          socialLinks: data.socialLinks || {},
          bio: data.bio || '',
          image: data.image,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Artist
      })
      
      // Sort by monthly listeners and take top limitCount
      const featuredArtists = artists
        .sort((a, b) => b.monthlyListeners - a.monthlyListeners)
        .slice(0, limitCount)
      
      console.log(`⭐ Successfully fetched ${featuredArtists.length} featured artists`)
      return featuredArtists
    } catch (error) {
      console.error('❌ Error fetching featured artists:', error)
      return []
    }
  }
}

export const artistService = new ArtistService()
