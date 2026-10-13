import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Clock, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  Zap,
  Smartphone,
  Info
} from 'lucide-react';
import { BlockedApp, UnlockRule } from '../types';
import { CircularGoalIndicator } from './CircularGoalIndicator';
import { DailyWisdom } from './DailyWisdom';

interface ShieldTabProps {
  blockedApps: BlockedApp[];
  onToggleAppLock: (appId: string) => void;
  onLaunchApp: (app: BlockedApp) => void;
  onLockImmediately: (appId: string) => void;
  isShieldActive: boolean;
  onToggleShield: () => void;
  unlockRule: UnlockRule;
  onUpdateRule: (rule: UnlockRule) => void;
  savedMinutesToday: number;
  readingMinutesToday?: number;
  dailyGoalMinutes?: number;
  onNavigateToReader?: () => void;
  onUpdateDailyGoal?: (minutes: number) => void;
  onQuickLogReading?: (minutes: number) => void;
}

export const ShieldTab: React.FC<ShieldTabProps> = ({
  blockedApps,
  onToggleAppLock,
  onLaunchApp,
  onLockImmediately,
  isShieldActive,
  onToggleShield,
  unlockRule,
  onUpdateRule,
  savedMinutesToday,
  readingMinutesToday = 12,
  dailyGoalMinutes = 15,
  onNavigateToReader,
  onUpdateDailyGoal,
  onQuickLogReading,
}) => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'locked' | 'unlocked'>('all');

  const lockedApps = blockedApps.filter((a) => a.isLocked);
  const currentlyUnlocked = blockedApps.filter(
    (a) => a.unlockedUntil && a.unlockedUntil > Date.now()
  );

  const filteredApps = blockedApps.filter((app) => {
    const isTempUnlocked = app.unlockedUntil && app.unlockedUntil > Date.now();
    if (activeFilter === 'locked') return app.isLocked && !isTempUnlocked;
    if (activeFilter === 'unlocked') return isTempUnlocked;
    return true;
  });

  const progressPercent = Math.min(100, Math.round((readingMinutesToday / Math.max(1, dailyGoalMinutes)) * 100));

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Daily Wisdom: Rotating selection of inspiring verses & Hadith regarding the Quran */}
      <DailyWisdom onNavigateToReader={onNavigateToReader} />

      {/* Top Shield Status Banner */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                iOS Screen Time Shield
              </span>
              {currentlyUnlocked.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                  {currentlyUnlocked.length} Session Active
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isShieldActive ? 'Focus Shield Active' : 'Shield Paused'}</span>
              {isShieldActive ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed max-w-xs">
              Distracting apps stay locked until you complete your Quran habit. Reclaim your soul and time.
            </p>
          </div>

          {/* Master Toggle */}
          <button
            onClick={onToggleShield}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
              isShieldActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-stone-800'
            }`}
            aria-label="Toggle Shield"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                isShieldActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
          <div className="p-2 rounded-2xl bg-stone-900/40 border border-white/5">
            <span className="text-[11px] text-stone-400 block">Saved Today</span>
            <span className="text-base font-bold text-emerald-400">{savedMinutesToday}m</span>
          </div>
          <div className="p-2 rounded-2xl bg-stone-900/40 border border-white/5">
            <span className="text-[11px] text-stone-400 block">Locked Apps</span>
            <span className="text-base font-bold text-amber-400">{lockedApps.length}</span>
          </div>
          <div className="p-2 rounded-2xl bg-stone-900/40 border border-white/5">
            <span className="text-[11px] text-stone-400 block">Daily Goal</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block truncate">
              {readingMinutesToday}/{dailyGoalMinutes}m ({progressPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Circular Progress Indicator for Daily Quran Reading Goal */}
      <CircularGoalIndicator
        currentMinutes={readingMinutesToday}
        goalMinutes={dailyGoalMinutes}
        onNavigateToReader={onNavigateToReader}
        onQuickLogMinutes={onQuickLogReading}
        onUpdateGoal={onUpdateDailyGoal}
      />

      {/* Interactive App Launcher & Tester Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Protected Apps</span>
            </h2>
            <p className="text-[11px] text-stone-400">
              Tap any app to test the real-world Quran gatekeeper!
            </p>
          </div>

          <button
            onClick={() => setShowRuleModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 text-xs font-medium transition active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rule Settings</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-1 pb-1 overflow-x-auto">
          {(['all', 'locked', 'unlocked'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                activeFilter === filter
                  ? 'bg-emerald-500 text-stone-950 font-bold'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {filter === 'all' ? `All (${blockedApps.length})` : filter === 'locked' ? `Locked (${lockedApps.length})` : `Unlocked (${currentlyUnlocked.length})`}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredApps.map((app) => {
            const isTempUnlocked = Boolean(app.unlockedUntil && app.unlockedUntil > Date.now());
            const minsLeft = isTempUnlocked
              ? Math.max(1, Math.ceil((app.unlockedUntil! - Date.now()) / (60 * 1000)))
              : 0;

            return (
              <div
                key={app.id}
                className={`group relative rounded-2xl p-3.5 border transition-all duration-200 text-left ${
                  isTempUnlocked
                    ? 'bg-gradient-to-b from-emerald-950/40 to-stone-900/60 border-emerald-500/30'
                    : app.isLocked
                    ? 'ios-glass-card hover:border-stone-600'
                    : 'bg-stone-900/40 border-stone-800/60 opacity-65'
                }`}
              >
                {/* Top: App Icon & Lock/Unlock Icon */}
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${app.color} p-0.5 shadow-md flex items-center justify-center`}>
                    <div className="w-full h-full bg-stone-950/60 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                      <span className="text-sm font-black text-white">{app.name.charAt(0)}</span>
                    </div>
                  </div>

                  {/* Shield Toggle on/off */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAppLock(app.id);
                    }}
                    className={`p-1.5 rounded-lg border transition ${
                      app.isLocked
                        ? 'bg-stone-800/90 text-amber-400 border-amber-500/20'
                        : 'bg-stone-900 text-stone-500 border-stone-800'
                    }`}
                    title={app.isLocked ? "Shield active for this app" : "Shield paused for this app"}
                  >
                    {app.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* App Name & Category */}
                <div className="mt-2.5">
                  <div className="font-semibold text-xs text-white truncate">{app.name}</div>
                  <div className="text-[10px] text-stone-400">{app.category} • ~{app.dailyUsageMinutes}m/day</div>
                </div>

                {/* Status or Launch Button */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  {isTempUnlocked ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {minsLeft}m left
                      </span>
                      <button
                        onClick={() => onLockImmediately(app.id)}
                        className="text-[10px] text-stone-400 hover:text-amber-400 underline"
                      >
                        Lock now
                      </button>
                    </div>
                  ) : app.isLocked ? (
                    <button
                      onClick={() => onLaunchApp(app)}
                      className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-[11px] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Test Launch</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleAppLock(app.id)}
                      className="w-full py-1 text-[11px] text-stone-400 hover:text-stone-300"
                    >
                      + Add to Shield
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guided Walkthrough Card */}
      <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-stone-300 font-semibold">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>How "Quran Unlock" Works on iOS</span>
        </div>
        <p className="text-stone-400 text-[11px] leading-relaxed">
          1. <strong>Select Distracting Apps</strong> (Instagram, TikTok, YouTube).
          <br />
          2. Whenever you attempt to open them, Apple's Screen Time framework or the Quran Gatekeeper prompts you to read your designated portion of Quran.
          <br />
          3. Once recited, your mind is calmed, and the app unlocks for 30 minutes!
        </p>
      </div>

      {/* Rule Configuration Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl ios-glass border border-emerald-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-bold text-sm text-white">Customize Unlock Rules</h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-stone-800"
              >
                Close
              </button>
            </div>

            {/* Rule Modes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 block">Unlock Challenge Type</label>
              {[
                { id: 'ayah_per_open', label: '1 Ayah before opening', desc: 'Read 1 verse (~30s) each time you launch a locked app' },
                { id: 'daily_minutes', label: 'Daily Quran Minutes Goal', desc: 'Read 5-15 mins of Quran to unlock apps for the whole day' },
                { id: 'daily_pages', label: 'Daily Pages Goal', desc: 'Complete 1 full page of the Mushaf to unlock' },
                { id: 'prayer_routine', label: 'Post-Prayer Focus', desc: 'Read after each prayer to keep apps unlocked' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateRule({ ...unlockRule, mode: opt.id as any })}
                  className={`w-full p-2.5 rounded-xl text-left border transition ${
                    unlockRule.mode === opt.id
                      ? 'bg-emerald-500/15 border-emerald-400 text-white'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="text-xs font-semibold text-emerald-300">{opt.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Unlock Duration Slider */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300">Unlock Duration Window</span>
                <span className="text-emerald-400 font-bold">{unlockRule.unlockDurationMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={unlockRule.unlockDurationMinutes}
                onChange={(e) => onUpdateRule({ ...unlockRule, unlockDurationMinutes: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-[10px] text-stone-500">
                After reciting the Ayah, apps will remain available for {unlockRule.unlockDurationMinutes} mins before re-locking.
              </p>
            </div>

            <button
              onClick={() => setShowRuleModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs"
            >
              Save Rule Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
