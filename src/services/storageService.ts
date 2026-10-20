import { BlockedApp, UnlockRule, SpiritualGoal, DailyLog, ReadingReminder, Badge, Reciter, DhikrItem, FavoriteVerse, HighlightColor } from '../types';
import { RECITERS } from '../data/quranData';
import { DEFAULT_DHIKR_ITEMS } from '../data/azkarData';

export const DEFAULT_BLOCKED_APPS: BlockedApp[] = [
  { id: 'instagram', name: 'Instagram', icon: 'camera', color: 'from-pink-500 via-rose-500 to-amber-500', category: 'Social', isLocked: true, unlockedUntil: null, dailyUsageMinutes: 52 },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: 'from-cyan-400 via-stone-900 to-rose-500', category: 'Shorts', isLocked: true, unlockedUntil: null, dailyUsageMinutes: 68 },
  { id: 'youtube', name: 'YouTube', icon: 'play-circle', color: 'from-red-600 to-rose-700', category: 'Video', isLocked: true, unlockedUntil: null, dailyUsageMinutes: 44 },
  { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', color: 'from-zinc-700 to-stone-900', category: 'Social', isLocked: true, unlockedUntil: null, dailyUsageMinutes: 35 },
  { id: 'reddit', name: 'Reddit', icon: 'message-square', color: 'from-orange-500 to-red-600', category: 'Community', isLocked: false, unlockedUntil: null, dailyUsageMinutes: 28 },
  { id: 'snapchat', name: 'Snapchat', icon: 'ghost', color: 'from-yellow-400 to-amber-500', category: 'Messaging', isLocked: false, unlockedUntil: null, dailyUsageMinutes: 20 },
  { id: 'games', name: 'Mobile Games', icon: 'gamepad-2', color: 'from-purple-500 to-indigo-600', category: 'Entertainment', isLocked: false, unlockedUntil: null, dailyUsageMinutes: 40 },
  { id: 'netflix', name: 'Netflix', icon: 'film', color: 'from-red-700 to-stone-950', category: 'Streaming', isLocked: false, unlockedUntil: null, dailyUsageMinutes: 45 },
];

export const DEFAULT_UNLOCK_RULE: UnlockRule = {
  mode: 'ayah_per_open',
  targetMinutes: 5,
  targetVerses: 1,
  targetPages: 1,
  unlockDurationMinutes: 30, // unlocks for 30 minutes
};

export const DEFAULT_GOAL: SpiritualGoal = {
  khatmTargetDays: 30, // 30-day Khatm (1 Juz / ~20 pages per day)
  startDate: new Date().toISOString().split('T')[0],
  dailyPageTarget: 4, // 4 pages per day = steady pace
  dailyMinutesTarget: 15,
  pagesReadTotal: 34,
  ayahsReadTotal: 182,
  currentJuz: 2,
};

export const DEFAULT_REMINDERS: ReadingReminder[] = [
  { id: 'rem-1', title: 'Fajr Dawn Reflection', time: '05:30', enabled: true, days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], type: 'prayer_based', surahRecommendation: 'Al-Fatihah & Ayat Al-Kursi' },
  { id: 'rem-2', title: 'Morning Focus & Detox', time: '08:30', enabled: true, days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], type: 'morning', surahRecommendation: 'Ad-Duha' },
  { id: 'rem-3', title: 'Asr Spiritual Recharge', time: '16:45', enabled: true, days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], type: 'prayer_based', surahRecommendation: 'Al-Asr' },
  { id: 'rem-4', title: 'Night Shield (Surah Al-Mulk)', time: '21:30', enabled: true, days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], type: 'bedtime', surahRecommendation: 'Al-Mulk' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'badge-1', title: 'First Unlock', description: 'Unlocked an app through the Quran for the first time', icon: 'sparkles', unlockedAt: new Date().toISOString(), category: 'detox' },
  { id: 'badge-2', title: '3-Day Consistency', description: 'Read Quran 3 consecutive days', icon: 'flame', unlockedAt: new Date().toISOString(), category: 'streak' },
  { id: 'badge-3', title: 'Ayat Al-Kursi Guardian', description: 'Memorized or recited the verse of the throne', icon: 'shield-check', unlockedAt: new Date().toISOString(), category: 'reading' },
  { id: 'badge-4', title: '7-Day Spiritual Streak', description: 'A complete week of mindful reading', icon: 'trophy', unlockedAt: null, category: 'streak' },
  { id: 'badge-5', title: 'Digital Detox Master', description: 'Saved over 2 hours of social scrolling', icon: 'smartphone-charging', unlockedAt: null, category: 'detox' },
  { id: 'badge-6', title: 'Juz 1 Completed', description: 'Finished the opening 148 verses of the Quran', icon: 'book-open', unlockedAt: null, category: 'khatm' },
  { id: 'badge-7', title: 'Surah Al-Mulk Night Owl', description: 'Read Al-Mulk 5 nights in a row before sleep', icon: 'moon', unlockedAt: null, category: 'reading' },
  { id: 'badge-8', title: '30-Day Khatm Champion', description: 'Successfully completed the entire Quran', icon: 'crown', unlockedAt: null, category: 'khatm' },
];

const KEYS = {
  BLOCKED_APPS: 'qu_blocked_apps',
  UNLOCK_RULE: 'qu_unlock_rule',
  GOALS: 'qu_spiritual_goals',
  STREAK: 'qu_streak_count',
  LAST_READ_DATE: 'qu_last_read_date',
  LOGS: 'qu_daily_logs',
  REMINDERS: 'qu_reminders',
  RECITER_ID: 'qu_reciter_id',
  BADGES: 'qu_badges',
  SHIELD_ENABLED: 'qu_shield_enabled',
  FONT_SIZE: 'qu_font_size',
  BOOKMARKS: 'qu_bookmarks',
  OFFLINE_DOWNLOADS: 'qu_offline_downloads',
  DHIKR_ITEMS: 'qu_dhikr_items',
  DHIKR_LAST_DATE: 'qu_dhikr_last_date',
  MUSHAF_PAPER_THEME: 'qu_mushaf_paper_theme',
  AUDIO_PLAYBACK_SPEED: 'qu_audio_playback_speed',
  TRANSLATION_LANGUAGE: 'qu_translation_language',
  FAVORITE_VERSES: 'qu_favorite_verses',
  VERSE_HIGHLIGHTS: 'qu_verse_highlights',
  FOCUS_READING_MODE: 'qu_focus_reading_mode',
  GLOBAL_UI_THEME: 'qu_global_ui_theme',
};

export type MushafTheme = 'cream' | 'warm' | 'night';
export type TranslationLanguage = 'both' | 'ur' | 'en';
export type GlobalUITheme = 'light' | 'dark';

export class StorageService {
  static getBlockedApps(): BlockedApp[] {
    try {
      const data = localStorage.getItem(KEYS.BLOCKED_APPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_BLOCKED_APPS;
  }

  static saveBlockedApps(apps: BlockedApp[]) {
    localStorage.setItem(KEYS.BLOCKED_APPS, JSON.stringify(apps));
  }

  static isShieldEnabled(): boolean {
    const val = localStorage.getItem(KEYS.SHIELD_ENABLED);
    return val === null ? true : val === 'true';
  }

  static setShieldEnabled(enabled: boolean) {
    localStorage.setItem(KEYS.SHIELD_ENABLED, String(enabled));
  }

  static unlockAppTemporarily(appId: string, durationMinutes: number): BlockedApp[] {
    const apps = this.getBlockedApps();
    const expiry = Date.now() + durationMinutes * 60 * 1000;
    const updated = apps.map((app) => {
      if (app.id === appId || appId === 'ALL') {
        return { ...app, unlockedUntil: expiry };
      }
      return app;
    });
    this.saveBlockedApps(updated);
    return updated;
  }

  static getUnlockRule(): UnlockRule {
    try {
      const data = localStorage.getItem(KEYS.UNLOCK_RULE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_UNLOCK_RULE;
  }

  static saveUnlockRule(rule: UnlockRule) {
    localStorage.setItem(KEYS.UNLOCK_RULE, JSON.stringify(rule));
  }

  static getSpiritualGoal(): SpiritualGoal {
    try {
      const data = localStorage.getItem(KEYS.GOALS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_GOAL;
  }

  static saveSpiritualGoal(goal: SpiritualGoal) {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goal));
  }

  static getStreak(): { current: number; best: number; lastDate: string } {
    try {
      const current = parseInt(localStorage.getItem(KEYS.STREAK) || '5', 10);
      const lastDate = localStorage.getItem(KEYS.LAST_READ_DATE) || new Date().toISOString().split('T')[0];
      return { current, best: Math.max(current, 12), lastDate };
    } catch {
      return { current: 5, best: 12, lastDate: new Date().toISOString().split('T')[0] };
    }
  }

  static recordReadingSession(minutes: number, ayahs: number, pages: number, surahNumber?: number) {
    const today = new Date().toISOString().split('T')[0];
    const streak = this.getStreak();
    let currentStreak = streak.current;

    if (streak.lastDate !== today) {
      currentStreak += 1;
      localStorage.setItem(KEYS.STREAK, String(currentStreak));
      localStorage.setItem(KEYS.LAST_READ_DATE, today);
    }

    // Update goal totals
    const goal = this.getSpiritualGoal();
    goal.pagesReadTotal += pages;
    goal.ayahsReadTotal += ayahs;
    this.saveSpiritualGoal(goal);

    // Update daily log
    const logs = this.getDailyLogs();
    let todayLog = logs.find((l) => l.date === today);
    if (!todayLog) {
      todayLog = {
        date: today,
        minutesRead: 0,
        ayahsRead: 0,
        pagesRead: 0,
        surahsExplored: [],
        appsBlockedCount: 4,
        minutesSaved: 35,
      };
      logs.push(todayLog);
    }
    todayLog.minutesRead += minutes;
    todayLog.ayahsRead += ayahs;
    todayLog.pagesRead += pages;
    todayLog.minutesSaved += minutes * 3; // every minute of Quran saves ~3 mins of doomscrolling
    if (surahNumber && !todayLog.surahsExplored.includes(surahNumber)) {
      todayLog.surahsExplored.push(surahNumber);
    }
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  }

  static getDailyLogs(): DailyLog[] {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // return default mock logs for the week
    }

    // Seed realistic past 7 days logs
    const mockLogs: DailyLog[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      mockLogs.push({
        date: dStr,
        minutesRead: i === 0 ? 12 : Math.floor(10 + Math.random() * 15),
        ayahsRead: i === 0 ? 18 : Math.floor(15 + Math.random() * 25),
        pagesRead: i === 0 ? 3 : Math.floor(2 + Math.random() * 4),
        surahsExplored: [1, 67, 93],
        appsBlockedCount: 5,
        minutesSaved: i === 0 ? 36 : Math.floor(30 + Math.random() * 45),
      });
    }
    return mockLogs;
  }

  static getReminders(): ReadingReminder[] {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_REMINDERS;
  }

  static saveReminders(reminders: ReadingReminder[]) {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  }

  static getReciter(): Reciter {
    const id = localStorage.getItem(KEYS.RECITER_ID);
    const found = RECITERS.find((r) => r.id === id);
    return found || RECITERS[0];
  }

  static setReciter(reciterId: string) {
    localStorage.setItem(KEYS.RECITER_ID, reciterId);
  }

  static getBadges(): Badge[] {
    try {
      const data = localStorage.getItem(KEYS.BADGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_BADGES;
  }

  static saveBadges(badges: Badge[]) {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  }

  static getMushafTheme(): MushafTheme {
    try {
      const val = localStorage.getItem(KEYS.MUSHAF_PAPER_THEME);
      if (val === 'cream' || val === 'warm' || val === 'night') {
        return val;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'cream';
  }

  static saveMushafTheme(theme: MushafTheme): void {
    try {
      localStorage.setItem(KEYS.MUSHAF_PAPER_THEME, theme);
    } catch (e) {
      console.warn(e);
    }
  }

  static getFontSize(): 'sm' | 'md' | 'lg' | 'xl' {
    try {
      const val = localStorage.getItem(KEYS.FONT_SIZE);
      if (val === 'sm' || val === 'md' || val === 'lg' || val === 'xl') {
        return val;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'lg';
  }

  static saveFontSize(size: 'sm' | 'md' | 'lg' | 'xl'): void {
    try {
      localStorage.setItem(KEYS.FONT_SIZE, size);
    } catch (e) {
      console.warn(e);
    }
  }

  static getBookmarks(): number[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      if (data) return JSON.parse(data);
    } catch {
      return [1, 67, 93];
    }
    return [1, 67, 93];
  }

  static toggleBookmark(surahNumber: number): number[] {
    const bms = this.getBookmarks();
    const idx = bms.indexOf(surahNumber);
    let updated: number[];
    if (idx >= 0) {
      updated = bms.filter((b) => b !== surahNumber);
    } else {
      updated = [...bms, surahNumber];
    }
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  }

  static getDownloadedSurahs(): number[] {
    try {
      const data = localStorage.getItem(KEYS.OFFLINE_DOWNLOADS);
      if (data) return JSON.parse(data);
    } catch {
      return [1, 67, 93, 94, 103, 112, 113, 114];
    }
    return [1, 67, 93, 94, 103, 112, 113, 114];
  }

  static markSurahDownloaded(surahNumber: number): number[] {
    const dl = this.getDownloadedSurahs();
    if (!dl.includes(surahNumber)) {
      const updated = [...dl, surahNumber];
      localStorage.setItem(KEYS.OFFLINE_DOWNLOADS, JSON.stringify(updated));
      return updated;
    }
    return dl;
  }

  // Dhikr Tracker Management
  static getDhikrItems(): DhikrItem[] {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(KEYS.DHIKR_LAST_DATE) || today;
    
    let items: DhikrItem[] = DEFAULT_DHIKR_ITEMS;
    try {
      const data = localStorage.getItem(KEYS.DHIKR_ITEMS);
      if (data) {
        items = JSON.parse(data);
      }
    } catch (e) {
      console.warn("Error reading dhikr items", e);
    }

    // New day reset: if date changed, reset daily counts while keeping totalCompletedCount
    if (lastDate !== today) {
      items = items.map((item) => ({
        ...item,
        currentCount: 0,
        isCompletedToday: false,
      }));
      localStorage.setItem(KEYS.DHIKR_LAST_DATE, today);
      this.saveDhikrItems(items);
    }

    return items;
  }

  static saveDhikrItems(items: DhikrItem[]): void {
    localStorage.setItem(KEYS.DHIKR_ITEMS, JSON.stringify(items));
    localStorage.setItem(KEYS.DHIKR_LAST_DATE, new Date().toISOString().split('T')[0]);
  }

  static incrementDhikr(id: string, amount: number = 1): { items: DhikrItem[]; reachedTarget: boolean; updatedItem: DhikrItem | null } {
    const items = this.getDhikrItems();
    let reachedTarget = false;
    let updatedItem: DhikrItem | null = null;

    const updated = items.map((item) => {
      if (item.id === id) {
        const nextCount = item.currentCount + amount;
        const wasCompleted = item.isCompletedToday;
        const isNowCompleted = nextCount >= item.targetCount;
        if (!wasCompleted && isNowCompleted) {
          reachedTarget = true;
        }

        const newItem: DhikrItem = {
          ...item,
          currentCount: nextCount,
          totalCompletedCount: item.totalCompletedCount + amount,
          isCompletedToday: isNowCompleted,
        };
        updatedItem = newItem;
        return newItem;
      }
      return item;
    });

    this.saveDhikrItems(updated);
    return { items: updated, reachedTarget, updatedItem };
  }

  static decrementDhikr(id: string): { items: DhikrItem[]; updatedItem: DhikrItem | null } {
    const items = this.getDhikrItems();
    let updatedItem: DhikrItem | null = null;

    const updated = items.map((item) => {
      if (item.id === id && item.currentCount > 0) {
        const nextCount = Math.max(0, item.currentCount - 1);
        const newItem: DhikrItem = {
          ...item,
          currentCount: nextCount,
          totalCompletedCount: Math.max(0, item.totalCompletedCount - 1),
          isCompletedToday: nextCount >= item.targetCount,
        };
        updatedItem = newItem;
        return newItem;
      }
      return item;
    });

    this.saveDhikrItems(updated);
    return { items: updated, updatedItem };
  }

  static resetDhikrToday(id: string): DhikrItem[] {
    const items = this.getDhikrItems();
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          currentCount: 0,
          isCompletedToday: false,
        };
      }
      return item;
    });
    this.saveDhikrItems(updated);
    return updated;
  }

  static resetAllDhikrToday(): DhikrItem[] {
    const items = this.getDhikrItems();
    const updated = items.map((item) => ({
      ...item,
      currentCount: 0,
      isCompletedToday: false,
    }));
    this.saveDhikrItems(updated);
    return updated;
  }

  static addCustomDhikr(newDhikr: {
    arabic: string;
    transliteration: string;
    translation: string;
    targetCount: number;
    category?: DhikrItem['category'];
    virtue?: string;
  }): DhikrItem[] {
    const items = this.getDhikrItems();
    const item: DhikrItem = {
      id: `custom-dhikr-${Date.now()}`,
      arabic: newDhikr.arabic || 'ذِكْرُ اللَّهِ',
      transliteration: newDhikr.transliteration || 'Dhikr',
      translation: newDhikr.translation || 'Remembrance of Allah',
      category: newDhikr.category || 'custom',
      targetCount: newDhikr.targetCount || 33,
      currentCount: 0,
      totalCompletedCount: 0,
      isCompletedToday: false,
      virtue: newDhikr.virtue || 'Purifies the soul and brings light to the heart.',
    };

    const updated = [item, ...items];
    this.saveDhikrItems(updated);
    return updated;
  }

  static deleteDhikr(id: string): DhikrItem[] {
    const items = this.getDhikrItems();
    const updated = items.filter((item) => item.id !== id);
    this.saveDhikrItems(updated);
    return updated;
  }

  static getPlaybackSpeed(): number {
    try {
      const val = localStorage.getItem(KEYS.AUDIO_PLAYBACK_SPEED);
      if (val) {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed >= 0.75 && parsed <= 1.5) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading playback speed', e);
    }
    return 1;
  }

  static savePlaybackSpeed(speed: number) {
    try {
      const clamped = Math.min(1.5, Math.max(0.75, Math.round(speed * 100) / 100));
      localStorage.setItem(KEYS.AUDIO_PLAYBACK_SPEED, clamped.toString());
    } catch (e) {
      console.warn('Error saving playback speed', e);
    }
  }

  static getTranslationLanguage(): TranslationLanguage {
    try {
      const val = localStorage.getItem(KEYS.TRANSLATION_LANGUAGE);
      if (val === 'ur' || val === 'en' || val === 'both') {
        return val;
      }
    } catch (e) {
      console.warn('Error reading translation language', e);
    }
    // Default to 'both' or 'ur' so users immediately see Urdu translation
    return 'both';
  }

  static saveTranslationLanguage(lang: TranslationLanguage) {
    try {
      localStorage.setItem(KEYS.TRANSLATION_LANGUAGE, lang);
    } catch (e) {
      console.warn('Error saving translation language', e);
    }
  }

  // Favorite Verses Management
  static getFavoriteVerses(): FavoriteVerse[] {
    try {
      const data = localStorage.getItem(KEYS.FAVORITE_VERSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading favorite verses', e);
    }
    return [];
  }

  static saveFavoriteVerses(favorites: FavoriteVerse[]): void {
    try {
      localStorage.setItem(KEYS.FAVORITE_VERSES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Error saving favorite verses', e);
    }
  }

  static toggleFavoriteVerse(verse: Omit<FavoriteVerse, 'id' | 'savedAt'> & { id?: string; savedAt?: number }): { isFavorite: boolean; favorites: FavoriteVerse[] } {
    const favorites = this.getFavoriteVerses();
    const verseId = verse.id || `${verse.surahNumber}:${verse.ayahNumberInSurah}`;
    const existingIndex = favorites.findIndex((f) => f.id === verseId || (f.surahNumber === verse.surahNumber && f.ayahNumberInSurah === verse.ayahNumberInSurah));
    
    let updated: FavoriteVerse[];
    let isFavorite: boolean;

    if (existingIndex >= 0) {
      updated = favorites.filter((_, idx) => idx !== existingIndex);
      isFavorite = false;
    } else {
      const newFav: FavoriteVerse = {
        ...verse,
        id: verseId,
        savedAt: verse.savedAt || Date.now(),
      };
      updated = [newFav, ...favorites];
      isFavorite = true;
    }

    this.saveFavoriteVerses(updated);
    return { isFavorite, favorites: updated };
  }

  static isAyahFavorite(surahNumber: number, ayahNumberInSurah: number): boolean {
    const favorites = this.getFavoriteVerses();
    return favorites.some((f) => f.surahNumber === surahNumber && f.ayahNumberInSurah === ayahNumberInSurah);
  }

  static removeFavoriteVerse(id: string): FavoriteVerse[] {
    const favorites = this.getFavoriteVerses();
    const updated = favorites.filter((f) => f.id !== id);
    this.saveFavoriteVerses(updated);
    return updated;
  }

  static updateFavoriteNote(id: string, note: string): FavoriteVerse[] {
    const favorites = this.getFavoriteVerses();
    const updated = favorites.map((f) => f.id === id ? { ...f, note } : f);
    this.saveFavoriteVerses(updated);
    return updated;
  }

  // Persistent Verse Highlights (key format: "surahNumber:ayahNumberInSurah")
  static getVerseHighlights(): Record<string, HighlightColor> {
    try {
      const data = localStorage.getItem(KEYS.VERSE_HIGHLIGHTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading verse highlights', e);
    }
    return {};
  }

  static saveVerseHighlights(highlights: Record<string, HighlightColor>): void {
    try {
      localStorage.setItem(KEYS.VERSE_HIGHLIGHTS, JSON.stringify(highlights));
    } catch (e) {
      console.warn('Error saving verse highlights', e);
    }
  }

  static getAyahHighlight(surahNumber: number, ayahNumberInSurah: number): HighlightColor | undefined {
    const highlights = this.getVerseHighlights();
    return highlights[`${surahNumber}:${ayahNumberInSurah}`];
  }

  static setVerseHighlight(
    surahNumber: number, 
    ayahNumberInSurah: number, 
    color?: HighlightColor
  ): Record<string, HighlightColor> {
    const highlights = this.getVerseHighlights();
    const key = `${surahNumber}:${ayahNumberInSurah}`;
    const updated = { ...highlights };
    
    if (color) {
      updated[key] = color;
    } else {
      delete updated[key];
    }
    
    this.saveVerseHighlights(updated);
    return updated;
  }

  static isFocusReadingMode(): boolean {
    try {
      return localStorage.getItem(KEYS.FOCUS_READING_MODE) === 'true';
    } catch {
      return false;
    }
  }

  static setFocusReadingMode(enabled: boolean): void {
    try {
      localStorage.setItem(KEYS.FOCUS_READING_MODE, String(enabled));
    } catch (e) {
      console.warn('Error saving focus reading mode', e);
    }
  }

  static getGlobalUITheme(): GlobalUITheme {
    try {
      const val = localStorage.getItem(KEYS.GLOBAL_UI_THEME);
      if (val === 'light' || val === 'dark') return val;
    } catch (e) {
      console.warn('Error reading global theme', e);
    }
    return 'dark'; // default to night/dark theme
  }

  static applyGlobalTheme(theme: GlobalUITheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    if (theme === 'light') {
      body.classList.remove('theme-dark', 'dark');
      body.classList.add('theme-light', 'theme-parchment');
      root.classList.remove('dark');
      root.classList.add('light');

      // Set CSS variables for light (parchment) theme
      root.style.setProperty('--bg-app', '#fbf7ee');
      root.style.setProperty('--bg-shell', '#f4ebd9');
      root.style.setProperty('--bg-card', 'rgba(255, 252, 245, 0.95)');
      root.style.setProperty('--bg-card-hover', '#ffffff');
      root.style.setProperty('--text-primary', '#1c1917');
      root.style.setProperty('--text-secondary', '#57534e');
      root.style.setProperty('--text-muted', '#78716c');
      root.style.setProperty('--border-subtle', 'rgba(180, 140, 80, 0.25)');
      root.style.setProperty('--border-card', 'rgba(180, 140, 80, 0.35)');
      root.style.setProperty('--accent-glow', 'rgba(217, 119, 6, 0.15)');

      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#fbf7ee');
    } else {
      body.classList.remove('theme-light', 'theme-parchment');
      body.classList.add('theme-dark', 'dark');
      root.classList.remove('light');
      root.classList.add('dark');

      // Set CSS variables for dark (night) theme
      root.style.setProperty('--bg-app', '#0c0a09');
      root.style.setProperty('--bg-shell', '#120f0d');
      root.style.setProperty('--bg-card', 'rgba(28, 25, 23, 0.85)');
      root.style.setProperty('--bg-card-hover', 'rgba(41, 37, 36, 0.9)');
      root.style.setProperty('--text-primary', '#f5f5f4');
      root.style.setProperty('--text-secondary', '#a8a29e');
      root.style.setProperty('--text-muted', '#78716c');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-card', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--accent-glow', 'rgba(16, 185, 129, 0.15)');

      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#0c0a09');
    }
  }

  static saveGlobalUITheme(theme: GlobalUITheme): void {
    try {
      localStorage.setItem(KEYS.GLOBAL_UI_THEME, theme);
      this.applyGlobalTheme(theme);
    } catch (e) {
      console.warn('Error saving global theme', e);
    }
  }
}
