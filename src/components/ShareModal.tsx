import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Share2 } from 'lucide-react';
import { Song } from '../types';

interface ShareModalProps {
  song: Song;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ song, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.origin + window.location.pathname + `?song=${song.id}`;
  const shareText = `Listen to "${song.title}" by BIG SEVEN (${song.genre}) on BIG SEVEN Music!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} - BIG SEVEN`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        id="share-modal-content"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Share Song</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Song preview card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover shadow" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-white truncate">{song.title}</h4>
            <p className="text-xs text-amber-400 font-medium">BIG SEVEN • {song.genre}</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/40 text-emerald-300 font-medium text-xs transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTwitter}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-700/40 text-sky-300 font-medium text-xs transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-sky-600/30 flex items-center justify-center font-bold text-sm">
              𝕏
            </div>
            <span>Twitter / X</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/40 text-amber-300 font-medium text-xs transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-amber-600/30 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-amber-400" />
            </div>
            <span>System Share</span>
          </button>
        </div>

        {/* Copy link bar */}
        <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-xs text-slate-300 px-2 flex-1 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
