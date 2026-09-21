import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const AdMobBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-3 my-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[9px] uppercase tracking-wider shrink-0 border border-emerald-500/30">
          AdMob
        </span>
        <p className="truncate text-slate-300">
          <span className="font-semibold text-white">Google AdMob Placement (v3 Slot):</span> Support BIG SEVEN with official music streaming.
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => alert('Monetization Note: As planned for Version 3, this slot connects to Google AdMob for in-app rewarded audio ads and banner impressions on Android, separate from web AdSense.')}
          className="text-slate-400 hover:text-amber-400 transition"
          title="Monetization details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 transition"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
