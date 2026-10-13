import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  Compass, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Share2,
  Bookmark
} from 'lucide-react';
import { Ayah, AyahTafsir, Surah } from '../types';
import { TafsirService } from '../services/tafsirService';

interface AyahTafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surah: Surah | null;
  onPlayAyah?: (ayah: Ayah, surahName: string) => void;
  onNavigateAyah?: (step: -1 | 1) => void;
  hasPrevAyah?: boolean;
  hasNextAyah?: boolean;
}

export const AyahTafsirModal: React.FC<AyahTafsirModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surah,
  onPlayAyah,
  onNavigateAyah,
  hasPrevAyah,
  hasNextAyah,
}) => {
  const [tafsir, setTafsir] = useState<AyahTafsir | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !ayah || !surah) {
      setTafsir(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    TafsirService.fetchTafsir(surah.number, surah.englishName, ayah)
      .then((data) => {
        if (isMounted) {
          setTafsir(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Failed to load Tafsir');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, ayah?.numberInSurah, surah?.number]);

  if (!isOpen || !ayah || !surah) return null;

  const handleCopy = () => {
    if (!tafsir) return;
    const textToCopy = `📖 Tafsir & Deeper Meaning [Surah ${surah.englishName} ${surah.number}:${ayah.numberInSurah}]

Arabic:
${ayah.text}

Translation:
"${ayah.translation}"

Concise Tafsir:
${tafsir.conciseTafsir}

Deeper Meaning:
${tafsir.deeperMeaning}

Key Takeaways:
${tafsir.practicalTakeaways.map((t) => `• ${t}`).join('\n')}

— Quran Unlock with Gemini AI`;

    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    if (!ayah || !surah) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Clear localStorage cache for this verse to force fresh generation
      localStorage.removeItem(`qu_tafsir_cache_${surah.number}:${ayah.numberInSurah}`);
      const freshData = await TafsirService.fetchTafsir(surah.number, surah.englishName, ayah);
      setTafsir(freshData);
    } catch (e: any) {
      setErrorMsg(e.message || 'Refresh failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  Tafsir & Deeper Meaning
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  Gemini AI
                </span>
              </div>
              <div className="text-[10px] text-stone-400">
                Surah {surah.englishName} • Ayah {ayah.numberInSurah} of {surah.numberOfAyahs}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Prev / Next Ayah navigators */}
            {onNavigateAyah && (
              <div className="flex items-center mr-1 bg-stone-800/80 rounded-lg p-0.5 border border-stone-700/60">
                <button
                  onClick={() => onNavigateAyah(-1)}
                  disabled={!hasPrevAyah}
                  className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Previous Ayah"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigateAyah(1)}
                  disabled={!hasNextAyah}
                  className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Next Ayah"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-800/80 text-stone-400 hover:text-white border border-stone-700 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto ios-scroll flex-1 text-left">
          {/* Ayah Spotlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-500/30 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-mono text-emerald-400 font-bold">
                [{surah.number}:{ayah.numberInSurah}]
              </span>
              {onPlayAyah && (
                <button
                  onClick={() => onPlayAyah(ayah, surah.englishName)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Recitation</span>
                </button>
              )}
            </div>

            {/* Arabic Verse */}
            <div className="py-2 text-right">
              <p className="font-quran text-2xl sm:text-3xl text-amber-200 leading-loose dir-rtl select-text">
                {ayah.text}
              </p>
            </div>

            {/* English Translation */}
            <div className="pt-2 text-xs sm:text-sm text-stone-200 leading-relaxed border-t border-white/5 font-serif italic">
              "{ayah.translation}"
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-3 py-6 text-center animate-pulse">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Consulting Gemini for authentic Quranic Tafsir & deeper wisdom...</span>
              </div>
              <div className="h-4 bg-stone-800 rounded-full w-3/4 mx-auto" />
              <div className="h-4 bg-stone-800 rounded-full w-5/6 mx-auto" />
              <div className="h-4 bg-stone-800 rounded-full w-2/3 mx-auto" />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && !isLoading && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={handleRefresh}
                className="px-2 py-1 rounded bg-red-900/50 hover:bg-red-900 text-white font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Tafsir Content Sections */}
          {tafsir && !isLoading && (
            <div className="space-y-4 animate-fade-in">
              {/* Section 1: Concise Tafsir */}
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Concise Scholarly Tafsir</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {tafsir.conciseTafsir}
                </p>
              </div>

              {/* Section 2: Context of Revelation (Asbab al-Nuzul) */}
              {tafsir.contextOfRevelation && (
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                    <Compass className="w-4 h-4 text-teal-400" />
                    <span>Context & Revelation Background</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {tafsir.contextOfRevelation}
                  </p>
                </div>
              )}

              {/* Section 3: Deeper Meaning & Spiritual Wisdom */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 to-stone-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <span>Deeper Meaning & Spiritual Reflection</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {tafsir.deeperMeaning}
                </p>
              </div>

              {/* Section 4: Practical Daily Takeaways */}
              {tafsir.practicalTakeaways && tafsir.practicalTakeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800/90 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Practical Daily Takeaways</span>
                  </div>
                  <ul className="space-y-2">
                    {tafsir.practicalTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 5: Key Arabic Vocabulary */}
              {tafsir.keyKeywords && tafsir.keyKeywords.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800/90 space-y-2.5">
                  <div className="text-xs font-bold text-amber-200">
                    Key Arabic Words & Linguistic Nuances
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tafsir.keyKeywords.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-arabic text-base text-amber-300 text-right dir-rtl">
                            {item.arabic}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                            {item.meaning}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/95 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 border border-stone-700/60 transition active:scale-95 disabled:opacity-50"
              title="Re-analyze with Gemini"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-[10px] text-stone-400 hidden xs:inline">
              Scholarly Tafsir via Gemini
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!tafsir || isLoading}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-xs font-medium text-white border border-stone-700 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy Tafsir</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
