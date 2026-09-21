import React from 'react';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { Song, PlayerState } from '../types';

interface MiniPlayerProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onOpenSongPage: (song: Song) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  playerState,
  onTogglePlay,
  onNextTrack,
  onOpenSongPage,
}) => {
  const { currentSong, isPlaying, currentTime, duration } = playerState;

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      id="mini-player-bar"
      onClick={() => onOpenSongPage(currentSong)}
      className="sticky bottom-[54px] z-30 mx-2 mb-2 p-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/25 shadow-xl shadow-black/60 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/40 transition-all group overflow-hidden"
    >
      {/* Top progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Album Artwork thumbnail */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-800 shadow-md">
          {currentSong.coverUrl ? (
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform ${isPlaying ? 'scale-105' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400">
              <Music className="w-5 h-5" />
            </div>
          )}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
              <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
            {currentSong.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-amber-400/90">{currentSong.artist}</span>
            <span>•</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
              {currentSong.genre}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onTogglePlay}
          id="mini-player-toggle"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
        </button>

        <button
          onClick={onNextTrack}
          id="mini-player-next"
          aria-label="Next track"
          className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
