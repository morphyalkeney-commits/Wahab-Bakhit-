import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface AndroidHeaderProps {
  isFramed: boolean;
  onToggleFrame: () => void;
  appName?: string;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  isFramed,
  onToggleFrame,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      {/* Android System Status Bar */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-400 border-b border-slate-800/40">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300 tracking-tight">{time || '12:00'}</span>
          <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-400 font-bold rounded">5G</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[10px]">98%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* App Action Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center font-black text-black shadow-md shadow-amber-500/20 text-xs tracking-tighter">
            B7
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wide text-white uppercase font-display">
                BIG SEVEN
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">African Dancehall • Afrobeat</p>
          </div>
        </div>

        {/* Quick Viewport Toggle (Android Frame vs Expanded Responsive) */}
        <button
          onClick={onToggleFrame}
          id="btn-toggle-viewport"
          title={isFramed ? 'Switch to Fluid Desktop View' : 'Switch to Android Mobile Device View'}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
        >
          {isFramed ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Desktop</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Android View</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
