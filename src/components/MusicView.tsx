import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Download, Music2, Share2, X, SlidersHorizontal } from 'lucide-react';
import { Song, PlayerState, Genre } from '../types';

interface MusicViewProps {
  songs: Song[];
  playerState: PlayerState;
  onPlaySong: (song: Song) => void;
  onDownloadSong: (song: Song) => void;
  onOpenSongPage: (song: Song) => void;
  onOpenShare: (song: Song) => void;
}

export const MusicView: React.FC<MusicViewProps> = ({
  songs,
  playerState,
  onPlaySong,
  onDownloadSong,
  onOpenSongPage,
  onOpenShare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Genre>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'title'>('latest');

  const categories: Genre[] = ['All', 'African Dancehall', 'Afrobeat', 'Amapiano', 'Alur'];

  const filteredSongs = useMemo(() => {
    let list = [...songs];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.genre === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          (s.lyrics && s.lyrics.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // latest
      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }

    return list;
  }, [songs, selectedCategory, searchQuery, sortBy]);

  const isCurrentPlaying = (song: Song) =>
    playerState.currentSong?.id === song.id && playerState.isPlaying;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Music Library
        </h1>
        <p className="text-xs text-slate-400">
          Discover all releases, singles, and anthems by BIG SEVEN
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by song title, lyric or vibe..."
          id="music-search-input"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort and Count bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
        <span>
          Showing <strong className="text-white">{filteredSongs.length}</strong> {filteredSongs.length === 1 ? 'song' : 'songs'}
        </span>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'title')}
            className="bg-slate-900 text-slate-300 text-xs border border-slate-800 rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-amber-500"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Played</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Song List */}
      {filteredSongs.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6">
          <Music2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-white text-base">No tracks found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            No songs matching "{searchQuery}" in {selectedCategory}. Try another keyword or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSongs.map((song, index) => {
            const playing = isCurrentPlaying(song);
            return (
              <div
                key={song.id}
                id={`song-item-${song.id}`}
                className={`p-3 rounded-2xl bg-slate-900/90 border transition-all flex items-center justify-between gap-3 group hover:border-slate-700 ${
                  playing ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800'
                }`}
              >
                {/* Index / Cover / Title */}
                <div
                  onClick={() => onOpenSongPage(song)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-xs font-mono text-slate-500 w-4 text-center shrink-0 hidden sm:inline">
                    {index + 1}
                  </span>

                  {/* Song Cover */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800 shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {playing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Song title + artist + tags */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700/50">
                        {song.genre}
                      </span>
                      {song.featured && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white truncate mt-0.5 group-hover:text-amber-300 transition-colors">
                      {song.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">BIG SEVEN</span>
                      <span>•</span>
                      <span>{formatDuration(song.duration)}</span>
                      <span>•</span>
                      <span>{song.plays?.toLocaleString() || 0} plays</span>
                    </div>
                  </div>
                </div>

                {/* Direct Actions: ▶️ Play & ⬇️ Download */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Share button */}
                  <button
                    onClick={() => onOpenShare(song)}
                    id={`btn-share-item-${song.id}`}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                    title="Share track"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Play button */}
                  <button
                    onClick={() => onPlaySong(song)}
                    id={`btn-play-item-${song.id}`}
                    aria-label={playing ? 'Pause' : 'Play'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
                      playing
                        ? 'bg-amber-500 text-black shadow-amber-500/30'
                        : 'bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-black'
                    }`}
                    title={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Download button */}
                  <button
                    onClick={() => onDownloadSong(song)}
                    id={`btn-download-item-${song.id}`}
                    aria-label="Download song"
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 border border-slate-700/60 flex items-center justify-center transition cursor-pointer"
                    title="Download MP3"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
