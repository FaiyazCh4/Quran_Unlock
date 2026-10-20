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
  X,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NotificationService } from '../services/notificationService';
import { D3GoalProgressRing } from './D3GoalProgressRing';

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
  const [scrubPreviewMinutes, setScrubPreviewMinutes] = useState<number | null>(null);

  const validGoal = Math.max(1, goalMinutes);
  const progressPercent = Math.round((currentMinutes / validGoal) * 100);
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
          colors: ['#10b981', '#34d399', '#f59e0b', '#38bdf8', '#ffffff'],
        });
      } catch {}
    }
  };

  const handleScrubMinutes = (scrubbedMins: number) => {
    setScrubPreviewMinutes(scrubbedMins);
    // If user clicked or dragged on ring, allow logging difference
    const diff = scrubbedMins - currentMinutes;
    if (diff > 0 && onQuickLogMinutes) {
      onQuickLogMinutes(diff);
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 2000);
      if (scrubbedMins >= validGoal) {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#10b981', '#34d399', '#38bdf8'],
          });
        } catch {}
      }
    }
  };

  return (
    <div className={`ios-glass-card rounded-3xl p-4.5 border border-emerald-500/35 relative overflow-hidden shadow-xl ${className}`}>
      {/* Background glow ambiance */}
      <div className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
        isCompleted ? 'bg-emerald-400/25' : 'bg-emerald-500/15'
      }`} />

      {/* Header Label Row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span>Daily Quran Reading Goal</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              D3 Interactive
            </span>
          </span>
        </div>

        {/* Adjust Target Goal Button */}
        <button
          onClick={() => setShowGoalSelector(!showGoalSelector)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700/60 text-[11px] font-medium transition active:scale-95 cursor-pointer"
          title="Change daily reading target"
          aria-label="Change target reading goal"
        >
          <Sliders className="w-3 h-3 text-emerald-400" />
          <span>Goal: {validGoal}m</span>
        </button>
      </div>

      {/* Main Content: D3 Progress-Ring Visualization + Dynamic Context */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
        {/* D3 Interactive Progress Ring Container */}
        <div className="relative shrink-0 flex items-center justify-center p-1">
          <D3GoalProgressRing
            currentMinutes={currentMinutes}
            goalMinutes={validGoal}
            size={144}
            strokeWidth={12}
            onScrubMinutes={handleScrubMinutes}
            interactive={true}
          />
        </div>

        {/* Details & Dynamic Context Information */}
        <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left w-full">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              {isCompleted ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h2 className="text-sm font-bold text-white leading-snug">
                    Daily Goal Achieved!
                  </h2>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h2 className="text-sm font-bold text-white leading-snug">
                    {currentMinutes} of {validGoal} mins read today
                  </h2>
                </>
              )}
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed mt-1 max-w-sm mx-auto sm:mx-0">
              {isCompleted ? (
                <span className="text-emerald-300">
                  Alhamdulillah! Your screen time shield is satisfied and protected apps are unlocked.
                </span>
              ) : (
                <span>
                  Read <strong className="text-emerald-400">{remainingMinutes} more min{remainingMinutes === 1 ? '' : 's'}</strong> to satisfy your screen time gatekeeper and unlock distracting apps.
                </span>
              )}
            </p>
          </div>

          {/* Interactive Milestone Indicator Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
            {[25, 50, 75, 100].map((pct) => {
              const reached = progressPercent >= pct;
              return (
                <div
                  key={pct}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border transition-all ${
                    reached
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                      : 'bg-stone-900/60 text-stone-500 border-stone-800'
                  }`}
                  title={`${pct}% of daily goal`}
                >
                  {reached ? '✓ ' : ''}{pct}%
                </div>
              );
            })}
          </div>

          {/* Interactive Action Controls */}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
            {onNavigateToReader && (
              <button
                onClick={onNavigateToReader}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-950/40 active:scale-95 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-950" />
                <span>Read Quran</span>
                <ArrowRight className="w-3 h-3 text-stone-950" />
              </button>
            )}

            {onQuickLogMinutes && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickAdd(5)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer ${
                    justLogged 
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                      : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 border-stone-700/70'
                  }`}
                  title="Log 5 minutes of mindful Quran reading"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>+5m</span>
                </button>

                <button
                  onClick={() => handleQuickAdd(10)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/70 text-xs font-semibold active:scale-95 transition cursor-pointer"
                  title="Log 10 minutes of mindful Quran reading"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>+10m</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Customization Modal / Dropdown */}
      {showGoalSelector && (
        <div className="mt-3.5 pt-3 border-t border-stone-800/80 animate-fade-in space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Set Daily Reading Target Goal:</span>
            </span>
            <button
              onClick={() => setShowGoalSelector(false)}
              className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
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
                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
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
