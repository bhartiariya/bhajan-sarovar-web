import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Song, Bhajan } from '@/types'

export class SongService {
  private readonly bhajansCollection = 'bhajans'
  private readonly artistsCollection = 'artists'
  private readonly categoriesCollection = 'categories'

  async fetchSongs(limitCount: number = 50): Promise<Song[]> {
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

  async fetchBhajans(limitCount: number = 50): Promise<Bhajan[]> {
    try {
      console.log(`🎵 Fetching ${limitCount} bhajans from Firebase...`)
      
      // Simple query without orderBy to avoid index issues - matches mobile app approach
      const q = query(
        collection(db, this.bhajansCollection),
        limit(limitCount)
      )
      
      const snapshot = await getDocs(q)
      const bhajans = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          filename: data.filename || '',
          title: data.title || '',
          artist: data.artist || '',
          category: data.category,
          s3Url: data.s3Url || '',
          thumbnail: data.thumbnail,
          fileSize: data.fileSize || 0,
          searchKeywords: data.searchKeywords || [],
          isActive: data.isActive ?? true,
          playCount: data.playCount || 0,
          uploadDate: data.uploadDate?.toDate(),
          uploadedBy: data.uploadedBy,
          uploadedByRole: data.uploadedByRole,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
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
    return {
      id: bhajan.id,
      name: bhajan.title,
      type: 'bhajan',
      album: bhajan.category || 'Bhajan Collection',
      year: '2025',
      releaseDate: bhajan.uploadDate?.toISOString(),
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
      image: bhajan.thumbnail || '/assets/img/cover.jpg',
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
}

export const songService = new SongService()
