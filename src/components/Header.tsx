import React, { useState } from 'react';
import { 
  Shield, 
  Flame, 
  WifiOff, 
  Unlock, 
  Lock, 
  Trophy, 
  Calendar, 
  Clock, 
  ArrowRight, 
  X, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Radio, 
  Play, 
  Pause,
  CheckCircle2,
  Smartphone,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlockedApp, Ayah } from '../types';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  streak: number;
  bestStreak?: number;
  isShieldActive: boolean;
  blockedApps: BlockedApp[];
  isOffline: boolean;
  onOpenShieldTab: () => void;
  onOpenTrackerTab: () => void;
  minutesReadToday: number;
  currentPlayingAyah?: Ayah | null;
  isPlayingAudio?: boolean;
  currentPlayingSurahName?: string;
  onTogglePlayAudio?: () => void;
  onOpenReaderTab?: () => void;
  currentTab?: string;
  onToggleShield?: () => void;
  onToggleAppLock?: (appId: string) => void;
  onLockImmediately?: (appId: string) => void;
  onUnlockAllApps?: (durationMinutes: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  bestStreak = streak,
  isShieldActive,
  blockedApps,
  isOffline,
  onOpenShieldTab,
  onOpenTrackerTab,
  minutesReadToday,
  currentPlayingAyah,
  isPlayingAudio,
  currentPlayingSurahName = 'Surah Al-Fatiha',
  onTogglePlayAudio,
  onOpenReaderTab,
  currentTab,
  onToggleShield,
  onToggleAppLock,
  onLockImmediately,
  onUnlockAllApps,
}) => {
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);

  const activeUnlocks = blockedApps.filter(
    (app) => app.unlockedUntil && app.unlockedUntil > Date.now()
  );
  const lockedCount = blockedApps.filter((a) => a.isLocked && (!a.unlockedUntil || a.unlockedUntil <= Date.now())).length;

  const handleStreakClick = () => {
    setShowStreakModal(true);
    if (streak > 0) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.2, x: 0.8 },
          colors: ['#f97316', '#fbbf24', '#f59e0b', '#10b981'],
        });
      } catch {}
    }
  };

  const handleNavigateToTracker = () => {
    setShowStreakModal(false);
    onOpenTrackerTab();
  };

  // Generate 7-day visual dots
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 py-2.5 ios-glass border-b border-stone-800/80 transition-all">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          {/* Logo & App Name - Sleek, single baseline alignment */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AppLogo size="sm" />
            <div className="min-w-0">
              <h1 className="font-bold text-sm tracking-tight text-stone-100 truncate">
                Quran Unlock
              </h1>
              {minutesReadToday > 0 && (
                <p className="text-[10px] text-stone-400 truncate">
                  {minutesReadToday}m read today
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Island Status Pill - Compact, centered & responsive */}
          <button
            onClick={() => setShowLockedModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 text-xs transition active:scale-95 shrink-0 shadow-xs cursor-pointer"
            title="Shield & Locked Apps manager (tap to open)"
            aria-label="Shield status"
          >
            {activeUnlocks.length > 0 ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Unlock className="w-3 h-3" />
                <span className="truncate max-w-[85px]">
                  {activeUnlocks[0].name}
                </span>
              </div>
            ) : isShieldActive ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                <Shield className="w-3 h-3 fill-emerald-500/20" />
                <span>{lockedCount} Locked</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                <Shield className="w-3 h-3 opacity-60" />
                <span>Paused</span>
              </div>
            )}
          </button>

          {/* Quick Badges: Streak & Offline Indicator (top right corner controls) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Offline Pill - Only displayed when offline */}
            {isOffline && (
              <button 
                onClick={() => setShowOfflineModal(true)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 animate-pulse cursor-pointer active:scale-95 transition"
                title="Offline mode active (tap for details)"
                aria-label="Offline status"
              >
                <WifiOff className="w-3 h-3" />
                <span className="hidden xs:inline">Offline</span>
              </button>
            )}

            {/* Streak Flame Pill Button - Top Right Corner Interactive Action */}
            <button
              onClick={handleStreakClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 hover:from-orange-500/25 hover:to-amber-500/25 border border-orange-500/30 hover:border-orange-500/50 text-orange-400 cursor-pointer active:scale-95 transition-all shadow-xs"
              title={`${streak} day reading streak (tap to view streak details)`}
              aria-label={`${streak} day reading streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span className="font-bold text-xs">{streak}</span>
            </button>
          </div>
        </div>

        {/* Persistent Recitation Pill in Header (Non-intrusive, zero reading obstruction) */}
        {currentPlayingAyah && (
          <div className="max-w-md mx-auto mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between gap-2 text-xs animate-fade-in">
            <button
              onClick={onOpenReaderTab}
              className="flex items-center gap-2 min-w-0 text-left hover:opacity-90 transition cursor-pointer"
              title="Quran recitation active. Tap to view current verse"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                {isPlayingAudio && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div className="truncate flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-300 truncate">
                  {currentPlayingSurahName} • {currentPlayingAyah.numberInSurah === 0 ? 'Opening Bismillah' : `Ayah ${currentPlayingAyah.numberInSurah}`}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 font-mono shrink-0">
                  Talawat
                </span>
              </div>
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              {onTogglePlayAudio && (
                <button
                  onClick={onTogglePlayAudio}
                  className="w-6 h-6 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center active:scale-90 transition cursor-pointer"
                  title={isPlayingAudio ? 'Pause recitation' : 'Play recitation'}
                >
                  {isPlayingAudio ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current translate-x-0.5" />}
                </button>
              )}
              {currentTab !== 'reader' && onOpenReaderTab && (
                <button
                  onClick={onOpenReaderTab}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-0.5 ml-1"
                >
                  <span>Mushaf</span>
                  <span>➔</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Streak Details Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl ios-glass border border-orange-500/30 p-5 shadow-2xl text-stone-100 space-y-4">
            {/* Close button */}
            <button
              onClick={() => setShowStreakModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Flame Hero */}
            <div className="text-center pt-2 space-y-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shadow-xl shadow-orange-500/30 mx-auto flex items-center justify-center animate-pulse">
                  <div className="w-full h-full bg-stone-950/80 rounded-[14px] flex items-center justify-center">
                    <Flame className="w-9 h-9 fill-orange-500 text-amber-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-stone-950 font-black text-[10px] shadow">
                  🔥 {streak}d
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {streak > 0 ? `${streak} Day Streak!` : 'Start Your Streak'}
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-[260px] mx-auto leading-relaxed">
                  {streak > 0
                    ? "Alhamdulillah! You are cultivating daily consistency with Allah's words."
                    : 'Read 1 ayah today to ignite your daily Quran reading streak!'}
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-mono">CURRENT</span>
                <span className="text-base font-bold text-orange-400">{streak} Days</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-mono">BEST</span>
                <span className="text-base font-bold text-amber-400">{Math.max(streak, bestStreak)} Days</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-mono">TODAY</span>
                <span className="text-base font-bold text-emerald-400">{minutesReadToday}m</span>
              </div>
            </div>

            {/* 7-Day Consistency Dots */}
            <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-stone-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>This Week's Momentum</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {minutesReadToday > 0 ? '✓ Active Today' : '⏳ Pending Today'}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {dayLabels.map((day, idx) => {
                  const isPast = idx < todayDayIndex;
                  const isToday = idx === todayDayIndex;
                  const hasRead = isToday ? minutesReadToday > 0 : isPast && streak > (todayDayIndex - idx);

                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono text-stone-400">{day}</span>
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isToday && minutesReadToday > 0
                            ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-stone-950 shadow-md shadow-orange-500/30 ring-2 ring-orange-400/50'
                            : isToday
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 ring-1 ring-orange-500/30'
                            : hasRead
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-stone-800/60 text-stone-500'
                        }`}
                      >
                        {hasRead ? '🔥' : isToday ? '•' : '○'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Prophetic Quote */}
            <p className="text-[11px] text-stone-400 italic text-center px-2">
              "The deeds most beloved to Allah are those done regularly, even if small."
            </p>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleNavigateToTracker}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition"
              >
                <span>Go to Goals & Habits Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-medium transition"
              >
                Keep Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Mode Details Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl ios-glass border border-amber-500/30 p-5 shadow-2xl text-stone-100 space-y-4">
            <button
              onClick={() => setShowOfflineModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Offline Mode Active</h3>
                <p className="text-xs text-amber-300/90 font-mono">No internet required</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Quran Unlock comes with the Complete Holy Quran text, tajweed audio recitations, and offline habit tracking saved on your device storage. You can read, listen, and reflect anywhere without connectivity.
            </p>

            <button
              onClick={() => setShowOfflineModal(false)}
              className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Interactive Locked Apps & Shield Manager Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl ios-glass border border-emerald-500/40 p-5 shadow-2xl text-stone-100 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-stone-950/80 rounded-[14px] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Locked Apps & Focus</h3>
                <p className="text-xs text-stone-400">
                  {lockedCount} of {blockedApps.length} apps locked with Quran Gatekeeper
                </p>
              </div>
            </div>

            {/* Shield Master Status & Toggle */}
            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Master Focus Shield</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  {isShieldActive ? 'Active: Apps are locked until Quran is read' : 'Paused: Apps open freely'}
                </div>
              </div>

              {onToggleShield && (
                <button
                  onClick={onToggleShield}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors ${
                    isShieldActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-stone-800'
                  }`}
                  aria-label="Toggle Focus Shield"
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                    isShieldActive ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onLockImmediately) {
                    blockedApps.forEach((a) => onLockImmediately(a.id));
                  }
                }}
                className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Lock All Now</span>
              </button>

              <button
                onClick={() => {
                  if (onUnlockAllApps) {
                    onUnlockAllApps(15);
                  }
                }}
                className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick Unlock 15m</span>
              </button>
            </div>

            {/* List of Apps with Fast Toggle */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                PROTECTED APPS
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {blockedApps.map((app) => {
                  const isTempUnlocked = Boolean(app.unlockedUntil && app.unlockedUntil > Date.now());
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-900/60 border border-stone-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${app.color} flex items-center justify-center text-[10px] font-bold text-white shadow-xs`}>
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white leading-tight">{app.name}</div>
                          <div className="text-[9px] text-stone-400">
                            {isTempUnlocked ? 'Unlocked session active' : app.isLocked ? 'Locked with Quran rule' : 'Protection off'}
                          </div>
                        </div>
                      </div>

                      {onToggleAppLock && (
                        <button
                          onClick={() => onToggleAppLock(app.id)}
                          className={`p-1.5 rounded-lg border transition active:scale-95 ${
                            app.isLocked
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-stone-800 text-stone-500 border-stone-700'
                          }`}
                          title={app.isLocked ? 'Unlock app' : 'Lock app'}
                        >
                          {app.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setShowLockedModal(false);
                  onOpenShieldTab();
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
              >
                <span>Open Full Shield Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

