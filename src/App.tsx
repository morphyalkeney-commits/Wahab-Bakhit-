import { useState, useEffect, useRef, useCallback } from 'react';
import { Song, PlayerState, ActiveTab } from './types';
import { storageService } from './services/storageService';
import { syntheticBeatEngine, downloadSongAudio } from './services/audioEngine';
import { AndroidHeader } from './components/AndroidHeader';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { SongPageModal } from './components/SongPageModal';
import { HomeView } from './components/HomeView';
import { MusicView } from './components/MusicView';
import { ArtistProfileView } from './components/ArtistProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { ShareModal } from './components/ShareModal';
import { AdMobBanner } from './components/AdMobBanner';

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => storageService.getSongs());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isFramed, setIsFramed] = useState<boolean>(true);

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.85,
    isMuted: false,
    isLoop: false,
    isShuffle: false,
  });

  // Modal Views
  const [isSongPageOpen, setIsSongPageOpen] = useState(false);
  const [activeSongForPage, setActiveSongForPage] = useState<Song | null>(null);
  const [shareModalSong, setShareModalSong] = useState<Song | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Set default first song into player
  useEffect(() => {
    if (songs.length > 0 && !playerState.currentSong) {
      const featured = songs.find((s) => s.featured) || songs[0];
      setPlayerState((prev) => ({
        ...prev,
        currentSong: featured,
        duration: featured.duration || 210,
      }));
    }
  }, [songs, playerState.currentSong]);

  // Check URL params for direct shared song link (e.g. ?song=bs-01)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const songId = params.get('song');
    if (songId) {
      const found = songs.find((s) => s.id === songId);
      if (found) {
        setPlayerState((prev) => ({
          ...prev,
          currentSong: found,
          isPlaying: false,
        }));
        setActiveSongForPage(found);
        setIsSongPageOpen(true);
      }
    }
  }, [songs]);

  // Handle Play Song
  const handlePlaySong = useCallback((song: Song) => {
    setPlayerState((prev) => {
      const isSameSong = prev.currentSong?.id === song.id;
      const nextPlaying = isSameSong ? !prev.isPlaying : true;

      // Update play counts if starting a song
      if (!isSameSong || (!prev.isPlaying && nextPlaying)) {
        const updatedSongs = storageService.incrementPlay(song.id);
        setSongs(updatedSongs);
      }

      return {
        ...prev,
        currentSong: song,
        isPlaying: nextPlaying,
        duration: song.duration || 210,
        currentTime: isSameSong ? prev.currentTime : 0,
      };
    });
  }, []);

  // Toggle Current Play/Pause
  const handleTogglePlay = useCallback(() => {
    setPlayerState((prev) => {
      if (!prev.currentSong && songs.length > 0) {
        const first = songs[0];
        storageService.incrementPlay(first.id);
        return {
          ...prev,
          currentSong: first,
          isPlaying: true,
          duration: first.duration || 210,
        };
      }
      return {
        ...prev,
        isPlaying: !prev.isPlaying,
      };
    });
  }, [songs]);

  // Next Track
  const handleNextTrack = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === playerState.currentSong?.id);
    let nextIndex: number;

    if (playerState.isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    const nextSong = songs[nextIndex];
    handlePlaySong(nextSong);
    if (isSongPageOpen) {
      setActiveSongForPage(nextSong);
    }
  }, [songs, playerState.currentSong, playerState.isShuffle, handlePlaySong, isSongPageOpen]);

  // Previous Track
  const handlePrevTrack = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === playerState.currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];
    handlePlaySong(prevSong);
    if (isSongPageOpen) {
      setActiveSongForPage(prevSong);
    }
  }, [songs, playerState.currentSong, handlePlaySong, isSongPageOpen]);

  // Seek
  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    setPlayerState((prev) => ({
      ...prev,
      currentTime: seconds,
    }));
  };

  // Volume
  const handleVolumeChange = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setPlayerState((prev) => ({
      ...prev,
      volume: vol,
      isMuted: vol === 0,
    }));
  };

  const handleToggleMute = () => {
    setPlayerState((prev) => {
      const nextMute = !prev.isMuted;
      if (audioRef.current) {
        audioRef.current.muted = nextMute;
      }
      return {
        ...prev,
        isMuted: nextMute,
      };
    });
  };

  const handleToggleLoop = () => {
    setPlayerState((prev) => ({
      ...prev,
      isLoop: !prev.isLoop,
    }));
  };

  const handleToggleShuffle = () => {
    setPlayerState((prev) => ({
      ...prev,
      isShuffle: !prev.isShuffle,
    }));
  };

  // Audio element sync & Audio Fallback Engine
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playerState.isPlaying && playerState.currentSong) {
      // Sync source if changed
      if (audio.src !== playerState.currentSong.audioUrl) {
        audio.src = playerState.currentSong.audioUrl;
        audio.currentTime = playerState.currentTime;
      }

      audio
        .play()
        .then(() => {
          syntheticBeatEngine.stop();
        })
        .catch((err) => {
          console.warn('HTML5 Audio playback preview fallback:', err.message);
          // Fallback to synthetic dancehall/afrobeat/amapiano beat rhythm
          syntheticBeatEngine.start(
            playerState.currentSong?.genre || 'Afrobeat',
            playerState.currentSong?.bpm || 110
          );
        });
    } else {
      audio.pause();
      syntheticBeatEngine.stop();
    }
  }, [playerState.isPlaying, playerState.currentSong]);

  // Audio event listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
        duration: audioRef.current?.duration || prev.duration,
      }));
    }
  };

  const onAudioEnded = () => {
    if (playerState.isLoop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextTrack();
    }
  };

  // Direct Download Handler
  const handleDownload = async (song: Song) => {
    const updatedSongs = storageService.incrementDownload(song.id);
    setSongs(updatedSongs);
    showToast(`Downloading "${song.title}" MP3 to your device...`);
    await downloadSongAudio(song.title, song.artist, song.audioUrl);
    showToast(`"${song.title}" saved successfully!`);
  };

  // Open Full Song Page
  const handleOpenSongPage = (song: Song) => {
    setActiveSongForPage(song);
    setIsSongPageOpen(true);
    // If not playing, or different song, start it
    if (playerState.currentSong?.id !== song.id) {
      handlePlaySong(song);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-start sm:p-4 selection:bg-amber-500/30 selection:text-amber-300">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onAudioEnded}
        onError={() => {
          // Trigger fallback beat engine
          if (playerState.isPlaying && playerState.currentSong) {
            syntheticBeatEngine.start(
              playerState.currentSong.genre,
              playerState.currentSong.bpm || 110
            );
          }
        }}
      />

      {/* Main Container: Android Mobile Frame vs Desktop Responsive */}
      <main
        className={`w-full bg-[#0b0e14] relative transition-all duration-300 overflow-hidden flex flex-col ${
          isFramed
            ? 'max-w-md sm:my-4 sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl sm:shadow-amber-500/5 min-h-[92vh]'
            : 'max-w-4xl sm:my-4 sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl min-h-[95vh]'
        }`}
      >
        {/* Android Status Bar & Top App Bar */}
        <AndroidHeader isFramed={isFramed} onToggleFrame={() => setIsFramed(!isFramed)} />

        {/* Scrollable Main Views */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto pb-24">
          {/* AdMob Monetization Banner (Version 1 -> Version 3 preparation) */}
          <AdMobBanner />

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <HomeView
              songs={songs}
              playerState={playerState}
              onPlaySong={handlePlaySong}
              onDownloadSong={handleDownload}
              onNavigateToMusic={() => setActiveTab('music')}
              onNavigateToArtist={() => setActiveTab('artist')}
              onOpenSongPage={handleOpenSongPage}
            />
          )}

          {/* TAB 2: MUSIC (ALL SONGS, SEARCH, CATEGORIES, PLAY, DOWNLOAD) */}
          {activeTab === 'music' && (
            <MusicView
              songs={songs}
              playerState={playerState}
              onPlaySong={handlePlaySong}
              onDownloadSong={handleDownload}
              onOpenSongPage={handleOpenSongPage}
              onOpenShare={(song) => setShareModalSong(song)}
            />
          )}

          {/* TAB 3: ARTIST PROFILE */}
          {activeTab === 'artist' && (
            <ArtistProfileView
              songs={songs}
              playerState={playerState}
              onPlaySong={handlePlaySong}
              onOpenSongPage={handleOpenSongPage}
            />
          )}

          {/* TAB 4: ADMIN DASHBOARD (ONLY YOU CAN UPLOAD, EDIT, DELETE, VIEW COUNTS) */}
          {activeTab === 'admin' && (
            <AdminDashboard
              songs={songs}
              onSongsUpdated={(updated) => setSongs(updated)}
              onOpenSongPage={handleOpenSongPage}
            />
          )}
        </div>

        {/* Persistent Bottom Mini Player */}
        <MiniPlayer
          playerState={playerState}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onOpenSongPage={(song) => handleOpenSongPage(song)}
        />

        {/* Android Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

        {/* Full Song Page Modal Player with Lyrics, Audio Seek, Download & Share */}
        {isSongPageOpen && activeSongForPage && (
          <SongPageModal
            song={activeSongForPage}
            playerState={playerState}
            onClose={() => setIsSongPageOpen(false)}
            onTogglePlay={handleTogglePlay}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
            onToggleLoop={handleToggleLoop}
            onToggleShuffle={handleToggleShuffle}
            onDownload={handleDownload}
            onOpenShare={(song) => setShareModalSong(song)}
          />
        )}

        {/* Share Modal */}
        {shareModalSong && (
          <ShareModal song={shareModalSong} onClose={() => setShareModalSong(null)} />
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs shadow-2xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
