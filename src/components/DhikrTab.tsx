import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Check, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Heart, 
  Trophy, 
  ChevronRight, 
  Info, 
  Minus,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DhikrItem } from '../types';
import { PRESET_DHIKR_TEMPLATES } from '../data/azkarData';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';

interface DhikrTabProps {
  onSessionLogged?: () => void;
}

export const DhikrTab: React.FC<DhikrTabProps> = ({ onSessionLogged }) => {
  const [dhikrItems, setDhikrItems] = useState<DhikrItem[]>([]);
  const [activeDhikrId, setActiveDhikrId] = useState<string>('dhikr-subhanallah');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [isPressing, setIsPressing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'prayer' | 'daily' | 'forgiveness' | 'custom'>('all');

  // New Dhikr form state
  const [customArabic, setCustomArabic] = useState('');
  const [customTranslit, setCustomTranslit] = useState('');
  const [customTranslation, setCustomTranslation] = useState('');
  const [customTarget, setCustomTarget] = useState<number>(33);
  const [customCategory, setCustomCategory] = useState<DhikrItem['category']>('daily');
  const [customVirtue, setCustomVirtue] = useState('');

  // Load items on mount
  useEffect(() => {
    const items = StorageService.getDhikrItems();
    setDhikrItems(items);
    if (items.length > 0 && !items.find((i) => i.id === activeDhikrId)) {
      setActiveDhikrId(items[0].id);
    }
  }, []);

  const activeDhikr = dhikrItems.find((d) => d.id === activeDhikrId) || dhikrItems[0];

  // Daily totals
  const totalCountToday = dhikrItems.reduce((acc, curr) => acc + curr.currentCount, 0);
  const totalTargetToday = dhikrItems.reduce((acc, curr) => acc + curr.targetCount, 0);
  const completedItemsCount = dhikrItems.filter((d) => d.currentCount >= d.targetCount).length;
  const overallPercentage = totalTargetToday > 0 ? Math.min(100, Math.round((totalCountToday / totalTargetToday) * 100)) : 0;

  // Tactile increment action
  const handleIncrement = (id: string, amount: number = 1) => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Audio feedback with slight pitch dynamic variation
    if (soundEnabled) {
      const pitch = 0.95 + Math.random() * 0.15;
      NotificationService.playBeadClickSound(pitch);
    }

    if (hapticEnabled) {
      NotificationService.triggerHaptic(18);
    }

    const { items, reachedTarget, updatedItem } = StorageService.incrementDhikr(id, amount);
    setDhikrItems(items);

    if (reachedTarget) {
      // Reached goal celebration!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#10b981', '#34d399', '#fbbf24', '#ffffff'],
        });
      } catch {}
      NotificationService.playUnlockSound();
    }

    if (onSessionLogged) {
      onSessionLogged();
    }
  };

  const handleDecrement = (id: string) => {
    if (soundEnabled) {
      NotificationService.playBeadClickSound(0.8);
    }
    const { items } = StorageService.decrementDhikr(id);
    setDhikrItems(items);
  };

  const handleResetCurrent = (id: string) => {
    const updated = StorageService.resetDhikrToday(id);
    setDhikrItems(updated);
  };

  const handleResetAll = () => {
    if (confirm("Reset today's dhikr counts to zero? (All-time totals remain saved)")) {
      const updated = StorageService.resetAllDhikrToday();
      setDhikrItems(updated);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this custom dhikr?")) {
      const updated = StorageService.deleteDhikr(id);
      setDhikrItems(updated);
      if (activeDhikrId === id && updated.length > 0) {
        setActiveDhikrId(updated[0].id);
      }
    }
  };

  const handleApplyPreset = (preset: Partial<DhikrItem>) => {
    if (preset.arabic) setCustomArabic(preset.arabic);
    if (preset.transliteration) setCustomTranslit(preset.transliteration);
    if (preset.translation) setCustomTranslation(preset.translation);
    if (preset.targetCount) setCustomTarget(preset.targetCount);
    if (preset.category) setCustomCategory(preset.category);
    if (preset.virtue) setCustomVirtue(preset.virtue);
  };

  const handleSaveCustomDhikr = () => {
    if (!customTranslit.trim() && !customArabic.trim()) return;
    const updated = StorageService.addCustomDhikr({
      arabic: customArabic.trim() || 'ذِكْرُ اللَّهِ',
      transliteration: customTranslit.trim() || 'Dhikr',
      translation: customTranslation.trim() || 'Remembrance of Allah',
      targetCount: Number(customTarget) || 33,
      category: customCategory,
      virtue: customVirtue.trim() || 'Brings peace and reward from Allah.',
    });
    setDhikrItems(updated);
    setActiveDhikrId(updated[0].id);
    setShowAddModal(false);

    // Reset inputs
    setCustomArabic('');
    setCustomTranslit('');
    setCustomTranslation('');
    setCustomTarget(33);
    setCustomVirtue('');
  };

  const filteredItems = dhikrItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-5 pb-28 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="space-y-1 px-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Daily Dhikr & Tasbih</span>
        </h1>
        <p className="text-xs text-stone-400">
          Tactile bead counting, daily spiritual progress, and Sunnah supplications.
        </p>
      </div>

      {/* Daily Completion Progress Card */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Daily Dhikr Goal Progress
            </span>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span>{totalCountToday} Recited</span>
              <span className="text-stone-500 text-xs font-normal">/ {totalTargetToday} Target</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Dhikr</span>
            </button>
            <button
              onClick={handleResetAll}
              className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition"
              title="Reset Today's Counts"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="pt-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completedItemsCount} of {dhikrItems.length} Complete Today</span>
            </span>
            <span className="text-emerald-400 font-bold font-mono">{overallPercentage}%</span>
          </div>

          <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-400/50"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tactile Digital Tasbih Interactive Screen */}
      {activeDhikr && (
        <div className="rounded-3xl ios-glass border border-emerald-500/35 p-5 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Toggles: Sound, Haptic, Reset */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/20">
              Active Tasbih Bead
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  soundEnabled
                    ? 'bg-stone-800/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-stone-900 text-stone-500 border-stone-800'
                }`}
                title={soundEnabled ? "Mute Click Sound" : "Enable Click Sound"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setHapticEnabled(!hapticEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  hapticEnabled
                    ? 'bg-stone-800/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-stone-900 text-stone-500 border-stone-800'
                }`}
                title={hapticEnabled ? "Disable Vibration" : "Enable Vibration"}
              >
                <Vibrate className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleResetCurrent(activeDhikr.id)}
                className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-white border border-stone-800 transition"
                title="Reset this Dhikr count"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Arabic Text & Meaning */}
          <div className="space-y-1.5 py-1">
            <h2 className="font-quran text-3xl sm:text-4xl text-emerald-100 font-normal leading-relaxed dir-rtl">
              {activeDhikr.arabic}
            </h2>
            <div className="text-sm font-bold text-white tracking-wide">
              {activeDhikr.transliteration}
            </div>
            <p className="text-xs text-stone-300 font-light italic max-w-xs mx-auto">
              "{activeDhikr.translation}"
            </p>
          </div>

          {/* Giant Tactile Tasbih Button */}
          <div className="py-2 flex flex-col items-center justify-center">
            <button
              onClick={() => handleIncrement(activeDhikr.id, 1)}
              className={`relative group w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-150 transform select-none ${
                isPressing ? 'scale-90 shadow-inner' : 'hover:scale-[1.02] shadow-2xl'
              }`}
            >
              {/* Concentric ambient glow ring */}
              <div
                className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                  activeDhikr.currentCount >= activeDhikr.targetCount
                    ? 'bg-gradient-to-tr from-amber-500/30 via-emerald-500/30 to-teal-400/30 ring-4 ring-emerald-400/40'
                    : 'bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-stone-800/40 ring-2 ring-emerald-500/30'
                }`}
              />

              {/* Inner bead pad */}
              <div className="relative w-38 h-38 rounded-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-emerald-500/40 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Tap to Count
                </span>
                <span className="text-4xl font-black text-white font-mono my-1 tracking-tight">
                  {activeDhikr.currentCount}
                </span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  Target: {activeDhikr.targetCount}
                </span>

                {/* Completion check badge */}
                {activeDhikr.currentCount >= activeDhikr.targetCount && (
                  <div className="absolute top-2 w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-md animate-bounce">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>

            {/* Quick Adjustment: -1 and +10 */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => handleDecrement(activeDhikr.id)}
                disabled={activeDhikr.currentCount <= 0}
                className="px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 disabled:opacity-40 text-stone-300 text-xs font-mono border border-stone-800 flex items-center gap-1 transition active:scale-95"
                title="Minus 1"
              >
                <Minus className="w-3 h-3" />
                <span>1</span>
              </button>

              <button
                onClick={() => handleIncrement(activeDhikr.id, 10)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-mono border border-emerald-500/30 flex items-center gap-1 transition active:scale-95"
                title="Add 10"
              >
                <Plus className="w-3 h-3" />
                <span>10</span>
              </button>
            </div>
          </div>

          {/* Virtue Snippet */}
          {activeDhikr.virtue && (
            <div className="p-3 rounded-2xl bg-stone-950/70 border border-emerald-500/20 text-xs text-left flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-stone-300 text-[11px] leading-relaxed">
                <strong className="text-emerald-400">Virtue:</strong> {activeDhikr.virtue}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            All Adhkar ({dhikrItems.length})
          </h2>
          <span className="text-[11px] text-stone-400">
            Total All-Time: <strong className="text-emerald-400">{dhikrItems.reduce((a, b) => a + b.totalCompletedCount, 0)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-1 overflow-x-auto pb-1">
          {(['all', 'prayer', 'daily', 'forgiveness', 'custom'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-emerald-500 text-stone-950 font-bold'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat === 'all' ? 'All Adhkar' : cat === 'prayer' ? 'Post-Prayer (33x)' : cat === 'forgiveness' ? 'Istighfar' : cat}
            </button>
          ))}
        </div>

        {/* Adhkar Items Grid/List */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const isSelected = activeDhikrId === item.id;
            const isCompleted = item.currentCount >= item.targetCount;
            const pct = Math.min(100, Math.round((item.currentCount / item.targetCount) * 100));

            return (
              <div
                key={item.id}
                onClick={() => setActiveDhikrId(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/40 to-stone-900/80 border-emerald-400/60 shadow-lg'
                    : isCompleted
                    ? 'ios-glass-card border-emerald-500/20'
                    : 'ios-glass-card hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Text & Progress */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {item.transliteration}
                      </span>
                      {isCompleted && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Completed ✓
                        </span>
                      )}
                    </div>
                    <div className="font-quran text-lg text-emerald-200 dir-rtl text-right">
                      {item.arabic}
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 italic">
                      {item.translation}
                    </p>

                    {/* Mini progress line */}
                    <div className="pt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-stone-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all duration-200"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {item.currentCount} / {item.targetCount}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quick increment button on card */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(item.id, 1);
                      }}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md transition active:scale-90 ${
                        isCompleted
                          ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/25'
                          : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700'
                      }`}
                      title="Quick tap +1"
                    >
                      {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                    </button>

                    {item.category === 'custom' && (
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 rounded-lg text-stone-500 hover:text-rose-400 transition"
                        title="Delete custom dhikr"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Dhikr Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl ios-glass border border-emerald-500/30 p-5 space-y-4 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Dhikr</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sunnah Presets Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Quick Sunnah Templates
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_DHIKR_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(tmpl)}
                    className="px-2.5 py-1 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700/60 text-xs text-stone-300 transition"
                  >
                    {tmpl.transliteration} ({tmpl.targetCount}x)
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <div className="space-y-1">
                <label className="text-xs text-stone-300">Arabic Text</label>
                <input
                  type="text"
                  placeholder="e.g. سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-quran text-right text-emerald-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300">Transliteration *</label>
                <input
                  type="text"
                  placeholder="e.g. SubhanAllahi wa bihamdihi"
                  value={customTranslit}
                  onChange={(e) => setCustomTranslit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300">English Meaning</label>
                <input
                  type="text"
                  placeholder="e.g. Glory be to Allah and His praise"
                  value={customTranslation}
                  onChange={(e) => setCustomTranslation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-stone-300">Daily Target Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(parseInt(e.target.value, 10) || 33)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-stone-300">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="prayer">Post-Prayer</option>
                    <option value="forgiveness">Istighfar</option>
                    <option value="morning">Morning/Evening</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300">Virtue / Hadith (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Erases misdeeds and grants peace"
                  value={customVirtue}
                  onChange={(e) => setCustomVirtue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomDhikr}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Save Dhikr
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
