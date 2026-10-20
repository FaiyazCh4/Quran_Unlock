/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ShieldTab } from './components/ShieldTab';
import { ReaderTab } from './components/ReaderTab';
import { ReelsTab } from './components/ReelsTab';
import { DhikrTab } from './components/DhikrTab';
import { TrackerTab } from './components/TrackerTab';
import { RemindersTab } from './components/RemindersTab';
import { PrayersTab } from './components/PrayersTab';
import { DuasTab } from './components/DuasTab';
import { AppBlockerModal } from './components/AppBlockerModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { 
  BlockedApp, 
  Ayah, 
  UnlockRule, 
  SpiritualGoal, 
  ReadingReminder, 
  Reciter, 
  DailyLog,
  GlobalUITheme 
} from './types';
import { StorageService } from './services/storageService';
import { SURAHS_LIST, getSurahVerses, BISMILLAH_AYAH } from './data/quranData';
import { webAudioRecitation } from './services/webAudioRecitationService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('shield');
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(true);
  const [activeModalApp, setActiveModalApp] = useState<BlockedApp | null>(null);
  const [unlockRule, setUnlockRule] = useState<UnlockRule>(StorageService.getUnlockRule());
  const [spiritualGoal, setSpiritualGoal] = useState<SpiritualGoal>(StorageService.getSpiritualGoal());
  const [streak, setStreak] = useState<{ current: number; best: number }>(StorageService.getStreak());
  const [reminders, setReminders] = useState<ReadingReminder[]>(StorageService.getReminders());
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(StorageService.getReciter());
  const [bookmarks, setBookmarks] = useState<number[]>(StorageService.getBookmarks());
  const [downloadedSurahs, setDownloadedSurahs] = useState<number[]>(StorageService.getDownloadedSurahs());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(StorageService.getDailyLogs());
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Global UI Theme (Light Parchment vs Dark Night)
  const [globalTheme, setGlobalTheme] = useState<GlobalUITheme>(() => StorageService.getGlobalUITheme());

  const handleToggleGlobalTheme = (theme: GlobalUITheme) => {
    setGlobalTheme(theme);
    StorageService.saveGlobalUITheme(theme);
  };

  useEffect(() => {
    StorageService.applyGlobalTheme(globalTheme);
  }, [globalTheme]);

  // Audio Player State
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<Ayah | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingSurahName, setCurrentPlayingSurahName] = useState('Surah Al-Fatiha');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [seekRatio, setSeekRatio] = useState<number | null>(null);

  // In-app simulation toast notification (replaces window.alert for iframe compatibility)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Focus Reading Mode (hides navigation & audio bars for deep distraction-free recitation)
  const [isFocusReadingMode, setIsFocusReadingMode] = useState<boolean>(() => StorageService.isFocusReadingMode());

  const handleToggleFocusReadingMode = (enabled: boolean) => {
    setIsFocusReadingMode(enabled);
    StorageService.setFocusReadingMode(enabled);
  };

  // Load initial stored values
  useEffect(() => {
    setBlockedApps(StorageService.getBlockedApps());
    setIsShieldActive(StorageService.isShieldEnabled());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for temporary unlock expiries (e.g., 30m window)
    const interval = setInterval(() => {
      const apps = StorageService.getBlockedApps();
      let hasChanges = false;
      const updated = apps.map((app) => {
        if (app.unlockedUntil && app.unlockedUntil <= Date.now()) {
          hasChanges = true;
          return { ...app, unlockedUntil: null };
        }
        return app;
      });
      if (hasChanges) {
        StorageService.saveBlockedApps(updated);
        setBlockedApps(updated);
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Handlers for Shield tab
  const handleToggleAppLock = (appId: string) => {
    const updated = blockedApps.map((a) => (a.id === appId ? { ...a, isLocked: !a.isLocked } : a));
    setBlockedApps(updated);
    StorageService.saveBlockedApps(updated);
  };

  const handleToggleShield = () => {
    const next = !isShieldActive;
    setIsShieldActive(next);
    StorageService.setShieldEnabled(next);
  };

  const handleLaunchApp = (app: BlockedApp) => {
    if (!isShieldActive) {
      showToast(`[Simulation] ${app.name} opened directly (Shield is paused).`);
      return;
    }
    const isTempUnlocked = app.unlockedUntil && app.unlockedUntil > Date.now();
    if (isTempUnlocked) {
      showToast(`[Simulation] ${app.name} is unlocked! You have uninterrupted access.`);
      return;
    }
    // Launch the signature Quran Gatekeeper screen
    setActiveModalApp(app);
  };

  const handleLockImmediately = (appId: string) => {
    const updated = blockedApps.map((a) => (a.id === appId ? { ...a, unlockedUntil: null } : a));
    setBlockedApps(updated);
    StorageService.saveBlockedApps(updated);
  };

  const handleAppUnlocked = (appId: string, durationMinutes: number) => {
    const updated = StorageService.unlockAppTemporarily(appId, durationMinutes);
    setBlockedApps(updated);
    setActiveModalApp(null);
    setStreak(StorageService.getStreak());
    setDailyLogs(StorageService.getDailyLogs());
  };

  const handleUnlockAllApps = (durationMinutes: number) => {
    const updated = StorageService.unlockAppTemporarily('ALL', durationMinutes);
    setBlockedApps(updated);
    setStreak(StorageService.getStreak());
    setDailyLogs(StorageService.getDailyLogs());
  };

  // Audio Handlers
  const handlePlayAyah = (ayah: Ayah, surahName: string) => {
    webAudioRecitation.ensureAudioContext();
    webAudioRecitation.startKeepAlive();
    setCurrentPlayingAyah(ayah);
    setCurrentPlayingSurahName(surahName);
    setIsPlayingAudio(true);
    setPlaybackProgress(0);
    setAudioCurrentTime(0);
  };

  const handleTogglePlayAudio = () => {
    webAudioRecitation.ensureAudioContext();
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleNextAyah = async () => {
    if (!currentPlayingAyah) return;
    setPlaybackProgress(0);
    setAudioCurrentTime(0);
    const currentSurahVerses = await getSurahVerses(currentPlayingAyah.surahNumber);
    
    // If currently reciting Bismillah (numberInSurah === 0), the next is Ayah 1 of this Surah
    if (currentPlayingAyah.numberInSurah === 0) {
      if (currentSurahVerses.length > 0) {
        setCurrentPlayingAyah(currentSurahVerses[0]);
        setIsPlayingAudio(true);
      } else {
        setIsPlayingAudio(false);
      }
      return;
    }

    const nextIndex = currentSurahVerses.findIndex((a) => a.numberInSurah === currentPlayingAyah.numberInSurah) + 1;
    if (nextIndex < currentSurahVerses.length) {
      setCurrentPlayingAyah(currentSurahVerses[nextIndex]);
      setIsPlayingAudio(true);
    } else {
      // Reached end of Surah
      setIsPlayingAudio(false);
    }
  };

  const handlePrevAyah = async () => {
    if (!currentPlayingAyah) return;
    setPlaybackProgress(0);
    setAudioCurrentTime(0);
    const currentSurahVerses = await getSurahVerses(currentPlayingAyah.surahNumber);
    
    // If on Ayah 1, go back to Bismillah if Surah is not 1 or 9
    if (currentPlayingAyah.numberInSurah === 1 && currentPlayingAyah.surahNumber !== 1 && currentPlayingAyah.surahNumber !== 9) {
      setCurrentPlayingAyah({
        ...BISMILLAH_AYAH,
        surahNumber: currentPlayingAyah.surahNumber,
      });
      setIsPlayingAudio(true);
      return;
    }

    const prevIndex = currentSurahVerses.findIndex((a) => a.numberInSurah === currentPlayingAyah.numberInSurah) - 1;
    if (prevIndex >= 0) {
      setCurrentPlayingAyah(currentSurahVerses[prevIndex]);
      setIsPlayingAudio(true);
    }
  };

  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    StorageService.setReciter(reciter.id);
  };

  const handleToggleBookmark = (surahNumber: number) => {
    const updated = StorageService.toggleBookmark(surahNumber);
    setBookmarks(updated);
  };

  const handleDownloadSurah = (surahNumber: number) => {
    const updated = StorageService.markSurahDownloaded(surahNumber);
    setDownloadedSurahs(updated);
  };

  const handleDownloadAllEssential = () => {
    [1, 2, 18, 36, 55, 67, 93, 94, 103, 112, 113, 114].forEach((num) => {
      StorageService.markSurahDownloaded(num);
    });
    setDownloadedSurahs(StorageService.getDownloadedSurahs());
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find((l) => l.date === todayStr) || {
    minutesRead: 12,
    minutesSaved: 36,
  };

  const isFocusModeActive = isFocusReadingMode && currentTab === 'reader';

  return (
    <div className={`min-h-screen ${globalTheme === 'light' ? 'bg-[#fbf7ee] text-stone-900' : 'bg-stone-950 text-stone-100'} flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300`}>
      {/* iOS App Shell Container */}
      <div className={`w-full max-w-md mx-auto min-h-screen flex flex-col relative border-x shadow-2xl transition-colors duration-300 ${
        globalTheme === 'light'
          ? 'border-amber-900/15 bg-gradient-to-b from-[#fbf7ee] via-[#f7f0e1] to-[#fbf7ee] text-stone-900'
          : 'border-stone-800/40 bg-gradient-to-b from-stone-950 via-stone-900/50 to-stone-950 text-stone-100'
      }`}>
        
        {/* iOS Header & Status Bar (hidden in Focus Reading Mode for maximum reading immersion) */}
        {!isFocusModeActive && (
          <Header
            streak={streak.current}
            bestStreak={streak.best}
            isShieldActive={isShieldActive}
            blockedApps={blockedApps}
            isOffline={isOffline}
            onOpenShieldTab={() => setCurrentTab('shield')}
            onOpenTrackerTab={() => setCurrentTab('tracker')}
            minutesReadToday={todayLog.minutesRead}
            currentPlayingAyah={currentPlayingAyah}
            isPlayingAudio={isPlayingAudio}
            currentPlayingSurahName={currentPlayingSurahName}
            onTogglePlayAudio={handleTogglePlayAudio}
            onOpenReaderTab={() => setCurrentTab('reader')}
            currentTab={currentTab}
            onToggleShield={handleToggleShield}
            onToggleAppLock={handleToggleAppLock}
            onLockImmediately={handleLockImmediately}
            onUnlockAllApps={handleUnlockAllApps}
          />
        )}

        {/* Tab Content Body */}
        <main className={`flex-1 ${isFocusModeActive ? 'px-2.5 sm:px-4 pt-1.5 pb-6' : 'px-4 pt-3 pb-24'} overflow-y-auto transition-all duration-300`}>
          {currentTab === 'shield' && (
            <ShieldTab
              blockedApps={blockedApps}
              onToggleAppLock={handleToggleAppLock}
              onLaunchApp={handleLaunchApp}
              onLockImmediately={handleLockImmediately}
              isShieldActive={isShieldActive}
              onToggleShield={handleToggleShield}
              unlockRule={unlockRule}
              onUpdateRule={(r) => {
                setUnlockRule(r);
                StorageService.saveUnlockRule(r);
              }}
              savedMinutesToday={todayLog.minutesSaved}
              readingMinutesToday={todayLog.minutesRead}
              dailyGoalMinutes={spiritualGoal.dailyMinutesTarget}
              onNavigateToReader={() => setCurrentTab('reader')}
              onUpdateDailyGoal={(minutes) => {
                const updated = { ...spiritualGoal, dailyMinutesTarget: minutes };
                setSpiritualGoal(updated);
                StorageService.saveSpiritualGoal(updated);
              }}
              onQuickLogReading={(minutes) => {
                StorageService.recordReadingSession(minutes, minutes * 2, 1);
                setDailyLogs(StorageService.getDailyLogs());
                setStreak(StorageService.getStreak());
                setSpiritualGoal(StorageService.getSpiritualGoal());
              }}
            />
          )}

          {currentTab === 'reader' && (
            <ReaderTab
              onPlayAyah={handlePlayAyah}
              currentPlayingAyah={currentPlayingAyah}
              isPlaying={isPlayingAudio}
              selectedReciter={selectedReciter}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              downloadedSurahs={downloadedSurahs}
              onDownloadSurah={handleDownloadSurah}
              playbackProgress={playbackProgress}
              audioCurrentTime={audioCurrentTime}
              audioDuration={audioDuration}
              onSeekWord={(ratio) => setSeekRatio(ratio)}
              isFocusReadingMode={isFocusReadingMode}
              onToggleFocusReadingMode={handleToggleFocusReadingMode}
            />
          )}

          {currentTab === 'reels' && (
            <ReelsTab
              onUnlockAllApps={handleUnlockAllApps}
              onOpenMushafWithSurah={(surahNum) => {
                setCurrentTab('reader');
              }}
            />
          )}

          {currentTab === 'dhikr' && (
            <DhikrTab
              onSessionLogged={() => {
                setDailyLogs(StorageService.getDailyLogs());
              }}
            />
          )}

          {currentTab === 'prayer' && <PrayersTab />}

          {currentTab === 'duas' && <DuasTab />}

          {currentTab === 'tracker' && (
            <TrackerTab
              goal={spiritualGoal}
              onUpdateGoal={(g) => {
                setSpiritualGoal(g);
                StorageService.saveSpiritualGoal(g);
              }}
              streak={streak}
              dailyLogs={dailyLogs}
              onSessionLogged={() => {
                setStreak(StorageService.getStreak());
                setSpiritualGoal(StorageService.getSpiritualGoal());
                setDailyLogs(StorageService.getDailyLogs());
              }}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersTab
              reminders={reminders}
              onSaveReminders={(rems) => {
                setReminders(rems);
                StorageService.saveReminders(rems);
              }}
              selectedReciter={selectedReciter}
              onChangeReciter={handleReciterChange}
              downloadedSurahsCount={downloadedSurahs.length}
              onDownloadAllEssential={handleDownloadAllEssential}
              globalTheme={globalTheme}
              onChangeGlobalTheme={handleToggleGlobalTheme}
            />
          )}
        </main>

        {/* Sticky iOS Audio Player Bar if playing (Hidden in Focus Reading Mode) */}
        {currentPlayingAyah && !isFocusModeActive && (
          <AudioPlayerBar
            currentAyah={currentPlayingAyah}
            isPlaying={isPlayingAudio}
            onTogglePlay={handleTogglePlayAudio}
            onNextAyah={handleNextAyah}
            onPrevAyah={handlePrevAyah}
            selectedReciter={selectedReciter}
            onChangeReciter={handleReciterChange}
            surahName={currentPlayingSurahName}
            onPlayStateChange={(playing) => setIsPlayingAudio(playing)}
            onPlaybackProgress={(curr, dur, ratio) => {
              setAudioCurrentTime(curr);
              setAudioDuration(dur);
              setPlaybackProgress(ratio);
            }}
            externalSeekRatio={seekRatio}
            onSeekHandled={() => setSeekRatio(null)}
            onClose={() => {
              setIsPlayingAudio(false);
              setCurrentPlayingAyah(null);
              setPlaybackProgress(0);
            }}
            onNavigateToReader={() => setCurrentTab('reader')}
            currentTab={currentTab}
          />
        )}

        {/* iOS Frosted Bottom Navigation (Hidden in Focus Reading Mode) */}
        {!isFocusModeActive && (
          <Navigation
            currentTab={currentTab}
            onSelectTab={(tab) => {
              if (tab === currentTab) {
                const mainEl = document.querySelector('main');
                if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
              }
              setCurrentTab(tab);
            }}
          />
        )}

        {/* Interactive iOS App Blocker Modal (Quran Gatekeeper) */}
        {activeModalApp && (
          <AppBlockerModal
            app={activeModalApp}
            onClose={() => setActiveModalApp(null)}
            onUnlocked={(appId, duration) => handleAppUnlocked(appId, duration)}
            onOpenMushaf={() => {
              setActiveModalApp(null);
              setCurrentTab('reader');
            }}
          />
        )}

        {/* Floating App Notification Toast (non-blocking for iframe compatibility) */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-[90%] pointer-events-none transition-all">
            <div className="ios-glass-card rounded-2xl p-3 border border-emerald-500/40 shadow-2xl flex items-center gap-2.5 text-xs text-white backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
              <p className="flex-1 font-medium">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
