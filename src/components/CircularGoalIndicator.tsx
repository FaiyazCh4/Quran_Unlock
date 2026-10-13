import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Plus, 
  Sliders, 
  Check,
  Trophy,
  Flame,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NotificationService } from '../services/notificationService';

interface CircularGoalIndicatorProps {
  currentMinutes: number;
  goalMinutes: number;
  onNavigateToReader?: () => void;
  onQuickLogMinutes?: (minutes: number) => void;
  onUpdateGoal?: (minutes: number) => void;
  className?: string;
}

export const CircularGoalIndicator: React.FC<CircularGoalIndicatorProps> = ({
  currentMinutes,
  goalMinutes,
  onNavigateToReader,
  onQuickLogMinutes,
  onUpdateGoal,
  className = '',
}) => {
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  // SVG circular geometry calculations
  const size = 116;
  const strokeWidth = 9.5;
  const radius = (size - strokeWidth) / 2; // ~53.25
  const circumference = 2 * Math.PI * radius; // ~334.58
  
  const validGoal = Math.max(1, goalMinutes);
  const progressRatio = currentMinutes / validGoal;
  const progressPercent = Math.round(progressRatio * 100);
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;
  
  const isCompleted = currentMinutes >= validGoal;
  const remainingMinutes = Math.max(0, validGoal - currentMinutes);

  const goalOptions = [5, 10, 15, 20, 30, 45, 60];

  const handleQuickAdd = (minutes: number) => {
    if (!onQuickLogMinutes) return;
    onQuickLogMinutes(minutes);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);

    const willAchieve = currentMinutes + minutes >= validGoal;
    NotificationService.playUnlockSound();

    if (willAchieve) {
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.55 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#38bdf8', '#ffffff']
        });
      } catch {}
    }
  };

  return (
    <div className={`ios-glass-card rounded-3xl p-4.5 border border-emerald-500/30 relative overflow-hidden shadow-xl ${className}`}>
      {/* Background glow ambiance */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
        isCompleted ? 'bg-emerald-400/20' : 'bg-emerald-500/10'
      }`} />

      {/* Header Label Row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Daily Quran Reading Goal
          </span>
        </div>

        {/* Adjust Target Goal Button */}
        <button
          onClick={() => setShowGoalSelector(!showGoalSelector)}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700/60 text-[11px] font-medium transition active:scale-95"
          title="Change daily reading target"
        >
          <Sliders className="w-3 h-3 text-emerald-400" />
          <span>Goal: {validGoal}m</span>
        </button>
      </div>

      {/* Main Content: Circular Progress Indicator + Dynamic Stats */}
      <div className="flex items-center gap-4">
        {/* Circular Indicator */}
        <div className="relative shrink-0 flex items-center justify-center p-1">
          <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
            <defs>
              <linearGradient id="shieldGoalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="shieldGoalGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Inactive Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#292524" // stone-800
              strokeWidth={strokeWidth}
              fill="transparent"
              className="opacity-75"
            />

            {/* Dynamic Progress Stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#shieldGoalGradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter={isCompleted ? "url(#shieldGoalGlow)" : undefined}
              className="transition-all duration-800 ease-out"
            />
          </svg>

          {/* Central Progress Statistics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-2">
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-0.5 animate-pulse" />
                <span className="text-base font-black text-white leading-tight">100%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  Satisfied
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-black text-white tracking-tight leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[11px] font-bold text-emerald-400 mt-0.5 leading-tight">
                  {currentMinutes}<span className="text-[9px] text-stone-400 font-normal">/{validGoal}m</span>
                </span>
                <span className="text-[8px] text-stone-400 font-medium uppercase tracking-wider mt-0.5">
                  Today
                </span>
              </>
            )}
          </div>
        </div>

        {/* Details & Dynamic Context Information */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5 leading-snug">
              {isCompleted ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Daily Goal Achieved!</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentMinutes} of {validGoal} mins read</span>
                </>
              )}
            </h2>
            <p className="text-[11px] text-stone-300 leading-relaxed mt-0.5">
              {isCompleted ? (
                <span className="text-emerald-300">
                  Alhamdulillah! Your screen time shield is satisfied and apps are unlocked.
                </span>
              ) : (
                <span>
                  Read <strong className="text-emerald-400">{remainingMinutes} more minute{remainingMinutes === 1 ? '' : 's'}</strong> today to keep your spiritual streak and unlock apps.
                </span>
              )}
            </p>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            {onNavigateToReader && (
              <button
                onClick={onNavigateToReader}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-950/40 active:scale-95 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-950" />
                <span>Read Quran</span>
                <ArrowRight className="w-3 h-3 text-stone-950" />
              </button>
            )}

            {onQuickLogMinutes && (
              <button
                onClick={() => handleQuickAdd(5)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
                  justLogged 
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 border-stone-700/70'
                }`}
                title="Simulate or log 5 minutes of mindful Quran reading"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>+5m Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Goal Customization Modal / Dropdown */}
      {showGoalSelector && (
        <div className="mt-3.5 pt-3 border-t border-stone-800/80 animate-fade-in space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300 font-semibold">
            <span>Set Daily Reading Goal:</span>
            <button
              onClick={() => setShowGoalSelector(false)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {goalOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onUpdateGoal?.(opt);
                  setShowGoalSelector(false);
                }}
                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition text-center border ${
                  validGoal === opt
                    ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-sm'
                    : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                {opt}m
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
