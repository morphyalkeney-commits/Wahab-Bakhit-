import React from 'react';
import { Play, Pause, Download, Sparkles, Flame, Disc, Radio, ArrowRight } from 'lucide-react';
import { Song, PlayerState } from '../types';

interface HomeViewProps {
  songs: Song[];
  playerState: PlayerState;
  onPlaySong: (song: Song) => void;
  onDownloadSong: (song: Song) => void;
  onNavigateToMusic: () => void;
  onNavigateToArtist: () => void;
  onOpenSongPage: (song: Song) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  songs,
  playerState,
  onPlaySong,
  onDownloadSong,
  onNavigateToMusic,
  onNavigateToArtist,
  onOpenSongPage,
}) => {
  const featuredSong = songs.find((s) => s.featured) || songs[0];
  const latestReleases = songs.slice(0, 4);

  const isCurrentPlaying = (song: Song) =>
    playerState.currentSong?.id === song.id && playerState.isPlaying;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* 1. BIG SEVEN Artist Banner (Hero) */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#151b26] to-[#0c1017] border border-slate-800 shadow-2xl">
        {/* Background ambient cover art styling */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/80 to-transparent" />

        <div className="relative p-5 sm:p-7 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                OFFICIAL ARTIST
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">West Nile • Worldwide</span>
            </div>

            <button
              onClick={onNavigateToArtist}
              id="btn-view-artist-bio"
              className="text-xs font-semibold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Artist Bio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display drop-shadow-md">
              BIG SEVEN
            </h1>
            <p className="text-amber-400 text-xs sm:text-sm font-bold tracking-wide mt-1">
              African Dancehall • Afrobeat • Amapiano • Alur
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-lg line-clamp-2 leading-relaxed">
              Official music streaming portal. Stream new bangers, read synchronized lyrics, and download MP3s directly to your device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
              🔥 1.2M+ Streams
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
              🌍 Alur Kingdom Heritage
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              ✓ Free Direct MP3 Downloads
            </span>
          </div>
        </div>
      </section>

      {/* 2. Featured Song */}
      {featuredSong && (
        <section id="featured-song-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-black text-white font-display">Featured Song</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Spotlight
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 p-4 sm:p-5 shadow-xl hover:border-amber-500/50 transition-all">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Featured Album Cover */}
              <div
                onClick={() => onOpenSongPage(featuredSong)}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 shadow-lg cursor-pointer group"
              >
                <img
                  src={featuredSong.coverUrl}
                  alt={featuredSong.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="p-2 rounded-full bg-amber-500/90 text-black shadow group-hover:scale-110 transition-transform">
                    {isCurrentPlaying(featuredSong) ? (
                      <Pause className="w-5 h-5 fill-black" />
                    ) : (
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Featured Song Metadata */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  {featuredSong.genre}
                </div>
                <h3
                  onClick={() => onOpenSongPage(featuredSong)}
                  className="text-lg sm:text-xl font-black text-white truncate cursor-pointer hover:text-amber-400 transition-colors font-display"
                >
                  {featuredSong.title}
                </h3>
                <p className="text-xs font-semibold text-slate-300">
                  {featuredSong.artist} • Produced by {featuredSong.producer || 'BIG SEVEN'}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {featuredSong.description || 'Listen to the massive anthem from BIG SEVEN.'}
                </p>

                {/* Controls */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                  <button
                    onClick={() => onPlaySong(featuredSong)}
                    id="btn-play-featured-song"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer active:scale-95"
                  >
                    {isCurrentPlaying(featuredSong) ? (
                      <>
                        <Pause className="w-4 h-4 fill-black" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black" />
                        <span>PLAY NOW</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDownloadSong(featuredSong)}
                    id="btn-download-featured-song"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-xs transition cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => onOpenSongPage(featuredSong)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 font-medium transition cursor-pointer"
                  >
                    Lyrics & Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Latest Releases */}
      <section id="latest-releases-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg font-black text-white font-display">Latest Releases</h2>
          </div>
          <button
            onClick={onNavigateToMusic}
            id="btn-see-all-songs"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
          >
            <span>All Songs ({songs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {latestReleases.map((song) => {
            const playing = isCurrentPlaying(song);
            return (
              <div
                key={song.id}
                id={`latest-song-card-${song.id}`}
                className={`flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border transition-all hover:bg-slate-800/90 ${
                  playing ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800/80'
                }`}
              >
                {/* Clickable song details */}
                <div
                  onClick={() => onOpenSongPage(song)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-800 shadow">
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    {playing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700/50">
                        {song.genre}
                      </span>
                      <span className="text-[10px] text-slate-500">{song.releaseDate}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate mt-0.5 hover:text-amber-400 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      BIG SEVEN • {song.plays?.toLocaleString()} plays
                    </p>
                  </div>
                </div>

                {/* Actions: Play & Download */}
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <button
                    onClick={() => onPlaySong(song)}
                    aria-label={playing ? 'Pause' : 'Play'}
                    id={`btn-play-release-${song.id}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shadow ${
                      playing
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-black'
                    }`}
                  >
                    {playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => onDownloadSong(song)}
                    aria-label="Download song"
                    id={`btn-download-release-${song.id}`}
                    className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition cursor-pointer"
                    title="Download track"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Quick Genre Discovery Navigation */}
      <section className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-xs font-black tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-amber-400" />
          <span>Core BIG SEVEN Styles</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['African Dancehall', 'Afrobeat', 'Amapiano', 'Alur'].map((genre) => (
            <button
              key={genre}
              onClick={onNavigateToMusic}
              className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-left transition cursor-pointer hover:border-amber-500/40 group"
            >
              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                {genre}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Explore catalog →</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
