import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ArrowRight, 
  Quote, 
  Heart,
  Scroll,
  Info
} from 'lucide-react';
import { WisdomItem } from '../types';
import { DAILY_WISDOM_ITEMS } from '../data/wisdomData';
import { NotificationService } from '../services/notificationService';
import { MushafCornerFlourish } from './MushafCornerFlourish';

interface DailyWisdomProps {
  onNavigateToReader?: () => void;
  className?: string;
}

const FAVORITES_STORAGE_KEY = 'quran_shield_favorite_wisdom';

export const DailyWisdom: React.FC<DailyWisdomProps> = ({
  onNavigateToReader,
  className = '',
}) => {
  const [items] = useState<WisdomItem[]>(DAILY_WISDOM_ITEMS);
  const [filter, setFilter] = useState<'all' | 'verse' | 'hadith' | 'favorites'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showReflection, setShowReflection] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Filtered list
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'favorites') return items.filter(item => favorites.includes(item.id));
    return items.filter(item => item.type === filter);
  }, [items, filter, favorites]);

  // Ensure current index is within bounds of filtered items
  const safeIndex = useMemo(() => {
    if (filteredItems.length === 0) return 0;
    return currentIndex % filteredItems.length;
  }, [currentIndex, filteredItems.length]);

  const currentItem: WisdomItem | undefined = filteredItems[safeIndex] || items[0];

  // Stop audio when changing items
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
  };

  // Auto rotation logic (every 10 seconds)
  useEffect(() => {
    if (!isAutoPlay || filteredItems.length <= 1 || isPlayingAudio) {
      setProgressPercent(0);
      return;
    }

    const DURATION_MS = 10000;
    const INTERVAL_MS = 100;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += INTERVAL_MS;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgressPercent(pct);
      if (elapsed >= DURATION_MS) {
        elapsed = 0;
        setCurrentIndex(prev => (prev + 1) % filteredItems.length);
        setProgressPercent(0);
      }
    }, INTERVAL_MS);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isAutoPlay, filteredItems.length, safeIndex, isPlayingAudio]);

  const handleNext = () => {
    stopAudio();
    NotificationService.triggerHaptic(10);
    setProgressPercent(0);
    setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
  };

  const handlePrev = () => {
    stopAudio();
    NotificationService.triggerHaptic(10);
    setProgressPercent(0);
    setCurrentIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
  };

  const handleShuffle = () => {
    stopAudio();
    NotificationService.triggerHaptic(15);
    setProgressPercent(0);
    if (filteredItems.length <= 1) return;
    let nextIdx = safeIndex;
    while (nextIdx === safeIndex) {
      nextIdx = Math.floor(Math.random() * filteredItems.length);
    }
    setCurrentIndex(nextIdx);
  };

  const handleToggleFavorite = (id: string) => {
    NotificationService.triggerHaptic(15);
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleCopy = async () => {
    if (!currentItem) return;
    NotificationService.triggerHaptic(15);
    const textToCopy = `"${currentItem.arabicText}"\n\n"${currentItem.translation}"\n\n— ${currentItem.source} (${currentItem.narratorOrSurah})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const handlePlayAudio = () => {
    if (!currentItem?.audioUrl) return;

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(currentItem.audioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.onerror = () => setIsPlayingAudio(false);
    } else {
      audioRef.current.src = currentItem.audioUrl;
    }

    audioRef.current.play().then(() => {
      setIsPlayingAudio(true);
    }).catch(err => {
      console.warn("Audio playback failed:", err);
      setIsPlayingAudio(false);
    });
  };

  if (!currentItem) return null;

  const isFav = favorites.includes(currentItem.id);
  const isHadith = currentItem.type === 'hadith';

  return (
    <div 
      className={`ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Medina Mushaf Ornamental Flourish */}
      <div className="absolute top-2 left-2 opacity-30 pointer-events-none">
        <MushafCornerFlourish position="top-left" size="sm" theme="cream" />
      </div>

      {/* Auto-play progress line */}
      {isAutoPlay && filteredItems.length > 1 && !isPlayingAudio && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge: Verse vs Hadith */}
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
              isHadith
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}>
              {isHadith ? (
                <>
                  <Scroll className="w-3 h-3 text-amber-400" />
                  <span>Prophetic Hadith</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3 h-3 text-emerald-400" />
                  <span>Quranic Ayah</span>
                </>
              )}
            </span>

            {/* Theme Tag */}
            <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-800/80 text-stone-300 border border-white/5">
              {currentItem.theme}
            </span>
          </div>
        </div>

        {/* Counter and Controls */}
        <div className="flex items-center gap-1">
          {/* Auto rotation toggle */}
          <button
            onClick={() => {
              NotificationService.triggerHaptic(10);
              setIsAutoPlay(!isAutoPlay);
            }}
            title={isAutoPlay ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              isAutoPlay 
                ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' 
                : 'text-stone-400 bg-stone-800/60 hover:text-stone-200'
            }`}
            aria-label="Toggle auto rotation"
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            title="Random Wisdom"
            className="p-1.5 rounded-xl text-stone-400 hover:text-amber-300 bg-stone-800/60 hover:bg-amber-500/10 transition-colors"
            aria-label="Shuffle wisdom"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Pagination arrows */}
          <div className="flex items-center gap-0.5 bg-stone-800/80 rounded-xl p-0.5 border border-white/5 ml-1">
            <button
              onClick={handlePrev}
              disabled={filteredItems.length <= 1}
              className="p-1 text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous wisdom"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-semibold text-stone-400 px-1 select-none min-w-[32px] text-center">
              {filteredItems.length > 0 ? `${safeIndex + 1}/${filteredItems.length}` : '0/0'}
            </span>
            <button
              onClick={handleNext}
              disabled={filteredItems.length <= 1}
              className="p-1 text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next wisdom"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="relative z-10 space-y-3.5 py-1">
        {/* Arabic Calligraphy / Text */}
        <div className="relative text-right dir-rtl px-1">
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-emerald-100 drop-shadow-sm select-text selection:bg-emerald-500/30 selection:text-white">
            {currentItem.arabicText}
          </p>
        </div>

        {/* English Translation */}
        <div className="relative text-left border-l-2 border-emerald-500/40 pl-3 py-0.5">
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal italic">
            "{currentItem.translation}"
          </p>
        </div>

        {/* Source & Narrator Info */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-emerald-400">
              {currentItem.source}
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-[11px] text-stone-300">
              {currentItem.narratorOrSurah}
            </span>
          </div>

          {currentItem.virtueHighlight && (
            <span className="text-[10px] font-semibold text-amber-300/90 hidden sm:inline-block">
              ✦ {currentItem.virtueHighlight}
            </span>
          )}
        </div>

        {/* Reflection Collapsible Section */}
        {currentItem.reflection && (
          <div>
            <button
              onClick={() => {
                NotificationService.triggerHaptic(10);
                setShowReflection(!showReflection);
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showReflection ? 'Hide spiritual reflection' : 'Why this matters for your day'}</span>
            </button>

            {showReflection && (
              <div className="mt-2 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-stone-300 leading-relaxed animate-fade-in flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{currentItem.reflection}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          {(['all', 'verse', 'hadith'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                NotificationService.triggerHaptic(10);
                setFilter(cat);
                setCurrentIndex(0);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors ${
                filter === cat
                  ? 'bg-emerald-500 text-stone-950 font-bold'
                  : 'bg-stone-900/60 text-stone-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'verse' ? 'Ayahs' : 'Hadith'}
            </button>
          ))}
          {favorites.length > 0 && (
            <button
              onClick={() => {
                NotificationService.triggerHaptic(10);
                setFilter('favorites');
                setCurrentIndex(0);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors ${
                filter === 'favorites'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900/60 text-stone-400 hover:text-amber-300 border border-white/5'
              }`}
            >
              <Bookmark className="w-2.5 h-2.5" />
              <span>Saved ({favorites.length})</span>
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Audio playback button if available */}
          {currentItem.audioUrl && (
            <button
              onClick={handlePlayAudio}
              title={isPlayingAudio ? 'Pause recitation' : 'Listen to recitation'}
              className={`p-1.5 rounded-xl text-xs transition-colors ${
                isPlayingAudio 
                  ? 'bg-emerald-500 text-stone-950 animate-pulse' 
                  : 'bg-stone-800/80 text-emerald-400 hover:bg-emerald-500/20 border border-white/5'
              }`}
              aria-label="Listen to audio"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title={isCopied ? 'Copied to clipboard' : 'Copy verse & translation'}
            className="p-1.5 rounded-xl text-xs bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700/80 border border-white/5 transition-colors relative"
            aria-label="Copy wisdom text"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {isCopied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-emerald-500 text-stone-950 text-[9px] font-bold shadow-lg pointer-events-none whitespace-nowrap animate-fade-in">
                Copied!
              </span>
            )}
          </button>

          {/* Bookmark favorite button */}
          <button
            onClick={() => handleToggleFavorite(currentItem.id)}
            title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            className={`p-1.5 rounded-xl text-xs border border-white/5 transition-colors ${
              isFav 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-stone-800/80 text-stone-400 hover:text-amber-300'
            }`}
            aria-label="Favorite wisdom"
          >
            {isFav ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          {/* Read in Quran CTA button */}
          {onNavigateToReader && (
            <button
              onClick={() => {
                NotificationService.triggerHaptic(15);
                onNavigateToReader();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all ml-1 shadow-sm"
            >
              <span>Read Quran</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
