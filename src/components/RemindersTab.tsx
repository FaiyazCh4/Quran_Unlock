import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Clock, 
  Plus, 
  Trash2, 
  Volume2, 
  WifiOff, 
  Download, 
  Check, 
  Sun, 
  Moon, 
  Compass, 
  CheckCircle2, 
  Mic,
  Sparkles,
  Info
} from 'lucide-react';
import { ReadingReminder, Reciter, GlobalUITheme } from '../types';
import { RECITERS } from '../data/quranData';
import { PrayerService } from '../services/prayerService';
import { NotificationService } from '../services/notificationService';
import { OFFLINE_AZKAR } from '../data/azkarData';
import { StorageService } from '../services/storageService';

interface RemindersTabProps {
  reminders: ReadingReminder[];
  onSaveReminders: (reminders: ReadingReminder[]) => void;
  selectedReciter: Reciter;
  onChangeReciter: (reciter: Reciter) => void;
  downloadedSurahsCount: number;
  onDownloadAllEssential: () => void;
  globalTheme?: GlobalUITheme;
  onChangeGlobalTheme?: (theme: GlobalUITheme) => void;
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  reminders,
  onSaveReminders,
  selectedReciter,
  onChangeReciter,
  downloadedSurahsCount,
  onDownloadAllEssential,
  globalTheme,
  onChangeGlobalTheme,
}) => {
  const [localTheme, setLocalTheme] = useState<GlobalUITheme>(() => globalTheme || StorageService.getGlobalUITheme());
  const activeTheme = globalTheme || localTheme;

  const handleThemeChange = (newTheme: GlobalUITheme) => {
    setLocalTheme(newTheme);
    StorageService.saveGlobalUITheme(newTheme);
    if (onChangeGlobalTheme) {
      onChangeGlobalTheme(newTheme);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('07:30');
  const [newSurah, setNewSurah] = useState('Al-Fatihah');
  const [azkarCounters, setAzkarCounters] = useState<Record<string, number>>({});
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const prayerTimes = PrayerService.getPrayerTimes();

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onSaveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    onSaveReminders(updated);
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    const newRem: ReadingReminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      enabled: true,
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      type: 'custom',
      surahRecommendation: newSurah.trim(),
    };
    onSaveReminders([...reminders, newRem]);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleTestReminder = async () => {
    await NotificationService.requestPermission();
    NotificationService.sendNotification(
      'Quran Unlock 📖 Spiritual Habit',
      'Time for your daily Quran reflection. Read 1 verse now to stay grounded and unlock your day.'
    );
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleZikrCount = (id: string, target: number) => {
    const curr = azkarCounters[id] || 0;
    const next = curr + 1;
    setAzkarCounters({ ...azkarCounters, [id]: next });
    if (next === target) {
      NotificationService.playUnlockSound();
    }
  };

  const handleDownloadAll = () => {
    setIsDownloadingAll(true);
    setTimeout(() => {
      onDownloadAllEssential();
      setIsDownloadingAll(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Title */}
      <div className="space-y-1 px-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <span>Daily Reminders & Offline</span>
        </h1>
        <p className="text-xs text-stone-400">
          Set custom reading schedules, sync with prayers, and manage offline Quran recitations.
        </p>
      </div>

      {/* Global UI Theme Switcher (Light Parchment vs Dark Night) */}
      <div className="ios-glass-card rounded-3xl p-5 border border-stone-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTheme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Display & UI Theme
            </h2>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold transition-all ${
            activeTheme === 'light' 
              ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30' 
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          }`}>
            {activeTheme === 'light' ? 'Light (Parchment)' : 'Dark (Night)'}
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Switch the app-wide reading atmosphere between authentic Medina ivory parchment and deep night mode.
        </p>

        {/* 2-Card Visual Theme Toggle */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Light Parchment Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              activeTheme === 'light'
                ? 'bg-amber-100/90 border-amber-500/80 shadow-md ring-2 ring-amber-400/40 text-stone-900'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                  activeTheme === 'light'
                    ? 'bg-amber-200 border-amber-300 text-amber-800'
                    : 'bg-stone-800 border-stone-700 text-amber-400'
                }`}>
                  <Sun className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className={`font-bold text-xs ${activeTheme === 'light' ? 'text-stone-900' : 'text-stone-100'}`}>
                    Light Parchment
                  </div>
                  <div className={`text-[10px] ${activeTheme === 'light' ? 'text-amber-800/80' : 'text-amber-400/80'}`}>
                    Medina Paper
                  </div>
                </div>
              </div>
              {activeTheme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 w-full">
              {/* Visual preview swatch */}
              <div className="h-4 w-full rounded-md bg-[#fbf7ee] border border-amber-300/60 flex items-center px-1.5 justify-between">
                <span className="h-1.5 w-6 rounded-full bg-stone-700/60" />
                <span className="h-1.5 w-2 rounded-full bg-amber-600/70" />
              </div>
              <p className={`text-[10px] leading-tight ${activeTheme === 'light' ? 'text-stone-600' : 'text-stone-400'}`}>
                Soft ivory parchment and warm gold tones for daytime recitation.
              </p>
            </div>
          </button>

          {/* Dark Night Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              activeTheme === 'dark'
                ? 'bg-stone-900 border-emerald-500/80 shadow-md ring-2 ring-emerald-500/30 text-white'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                  activeTheme === 'dark'
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}>
                  <Moon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">
                    Dark Night
                  </div>
                  <div className="text-[10px] text-emerald-400/80">
                    Obsidian Night
                  </div>
                </div>
              </div>
              {activeTheme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 w-full">
              {/* Visual preview swatch */}
              <div className="h-4 w-full rounded-md bg-[#0c0a09] border border-stone-700 flex items-center px-1.5 justify-between">
                <span className="h-1.5 w-6 rounded-full bg-stone-300/70" />
                <span className="h-1.5 w-2 rounded-full bg-emerald-400/80" />
              </div>
              <p className="text-[10px] text-stone-400 leading-tight">
                High-contrast deep black and emerald glow for nighttime focus.
              </p>
            </div>
          </button>
        </div>

        {/* Quick Toggle Switch Bar */}
        <div className="pt-1 flex items-center justify-between p-3 rounded-2xl bg-stone-900/50 border border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${activeTheme === 'light' ? 'text-amber-600 bg-amber-500/15' : 'text-emerald-400 bg-emerald-500/15'}`}>
              {activeTheme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Quick Toggle Theme
              </div>
              <div className="text-[10px] text-stone-400">
                Currently in {activeTheme === 'light' ? 'Light (Parchment)' : 'Dark (Night)'} mode
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleThemeChange(activeTheme === 'light' ? 'dark' : 'light')}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              activeTheme === 'light' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            aria-label="Toggle global theme"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                activeTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {activeTheme === 'light' ? (
                <Sun className="w-3 h-3 text-amber-600 stroke-[2.5]" />
              ) : (
                <Moon className="w-3 h-3 text-stone-900 stroke-[2.5]" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Customizable Daily Reading Reminders */}
      <div className="ios-glass-card rounded-3xl p-5 border border-stone-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Reading Schedules
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestReminder}
              className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 text-xs flex items-center gap-1 transition"
              title="Test notification chime"
            >
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>{testNotificationSent ? 'Chime Sent!' : 'Test Sound'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition active:scale-95"
              title="Add Reminder"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-2.5">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                rem.enabled
                  ? 'bg-stone-900/80 border-stone-700/80'
                  : 'bg-stone-900/30 border-stone-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    rem.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <span>{rem.title}</span>
                    <span className="font-mono text-emerald-400 font-bold text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/10">
                      {rem.time}
                    </span>
                  </div>
                  {rem.surahRecommendation && (
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      Recommended: <span className="text-stone-300">{rem.surahRecommendation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle switch & Delete */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReminder(rem.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    rem.enabled ? 'bg-emerald-500' : 'bg-stone-800'
                  }`}
                  aria-label="Toggle reminder"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      rem.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                {rem.type === 'custom' && (
                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-1 rounded-lg text-stone-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Prayer Times Card */}
      <div className="ios-glass-card rounded-3xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Offline Prayer Times
            </h3>
          </div>
          <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/15">
            Next: {prayerTimes.nextPrayer.name} in {prayerTimes.nextPrayer.minutesLeft}m
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
          {[
            { name: 'Fajr', time: prayerTimes.fajr },
            { name: 'Dhuhr', time: prayerTimes.dhuhr },
            { name: 'Asr', time: prayerTimes.asr },
            { name: 'Maghrib', time: prayerTimes.maghrib },
            { name: 'Isha', time: prayerTimes.isha },
          ].map((p) => (
            <div
              key={p.name}
              className={`p-2 rounded-xl border ${
                prayerTimes.nextPrayer.name === p.name
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300'
              }`}
            >
              <div className="text-[10px] text-stone-400">{p.name}</div>
              <div className="font-mono font-bold text-xs mt-0.5">{p.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Storage & Audio Downloads Manager */}
      <div className="ios-glass-card rounded-3xl p-5 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Offline Storage Manager
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {downloadedSurahsCount} / 114 Cached
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Quran Unlock is engineered to work completely without Wi-Fi or cellular network. All core Surahs and translations are locally cached.
        </p>

        <button
          onClick={handleDownloadAll}
          disabled={isDownloadingAll}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
        >
          {isDownloadingAll ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Caching all Surahs & Audio offline...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download All Essential Surahs (Instant Offline)</span>
            </>
          )}
        </button>
      </div>

      {/* Reciter Voice Selection */}
      <div className="ios-glass rounded-3xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Audio Recitation Voice
          </h3>
        </div>

        <div className="space-y-1.5">
          {RECITERS.map((r) => (
            <button
              key={r.id}
              onClick={() => onChangeReciter(r)}
              className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition ${
                selectedReciter.id === r.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-white'
                  : 'bg-stone-900/50 border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div>
                <div className="font-semibold text-xs text-emerald-300">{r.name}</div>
                <div className="text-[10px] text-stone-400">{r.subname}</div>
              </div>
              {selectedReciter.id === r.id && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Offline Daily Azkar Beads Counter */}
      <div className="ios-glass-card rounded-3xl p-5 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Daily Azkar Beads Counter
            </h3>
          </div>
          <span className="text-[10px] text-stone-400">Tap to count</span>
        </div>

        <div className="space-y-3">
          {OFFLINE_AZKAR.map((zk) => {
            const count = azkarCounters[zk.id] || 0;
            const isCompleted = count >= zk.repeatTarget;

            return (
              <div
                key={zk.id}
                onClick={() => handleZikrCount(zk.id, zk.repeatTarget)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] select-none ${
                  isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/30'
                    : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-quran text-lg text-emerald-200 dir-rtl text-right">
                      {zk.arabic}
                    </p>
                    <p className="text-[11px] text-stone-300 italic">
                      "{zk.translation}"
                    </p>
                  </div>

                  {/* Counter Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isCompleted
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                        : 'bg-stone-800 text-emerald-400 border-stone-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `${count}/${zk.repeatTarget}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl ios-glass border border-emerald-500/30 p-5 space-y-4">
            <h3 className="font-bold text-sm text-white">Create Custom Reading Reminder</h3>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300">Reminder Title</label>
              <input
                type="text"
                placeholder="e.g. Midday Break Reflection"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300">Scheduled Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300">Surah Recommendation (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Surah Al-Mulk, Ya-Sin, Al-Kahf"
                value={newSurah}
                onChange={(e) => setNewSurah(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                className="w-1/2 py-2 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
