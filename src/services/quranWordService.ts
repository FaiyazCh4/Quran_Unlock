/**
 * Quran Word Timing & Parsing Service
 * Provides word splitting, waqf mark grouping, and tajweed-weighted
 * progress calculations for precise word-by-word recitation highlighting.
 */

export interface WordTiming {
  word: string;
  cleanWord: string;
  index: number;
  startRatio: number; // 0.0 to 1.0
  endRatio: number;   // 0.0 to 1.0
}

// Quranic waqf (stop/pause) marks and special punctuation
const WAQF_MARKS = new Set([
  'ۚ', // Small High Jeem (permissible stop)
  'ۖ', // Small High Sad-Lam-Alef (preferable to continue)
  'ۗ', // Small High Qaf-Lam-Alef (preferable to stop)
  'ۘ', // Small High Meem (obligatory stop)
  'ۙ', // Small High Lam-Alef (do not stop)
  'ۛ', // Small Three Dots (stop on one, not both)
  'ۜ', // Small High Seen (slight pause without breath)
  '۞', // Rub-el-Hizb mark
  '۩', // Sajdah mark
]);

/**
 * Splits Quranic Arabic text into words, grouping attached waqf marks
 * with their respective parent words.
 */
export function splitQuranWords(text: string): string[] {
  if (!text) return [];
  const rawTokens = text.trim().split(/\s+/);
  const words: string[] = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    if (WAQF_MARKS.has(token) && words.length > 0) {
      words[words.length - 1] += ' ' + token;
    } else {
      words.push(token);
    }
  }

  return words;
}

/**
 * Strips tashkeel/diacritics to calculate base consonant structure length.
 */
export function cleanArabicWord(word: string): string {
  // Remove harakat, sukun, tanween, dagger alif, and Quranic annotations
  return word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

// In-memory cache to prevent re-computation during 60fps render cycles
const wordTimingsCache = new Map<string, WordTiming[]>();

/**
 * Computes tajweed-weighted timings for each word in an Ayah.
 * Accounts for syllable counts, shaddah (gemination), madd (elongation),
 * waqf pauses, and natural end-of-ayah elongation (Madd 'Arid li-Sukun).
 */
export function getWordTimings(words: string[]): WordTiming[] {
  if (!words || words.length === 0) return [];

  const cacheKey = words.join('|');
  const cached = wordTimingsCache.get(cacheKey);
  if (cached) return cached;

  if (words.length === 1) {
    const single: WordTiming[] = [{
      word: words[0],
      cleanWord: cleanArabicWord(words[0]),
      index: 0,
      startRatio: 0,
      endRatio: 1,
    }];
    wordTimingsCache.set(cacheKey, single);
    return single;
  }

  const weights = words.map((w, idx) => {
    const rawChars = cleanArabicWord(w).length;
    let weight = Math.max(2.0, rawChars);

    // Shaddah (ّ) or Madd (ٓ or ~): elongation of sound
    if (/[\u0651\u0653~]/.test(w)) {
      weight += 1.25;
    }

    // Waqf pause mark: reciters take a slight breath/pause
    if (/[ۚۖۗۘۛۜ]/.test(w)) {
      weight += 1.8;
    }

    // Final word in the ayah: Madd 'Arid li-Sukun & breath pause
    if (idx === words.length - 1) {
      weight += 3.2;
    }

    return weight;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let cumulative = 0;

  const result: WordTiming[] = words.map((word, idx) => {
    const startRatio = cumulative / totalWeight;
    cumulative += weights[idx];
    const endRatio = cumulative / totalWeight;

    return {
      word,
      cleanWord: cleanArabicWord(word),
      index: idx,
      startRatio,
      endRatio,
    };
  });

  wordTimingsCache.set(cacheKey, result);
  return result;
}

/**
 * Resolves the currently active word index based on playback progress ratio (0 to 1).
 */
export function getActiveWordIndex(timings: WordTiming[], progressRatio: number): number {
  if (!timings || timings.length === 0) return -1;
  const clamped = Math.max(0, Math.min(0.9999, progressRatio));

  for (let i = 0; i < timings.length; i++) {
    if (clamped >= timings[i].startRatio && clamped < timings[i].endRatio) {
      return i;
    }
  }

  return timings.length - 1;
}
