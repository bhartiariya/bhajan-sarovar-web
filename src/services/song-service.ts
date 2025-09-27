import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Song, Bhajan } from '@/types'

export class SongService {
  private readonly bhajansCollection = 'bhajans'
  private readonly artistsCollection = 'artists'
  private readonly categoriesCollection = 'categories'

  async fetchSongs(limitCount?: number): Promise<Song[]> {
    try {
      console.log('🎵 Fetching songs from Firebase...')
      const bhajans = await this.fetchBhajans(limitCount)
      return bhajans.map((bhajan) => this.bhajanToSong(bhajan))
    } catch (error) {
      console.error('❌ Error fetching songs:', error)
      return []
    }
  }

  async fetchRandomSongs(limitCount: number = 5): Promise<Song[]> {
    try {
      console.log(`🎲 Fetching ${limitCount} random songs...`)
      
      // Fetch a larger batch and randomly select from them
      const batchSize = Math.min(limitCount * 3, 100)
      const allSongs = await this.fetchSongs(batchSize)
      
      if (allSongs.length === 0) {
        console.log('❌ No songs found in database')
        return []
      }
      
      // Shuffle and take the requested limit
      const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5)
      const randomSongs = shuffledSongs.slice(0, limitCount)
      
      console.log(`🎲 Successfully fetched ${randomSongs.length} random songs`)
      return randomSongs
    } catch (error) {
      console.error('❌ Error fetching random songs:', error)
      return []
    }
  }

  async fetchSongsByArtist(artistId: string): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs for artist ID: ${artistId}`)
      
      // First get the artist name
      const artistDoc = await getDoc(doc(db, this.artistsCollection, artistId))
      if (!artistDoc.exists()) {
        console.log('❌ Artist not found')
        return []
      }
      
      const artistData = artistDoc.data()
      const artistName = artistData?.name || ''
      console.log(`🎤 Artist name: ${artistName}`)
      
      // Search for songs by artist name
      const q = query(
        collection(db, this.bhajansCollection),
        where('artist', '==', artistName),
        where('isActive', '==', true)
      )
      
      const snapshot = await getDocs(q)
      const bhajans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bhajan))
      
      console.log(`🎵 Found ${bhajans.length} songs for artist: ${artistName}`)
      return bhajans.map(bhajan => this.bhajanToSong(bhajan))
    } catch (error) {
      console.error('❌ Error fetching songs by artist:', error)
      return []
    }
  }

  async fetchSongsByCategory(categoryId: string): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs for category ID: ${categoryId}`)
      
      // First get the category name
      const categoryDoc = await getDoc(doc(db, this.categoriesCollection, categoryId))
      if (!categoryDoc.exists()) {
        console.log('❌ Category not found')
        return []
      }
      
      const categoryData = categoryDoc.data()
      const categoryName = categoryData?.name || ''
      console.log(`📂 Category name: ${categoryName}`)
      
      // Search for songs by category
      const q = query(
        collection(db, this.bhajansCollection),
        where('category', '==', categoryName),
        where('isActive', '==', true)
      )
      
      const snapshot = await getDocs(q)
      const bhajans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bhajan))
      
      console.log(`🎵 Found ${bhajans.length} songs for category: ${categoryName}`)
      return bhajans.map(bhajan => this.bhajanToSong(bhajan))
    } catch (error) {
      console.error('❌ Error fetching songs by category:', error)
      return []
    }
  }

  async fetchBhajans(limitCount?: number): Promise<Bhajan[]> {
    try {
      console.log(`🎵 Fetching ${limitCount ? limitCount : 'all'} bhajans from Firebase...`)
      
      // Simple query without orderBy to avoid index issues - matches mobile app approach
      const q = limitCount 
        ? query(collection(db, this.bhajansCollection), limit(limitCount))
        : query(collection(db, this.bhajansCollection))
      
      const snapshot = await getDocs(q)
      const bhajans = snapshot.docs.map(doc => {
        const data = doc.data()
        
        // Helper function to safely read strings
        const readString = (value: any): string => {
          if (value == null) return ''
          if (typeof value === 'string') return value
          return value.toString()
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
          filename: readString(data.filename),
          title: readString(data.title),
          artist: readString(data.artist),
          category: data.category?.toString(),
          s3Url: readString(data.s3Url),
          thumbnail: data.thumbnail?.toString(),
          fileSize: data.fileSize ?? 0,
          searchKeywords: Array.isArray(data.searchKeywords) ? data.searchKeywords : [],
          isActive: data.isActive ?? true,
          playCount: data.playCount ?? 0,
          uploadDate: parseTimestamp(data.uploadDate),
          uploadedBy: data.uploadedBy?.toString(),
          uploadedByRole: data.uploadedByRole?.toString(),
          createdAt: parseTimestamp(data.createdAt) || new Date(),
          updatedAt: parseTimestamp(data.updatedAt) || new Date(),
        } as Bhajan
      })
      
      console.log(`🎵 Successfully fetched ${bhajans.length} bhajans`)
      return bhajans
    } catch (error) {
      console.error('❌ Error fetching bhajans:', error)
      return []
    }
  }

  private bhajanToSong(bhajan: Bhajan): Song {
    // Helper function to safely convert date to ISO string
    const safeDateToISO = (date: any): string => {
      try {
        if (!date) return new Date().toISOString()
        
        let dateObj: Date
        
        if (date instanceof Date) {
          dateObj = date
        } else if (date.toDate && typeof date.toDate === 'function') {
          // Firestore Timestamp
          dateObj = date.toDate()
        } else if (typeof date === 'string' || typeof date === 'number') {
          dateObj = new Date(date)
        } else {
          dateObj = new Date()
        }
        
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date detected, using current date:', date)
          return new Date().toISOString()
        }
        
        return dateObj.toISOString()
      } catch (error) {
        console.warn('Error converting date to ISO string:', error, 'Using current date')
        return new Date().toISOString()
      }
    }

    return {
      id: bhajan.id,
      name: bhajan.title,
      type: 'bhajan',
      album: bhajan.category || 'Bhajan Collection',
      year: '2025',
      releaseDate: safeDateToISO(bhajan.uploadDate),
      duration: '0', // Will be updated when audio metadata is available
      label: 'Bhajan Sangrah',
      artists: bhajan.artist,
      artistsId: '',
      featuredArtists: '',
      featuredArtistsId: '',
      explicitContent: 0,
      playCount: bhajan.playCount.toString(),
      language: 'Hindi',
      hasLyrics: '0',
      url: bhajan.s3Url,
      copyright: 'Bhajan Sangrah',
      image: bhajan.thumbnail || '/api/placeholder/200/200',
      downloadUrl: bhajan.s3Url,
    }
  }

  async searchBhajans(searchTerm: string, limitCount: number = 20): Promise<Song[]> {
    return this.searchSongs(searchTerm)
  }

  async searchSongs(query: string): Promise<Song[]> {
    try {
      console.log(`🔍 Searching songs with query: ${query}`)
      
      // Search in bhajans collection by title, artist, or keywords
      const q = query(
        collection(db, this.bhajansCollection),
        where('isActive', '==', true)
      )
      
      const snapshot = await getDocs(q)
      const allBhajans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Bhajan))
      
      // Filter by search query
      const filteredBhajans = allBhajans.filter(bhajan => {
        const searchTerm = query.toLowerCase()
        return (
          bhajan.title.toLowerCase().includes(searchTerm) ||
          bhajan.artist.toLowerCase().includes(searchTerm) ||
          bhajan.searchKeywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm)
          )
        )
      })
      
      console.log(`🔍 Found ${filteredBhajans.length} songs matching query`)
      return filteredBhajans.map(bhajan => this.bhajanToSong(bhajan))
    } catch (error) {
      console.error('❌ Error searching songs:', error)
      return []
    }
  }

  async fetchSongsByCategories(categoryIds: string[], limitCount?: number): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs for categories: ${categoryIds.join(', ')}`)
      
      // Get category names first
      const categoryNames: string[] = []
      for (const categoryId of categoryIds) {
        try {
          const categoryDoc = await getDoc(doc(db, this.categoriesCollection, categoryId))
          if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data()
            const categoryName = categoryData?.name || categoryData?.displayName || ''
            if (categoryName) {
              categoryNames.push(categoryName)
            }
          }
        } catch (e) {
          console.error(`Error fetching category ${categoryId}:`, e)
        }
      }
      
      if (categoryNames.length === 0) {
        console.log('❌ No valid categories found')
        return []
      }
      
      // Fetch songs for each category
      let allSongs: Song[] = []
      const songIds = new Set<string>()
      
      for (const categoryName of categoryNames) {
        const q = limitCount 
          ? query(
              collection(db, this.bhajansCollection),
              where('category', '==', categoryName),
              where('isActive', '==', true),
              limit(limitCount)
            )
          : query(
              collection(db, this.bhajansCollection),
              where('category', '==', categoryName),
              where('isActive', '==', true)
            )
        
        const snapshot = await getDocs(q)
        const bhajans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Bhajan))
        
        bhajans.forEach(bhajan => {
          if (!songIds.has(bhajan.id)) {
            allSongs.push(this.bhajanToSong(bhajan))
            songIds.add(bhajan.id)
          }
        })
      }
      
      console.log(`🎵 Found ${allSongs.length} songs for categories`)
      return limitCount ? allSongs.slice(0, limitCount) : allSongs
    } catch (error) {
      console.error('❌ Error fetching songs by categories:', error)
      return []
    }
  }

  async fetchSongsByArtists(artistIds: string[], limitCount?: number): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs for artists: ${artistIds.join(', ')}`)
      
      // Get artist names first
      const artistNames: string[] = []
      for (const artistId of artistIds) {
        try {
          const artistDoc = await getDoc(doc(db, this.artistsCollection, artistId))
          if (artistDoc.exists()) {
            const artistData = artistDoc.data()
            const artistName = artistData?.name || ''
            if (artistName) {
              artistNames.push(artistName)
            }
          }
        } catch (e) {
          console.error(`Error fetching artist ${artistId}:`, e)
        }
      }
      
      if (artistNames.length === 0) {
        console.log('❌ No valid artists found')
        return []
      }
      
      // Fetch songs for each artist
      let allSongs: Song[] = []
      const songIds = new Set<string>()
      
      for (const artistName of artistNames) {
        const q = limitCount 
          ? query(
              collection(db, this.bhajansCollection),
              where('artist', '==', artistName),
              where('isActive', '==', true),
              limit(limitCount)
            )
          : query(
              collection(db, this.bhajansCollection),
              where('artist', '==', artistName),
              where('isActive', '==', true)
            )
        
        const snapshot = await getDocs(q)
        const bhajans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Bhajan))
        
        bhajans.forEach(bhajan => {
          if (!songIds.has(bhajan.id)) {
            allSongs.push(this.bhajanToSong(bhajan))
            songIds.add(bhajan.id)
          }
        })
      }
      
      console.log(`🎵 Found ${allSongs.length} songs for artists`)
      return limitCount ? allSongs.slice(0, limitCount) : allSongs
    } catch (error) {
      console.error('❌ Error fetching songs by artists:', error)
      return []
    }
  }

  async fetchSongsByIds(songIds: string[]): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs by IDs: ${songIds.length} songs`)
      console.log(`🎵 Song IDs:`, songIds)
      
      if (songIds.length === 0) {
        return []
      }

      // Fetch songs in batches to avoid query limits
      const batchSize = 10 // Firestore 'in' queries are limited to 10 items
      const allSongs: Song[] = []
      
      for (let i = 0; i < songIds.length; i += batchSize) {
        const batch = songIds.slice(i, i + batchSize)
        console.log(`🎵 Fetching batch ${Math.floor(i/batchSize) + 1}:`, batch)
        
        try {
          const q = query(
            collection(db, this.bhajansCollection),
            where('__name__', 'in', batch)
          )
          
          const snapshot = await getDocs(q)
          console.log(`🎵 Batch query returned ${snapshot.docs.length} documents`)
          
          const bhajans = snapshot.docs.map(doc => {
            const data = doc.data()
            console.log(`🎵 Document ${doc.id} data:`, { 
              id: doc.id, 
              hasIsActive: 'isActive' in data,
              isActive: data.isActive,
              hasTitle: 'title' in data,
              title: data.title,
              uploadDateType: typeof data.uploadDate,
              uploadDateValue: data.uploadDate
            })
            
            // Helper function to safely read strings
            const readString = (value: any): string => {
              if (value == null) return ''
              if (typeof value === 'string') return value
              return value.toString()
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
              filename: readString(data.filename),
              title: readString(data.title),
              artist: readString(data.artist),
              category: data.category?.toString(),
              s3Url: readString(data.s3Url),
              thumbnail: data.thumbnail?.toString(),
              fileSize: data.fileSize ?? 0,
              searchKeywords: Array.isArray(data.searchKeywords) ? data.searchKeywords : [],
              isActive: data.isActive ?? true,
              playCount: data.playCount ?? 0,
              uploadDate: parseTimestamp(data.uploadDate),
              uploadedBy: data.uploadedBy?.toString(),
              uploadedByRole: data.uploadedByRole?.toString(),
              createdAt: parseTimestamp(data.createdAt) || new Date(),
              updatedAt: parseTimestamp(data.updatedAt) || new Date(),
            } as Bhajan
          })
          
          // Filter out inactive songs after fetching
          const activeBhajans = bhajans.filter(bhajan => bhajan.isActive !== false)
          console.log(`🎵 Active bhajans in batch: ${activeBhajans.length}`)
          
          allSongs.push(...activeBhajans.map(bhajan => this.bhajanToSong(bhajan)))
        } catch (batchError) {
          console.error(`❌ Error fetching batch ${Math.floor(i/batchSize) + 1}:`, batchError)
          // Continue with next batch
        }
      }
      
      // Sort by the original order of songIds
      const sortedSongs = songIds
        .map(id => allSongs.find(song => song.id === id))
        .filter(song => song !== undefined) as Song[]
      
      console.log(`🎵 Found ${sortedSongs.length} songs by IDs out of ${songIds.length} requested`)
      return sortedSongs
    } catch (error) {
      console.error('❌ Error fetching songs by IDs:', error)
      return []
    }
  }

  async fetchSongsByPlaylistName(playlistName: string): Promise<Song[]> {
    try {
      console.log(`🎵 Fetching songs for playlist: ${playlistName}`)
      
      // Try different approaches to find songs for this playlist
      const queries = [
        // Try to find songs with playlist name in title or description
        query(
          collection(db, this.bhajansCollection),
          where('title', '>=', playlistName),
          where('title', '<=', playlistName + '\uf8ff')
        ),
        // Try to find songs with playlist name in any field
        query(
          collection(db, this.bhajansCollection),
          where('playlist', '==', playlistName)
        ),
        // Try to find songs with playlist name in tags
        query(
          collection(db, this.bhajansCollection),
          where('tags', 'array-contains', playlistName)
        )
      ]
      
      let allSongs: Song[] = []
      
      for (const q of queries) {
        try {
          const snapshot = await getDocs(q)
          const bhajans = snapshot.docs.map(doc => {
            const data = doc.data()
            
            // Helper function to safely read strings
            const readString = (value: any): string => {
              if (value == null) return ''
              if (typeof value === 'string') return value
              return value.toString()
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
              filename: readString(data.filename),
              title: readString(data.title),
              artist: readString(data.artist),
              category: data.category?.toString(),
              s3Url: readString(data.s3Url),
              thumbnail: data.thumbnail?.toString(),
              fileSize: data.fileSize ?? 0,
              searchKeywords: Array.isArray(data.searchKeywords) ? data.searchKeywords : [],
              isActive: data.isActive ?? true,
              playCount: data.playCount ?? 0,
              uploadDate: parseTimestamp(data.uploadDate),
              uploadedBy: data.uploadedBy?.toString(),
              uploadedByRole: data.uploadedByRole?.toString(),
              createdAt: parseTimestamp(data.createdAt) || new Date(),
              updatedAt: parseTimestamp(data.updatedAt) || new Date(),
            } as Bhajan
          })
          
          const activeBhajans = bhajans.filter(bhajan => bhajan.isActive !== false)
          allSongs.push(...activeBhajans.map(bhajan => this.bhajanToSong(bhajan)))
          
          if (allSongs.length > 0) {
            console.log(`🎵 Found ${allSongs.length} songs for playlist: ${playlistName}`)
            break // Found songs, no need to try other queries
          }
        } catch (queryError) {
          console.log(`🎵 Query failed for playlist ${playlistName}:`, queryError)
          // Continue with next query
        }
      }
      
      // If no songs found, return some random songs as fallback
      if (allSongs.length === 0) {
        console.log(`🎵 No songs found for playlist ${playlistName}, returning random songs`)
        allSongs = await this.fetchRandomSongs(10)
      }
      
      return allSongs
    } catch (error) {
      console.error('❌ Error fetching songs by playlist name:', error)
      return []
    }
  }
}

export const songService = new SongService()
