import React from 'react';
import { Shield, BookOpen, Film, Target, Bell, Sparkles } from 'lucide-react';

export type TabType = 'shield' | 'reader' | 'reels' | 'dhikr' | 'tracker' | 'reminders';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'shield' as TabType, label: 'Shield', icon: Shield },
    { id: 'reader' as TabType, label: 'Mushaf', icon: BookOpen },
    { id: 'reels' as TabType, label: 'Reels', icon: Film },
    { id: 'dhikr' as TabType, label: 'Dhikr', icon: Sparkles },
    { id: 'tracker' as TabType, label: 'Goals', icon: Target },
    { id: 'reminders' as TabType, label: 'Schedule', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3.5 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="ios-glass rounded-2xl p-1 shadow-2xl shadow-black/80 border border-white/10 backdrop-blur-2xl">
          <div className="grid grid-cols-6 items-center w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 text-center ${
                    isActive
                      ? 'text-emerald-400 font-semibold'
                      : 'text-stone-400 hover:text-stone-200 font-medium'
                  }`}
                  title={tab.label}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-emerald-500/15 rounded-xl -z-10 border border-emerald-500/25 shadow-xs" />
                  )}
                  
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                  
                  <span className="text-[10px] mt-1 tracking-tight leading-none block truncate max-w-full">
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

