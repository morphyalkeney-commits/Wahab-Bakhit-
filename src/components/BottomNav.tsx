import React from 'react';
import { Home, Disc3, Mic2, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'music',
      label: 'Music',
      icon: <Disc3 className="w-5 h-5" />
    },
    {
      id: 'artist',
      label: 'BIG SEVEN',
      icon: <Mic2 className="w-5 h-5" />
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#0d1117]/95 backdrop-blur-lg border-t border-slate-800/90 select-none pb-safe">
      <div className="grid grid-cols-4 max-w-lg mx-auto py-1 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200 cursor-pointer ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-sm shadow-amber-500/50 animate-pulse" />
              )}
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold text-amber-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
