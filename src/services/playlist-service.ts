import { db } from '@/lib/firebase';
import { Playlist } from '@/types';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { readString, parseTimestamp } from '@/lib/utils';

class PlaylistService {
  private readonly curatedPlaylistNames = [
    'Dhandhan wali Dadi Bhajans',
    'Shyam baba Bhajans',
    'Salasar Balaji Bhajans',
    'Laxminath Ji Bhajans'
  ];

  async fetchPlaylists(): Promise<Playlist[]> {
    try {
      const snapshot = await getDocs(collection(db, 'playlists'));
      return snapshot.docs.map(doc => this.mapFirestoreToPlaylist(doc.data(), doc.id));
    } catch (error) {
      console.error('Error fetching all playlists:', error);
      return [];
    }
  }

  async fetchCuratedPlaylists(): Promise<Playlist[]> {
    try {
      const allPlaylists = await this.fetchPlaylists();
      return allPlaylists.filter(playlist => this.curatedPlaylistNames.includes(playlist.name));
    } catch (error) {
      console.error('Error fetching curated playlists:', error);
      return [];
    }
  }

  async fetchBhajanSangrahPlaylists(): Promise<Playlist[]> {
    try {
      const allPlaylists = await this.fetchPlaylists();
      return allPlaylists.filter(playlist => playlist.name.includes('Dadiji Bhajan Sangrah'));
    } catch (error) {
      console.error('Error fetching Bhajan Sangrah playlists:', error);
      return [];
    }
  }

  async fetchExploreMorePlaylists(): Promise<Playlist[]> {
    try {
      const allPlaylists = await this.fetchPlaylists();
      return allPlaylists.filter(playlist =>
        !this.curatedPlaylistNames.includes(playlist.name) &&
        !playlist.name.includes('Dadiji Bhajan Sangrah')
      );
    } catch (error) {
      console.error('Error fetching explore more playlists:', error);
      return [];
    }
  }

  async fetchUserPlaylists(userId: string): Promise<Playlist[]> {
    if (!userId) return [];
    try {
      const q = query(collection(db, 'userPlaylists'), where('ownerId', 'isEqualTo', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.mapFirestoreToUserPlaylist(doc.data(), doc.id));
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      return [];
    }
  }

  async fetchPlaylistById(playlistId: string): Promise<Playlist | null> {
    try {
      const docRef = doc(db, 'playlists', playlistId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return this.mapFirestoreToPlaylist(docSnap.data(), docSnap.id);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching playlist by ID ${playlistId}:`, error);
      return null;
    }
  }

  private mapFirestoreToPlaylist(data: any, id: string): Playlist {
    return {
      id: id,
      name: readString(data, 'name'),
      description: readString(data, 'description'),
      image: readString(data, 'image') || readString(data, 'imageUrl') || '/api/placeholder/200/200',
      imageUrl: readString(data, 'imageUrl'),
      songCount: data.songCount || 0,
      songs: data.songs || [],
      isActive: data.isActive ?? true,
      isPublic: data.isPublic ?? false,
      createdBy: readString(data, 'createdBy'),
      tags: data.tags || [],
      createdAt: parseTimestamp(data, 'createdAt'),
      updatedAt: parseTimestamp(data, 'updatedAt'),
    };
  }

  private mapFirestoreToUserPlaylist(data: any, id: string): Playlist {
    return {
      id: id,
      name: readString(data, 'title'), // User playlists use 'title'
      description: readString(data, 'description'),
      image: readString(data, 'imageUrl') || '/api/placeholder/200/200',
      imageUrl: readString(data, 'imageUrl'),
      songCount: data.trackIds?.length || 0, // User playlists use 'trackIds'
      songs: data.trackIds || [],
      isActive: data.isActive ?? true,
      isPublic: data.isPublic ?? false,
      createdBy: readString(data, 'ownerId'), // ownerId is the creator
      tags: data.tags || [],
      createdAt: parseTimestamp(data, 'createdAt'),
      updatedAt: parseTimestamp(data, 'updatedAt'),
      isUserPlaylist: true, // Custom flag for user playlists
    };
  }
}

export const playlistService = new PlaylistService();