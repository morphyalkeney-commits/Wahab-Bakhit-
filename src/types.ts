export type Genre = 'African Dancehall' | 'Afrobeat' | 'Amapiano' | 'Alur' | 'All';

export interface Song {
  id: string;
  title: string;
  artist: string; // "BIG SEVEN"
  genre: 'African Dancehall' | 'Afrobeat' | 'Amapiano' | 'Alur';
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  releaseDate: string;
  plays: number;
  downloads: number;
  lyrics: string;
  featured?: boolean;
  producer?: string;
  bpm?: number;
  description?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoop: boolean;
  isShuffle: boolean;
}

export type ActiveTab = 'home' | 'music' | 'artist' | 'admin';

export interface AdminStats {
  totalPlays: number;
  totalDownloads: number;
  totalSongs: number;
  genreBreakdown: Record<string, number>;
}
