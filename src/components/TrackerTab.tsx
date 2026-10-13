import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Flame, 
  Trophy, 
  Clock, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Play, 
  Square, 
  Plus, 
  CheckCircle2, 
  Check, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpiritualGoal, DailyLog, Badge } from '../types';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';

interface TrackerTabProps {
  goal: SpiritualGoal;
  onUpdateGoal: (goal: SpiritualGoal) => void;
  streak: { current: number; best: number };
  dailyLogs: DailyLog[];
  onSessionLogged: () => void;
}

export const TrackerTab: React.FC<TrackerTabProps> = ({
  goal,
  onUpdateGoal,
  streak,
  dailyLogs,
  onSessionLogged,
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [badges, setBadges] = useState<Badge[]>(StorageService.getBadges());
  const [showPaceModal, setShowPaceModal] = useState(false);

  // Focus reading timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && sessionSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStopAndSaveSession = () => {
    setIsTimerRunning(false);
    const mins = Math.max(1, Math.round(sessionSeconds / 60));
    StorageService.recordReadingSession(mins, mins * 2, 1);
    setSessionSeconds(0);
    onSessionLogged();
    NotificationService.playUnlockSound();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleManualAddPage = () => {
    StorageService.recordReadingSession(5, 10, 1);
    onSessionLogged();
    NotificationService.playUnlockSound();
  };

  // Khatm calculations: 604 pages total
  const TOTAL_PAGES = 604;
  const progressPercent = Math.min(100, Math.round((goal.pagesReadTotal / TOTAL_PAGES) * 1000) / 10);
  const pagesRemaining = Math.max(0, TOTAL_PAGES - goal.pagesReadTotal);
  const estDaysRemaining = Math.ceil(pagesRemaining / Math.max(1, goal.dailyPageTarget));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find((l) => l.date === todayStr) || {
    minutesRead: 12,
    ayahsRead: 18,
    pagesRead: 2,
    minutesSaved: 36,
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Title */}
      <div className="space-y-1 px-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>Spiritual Goals & Khatm</span>
        </h1>
        <p className="text-xs text-stone-400">
          Personalized progress tracking to help you finish the Quran and build lifelong devotion.
        </p>
      </div>

      {/* Khatm Grand Circular Ring Card */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Holy Quran Khatm Goal
            </span>
            <h2 className="text-sm font-bold text-white">
              {goal.khatmTargetDays}-Day Completion Pace
            </h2>
          </div>
          <button
            onClick={() => setShowPaceModal(true)}
            className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 text-xs transition"
          >
            Adjust Pace
          </button>
        </div>

        {/* Radial Progress & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-5">
          {/* Circular Graphic */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-stone-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-emerald-400"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{progressPercent}%</span>
              <span className="text-[10px] text-stone-400 font-medium">Completed</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-4 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <div className="text-left">
                <span className="text-[10px] text-stone-400 block">Pages Read</span>
                <span className="text-base font-bold text-white">
                  {goal.pagesReadTotal} <span className="text-stone-500 text-xs">/ 604</span>
                </span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 block">Daily Target</span>
                <span className="text-base font-bold text-emerald-400">
                  {goal.dailyPageTarget} pages/day
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Remaining: <strong className="text-white">{pagesRemaining} pages</strong></span>
              <span>~{estDaysRemaining} days left</span>
            </div>

            {/* Quick manual log button */}
            <button
              onClick={handleManualAddPage}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log +1 Page Read</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Focus Reading Timer Card */}
      <div className="ios-glass rounded-3xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Focused Quran Session Timer</h3>
              <p className="text-[10px] text-stone-400">Read in tranquility without device distractions</p>
            </div>
          </div>

          <div className="font-mono text-base font-bold text-emerald-400">
            {formatTimer(sessionSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Reading Timer</span>
            </button>
          ) : (
            <button
              onClick={handleStopAndSaveSession}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Finish & Record Progress</span>
            </button>
          )}
        </div>
      </div>

      {/* Streak & Screen Time Saved Showcase */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 via-stone-900 to-stone-950 border border-orange-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400/30" />
            <span className="text-[10px] text-stone-400 font-medium">Best: {streak.best}d</span>
          </div>
          <div className="text-2xl font-black text-white">{streak.current} Days</div>
          <div className="text-[11px] text-orange-300 font-medium">Daily Quran Streak 🔥</div>
        </div>

        {/* Screen Time Saved card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/40 via-stone-900 to-stone-950 border border-teal-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <Zap className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] text-stone-400 font-medium">Today</span>
          </div>
          <div className="text-2xl font-black text-white">{todayLog.minutesSaved}m</div>
          <div className="text-[11px] text-teal-300 font-medium">Screen Time Detoxed ✨</div>
        </div>
      </div>

      {/* Badges & Achievements Showcase */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Spiritual Milestones & Badges</span>
          </h3>
          <span className="text-[10px] text-stone-400 font-mono">
            {badges.filter((b) => b.unlockedAt).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-stone-900/90 to-stone-950 border-amber-500/30'
                    : 'bg-stone-900/30 border-stone-800/60 opacity-55'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-xs text-white block truncate">
                      {badge.title}
                    </span>
                    <span className="text-[9px] text-stone-400 block truncate">
                      {isUnlocked ? 'Unlocked' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 mt-2 line-clamp-2 leading-tight">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pace Adjustment Modal */}
      {showPaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl ios-glass border border-emerald-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-bold text-sm text-white">Select Khatm Pace</h3>
              <button
                onClick={() => setShowPaceModal(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-stone-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {[
                { days: 30, pagesPerDay: 20, label: '30 Days (Ramadan Pace)', desc: '1 Juz / 20 pages every day' },
                { days: 60, pagesPerDay: 10, label: '60 Days (Steady Pace)', desc: '10 pages every day' },
                { days: 100, pagesPerDay: 6, label: '100 Days (Balanced Pace)', desc: '6 pages every day' },
                { days: 365, pagesPerDay: 2, label: '1 Year (Gentle Habit)', desc: '1-2 pages every day' },
              ].map((p) => (
                <button
                  key={p.days}
                  onClick={() => {
                    onUpdateGoal({
                      ...goal,
                      khatmTargetDays: p.days,
                      dailyPageTarget: p.pagesPerDay,
                    });
                    setShowPaceModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition ${
                    goal.khatmTargetDays === p.days
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-emerald-300">{p.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatTimer(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
