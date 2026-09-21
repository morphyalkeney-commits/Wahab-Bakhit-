import { Song, AdminStats } from '../types';
import { DEFAULT_SONGS } from '../data/defaultSongs';

const SONGS_STORAGE_KEY = 'bigseven_songs_v1';
const ADMIN_AUTH_KEY = 'bigseven_admin_auth_v1';

export const storageService = {
  getSongs(): Song[] {
    try {
      const stored = localStorage.getItem(SONGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading songs from localStorage:', e);
    }
    // Default fallback
    this.saveSongs(DEFAULT_SONGS);
    return DEFAULT_SONGS;
  },

  saveSongs(songs: Song[]): void {
    try {
      localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.error('Error saving songs to localStorage:', e);
    }
  },

  incrementPlay(songId: string): Song[] {
    const songs = this.getSongs();
    const updated = songs.map(s => {
      if (s.id === songId) {
        return { ...s, plays: (s.plays || 0) + 1 };
      }
      return s;
    });
    this.saveSongs(updated);
    return updated;
  },

  incrementDownload(songId: string): Song[] {
    const songs = this.getSongs();
    const updated = songs.map(s => {
      if (s.id === songId) {
        return { ...s, downloads: (s.downloads || 0) + 1 };
      }
      return s;
    });
    this.saveSongs(updated);
    return updated;
  },

  addSong(newSong: Omit<Song, 'id' | 'plays' | 'downloads'>): Song {
    const songs = this.getSongs();
    const song: Song = {
      ...newSong,
      id: 'bs-' + Date.now(),
      plays: 0,
      downloads: 0,
    };
    const updated = [song, ...songs];
    this.saveSongs(updated);
    return song;
  },

  updateSong(id: string, updates: Partial<Song>): Song[] {
    const songs = this.getSongs();
    const updated = songs.map(s => (s.id === id ? { ...s, ...updates } : s));
    this.saveSongs(updated);
    return updated;
  },

  deleteSong(id: string): Song[] {
    const songs = this.getSongs();
    const updated = songs.filter(s => s.id !== id);
    this.saveSongs(updated);
    return updated;
  },

  resetToDefault(): Song[] {
    this.saveSongs(DEFAULT_SONGS);
    return DEFAULT_SONGS;
  },

  getStats(songs: Song[]): AdminStats {
    const totalPlays = songs.reduce((acc, s) => acc + (s.plays || 0), 0);
    const totalDownloads = songs.reduce((acc, s) => acc + (s.downloads || 0), 0);
    const genreBreakdown: Record<string, number> = {};

    songs.forEach(s => {
      genreBreakdown[s.genre] = (genreBreakdown[s.genre] || 0) + 1;
    });

    return {
      totalPlays,
      totalDownloads,
      totalSongs: songs.length,
      genreBreakdown
    };
  },

  isAdminAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },

  setAdminAuthenticated(auth: boolean): void {
    if (auth) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }
};
