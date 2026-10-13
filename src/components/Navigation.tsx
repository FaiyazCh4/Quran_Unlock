import React from 'react';
import { 
  Lock, 
  BookOpen, 
  Film, 
  Sparkles, 
  Compass, 
  Heart, 
  Target, 
  Bell 
} from 'lucide-react';

export type TabType = 
  | 'shield' 
  | 'reader' 
  | 'reels' 
  | 'dhikr' 
  | 'prayer' 
  | 'duas' 
  | 'tracker' 
  | 'reminders';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'shield' as TabType, label: 'Locked', icon: Lock },
    { id: 'reader' as TabType, label: 'Mushaf', icon: BookOpen },
    { id: 'reels' as TabType, label: 'Reels', icon: Film },
    { id: 'dhikr' as TabType, label: 'Dhikr', icon: Sparkles },
    { id: 'prayer' as TabType, label: 'Prayers', icon: Compass },
    { id: 'duas' as TabType, label: 'Duas', icon: Heart },
    { id: 'tracker' as TabType, label: 'Goals', icon: Target },
    { id: 'reminders' as TabType, label: 'Schedule', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="ios-glass rounded-2xl p-1 shadow-2xl shadow-black/90 border border-white/10 backdrop-blur-2xl">
          <div className="grid grid-cols-8 items-center w-full gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 active:scale-90 text-center select-none ${
                    isActive
                      ? 'text-emerald-400 font-bold'
                      : 'text-stone-400 hover:text-stone-200 font-medium'
                  }`}
                  title={tab.label}
                  aria-label={tab.label}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-emerald-500/15 rounded-xl -z-10 border border-emerald-500/30 shadow-xs" />
                  )}
                  
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-115 text-emerald-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  
                  <span className="text-[9px] mt-0.5 tracking-tight leading-none block truncate max-w-full">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
