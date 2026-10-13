export interface Surah {
  number: number;
  name: string; // Arabic: سُورَةُ الفَاتِحَة
  englishName: string; // Al-Fatiha
  englishNameTranslation: string; // The Opening
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  pageStart: number;
  juzStart: number;
}

export interface Ayah {
  number: number; // overall number in Quran (1-6236)
  numberInSurah: number;
  text: string; // Arabic text
  translation: string;
  transliteration?: string;
  audio?: string;
  tafsir?: string;
  juz?: number;
  page?: number;
  surahNumber: number;
}

export interface AyahTafsir {
  ayahNumber: number;
  surahNumber: number;
  conciseTafsir: string;
  contextOfRevelation?: string;
  deeperMeaning: string;
  practicalTakeaways: string[];
  keyKeywords?: {
    arabic: string;
    meaning: string;
  }[];
}

export interface BlockedApp {
  id: string;
  name: string;
  icon: string; // Lucide or brand color
  color: string;
  category: string;
  isLocked: boolean;
  unlockedUntil: number | null; // timestamp when temporary unlock expires
  dailyUsageMinutes: number; // simulated daily usage before being blocked
}

export type UnlockRuleMode = 'ayah_per_open' | 'daily_minutes' | 'daily_pages' | 'prayer_routine';

export interface UnlockRule {
  mode: UnlockRuleMode;
  targetMinutes: number; // e.g. 5 or 15 mins
  targetVerses: number; // e.g. 1 or 5 ayahs
  targetPages: number; // e.g. 1 or 2 pages
  unlockDurationMinutes: number; // unlock window duration after reading (e.g. 30 mins)
}

export interface SpiritualGoal {
  khatmTargetDays: number; // e.g. 30, 60, 90, 365
  startDate: string;
  dailyPageTarget: number;
  dailyMinutesTarget: number;
  pagesReadTotal: number;
  ayahsReadTotal: number;
  currentJuz: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  minutesRead: number;
  ayahsRead: number;
  pagesRead: number;
  surahsExplored: number[];
  appsBlockedCount: number;
  minutesSaved: number;
}

export interface ReadingReminder {
  id: string;
  title: string;
  time: string; // HH:mm format, e.g. "06:30"
  enabled: boolean;
  days: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
  surahRecommendation?: string;
  type: 'prayer_based' | 'custom' | 'bedtime' | 'morning';
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  identifier: string; // identifier for API/CDN
  audioSubfolder: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: 'streak' | 'reading' | 'detox' | 'khatm';
}

export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: 'daily' | 'morning' | 'evening' | 'prayer' | 'forgiveness' | 'custom';
  targetCount: number; // e.g., 33, 100
  currentCount: number; // count for today
  totalCompletedCount: number; // all-time count
  isCompletedToday: boolean;
  virtue?: string;
}

export interface ReelItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  theme: string;
  reciterName: string;
  audioUrl: string;
  bgGradient: string;
  bgVideoType: 'mecca' | 'stars' | 'desert' | 'water' | 'mountains';
  reflection: string;
}

export interface WisdomItem {
  id: string;
  type: 'verse' | 'hadith';
  arabicText: string;
  translation: string;
  source: string;
  narratorOrSurah: string;
  surahNumber?: number;
  ayahNumber?: number;
  theme: string;
  reflection?: string;
  virtueHighlight?: string;
  audioUrl?: string;
}
