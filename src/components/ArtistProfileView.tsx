import React from 'react';
import { Play, Pause, ExternalLink, MapPin, Award, Radio, Flame, CheckCircle, Music, MessageCircle } from 'lucide-react';
import { Song, PlayerState } from '../types';
import { ARTIST_INFO } from '../data/defaultSongs';

interface ArtistProfileViewProps {
  songs: Song[];
  playerState: PlayerState;
  onPlaySong: (song: Song) => void;
  onOpenSongPage: (song: Song) => void;
}

export const ArtistProfileView: React.FC<ArtistProfileViewProps> = ({
  songs,
  playerState,
  onPlaySong,
  onOpenSongPage,
}) => {
  const isCurrentPlaying = (song: Song) =>
    playerState.currentSong?.id === song.id && playerState.isPlaying;

  const topSongs = [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 5);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Hero Banner with Artist Image */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-b from-slate-900 to-[#0c0f17]">
        <div
          className="h-56 sm:h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/60 to-black/30" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold shadow">
                  <CheckCircle className="w-3 h-3" /> VERIFIED ARTIST
                </span>
                <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                  {ARTIST_INFO.recordLabel}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
                {ARTIST_INFO.name}
              </h1>
              <p className="text-amber-400 text-xs sm:text-sm font-bold tracking-wide mt-0.5">
                {ARTIST_INFO.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950/80 border-t border-slate-800 p-3 text-center">
          <div>
            <span className="text-lg sm:text-xl font-black text-white font-display">1.2M+</span>
            <p className="text-[10px] text-slate-400 font-medium">Total Streams</p>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-display">84.5K+</span>
            <p className="text-[10px] text-slate-400 font-medium">Monthly Fans</p>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-display">{songs.length}</span>
            <p className="text-[10px] text-slate-400 font-medium">Official Tracks</p>
          </div>
        </div>
      </section>

      {/* Origin & Musical Heritage */}
      <section className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Artist Roots & Heritage</span>
          </h2>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
            Alur Kingdom
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {ARTIST_INFO.bio}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Origin</span>
            <p className="font-bold text-white mt-0.5">{ARTIST_INFO.origin}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Label</span>
            <p className="font-bold text-white mt-0.5">{ARTIST_INFO.recordLabel}</p>
          </div>
        </div>
      </section>

      {/* Top Tracks by BIG SEVEN */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2 font-display">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Popular Anthems</span>
          </h2>
          <span className="text-xs text-slate-400">By plays</span>
        </div>

        <div className="space-y-2">
          {topSongs.map((song, i) => {
            const playing = isCurrentPlaying(song);
            return (
              <div
                key={song.id}
                onClick={() => onOpenSongPage(song)}
                className={`flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border transition-all cursor-pointer hover:bg-slate-800/90 ${
                  playing ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-sm font-black font-display text-amber-400 w-4 text-center">
                    {i + 1}
                  </span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-11 h-11 rounded-lg object-cover shadow shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white truncate hover:text-amber-400 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {song.genre} • {song.plays?.toLocaleString()} plays
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPlaySong(song)}
                    id={`btn-play-popular-${song.id}`}
                    aria-label={playing ? 'Pause' : 'Play'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      playing
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-black'
                    }`}
                  >
                    {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Links & Booking Connect */}
      <section className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>Connect & Booking</span>
        </h2>
        <p className="text-xs text-slate-400">
          Stream BIG SEVEN on all digital platforms or reach management for bookings and dubplates.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          <a
            href={ARTIST_INFO.socials.audiomack}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700/60 transition hover:border-amber-500/40"
          >
            <span>Audiomack</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={ARTIST_INFO.socials.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-emerald-300 border border-slate-700/60 transition hover:border-emerald-500/40"
          >
            <span>Spotify</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={ARTIST_INFO.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-rose-300 border border-slate-700/60 transition hover:border-rose-500/40"
          >
            <span>YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={ARTIST_INFO.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-xs font-bold text-emerald-300 border border-emerald-600/40 transition shadow"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Direct WhatsApp Booking & Management</span>
          </a>
        </div>
      </section>

      {/* App Roadmap Note (Reflecting Version 2 & Version 3 mentioned in user prompt) */}
      <section className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Award className="w-4 h-4" />
          <span>BIG SEVEN Music — App Roadmap</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          <strong>Version 1 (Active):</strong> Android app with offline-ready audio player, official lyrics, direct MP3 downloads, and artist admin dashboard.
        </p>
        <p className="text-slate-400">
          <strong>Version 2:</strong> User accounts, custom playlists, favorites, and fan comments.
          <br />
          <strong>Version 3:</strong> Push notifications, Google AdMob in-app monetization, and full music promotion suite.
        </p>
      </section>
    </div>
  );
};
