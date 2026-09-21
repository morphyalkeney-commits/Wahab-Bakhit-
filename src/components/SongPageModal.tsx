import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Share2,
  FileText,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Sparkles,
  CheckCircle2,
  Disc
} from 'lucide-react';
import { Song, PlayerState } from '../types';

interface SongPageModalProps {
  song: Song;
  playerState: PlayerState;
  onClose: () => void;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onDownload: (song: Song) => Promise<void>;
  onOpenShare: (song: Song) => void;
}

export const SongPageModal: React.FC<SongPageModalProps> = ({
  song,
  playerState,
  onClose,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onDownload,
  onOpenShare,
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics'>('player');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { isPlaying, currentTime, duration, volume, isMuted, isLoop, isShuffle } = playerState;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await onDownload(song);
    setIsDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      id="song-page-overlay"
      className="fixed inset-0 z-50 bg-[#090c12]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-bottom duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 max-w-xl mx-auto w-full">
        <button
          onClick={onClose}
          id="btn-collapse-song-page"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Minimize"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Playing from BIG SEVEN
          </span>
          <span className="text-xs font-semibold text-slate-300">{song.genre}</span>
        </div>

        <button
          onClick={() => onOpenShare(song)}
          id="btn-share-song"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 flex items-center justify-center transition cursor-pointer"
          aria-label="Share song"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6 py-4">
        {/* Toggle between Player & Lyrics view */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'lyrics'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>
          </div>
        </div>

        {activeTab === 'player' ? (
          <div className="flex flex-col items-center space-y-6">
            {/* High-res Album Cover with Ambient Glow */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-700/60 group">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300">
                {song.genre}
              </div>
              {song.bpm && (
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300 font-mono">
                  {song.bpm} BPM
                </div>
              )}
            </div>

            {/* Song Details */}
            <div className="w-full text-center">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mb-1">
                {song.title}
              </h2>
              <p className="text-sm font-bold text-amber-400 tracking-wide uppercase">
                {song.artist}
              </p>
              {song.description && (
                <p className="text-xs text-slate-400 mt-2 px-4 line-clamp-2 leading-relaxed">
                  {song.description}
                </p>
              )}
            </div>

            {/* Stats Pills (Plays & Downloads) */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{song.plays?.toLocaleString() || 0} plays</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <Download className="w-3 h-3 text-emerald-400" />
                <span>{song.downloads?.toLocaleString() || 0} downloads</span>
              </span>
            </div>

            {/* Audio Progress Scrubber */}
            <div className="w-full space-y-1.5">
              <div className="relative group flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  id="song-progress-slider"
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${progressPercent}%, #1e293b ${progressPercent}%, #1e293b 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || song.duration)}</span>
              </div>
            </div>

            {/* Main Playback Buttons */}
            <div className="flex items-center justify-between w-full max-w-xs px-2">
              <button
                onClick={onToggleShuffle}
                id="btn-shuffle"
                className={`p-2 rounded-full transition cursor-pointer ${
                  isShuffle ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={onPrevTrack}
                id="btn-prev-track"
                className="w-11 h-11 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                title="Previous"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={onTogglePlay}
                id="btn-main-play-pause"
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black flex items-center justify-center font-black shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-black" />
                ) : (
                  <Play className="w-8 h-8 fill-black ml-1" />
                )}
              </button>

              <button
                onClick={onNextTrack}
                id="btn-next-track"
                className="w-11 h-11 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                title="Next"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={onToggleLoop}
                id="btn-loop"
                className={`p-2 rounded-full transition cursor-pointer ${
                  isLoop ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Loop"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Bar: Download & Volume */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800/60">
              {/* Download CTA Button */}
              <button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                id="btn-download-song-page"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 font-bold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Downloaded!</span>
                  </>
                ) : isDownloading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Saving track...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download MP3</span>
                  </>
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={onToggleMute}
                  className="hover:text-white cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Lyrics Tab */
          <div className="flex flex-col h-[420px] bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-white text-base">Lyrics</h3>
                <p className="text-xs text-amber-400 font-medium">
                  {song.title} — {song.artist}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Official Lyrics
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed text-slate-300 font-sans select-text">
              {song.lyrics ? (
                song.lyrics.split('\n\n').map((stanza, idx) => (
                  <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    <pre className="whitespace-pre-wrap font-sans text-slate-200 text-xs sm:text-sm">
                      {stanza}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <p>Lyrics not yet added for this track.</p>
                  <p className="text-xs mt-1">Admin can add lyrics via the Admin Dashboard.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Sing along with BIG SEVEN</span>
              <button
                onClick={() => onOpenShare(song)}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Share2 className="w-3 h-3" /> Share Lyrics
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer safe spacing */}
      <div className="h-6" />
    </div>
  );
};
