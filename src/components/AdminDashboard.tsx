import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Edit,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Plus,
  RefreshCw,
  Eye,
  Disc,
  X
} from 'lucide-react';
import { Song, AdminStats, Genre } from '../types';
import { storageService } from '../services/storageService';

interface AdminDashboardProps {
  songs: Song[];
  onSongsUpdated: (updatedSongs: Song[]) => void;
  onOpenSongPage: (song: Song) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  songs,
  onSongsUpdated,
  onOpenSongPage,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    storageService.isAdminAuthenticated()
  );
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'analytics'>('upload');

  // New Song Form state
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState<Genre>('African Dancehall');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newLyrics, setNewLyrics] = useState('');
  const [newProducer, setNewProducer] = useState('BIG SEVEN');
  const [newBpm, setNewBpm] = useState('110');
  const [newDescription, setNewDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Editing Song state
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Deleting Song confirmation
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);

  // Admin stats computation
  const stats: AdminStats = useMemo(() => storageService.getStats(songs), [songs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'bigseven7' || passcode.trim() === '777') {
      storageService.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Hint: use "bigseven7" or click Fast Unlock below.');
    }
  };

  const handleFastUnlock = () => {
    storageService.setAdminAuthenticated(true);
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleLogout = () => {
    storageService.setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Handle Cover image file picker
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Audio file picker
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewAudioUrl(url);
    }
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please provide a song title.');
      return;
    }

    const defaultCover = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';

    const created = storageService.addSong({
      title: newTitle.trim(),
      artist: 'BIG SEVEN',
      genre: newGenre === 'All' ? 'African Dancehall' : newGenre,
      coverUrl: newCoverUrl || defaultCover,
      audioUrl: newAudioUrl || 'https://cdn.freesound.org/previews/558/558778_11861866-lq.mp3',
      duration: 210,
      releaseDate: new Date().toISOString().split('T')[0],
      lyrics: newLyrics.trim() || `[Intro]\nBIG SEVEN on the microphone!\nBrand new release!\n\n[Chorus]\n${newTitle} taking over the street!`,
      producer: newProducer.trim() || 'BIG SEVEN Studios',
      bpm: parseInt(newBpm) || 110,
      description: newDescription.trim() || `Official release by BIG SEVEN in ${newGenre}.`,
      featured: false,
    });

    onSongsUpdated(storageService.getSongs());

    // Reset form
    setNewTitle('');
    setNewCoverUrl('');
    setNewAudioUrl('');
    setNewLyrics('');
    setNewDescription('');
    setFormSuccess(`"${created.title}" successfully added to BIG SEVEN catalog!`);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;

    const updated = storageService.updateSong(editingSong.id, {
      title: editingSong.title,
      genre: editingSong.genre,
      coverUrl: editingSong.coverUrl,
      lyrics: editingSong.lyrics,
      producer: editingSong.producer,
      description: editingSong.description,
      audioUrl: editingSong.audioUrl,
    });

    onSongsUpdated(updated);
    setEditingSong(null);
  };

  const handleDeleteSong = (id: string) => {
    const updated = storageService.deleteSong(id);
    onSongsUpdated(updated);
    setDeletingSongId(null);
  };

  const handleResetCatalog = () => {
    if (confirm('Are you sure you want to reset the catalog back to the original BIG SEVEN default songs?')) {
      const reset = storageService.resetToDefault();
      onSongsUpdated(reset);
    }
  };

  // If NOT authenticated, show artist admin lock screen
  if (!isAuthenticated) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white font-display">
            Admin Dashboard
          </h2>
          <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">
            Artist Portal • BIG SEVEN Only
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Only you can upload songs, upload covers, add lyrics, edit song info, delete songs, and monitor play/download counts.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl text-left shadow-xl">
          <label className="block text-xs font-semibold text-slate-300">
            Enter Admin Passcode
          </label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode (e.g. bigseven7)"
            id="admin-passcode-input"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
          />

          {authError && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{authError}</span>
            </p>
          )}

          <button
            type="submit"
            id="btn-admin-login"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm shadow transition cursor-pointer"
          >
            Unlock Dashboard
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleFastUnlock}
              className="text-xs text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
            >
              Demo Quick Unlock (Artist Bypass)
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Top Admin Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white font-display">
                Admin Dashboard
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Only you can upload, edit, delete songs and see analytics
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          id="btn-admin-logout"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
        >
          <Unlock className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Lock</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('upload')}
          id="admin-tab-upload"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-amber-500 text-black shadow'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Upload Song</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          id="admin-tab-manage"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'manage'
              ? 'bg-amber-500 text-black shadow'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Manage Songs ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          id="admin-tab-analytics"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-black shadow'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Plays & Downloads</span>
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {formSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* SUB-TAB 1: UPLOAD SONG */}
      {activeTab === 'upload' && (
        <form onSubmit={handleCreateSong} className="space-y-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload New BIG SEVEN Track</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in song metadata, upload cover art, attach audio file, and add lyrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Song Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Song Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. West Nile Anthem"
                id="input-new-song-title"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category / Genre */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category / Genre *
              </label>
              <select
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value as Genre)}
                id="select-new-song-genre"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="African Dancehall">African Dancehall</option>
                <option value="Afrobeat">Afrobeat</option>
                <option value="Amapiano">Amapiano</option>
                <option value="Alur">Alur</option>
              </select>
            </div>

            {/* Cover Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Cover Art</span>
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  id="input-cover-file"
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                />
                <input
                  type="url"
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500"
                />
                {newCoverUrl && (
                  <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    <img src={newCoverUrl} alt="Cover preview" className="w-10 h-10 rounded object-cover" />
                    <span className="text-[10px] text-emerald-400 font-semibold">Cover preview loaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Audio (MP3 / WAV)</span>
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  id="input-audio-file"
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                />
                <input
                  type="url"
                  value={newAudioUrl}
                  onChange={(e) => setNewAudioUrl(e.target.value)}
                  placeholder="Or paste direct audio URL (https://...)"
                  className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500"
                />
                {newAudioUrl && (
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    ✓ Audio source ready
                  </span>
                )}
              </div>
            </div>

            {/* Producer & BPM */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Producer Credits
              </label>
              <input
                type="text"
                value={newProducer}
                onChange={(e) => setNewProducer(e.target.value)}
                placeholder="e.g. Master P x BIG SEVEN"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tempo (BPM)
              </label>
              <input
                type="number"
                value={newBpm}
                onChange={(e) => setNewBpm(e.target.value)}
                placeholder="110"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Song Description & Release Notes
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Short backstory, mood, or inspiration behind the song"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Lyrics Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Lyrics</span>
            </label>
            <textarea
              rows={6}
              value={newLyrics}
              onChange={(e) => setNewLyrics(e.target.value)}
              placeholder={`[Intro]\nYeah, BIG SEVEN!\n\n[Verse 1]\nRiddim pumping through the speaker...\n\n[Chorus]\nSing along with the energy!`}
              id="textarea-song-lyrics"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            id="btn-submit-upload-song"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
          >
            Publish Song to BIG SEVEN Music
          </button>
        </form>
      )}

      {/* SUB-TAB 2: MANAGE SONGS (EDIT & DELETE) */}
      {activeTab === 'manage' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Catalog Management ({songs.length} Tracks)
            </h2>
            <button
              onClick={handleResetCatalog}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition cursor-pointer"
              title="Reset to default original songs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                id={`manage-song-row-${song.id}`}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover shadow shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                        {song.genre}
                      </span>
                      <span className="text-[10px] text-slate-500">{song.releaseDate}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white truncate mt-0.5">{song.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3 text-amber-400" />
                        {song.plays?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-emerald-400" />
                        {song.downloads?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: View, Edit, Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenSongPage(song)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title="View Song Page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setEditingSong(song)}
                    id={`btn-edit-song-${song.id}`}
                    className="w-8 h-8 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 flex items-center justify-center transition cursor-pointer"
                    title="Edit Song Info"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingSongId(song.id)}
                    id={`btn-delete-song-${song.id}`}
                    className="w-8 h-8 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 flex items-center justify-center transition cursor-pointer"
                    title="Delete Song"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ANALYTICS (SEE PLAY / DOWNLOAD COUNTS) */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          {/* Key Stat Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Stream Plays</span>
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
                {stats.totalPlays.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1">Live realtime listener count</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total MP3 Downloads</span>
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
                {stats.totalDownloads.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1">Saved offline to listener devices</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Track Catalog</span>
                <Disc className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
                {stats.totalSongs}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Available for streaming & download</p>
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Style & Genre Distribution
            </h3>
            <div className="space-y-2">
              {Object.entries(stats.genreBreakdown).map(([genre, count]) => {
                const percent = stats.totalSongs > 0 ? (count / stats.totalSongs) * 100 : 0;
                return (
                  <div key={genre} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{genre}</span>
                      <span className="text-slate-400">
                        {count} tracks ({Math.round(percent)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performer Songs Table */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Top Performing Tracks
            </h3>
            <div className="space-y-2">
              {[...songs]
                .sort((a, b) => (b.plays || 0) - (a.plays || 0))
                .slice(0, 5)
                .map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-amber-400 w-4">{idx + 1}</span>
                      <img src={s.coverUrl} alt={s.title} className="w-8 h-8 rounded object-cover" />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400">{s.genre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 shrink-0">
                      <span className="text-amber-400 font-semibold">{s.plays?.toLocaleString()} plays</span>
                      <span className="text-emerald-400 font-semibold">{s.downloads?.toLocaleString()} dls</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT SONG MODAL */}
      {editingSong && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Edit Song Information</h3>
              <button
                onClick={() => setEditingSong(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Song Title</label>
                <input
                  type="text"
                  value={editingSong.title}
                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Genre</label>
                <select
                  value={editingSong.genre}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, genre: e.target.value as Song['genre'] })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="African Dancehall">African Dancehall</option>
                  <option value="Afrobeat">Afrobeat</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Alur">Alur</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingSong.coverUrl}
                  onChange={(e) => setEditingSong({ ...editingSong, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Producer Notes</label>
                <input
                  type="text"
                  value={editingSong.producer || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, producer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={editingSong.description || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lyrics</label>
                <textarea
                  rows={6}
                  value={editingSong.lyrics || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, lyrics: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSong(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-song-edit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingSongId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete This Song?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This action will remove the song from BIG SEVEN Music.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingSongId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSong(deletingSongId)}
                id="btn-confirm-delete-song"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
