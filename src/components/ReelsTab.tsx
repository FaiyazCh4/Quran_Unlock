import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Unlock, 
  Share2, 
  Bookmark, 
  Heart, 
  BookOpen, 
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReelItem, Ayah } from '../types';
import { REELS_ITEMS } from '../data/reelsData';
import { NotificationService } from '../services/notificationService';
import { StorageService } from '../services/storageService';

interface ReelsTabProps {
  onUnlockAllApps: (durationMinutes: number) => void;
  onOpenMushafWithSurah: (surahNumber: number) => void;
}

export const ReelsTab: React.FC<ReelsTabProps> = ({
  onUnlockAllApps,
  onOpenMushafWithSurah,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showReflection, setShowReflection] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentReel = REELS_ITEMS[currentIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentReel.audioUrl;
    audioRef.current.currentTime = 0;
    setAudioError(false);

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setAudioError(true);
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioError(false);
      }).catch(() => {
        setAudioError(true);
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < REELS_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(REELS_ITEMS.length - 1);
    }
  };

  const handleUnlockTrigger = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#ffffff'],
      });
    } catch {}

    NotificationService.playUnlockSound();
    StorageService.recordReadingSession(1, 1, 0, currentReel.surahNumber);
    onUnlockAllApps(30);
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Atmospheric background gradient / animations per theme
  const getAtmosphereBg = (videoType: string) => {
    switch (videoType) {
      case 'mecca':
        return 'from-emerald-950/90 via-stone-950 to-black';
      case 'stars':
        return 'from-indigo-950/90 via-slate-950 to-black';
      case 'desert':
        return 'from-amber-950/80 via-stone-950 to-black';
      case 'water':
        return 'from-cyan-950/90 via-blue-950/70 to-black';
      case 'mountains':
      default:
        return 'from-teal-950/90 via-stone-950 to-black';
    }
  };

  return (
    <div className="relative -mx-4 -mt-3 h-[calc(100vh-68px)] max-h-[820px] rounded-3xl overflow-hidden bg-black text-white flex flex-col justify-between p-5 select-none shadow-2xl border border-stone-800">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setAudioError(true)}
      />

      {/* Atmospheric dynamic visual canvas backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getAtmosphereBg(currentReel.bgVideoType)} -z-10`} />

      {/* Floating starry or radiant orbs */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Tag & Navigation Buttons */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ayah Reels • {currentReel.theme}</span>
          </span>
        </div>

        {/* Up / Down reel navigators */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-700/60 active:scale-95 transition backdrop-blur-md"
            title="Previous verse"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-700/60 active:scale-95 transition backdrop-blur-md"
            title="Next verse"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Center: The Main Holy Ayah & Reflection */}
      <div className="relative z-10 my-auto text-center space-y-5 max-w-sm mx-auto px-2">
        {/* Surah reference badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs transition-all ${
          isPlaying
            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40 shadow-lg'
            : 'bg-stone-900/60 border-white/10 text-stone-300'
        } backdrop-blur-md`}>
          <span>Surah {currentReel.surahName}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Ayah {currentReel.ayahNumber}</span>
          {isPlaying && (
            <span className="flex items-end gap-0.5 h-2.5 ml-1">
              <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-3 bg-teal-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>

        {/* Arabic Calligraphy with active recitation illumination */}
        <div className="py-2">
          <p className={`font-quran text-3xl sm:text-4xl leading-[2.5] tracking-wide text-center dir-rtl transition-all duration-300 ${
            isPlaying
              ? 'text-emerald-300 font-bold drop-shadow-[0_0_28px_rgba(52,211,153,0.75)] scale-[1.02]'
              : 'text-emerald-100 font-normal drop-shadow-md'
          } selection:bg-emerald-700`}>
            {currentReel.arabicText}
          </p>
        </div>

        {/* Translation */}
        <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed italic px-2">
          "{currentReel.translation}"
        </p>

        {/* Reflection Insight Card */}
        {showReflection && (
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-emerald-500/25 text-left text-xs space-y-1 backdrop-blur-md animate-fade-in shadow-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Spiritual Reflection</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              {currentReel.reflection}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar: Audio reciter + Unlock Action + Social Controls */}
      <div className="relative z-10 space-y-3 pb-2">
        {/* Reciter badge & Audio play trigger */}
        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition active:scale-95 ${
              isPlaying
                ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-bold'
                : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:text-white'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'Reciting...' : `Reciter: ${currentReel.reciterName.split(' ')[0]}`}</span>
          </button>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(currentReel.id)}
              className={`p-2 rounded-full border transition ${
                liked[currentReel.id]
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked[currentReel.id] ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onOpenMushafWithSurah(currentReel.surahNumber)}
              className="p-2 rounded-full bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-emerald-400 transition"
              title="Open in Mushaf reader"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Viral Core Action: Unlock Apps right from Reel */}
        <button
          onClick={handleUnlockTrigger}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 active:scale-[0.98] transition"
        >
          <Unlock className="w-4 h-4 stroke-[2.5]" />
          <span>I've read this • Unlock all apps for 30m</span>
        </button>
      </div>
    </div>
  );
};
