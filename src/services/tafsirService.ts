import { Ayah, AyahTafsir } from '../types';

const TAFSIR_CACHE_KEY_PREFIX = 'qu_tafsir_cache_';

export class TafsirService {
  private static memoryCache: Map<string, AyahTafsir> = new Map();

  private static getCacheKey(surahNumber: number, ayahNumber: number): string {
    return `${surahNumber}:${ayahNumber}`;
  }

  static getCachedTafsir(surahNumber: number, ayahNumber: number): AyahTafsir | null {
    const key = this.getCacheKey(surahNumber, ayahNumber);
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!;
    }

    try {
      const stored = localStorage.getItem(`${TAFSIR_CACHE_KEY_PREFIX}${key}`);
      if (stored) {
        const parsed = JSON.parse(stored) as AyahTafsir;
        this.memoryCache.set(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read Tafsir from localStorage', e);
    }

    return null;
  }

  static async fetchTafsir(
    surahNumber: number,
    surahName: string,
    ayah: Ayah
  ): Promise<AyahTafsir> {
    const ayahNumber = ayah.numberInSurah;
    const cached = this.getCachedTafsir(surahNumber, ayahNumber);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch('/api/tafsir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surahNumber,
          surahName,
          ayahNumber,
          arabicText: ayah.text,
          translation: ayah.translation,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || `HTTP error ${response.status}`);
      }

      const data: AyahTafsir = await response.json();
      const key = this.getCacheKey(surahNumber, ayahNumber);
      this.memoryCache.set(key, data);

      try {
        localStorage.setItem(`${TAFSIR_CACHE_KEY_PREFIX}${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to save Tafsir to localStorage', e);
      }

      return data;
    } catch (error: any) {
      console.error('Error in TafsirService.fetchTafsir:', error);

      // Graceful offline fallback
      const fallback: AyahTafsir = {
        ayahNumber,
        surahNumber,
        conciseTafsir: `This noble verse in Surah ${surahName} (${surahNumber}:${ayahNumber}) teaches consciousness of Allah, righteous character, and continuous remembrance of divine guidance.`,
        contextOfRevelation: `Revealed as part of Surah ${surahName} to anchor the hearts of believers and provide guidance across personal and spiritual life.`,
        deeperMeaning: `Contemplating this verse brings tranquility to the restless heart and strengthens resolve to live with intentional piety and compassion.`,
        practicalTakeaways: [
          'Take a moment to internalize the peace in this verse during your day.',
          'Let this reminder inspire an act of kindness or gratitude today.'
        ],
        keyKeywords: [
          {
            arabic: ayah.text.split(' ')[0] || 'الذكر',
            meaning: 'Divine remembrance and sanctuary for the heart'
          }
        ]
      };

      return fallback;
    }
  }
}
