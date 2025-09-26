import { db } from '@/lib/firebase';
import { doc, getDoc, getDocs, collection, query, where, limit } from 'firebase/firestore';
import { UserService } from './user-service';
import { playlistService } from './playlist-service';
import { songService } from './song-service';
import { artistService } from './artist-service';
import { UserProfile, Song, Artist, Playlist } from '@/types';
import { readString, safeStringList } from '@/utils/firestore-helpers';

class PersonalizationService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUserFavoriteArtists(userData: UserProfile): Promise<Artist[]> {
    try {
      const favoriteArtistIds = safeStringList(userData, 'favoriteArtists') || safeStringList(userData.preferences, 'selectedArtists');

      if (!favoriteArtistIds || favoriteArtistIds.length === 0) {
        console.log('PersonalizationService: No favorite artists found');
        return [];
      }

      const artists: Artist[] = [];
      for (const artistId of favoriteArtistIds) {
        try {
          const artistDoc = await getDoc(doc(db, 'artists', artistId));
          if (artistDoc.exists()) {
            const artistData = artistDoc.data();
            artists.push(artistService.mapFirestoreToArtist(artistData, artistDoc.id));
          }
        } catch (e) {
          console.error(`Error fetching artist ${artistId}:`, e);
        }
      }
      console.log(`PersonalizationService: Loaded ${artists.length} favorite artists`);
      return artists;
    } catch (e) {
      console.error('Error getting user favorite artists:', e);
      return [];
    }
  }

  async getPersonalizedSystemPlaylists(userData: UserProfile): Promise<Playlist[]> {
    try {
      const favoriteCategoryIds = safeStringList(userData, 'favoriteCategories') || safeStringList(userData.preferences, 'selectedCategories');

      if (!favoriteCategoryIds || favoriteCategoryIds.length === 0) {
        console.log('PersonalizationService: No favorite categories found for playlists');
        return [];
      }

      const allPlaylists = await playlistService.fetchPlaylists();
      const personalizedPlaylists = allPlaylists.filter(playlist =>
        playlist.tags?.some(tag => favoriteCategoryIds.includes(tag))
      );

      console.log(`PersonalizationService: Loaded ${personalizedPlaylists.length} personalized system playlists`);
      return personalizedPlaylists;
    } catch (e) {
      console.error('Error getting personalized system playlists:', e);
      return [];
    }
  }

  async getPersonalizedBhajans(userData: UserProfile, limitCount: number = 12): Promise<Song[]> {
    try {
      const favoriteCategoryIds = safeStringList(userData, 'favoriteCategories') || safeStringList(userData.preferences, 'selectedCategories');
      const favoriteArtistIds = safeStringList(userData, 'favoriteArtists') || safeStringList(userData.preferences, 'selectedArtists');

      // Always provide content - if no preferences, show random songs
      if ((!favoriteCategoryIds || favoriteCategoryIds.length === 0) && (!favoriteArtistIds || favoriteArtistIds.length === 0)) {
        console.log('PersonalizationService: No preferences found, fetching random songs for discover section.');
        return songService.fetchRandomSongs(limitCount);
      }

      let songs: Song[] = [];
      const songIds: Set<string> = new Set();

      // Fetch songs by favorite categories
      if (favoriteCategoryIds && favoriteCategoryIds.length > 0) {
        const categorySongs = await songService.fetchSongsByCategories(favoriteCategoryIds, limitCount);
        categorySongs.forEach(song => {
          if (!songIds.has(song.id)) {
            songs.push(song);
            songIds.add(song.id);
          }
        });
      }

      // Fetch songs by favorite artists
      if (favoriteArtistIds && favoriteArtistIds.length > 0) {
        const artistSongs = await songService.fetchSongsByArtists(favoriteArtistIds, limitCount);
        artistSongs.forEach(song => {
          if (!songIds.has(song.id)) {
            songs.push(song);
            songIds.add(song.id);
          }
        });
      }

      // If not enough songs, fill with random ones
      if (songs.length < limitCount) {
        const randomSongs = await songService.fetchRandomSongs(limitCount * 2); // Fetch more to ensure unique ones
        randomSongs.forEach(song => {
          if (!songIds.has(song.id) && songs.length < limitCount) {
            songs.push(song);
            songIds.add(song.id);
          }
        });
      }

      // Shuffle and take the limit
      songs.sort(() => Math.random() - 0.5);
      console.log(`PersonalizationService: Loaded ${songs.length} personalized bhajans`);
      return songs.slice(0, limitCount);
    } catch (e) {
      console.error('Error getting personalized bhajans:', e);
      return songService.fetchRandomSongs(limitCount); // Fallback to random
    }
  }

  async getForYouContent(userData: UserProfile): Promise<{ artists: Artist[], playlists: Playlist[] }> {
    try {
      const artists = await this.getUserFavoriteArtists(userData);
      const playlists = await this.getPersonalizedSystemPlaylists(userData);
      return { artists, playlists };
    } catch (e) {
      console.error('Error getting For You content:', e);
      // Return some fallback content
      return { 
        artists: [], 
        playlists: [] 
      };
    }
  }

  hasUserPreferences(userData: UserProfile): boolean {
    const favoriteArtistIds = safeStringList(userData, 'favoriteArtists') || safeStringList(userData.preferences, 'selectedArtists');
    const favoriteCategoryIds = safeStringList(userData, 'favoriteCategories') || safeStringList(userData.preferences, 'selectedCategories');
    return (favoriteArtistIds && favoriteArtistIds.length > 0) || (favoriteCategoryIds && favoriteCategoryIds.length > 0);
  }
}

export const personalizationService = new PersonalizationService();