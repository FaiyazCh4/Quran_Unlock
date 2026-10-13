import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  Play, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  Download, 
  Check, 
  SlidersHorizontal, 
  ChevronRight, 
  Sparkles,
  Layers,
  Copy,
  Radio
} from 'lucide-react';
import { Surah, Ayah, Reciter } from '../types';
import { SURAHS_LIST, getSurahVerses, BISMILLAH_AYAH } from '../data/quranData';
import { StorageService, MushafTheme } from '../services/storageService';
import { AyahTafsirModal } from './AyahTafsirModal';
import { splitQuranWords, getWordTimings, getActiveWordIndex } from '../services/quranWordService';
import { MushafCornerFlourish } from './MushafCornerFlourish';

export type PaperTextureStyle = MushafTheme;

interface ReaderTabProps {
  onPlayAyah: (ayah: Ayah, surahName: string) => void;
  currentPlayingAyah: Ayah | null;
  isPlaying: boolean;
  selectedReciter: Reciter;
  bookmarks: number[];
  onToggleBookmark: (surahNumber: number) => void;
  downloadedSurahs: number[];
  onDownloadSurah: (surahNumber: number) => void;
  playbackProgress?: number;
  audioCurrentTime?: number;
  audioDuration?: number;
  onSeekWord?: (progressRatio: number) => void;
}

export const ReaderTab: React.FC<ReaderTabProps> = ({
  onPlayAyah,
  currentPlayingAyah,
  isPlaying,
  selectedReciter,
  bookmarks,
  onToggleBookmark,
  downloadedSurahs,
  onDownloadSurah,
  playbackProgress = 0,
  audioCurrentTime = 0,
  audioDuration = 0,
  onSeekWord,
}) => {
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'meccan' | 'medinan' | 'saved'>('all');
  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => StorageService.getFontSize());

  const handleSetFontSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setFontSizeState(size);
    StorageService.saveFontSize(size);
  };
  const [viewStyle, setViewStyle] = useState<'ayah_list' | 'mushaf_page'>('ayah_list');
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [focusModeEnabled, setFocusModeEnabled] = useState(true);
  const [wordHighlightEnabled, setWordHighlightEnabled] = useState(true);
  const [startWithBismillah, setStartWithBismillah] = useState(true);
  const [paperTheme, setPaperTheme] = useState<MushafTheme>(() => StorageService.getMushafTheme());

  const handleSetPaperTheme = (theme: MushafTheme) => {
    setPaperTheme(theme);
    StorageService.saveMushafTheme(theme);
  };
  const [tafsirModalOpen, setTafsirModalOpen] = useState(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);

  // Smoothly auto-scroll to the active reciting Ayah
  useEffect(() => {
    if (isPlaying && currentPlayingAyah && activeSurahNumber === currentPlayingAyah.surahNumber) {
      const timer = setTimeout(() => {
        activeAyahRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPlayingAyah?.numberInSurah, currentPlayingAyah?.surahNumber, isPlaying, activeSurahNumber]);

  // Load verses when a Surah is clicked
  useEffect(() => {
    if (!activeSurahNumber) return;

    let isMounted = true;
    setIsLoadingVerses(true);

    getSurahVerses(activeSurahNumber).then((data) => {
      if (isMounted) {
        setVerses(data);
        setIsLoadingVerses(false);

        // Record reading log
        const surah = SURAHS_LIST.find((s) => s.number === activeSurahNumber);
        if (surah) {
          StorageService.recordReadingSession(2, Math.min(5, surah.numberOfAyahs), 1, activeSurahNumber);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeSurahNumber]);

  const activeSurahMeta = SURAHS_LIST.find((s) => s.number === activeSurahNumber);

  const filteredSurahs = SURAHS_LIST.filter((s) => {
    const matchesSearch =
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number) === searchQuery.trim();

    if (!matchesSearch) return false;
    if (filterMode === 'meccan') return s.revelationType === 'Meccan';
    if (filterMode === 'medinan') return s.revelationType === 'Medinan';
    if (filterMode === 'saved') return bookmarks.includes(s.number);
    return true;
  });

  const handleDownload = (surahNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(surahNumber);
    setTimeout(() => {
      onDownloadSurah(surahNumber);
      setDownloadingId(null);
    }, 600);
  };

  const copyAyahText = (ayah: Ayah) => {
    const text = `${ayah.text}\n\n"${ayah.translation}"\n- [Surah ${ayah.surahNumber}:${ayah.numberInSurah}]`;
    navigator.clipboard?.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 1800);
  };

  const handleOpenTafsir = (ayah: Ayah) => {
    setSelectedTafsirAyah(ayah);
    setTafsirModalOpen(true);
  };

  const handleNavigateTafsirAyah = (step: -1 | 1) => {
    if (!selectedTafsirAyah || verses.length === 0) return;
    const currentIndex = verses.findIndex((v) => v.numberInSurah === selectedTafsirAyah.numberInSurah);
    if (currentIndex === -1) return;
    const newIndex = currentIndex + step;
    if (newIndex >= 0 && newIndex < verses.length) {
      setSelectedTafsirAyah(verses[newIndex]);
    }
  };

  // Play verse with optional opening Bismillah invocation when starting a new Surah
  const handlePlayVerse = (verse: Ayah) => {
    const surahName = activeSurahMeta?.englishName || 'Quran';
    const isNewSurahStart = !isPlaying || !currentPlayingAyah || Number(currentPlayingAyah.surahNumber) !== Number(activeSurahMeta?.number);

    // If starting Surah from Ayah 1 (except Surah 1 where Ayah 1 is Bismillah, or Surah 9 At-Tawbah), recite Bismillah first
    if (
      startWithBismillah &&
      verse.numberInSurah === 1 &&
      activeSurahMeta &&
      activeSurahMeta.number !== 1 &&
      activeSurahMeta.number !== 9 &&
      isNewSurahStart
    ) {
      onPlayAyah({
        ...BISMILLAH_AYAH,
        surahNumber: activeSurahMeta.number,
      }, surahName);
    } else {
      onPlayAyah(verse, surahName);
    }
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-xl leading-relaxed',
    md: 'text-2xl leading-loose',
    lg: 'text-3xl leading-[2.6]',
    xl: 'text-4xl leading-[3]',
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* If viewing a specific Surah */}
      {activeSurahNumber && activeSurahMeta ? (
        <div className="space-y-4">
          {/* Surah Header Bar - Clean, properly aligned top bar */}
          <div className="sticky top-14 z-30 -mx-3 px-4 py-2 ios-glass border-b border-stone-800/80 shadow-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveSurahNumber(null)}
                className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-2.5 py-1 rounded-xl bg-stone-900/80 border border-stone-800 transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="font-medium">Surahs</span>
              </button>

              <div className="text-center truncate min-w-0 flex-1 px-1">
                <span className="font-bold text-xs text-white block truncate">
                  {activeSurahMeta.englishName} ({activeSurahMeta.name})
                </span>
                <span className="text-[10px] text-stone-400 block truncate">
                  {activeSurahMeta.revelationType} • {activeSurahMeta.numberOfAyahs} Ayahs • Juz {activeSurahMeta.juzStart}
                </span>
              </div>

              {/* Right Quick Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onToggleBookmark(activeSurahMeta.number)}
                  className="p-1.5 rounded-lg bg-stone-900/70 border border-stone-800 text-stone-300 hover:text-amber-400 transition"
                  title="Bookmark Surah"
                >
                  {bookmarks.includes(activeSurahMeta.number) ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => {
                    const nextTheme: Record<MushafTheme, MushafTheme> = {
                      cream: 'warm',
                      warm: 'night',
                      night: 'cream',
                    };
                    handleSetPaperTheme(nextTheme[paperTheme] || 'cream');
                  }}
                  className={`p-1.5 rounded-lg border transition text-[11px] px-2 flex items-center gap-1 active:scale-95 ${
                    paperTheme === 'cream'
                      ? 'bg-[#fbf7ee] text-stone-900 border-amber-600/50 font-bold shadow-xs'
                      : paperTheme === 'warm'
                      ? 'bg-[#f4ebd9] text-amber-950 border-amber-700/50 font-bold shadow-xs'
                      : 'bg-[#1e1914] text-amber-300 border-amber-500/50 font-bold shadow-xs'
                  }`}
                  title={`Parchment Theme: ${
                    paperTheme === 'cream'
                      ? 'Cream Parchment'
                      : paperTheme === 'warm'
                      ? 'Warm Parchment'
                      : 'Night Parchment'
                  } (click to toggle)`}
                >
                  <span className="text-xs">📜</span>
                  <span className="text-[10px] hidden sm:inline capitalize font-semibold">
                    {paperTheme}
                  </span>
                </button>

                <button
                  onClick={() => setViewStyle(viewStyle === 'ayah_list' ? 'mushaf_page' : 'ayah_list')}
                  className="p-1.5 rounded-lg bg-stone-900/70 border border-stone-800 text-stone-300 hover:text-emerald-400 transition text-[11px] font-medium px-2"
                  title="Switch between Mushaf page and Ayah list view"
                >
                  {viewStyle === 'ayah_list' ? 'Mushaf' : 'List'}
                </button>
              </div>
            </div>

            {/* Secondary Reading Controls Strip: Focus, Word Highlight, Bismillah & AI Tafsir */}
            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/5 overflow-x-auto no-scrollbar text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFocusModeEnabled(!focusModeEnabled)}
                  className={`px-2 py-1 rounded-lg border transition text-[10px] font-medium flex items-center gap-1 active:scale-95 whitespace-nowrap ${
                    focusModeEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                      : 'bg-stone-900/50 text-stone-400 border-stone-800'
                  }`}
                  title={focusModeEnabled ? "Focus Mode ON" : "Focus Mode OFF"}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Focus</span>
                </button>

                <button
                  onClick={() => setWordHighlightEnabled(!wordHighlightEnabled)}
                  className={`px-2 py-1 rounded-lg border transition text-[10px] font-medium flex items-center gap-1 active:scale-95 whitespace-nowrap ${
                    wordHighlightEnabled
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-xs'
                      : 'bg-stone-900/50 text-stone-400 border-stone-800'
                  }`}
                  title={wordHighlightEnabled ? "Word Highlighting ON" : "Word Highlighting OFF"}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${wordHighlightEnabled ? 'bg-amber-400 animate-pulse' : 'bg-stone-600'}`} />
                  <span>Word Focus</span>
                </button>

                {activeSurahMeta.number !== 9 && activeSurahMeta.number !== 1 && (
                  <button
                    onClick={() => setStartWithBismillah(!startWithBismillah)}
                    className={`px-2 py-1 rounded-lg border transition text-[10px] font-medium flex items-center gap-1 active:scale-95 whitespace-nowrap ${
                      startWithBismillah
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                        : 'bg-stone-900/50 text-stone-400 border-stone-800'
                    }`}
                    title={startWithBismillah ? "Start with Bismillah: ON" : "Start with Bismillah: OFF"}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${startWithBismillah ? 'bg-emerald-400' : 'bg-stone-600'}`} />
                    <span>Bismillah First</span>
                  </button>
                )}
              </div>

              {currentPlayingAyah && (Number(currentPlayingAyah.surahNumber || activeSurahMeta.number) === Number(activeSurahMeta.number)) && (
                <button
                  onClick={() => {
                    const targetAyah = currentPlayingAyah.numberInSurah === 0 
                      ? currentPlayingAyah 
                      : (verses.find((v) => v.numberInSurah === currentPlayingAyah.numberInSurah) || currentPlayingAyah);
                    handleOpenTafsir(targetAyah);
                  }}
                  className="px-2 py-1 rounded-lg border bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-bold flex items-center gap-1 active:scale-95 shrink-0 whitespace-nowrap"
                  title="View Tafsir for current reciting ayah"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Tafsir</span>
                </button>
              )}
            </div>
          </div>

          {/* Surah Decorative Card Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/70 via-stone-900 to-stone-950 border border-emerald-500/30 p-5 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="font-quran text-3xl sm:text-4xl text-emerald-200 tracking-wide font-normal mb-1">
              {activeSurahMeta.name}
            </h2>
            <div className="text-sm font-semibold text-white tracking-wide">
              {activeSurahMeta.englishName} • {activeSurahMeta.englishNameTranslation}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-stone-400 mt-2">
              <span>{activeSurahMeta.revelationType}</span>
              <span>•</span>
              <span>{activeSurahMeta.numberOfAyahs} Verses</span>
              <span>•</span>
              <span>Page {activeSurahMeta.pageStart}</span>
            </div>

            {/* Listen Surah & Offline status buttons */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/5">
              {verses.length > 0 && (
                <button
                  onClick={() => {
                    // For all Surahs except At-Tawbah (9), start with Bismillah
                    if (activeSurahMeta.number !== 9) {
                      if (activeSurahMeta.number === 1) {
                        onPlayAyah(verses[0], activeSurahMeta.englishName);
                      } else {
                        onPlayAyah({
                          ...BISMILLAH_AYAH,
                          surahNumber: activeSurahMeta.number,
                        }, activeSurahMeta.englishName);
                      }
                    } else {
                      onPlayAyah(verses[0], activeSurahMeta.englishName);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
                  title="Recite full surah from opening Bismillah"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{activeSurahMeta.number !== 9 && activeSurahMeta.number !== 1 ? 'Start Surah with Bismillah' : 'Play Full Surah'}</span>
                </button>
              )}

              <button
                onClick={(e) => handleDownload(activeSurahMeta.number, e)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                  downloadedSurahs.includes(activeSurahMeta.number)
                    ? 'bg-stone-900/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-stone-900/60 text-stone-300 border-stone-800 hover:text-white'
                }`}
              >
                {downloadedSurahs.includes(activeSurahMeta.number) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved Offline</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Offline</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reading Appearance: Mushaf Paper Texture & Script Size */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 bg-stone-900/50 rounded-2xl border border-stone-800/70 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-stone-300 flex items-center gap-1.5">
                <span>📜</span>
                <span>Parchment:</span>
              </span>
              <div className="flex items-center gap-1 bg-stone-950/80 p-0.5 rounded-xl border border-stone-800/80">
                <button
                  onClick={() => handleSetPaperTheme('cream')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 ${
                    paperTheme === 'cream'
                      ? 'bg-[#fbf7ee] text-stone-900 font-bold shadow-sm ring-1 ring-amber-500/60'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Cream Parchment (Medina Mushaf paper)"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbf7ee] border border-amber-600/40 inline-block shadow-xs" />
                  <span>Cream</span>
                </button>

                <button
                  onClick={() => handleSetPaperTheme('warm')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 ${
                    paperTheme === 'warm'
                      ? 'bg-[#f4ebd9] text-amber-950 font-bold shadow-sm ring-1 ring-amber-600/60'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Warm Parchment (Antique soft paper)"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f4ebd9] border border-amber-700/40 inline-block shadow-xs" />
                  <span>Warm</span>
                </button>

                <button
                  onClick={() => handleSetPaperTheme('night')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 ${
                    paperTheme === 'night'
                      ? 'bg-[#221c16] text-amber-200 font-bold shadow-sm ring-1 ring-amber-500/60'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Night Parchment (Dark paper with warm golden script)"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1a1612] border border-amber-400/50 inline-block shadow-xs" />
                  <span>Night</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400">Script Size:</span>
              <div className="flex items-center gap-0.5 bg-stone-950/80 p-0.5 rounded-xl border border-stone-800/80">
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSetFontSize(size)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                      fontSize === size ? 'bg-emerald-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoadingVerses && (
            <div className="py-12 text-center text-xs text-stone-400 space-y-2">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading verses from offline repository...</p>
            </div>
          )}

          {/* Ayah List Mode */}
          {!isLoadingVerses && viewStyle === 'ayah_list' && (
            <div className="space-y-3.5">
              {(() => {
                const isAnyAyahReciting = Boolean(
                  isPlaying &&
                  currentPlayingAyah &&
                  (Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahNumber))
                );

                // Check if Bismillah is currently reciting for this Surah
                const isBismillahActive = Boolean(
                  currentPlayingAyah &&
                  currentPlayingAyah.numberInSurah === 0 &&
                  Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahMeta.number)
                );
                const isBismillahReciting = isBismillahActive && isPlaying;
                const shouldDimBismillah = isAnyAyahReciting && focusModeEnabled && !isBismillahActive;

                // Surah 1 (Al-Fatihah) has Bismillah as Ayah 1; Surah 9 (At-Tawbah) does not start with Bismillah
                const showBismillahBanner = activeSurahMeta.number !== 1 && activeSurahMeta.number !== 9;

                return (
                  <>
                    {/* Opening Bismillah recitation banner for Surahs other than Al-Fatiha and At-Tawbah */}
                    {showBismillahBanner && (
                      <div
                        ref={isBismillahActive ? activeAyahRef : undefined}
                        className={`rounded-3xl p-4 sm:p-5 text-center transition-all duration-500 relative overflow-hidden border ${
                          isBismillahActive
                            ? isBismillahReciting
                              ? 'bg-gradient-to-br from-amber-950/60 via-emerald-950/80 to-stone-900 border-2 border-amber-400 ring-4 ring-amber-400/25 shadow-[0_0_45px_rgba(251,191,36,0.3)] scale-[1.01] z-10 opacity-100 text-stone-100'
                              : 'bg-stone-900/95 border-2 border-emerald-500/70 ring-2 ring-emerald-500/20 shadow-xl opacity-100 text-stone-100'
                            : shouldDimBismillah
                            ? 'opacity-30 grayscale-[30%] hover:opacity-85 scale-[0.99] border-stone-800/40 ios-glass-card'
                            : paperTheme === 'cream'
                            ? 'mushaf-parchment-cream border-2 border-amber-600/35 ring-1 ring-amber-500/25 text-stone-900 shadow-xl'
                            : paperTheme === 'warm'
                            ? 'mushaf-parchment-warm border-2 border-amber-700/35 ring-1 ring-amber-600/25 text-amber-950 shadow-xl'
                            : 'mushaf-parchment-night border border-amber-500/30 text-amber-100 shadow-xl'
                        }`}
                      >
                        {/* Elegant Gold Ornamental Corner Flourishes for Parchment Background */}
                        {!isBismillahActive && (
                          <>
                            <MushafCornerFlourish position="top-left" theme={paperTheme} size="sm" />
                            <MushafCornerFlourish position="bottom-right" theme={paperTheme} size="sm" />
                          </>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            paperTheme === 'cream' || paperTheme === 'warm'
                              ? 'bg-amber-600/10 text-amber-900 border-amber-700/30 font-bold'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            Opening Invocation
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const bismillahAyahData: Ayah = {
                                  ...BISMILLAH_AYAH,
                                  surahNumber: activeSurahMeta.number,
                                };
                                handleOpenTafsir(bismillahAyahData);
                              }}
                              className="p-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs flex items-center gap-1 active:scale-95 transition"
                              title="View Bismillah Tafsir (Gemini AI)"
                            >
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span className="text-[10px] font-medium hidden xs:inline">Tafsir</span>
                            </button>
                            <button
                              onClick={() => {
                                const bismillahAyahData: Ayah = {
                                  ...BISMILLAH_AYAH,
                                  surahNumber: activeSurahMeta.number,
                                };
                                onPlayAyah(bismillahAyahData, activeSurahMeta.englishName);
                              }}
                              className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 active:scale-95 shadow-sm ${
                                isBismillahActive && isPlaying
                                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-md shadow-amber-400/40 scale-105'
                                  : paperTheme === 'cream' || paperTheme === 'warm'
                                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border-amber-700/40 font-bold'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 font-bold'
                              }`}
                              title="Recite Bismillah (auto-advances to Ayah 1)"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold">
                                {isBismillahActive && isPlaying ? 'Reciting Bismillah...' : 'Recite Bismillah & Start Surah'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Word-by-word highlighted Bismillah with authentic Right-to-Left order */}
                        <div dir="rtl" className="py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 dir-rtl rtl-flow">
                          {(() => {
                            const bismillahWords = splitQuranWords(BISMILLAH_AYAH.text);
                            const bismillahTimings = getWordTimings(bismillahWords);
                            const activeWordIdx = (isBismillahReciting && wordHighlightEnabled)
                              ? getActiveWordIndex(bismillahTimings, playbackProgress)
                              : -1;

                            return bismillahWords.map((word, wIdx) => {
                              const isCurrWord = isBismillahReciting && wordHighlightEnabled && wIdx === activeWordIdx;
                              const isPastWord = isBismillahReciting && wordHighlightEnabled && wIdx < activeWordIdx;

                              return (
                                <span
                                  key={wIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isBismillahActive && onSeekWord && bismillahTimings[wIdx]) {
                                      onSeekWord(bismillahTimings[wIdx].startRatio);
                                    }
                                  }}
                                  className={`font-quran text-2xl sm:text-3xl tracking-wide transition-all duration-200 px-2.5 py-0.5 rounded-xl cursor-pointer select-none inline-block ${
                                    isCurrWord
                                      ? 'bg-amber-400 text-stone-950 font-black shadow-[0_0_30px_rgba(251,191,36,0.95)] ring-2 ring-amber-300 scale-110 z-10'
                                      : isPastWord
                                      ? paperTheme === 'cream' || paperTheme === 'warm'
                                        ? 'text-amber-900 font-bold opacity-95'
                                        : 'text-amber-200 font-bold opacity-95'
                                      : isBismillahActive
                                      ? paperTheme === 'cream' || paperTheme === 'warm'
                                        ? 'text-amber-950 font-semibold'
                                        : 'text-amber-100/75 hover:text-amber-200'
                                      : paperTheme === 'cream'
                                      ? 'text-stone-900 font-bold'
                                      : paperTheme === 'warm'
                                      ? 'text-amber-950 font-bold'
                                      : 'text-emerald-200'
                                  }`}
                                  title={`Word ${wIdx + 1}: ${word} (click to jump)`}
                                >
                                  {word}
                                </span>
                              );
                            });
                          })()}
                        </div>

                        {isBismillahReciting && wordHighlightEnabled && (
                          <div className={`flex items-center justify-center gap-2 mt-1.5 font-mono text-[10px] ${
                            paperTheme === 'cream' || paperTheme === 'warm' ? 'text-amber-900 font-bold' : 'text-amber-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            <span className="font-bold">RIGHT-TO-LEFT RECITATION • Word {(() => {
                              const bismillahWords = splitQuranWords(BISMILLAH_AYAH.text);
                              const bismillahTimings = getWordTimings(bismillahWords);
                              return getActiveWordIndex(bismillahTimings, playbackProgress) + 1;
                            })()}/4</span>
                          </div>
                        )}
                        <p className={`text-xs italic mt-1 font-serif ${
                          paperTheme === 'cream' || paperTheme === 'warm' ? 'text-stone-700' : 'text-stone-300'
                        }`}>
                          "In the name of Allah, the Entirely Merciful, the Especially Merciful."
                        </p>
                        <p className={`text-[11px] font-mono mt-0.5 ${
                          paperTheme === 'cream' || paperTheme === 'warm' ? 'text-amber-900/70 font-medium' : 'text-stone-500'
                        }`}>
                          Bismillaahir Rahmaanir Raheem
                        </p>
                      </div>
                    )}

                    {verses.map((ayah) => {
                  const isThisAyahActive = Boolean(
                    currentPlayingAyah && (
                      (Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(ayah.surahNumber || activeSurahNumber) &&
                       Number(currentPlayingAyah.numberInSurah) === Number(ayah.numberInSurah)) ||
                      (Number(currentPlayingAyah.numberInSurah) === Number(ayah.numberInSurah) &&
                       Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahMeta.number)) ||
                      (currentPlayingAyah.number && ayah.number && Number(currentPlayingAyah.number) === Number(ayah.number))
                    )
                  );
                  const isRecitingNow = isThisAyahActive && isPlaying;
                  const shouldDim = isAnyAyahReciting && focusModeEnabled && !isThisAyahActive;

                  return (
                    <div
                      key={ayah.numberInSurah}
                      ref={isThisAyahActive ? activeAyahRef : undefined}
                      className={`rounded-3xl p-4 sm:p-5 transition-all duration-500 relative overflow-hidden ${
                        isThisAyahActive
                          ? isRecitingNow
                            ? 'bg-gradient-to-br from-amber-950/50 via-emerald-950/80 to-stone-900 border-2 border-amber-400 border-l-[8px] border-l-amber-400 ring-4 ring-amber-400/25 shadow-[0_0_45px_rgba(251,191,36,0.25)] scale-[1.01] z-10 opacity-100'
                            : 'bg-stone-900/95 border-2 border-emerald-500/70 border-l-[8px] border-l-emerald-500 ring-2 ring-emerald-500/20 shadow-xl opacity-100'
                          : shouldDim
                          ? 'opacity-25 grayscale-[30%] hover:opacity-85 scale-[0.99] border-stone-800/40 ios-glass-card'
                          : 'ios-glass-card hover:border-stone-700/80 border border-stone-800/80 opacity-100'
                      }`}
                    >
                      {/* Top Status Bar: Ayah Number & Focus Reciting Indicator */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-stone-400">
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                            isThisAyahActive
                              ? 'bg-amber-400 text-stone-950 font-black shadow-lg shadow-amber-400/40 scale-105'
                              : 'bg-stone-800/80 border border-stone-700/60 text-emerald-400'
                          }`}>
                            {ayah.numberInSurah}
                          </span>

                          {isThisAyahActive && (
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black shadow-md ${
                              isRecitingNow
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-amber-500/30 animate-pulse'
                                : 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                            }`}>
                              {isRecitingNow ? (
                                <>
                                  <span className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 h-3 bg-stone-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-0.5 h-2 bg-stone-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-0.5 h-3.5 bg-stone-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </span>
                                  <span>FOCUS SPOTLIGHT • AYAH {ayah.numberInSurah}</span>
                                </>
                              ) : (
                                <span>SELECTED AYAH {ayah.numberInSurah}</span>
                              )}
                            </div>
                          )}

                          {!isThisAyahActive && ayah.juz && (
                            <span className="text-[10px] text-stone-500">
                              Juz {ayah.juz}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenTafsir(ayah)}
                            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 transition active:scale-95 flex items-center gap-1 shadow-sm"
                            title="Concise Tafsir & Deeper Meaning (Gemini AI)"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[11px] font-semibold hidden sm:inline">Tafsir</span>
                          </button>
                          <button
                            onClick={() => handlePlayVerse(ayah)}
                            className={`p-2 rounded-xl border transition active:scale-95 ${
                              isRecitingNow
                                ? 'bg-amber-400 text-stone-950 border-amber-300 font-black shadow-md shadow-amber-500/40 scale-105'
                                : isThisAyahActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                : 'bg-stone-900/70 text-stone-300 border-stone-800 hover:text-white'
                            }`}
                            title={
                              isRecitingNow
                                ? "Currently reciting this verse"
                                : ayah.numberInSurah === 1 && activeSurahMeta.number !== 1 && activeSurahMeta.number !== 9 && startWithBismillah
                                ? "Recite Surah (Starts with Bismillah)"
                                : "Listen to this verse"
                            }
                          >
                            <Volume2 className={`w-4 h-4 ${isRecitingNow ? 'animate-pulse' : ''}`} />
                          </button>
                          <button
                            onClick={() => copyAyahText(ayah)}
                            className="p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-300 hover:text-white transition"
                            title="Copy verse"
                          >
                            {copiedAyah === ayah.numberInSurah ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text with authentic Mushaf parchment background & real-time word highlighting in Right-to-Left order */}
                      <div 
                        dir="rtl" 
                        className={`my-3 p-4 sm:p-5 rounded-2xl text-right rtl-flow transition-all duration-300 relative overflow-hidden ${
                          paperTheme === 'cream'
                            ? 'mushaf-text-parchment border border-amber-700/25 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] text-stone-900'
                            : paperTheme === 'warm'
                            ? 'mushaf-text-parchment-warm border border-amber-800/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] text-amber-950'
                            : 'mushaf-text-parchment-night border border-amber-500/25 shadow-inner text-amber-100'
                        }`}
                      >
                        {isRecitingNow && wordHighlightEnabled ? (
                          (() => {
                            const words = splitQuranWords(ayah.text);
                            const timings = getWordTimings(words);
                            const activeWordIdx = getActiveWordIndex(timings, playbackProgress);

                            return (
                              <div>
                                {/* Active Recited Word Indicator Bar */}
                                <div dir="ltr" className="flex items-center justify-between text-[11px] mb-2.5 px-1 font-mono">
                                  <div className={`flex items-center gap-1.5 ${
                                    paperTheme === 'cream' || paperTheme === 'warm' ? 'text-amber-950 font-bold' : 'text-amber-300'
                                  }`}>
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Word {activeWordIdx + 1} of {words.length}:</span>
                                    <span className={`font-quran text-base font-bold px-2 py-0.5 rounded-lg border shadow-xs animate-pulse ${
                                      paperTheme === 'cream' || paperTheme === 'warm'
                                        ? 'text-amber-950 bg-amber-400/30 border-amber-500/50'
                                        : 'text-amber-200 bg-amber-400/20 border-amber-400/40 shadow-sm'
                                    }`}>
                                      {words[activeWordIdx]}
                                    </span>
                                  </div>
                                  <div className={`flex items-center gap-1.5 text-[10px] font-mono ${
                                    paperTheme === 'cream' || paperTheme === 'warm' ? 'text-amber-900 font-bold' : 'text-amber-300'
                                  }`}>
                                    <span>RIGHT-TO-LEFT RECITATION</span>
                                    <span className="text-amber-500">➔</span>
                                  </div>
                                </div>

                                <div dir="rtl" className={`font-quran ${fontSizes[fontSize]} leading-[2.6] transition-all duration-200 text-right rtl-flow flex flex-wrap items-center justify-start gap-y-2.5 gap-x-1.5`}>
                                  {words.map((word, wIdx) => {
                                    const isCurr = wIdx === activeWordIdx;
                                    const isPast = wIdx < activeWordIdx;
                                    return (
                                      <span
                                        key={wIdx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onSeekWord && timings[wIdx]) {
                                            onSeekWord(timings[wIdx].startRatio);
                                          }
                                        }}
                                        className={`transition-all duration-200 rounded-xl cursor-pointer select-none inline-block ${
                                          isCurr
                                            ? 'bg-amber-400 text-stone-950 font-black shadow-[0_0_25px_rgba(251,191,36,0.95)] ring-2 ring-amber-300 scale-110 z-10 px-2.5 py-0.5 mx-0.5'
                                            : isPast
                                            ? paperTheme === 'cream' || paperTheme === 'warm'
                                              ? 'text-amber-900 font-bold px-1 mx-0.5'
                                              : 'text-amber-200 font-semibold px-1 mx-0.5 hover:text-white hover:bg-stone-800/50 rounded-lg'
                                            : paperTheme === 'cream'
                                            ? 'text-stone-900 font-medium px-1 mx-0.5 hover:text-amber-900'
                                            : paperTheme === 'warm'
                                            ? 'text-amber-950 font-medium px-1 mx-0.5 hover:text-amber-800'
                                            : 'text-stone-300/80 font-normal px-1 mx-0.5 hover:text-white hover:bg-stone-800/50 rounded-lg'
                                        }`}
                                        title={`Word ${wIdx + 1}: ${word} (click to jump)`}
                                      >
                                        {word}
                                      </span>
                                    );
                                  })}
                                  <span className={`inline-flex items-center justify-center mr-2 px-2 py-0.5 rounded-full font-serif text-sm border align-middle select-none ${
                                    paperTheme === 'cream' || paperTheme === 'warm'
                                      ? 'border-amber-700/50 bg-amber-500/15 text-amber-900 font-bold'
                                      : 'border-amber-400/40 bg-amber-400/10 text-amber-300 font-semibold'
                                  }`}>
                                    ۝ {ayah.numberInSurah}
                                  </span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <p dir="rtl" className={`font-quran ${fontSizes[fontSize]} text-right rtl-flow transition-all duration-300 ${
                            isThisAyahActive
                              ? paperTheme === 'cream' || paperTheme === 'warm'
                                ? 'text-amber-950 font-bold drop-shadow-[0_1px_2px_rgba(245,158,11,0.3)] scale-[1.01]'
                                : 'text-amber-200 font-bold drop-shadow-[0_0_20px_rgba(251,191,36,0.65)] scale-[1.01]'
                              : shouldDim
                              ? paperTheme === 'cream' || paperTheme === 'warm' ? 'text-stone-400' : 'text-stone-500'
                              : paperTheme === 'cream'
                              ? 'text-stone-900 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]'
                              : paperTheme === 'warm'
                              ? 'text-amber-950 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]'
                              : 'text-stone-100 font-normal'
                          } selection:bg-amber-400/40`}>
                            {ayah.text}
                            <span className={`inline-flex items-center justify-center mr-2 px-2 py-0.5 rounded-full font-serif text-sm border align-middle select-none ${
                              paperTheme === 'cream' || paperTheme === 'warm'
                                ? 'border-amber-700/50 bg-amber-500/15 text-amber-900 font-bold'
                                : 'border-amber-400/40 bg-amber-400/10 text-amber-300 font-semibold'
                            }`}>
                              ۝ {ayah.numberInSurah}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Translation */}
                      <div className={`pt-2.5 text-xs sm:text-sm leading-relaxed border-t border-white/5 transition-colors ${
                        isThisAyahActive ? 'text-white font-medium' : shouldDim ? 'text-stone-500' : 'text-stone-300 font-light'
                      }`}>
                        {ayah.translation}
                      </div>

                      {ayah.transliteration && (
                        <div className={`mt-1 text-[11px] font-mono ${
                          isThisAyahActive ? 'text-amber-300/90 font-medium' : shouldDim ? 'text-stone-600' : 'text-stone-500'
                        }`}>
                          {ayah.transliteration}
                        </div>
                      )}

                      {/* Concise Tafsir & Deeper Meaning action strip */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenTafsir(ayah)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
                            isThisAyahActive
                              ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 hover:bg-purple-500/35 shadow-md shadow-purple-500/20'
                              : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800 hover:border-purple-500/40'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>Tafsir & Deeper Meaning</span>
                        </button>

                        {isThisAyahActive && isRecitingNow && (
                          <span className="text-[10px] text-amber-300 font-mono animate-pulse">
                            Active Recitation Focus
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      )}

          {/* Mushaf Page Continuous Mode */}
          {!isLoadingVerses && viewStyle === 'mushaf_page' && (
            <div className={`rounded-3xl p-6 sm:p-9 shadow-2xl space-y-5 transition-all duration-300 relative overflow-hidden mushaf-ornate-frame ${
              paperTheme === 'cream'
                ? 'mushaf-parchment-cream text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
                : paperTheme === 'warm'
                ? 'mushaf-parchment-warm text-amber-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
                : 'mushaf-parchment-night text-amber-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
            }`}>
              {/* Elegant Gold Ornamental Corner Flourishes to replicate printed Mushaf */}
              <MushafCornerFlourish position="top-left" theme={paperTheme} size="lg" />
              <MushafCornerFlourish position="bottom-right" theme={paperTheme} size="lg" />

              {/* Authentic Medina Mushaf Page Header */}
              <div className={`flex items-center justify-between pb-3.5 mb-2 border-b select-none font-mono text-xs ${
                paperTheme === 'cream' || paperTheme === 'warm'
                  ? 'border-amber-800/25 text-amber-950'
                  : 'border-amber-500/25 text-amber-300'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>JUZ {activeSurahMeta.juzStart}</span>
                </div>
                <div className={`px-4 py-1 rounded-full border text-xs font-serif font-bold tracking-wider uppercase shadow-xs ${
                  paperTheme === 'cream' || paperTheme === 'warm'
                    ? 'bg-amber-600/10 border-amber-700/35 text-amber-950'
                    : 'bg-stone-900/80 border-stone-700 text-amber-300'
                }`}>
                  {activeSurahMeta.englishName} • {activeSurahMeta.name}
                </div>
                <div className="font-bold">
                  <span>PAGE {activeSurahMeta.pageStart}</span>
                </div>
              </div>

              {activeSurahMeta.number !== 9 && (
                (() => {
                  const isBismillahActive = Boolean(
                    currentPlayingAyah &&
                    currentPlayingAyah.numberInSurah === 0 &&
                    Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahMeta.number)
                  );
                  const isBismillahReciting = isBismillahActive && isPlaying;

                  return (
                    <div 
                      ref={isBismillahActive ? activeAyahRef : undefined}
                      className={`text-center font-quran text-2xl sm:text-3xl border-2 pb-3.5 pt-2.5 transition-all duration-300 rounded-2xl p-3 cursor-pointer relative overflow-hidden ${
                        isBismillahActive
                          ? isBismillahReciting
                            ? 'bg-amber-400/30 text-stone-950 border-amber-500 ring-4 ring-amber-400/40 shadow-lg scale-[1.01]'
                            : 'bg-emerald-500/20 text-emerald-900 border-emerald-500'
                          : paperTheme === 'cream'
                          ? 'mushaf-text-parchment border-amber-700/35 text-stone-900 hover:border-amber-600 shadow-sm'
                          : paperTheme === 'warm'
                          ? 'mushaf-text-parchment-warm border-amber-800/40 text-amber-950 hover:border-amber-700 shadow-sm'
                          : 'mushaf-text-parchment-night border-amber-500/35 text-amber-100 hover:border-amber-400 shadow-sm'
                      }`}
                      onClick={() => {
                        onPlayAyah({
                          ...BISMILLAH_AYAH,
                          surahNumber: activeSurahMeta.number,
                        }, activeSurahMeta.englishName);
                      }}
                      title="Click to recite Opening Bismillah"
                    >
                      {(() => {
                        const bismillahWords = splitQuranWords(BISMILLAH_AYAH.text);
                        const bismillahTimings = getWordTimings(bismillahWords);
                        const activeWordIdx = (isBismillahReciting && wordHighlightEnabled)
                          ? getActiveWordIndex(bismillahTimings, playbackProgress)
                          : -1;

                        return (
                          <div dir="rtl" className="flex flex-wrap items-center justify-center gap-x-2.5 dir-rtl rtl-flow">
                            {bismillahWords.map((word, wIdx) => {
                              const isCurr = isBismillahReciting && wordHighlightEnabled && wIdx === activeWordIdx;
                              return (
                                <span
                                  key={wIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isBismillahActive && onSeekWord && bismillahTimings[wIdx]) {
                                      onSeekWord(bismillahTimings[wIdx].startRatio);
                                    }
                                  }}
                                  className={`transition-all duration-200 px-2 py-0.5 rounded-lg inline-block ${
                                    isCurr
                                      ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-400/50 scale-105 ring-1 ring-amber-300 z-10'
                                      : ''
                                  }`}
                                  title={`Word ${wIdx + 1}: ${word} (click to jump)`}
                                >
                                  {word}
                                </span>
                              );
                            })}
                          </div>
                        );
                      })()}
                      {isBismillahActive && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold shadow-xs">
                            Reciting Bismillah (RTL ➔)
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTafsir({
                                ...BISMILLAH_AYAH,
                                surahNumber: activeSurahMeta.number,
                              });
                            }}
                            className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/40 hover:bg-purple-500/40"
                          >
                            Tafsir
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              <div 
                dir="rtl" 
                className={`text-right leading-[3] font-quran text-2xl sm:text-3xl dir-rtl rtl-flow selection:bg-amber-400/40 ${
                  paperTheme === 'cream'
                    ? 'text-stone-900 font-medium'
                    : paperTheme === 'warm'
                    ? 'text-amber-950 font-medium'
                    : 'text-amber-100 font-normal'
                }`}
              >
                {(() => {
                  const isAnyAyahReciting = Boolean(
                    isPlaying &&
                    currentPlayingAyah &&
                    (Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahNumber))
                  );

                  return verses.map((ayah) => {
                    const isThisAyahActive = Boolean(
                      currentPlayingAyah && (
                        (Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(ayah.surahNumber || activeSurahNumber) &&
                         Number(currentPlayingAyah.numberInSurah) === Number(ayah.numberInSurah)) ||
                        (Number(currentPlayingAyah.numberInSurah) === Number(ayah.numberInSurah) &&
                         Number(currentPlayingAyah.surahNumber || activeSurahNumber) === Number(activeSurahMeta.number)) ||
                        (currentPlayingAyah.number && ayah.number && Number(currentPlayingAyah.number) === Number(ayah.number))
                      )
                    );
                    const isRecitingNow = isThisAyahActive && isPlaying;
                    const shouldDim = isAnyAyahReciting && focusModeEnabled && !isThisAyahActive;

                    return (
                      <span
                        key={ayah.numberInSurah}
                        ref={isThisAyahActive ? activeAyahRef : undefined}
                        onClick={() => handlePlayVerse(ayah)}
                        className={`cursor-pointer inline transition-all duration-300 px-2 py-1 rounded-2xl mx-0.5 ${
                          isThisAyahActive
                            ? paperTheme === 'cream' || paperTheme === 'warm'
                              ? 'bg-amber-300/40 text-stone-950 font-bold ring-2 ring-amber-500/80 shadow-md scale-105 inline-block z-10'
                              : 'bg-amber-400/30 text-amber-200 font-bold ring-2 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-105 inline-block z-10'
                            : shouldDim
                            ? paperTheme === 'cream' || paperTheme === 'warm' ? 'opacity-30 hover:opacity-85 text-stone-400' : 'opacity-25 hover:opacity-85 text-stone-400'
                            : paperTheme === 'cream' || paperTheme === 'warm'
                            ? 'hover:text-amber-800'
                            : 'hover:text-amber-300'
                        }`}
                      >
                        {isRecitingNow && wordHighlightEnabled ? (
                          (() => {
                            const words = splitQuranWords(ayah.text);
                            const timings = getWordTimings(words);
                            const activeWordIdx = getActiveWordIndex(timings, playbackProgress);

                            return words.map((word, wIdx) => {
                              const isCurr = wIdx === activeWordIdx;
                              return (
                                <span
                                  key={wIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSeekWord && timings[wIdx]) {
                                      onSeekWord(timings[wIdx].startRatio);
                                    }
                                  }}
                                  className={`transition-all duration-200 rounded-lg mx-0.5 ${
                                    isCurr
                                      ? 'bg-amber-400 text-stone-950 font-black scale-110 shadow-lg shadow-amber-400/50 ring-2 ring-amber-300 px-1.5 py-0.5 inline-block z-10'
                                      : 'inline-block px-0.5 hover:text-amber-900'
                                  }`}
                                  title={`Word ${wIdx + 1}: ${word} (click to jump)`}
                                >
                                  {word}{' '}
                                </span>
                              );
                            });
                          })()
                        ) : (
                          <>{ayah.text}{' '}</>
                        )}
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTafsir(ayah);
                          }}
                          className={`inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-full border text-xs mx-1 font-serif font-bold transition hover:scale-125 cursor-pointer shadow-xs ${
                            isThisAyahActive
                              ? 'bg-amber-400 text-stone-950 border-amber-300 font-black scale-110 shadow-md shadow-amber-400/50'
                              : paperTheme === 'cream' || paperTheme === 'warm'
                              ? 'border-amber-700/50 text-amber-900 bg-amber-500/15 hover:bg-amber-500/30'
                              : 'border-amber-400/40 text-amber-300 bg-amber-400/10 hover:bg-amber-400/20'
                          }`}
                          title={`Ayah ${ayah.numberInSurah}: Tap to view Tafsir & Deeper Meaning (Gemini AI)`}
                        >
                          ۝ {ayah.numberInSurah}
                        </span>{' '}
                      </span>
                    );
                  });
                })()}
              </div>

              {/* Mushaf Page Footer */}
              <div className={`flex items-center justify-between pt-4 border-t text-xs select-none ${
                paperTheme === 'cream' || paperTheme === 'warm'
                  ? 'border-amber-800/20 text-amber-900/80 font-mono'
                  : 'border-amber-500/20 text-amber-400/70 font-mono'
              }`}>
                <span className="text-[11px]">Hizb {Math.ceil(activeSurahMeta.juzStart * 2)}</span>
                <span className="text-[11px] font-bold">Surah {activeSurahMeta.englishName} ({activeSurahMeta.numberOfAyahs} Ayahs)</span>
                <span className="text-[11px]">Rub' {activeSurahMeta.juzStart * 4}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Surahs Directory Screen */
        <div className="space-y-4">
          {/* Header Title */}
          <div className="space-y-1 px-1">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Holy Quran Mushaf</span>
            </h1>
            <p className="text-xs text-stone-400">
              Full 114 Surahs with canonical text, audio streams, and offline download support.
            </p>
          </div>

          {/* Active Recitation Quick Jump Banner */}
          {isPlaying && currentPlayingAyah && (
            <button
              onClick={() => setActiveSurahNumber(currentPlayingAyah.surahNumber)}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-stone-900 border border-emerald-400/60 shadow-lg flex items-center justify-between text-left transition active:scale-[0.99] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Now Reciting: {SURAHS_LIST.find((s) => s.number === currentPlayingAyah.surahNumber)?.englishName || 'Quran'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Ayah {currentPlayingAyah.numberInSurah}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    Tap to open Surah & follow recitation with live highlighting
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search Surah by name, number, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 focus:border-emerald-500/60 focus:outline-none text-xs text-white placeholder-stone-500 shadow-inner"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 px-1 overflow-x-auto">
            {(['all', 'meccan', 'medinan', 'saved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterMode(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition whitespace-nowrap ${
                  filterMode === f
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {f === 'saved' ? `Bookmarked (${bookmarks.length})` : f}
              </button>
            ))}
          </div>

          {/* Surah List */}
          <div className="space-y-2">
            {filteredSurahs.map((surah) => {
              const isDownloaded = downloadedSurahs.includes(surah.number);
              const isBookmarked = bookmarks.includes(surah.number);

              return (
                <div
                  key={surah.number}
                  onClick={() => setActiveSurahNumber(surah.number)}
                  className="ios-glass-card rounded-2xl p-3 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group active:scale-[0.99]"
                >
                  {/* Left: Number & Titles */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-900/90 border border-stone-800 group-hover:border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono shrink-0 shadow-inner">
                      {surah.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white group-hover:text-emerald-300 transition">
                          {surah.englishName}
                        </span>
                        {isDownloaded && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Available offline" />
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        <span>{surah.englishNameTranslation}</span>
                        <span>•</span>
                        <span>{surah.numberOfAyahs} Ayahs</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Arabic Name & Actions */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-right">
                      <div dir="rtl" className="font-quran text-lg text-emerald-200 dir-rtl rtl-flow">
                        {surah.name}
                      </div>
                      <div className="text-[9px] text-stone-500 uppercase font-mono">
                        {surah.revelationType}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSurahNumber(surah.number);
                        if (surah.number !== 9) {
                          if (surah.number === 1) {
                            getSurahVerses(1).then((v) => {
                              if (v[0]) onPlayAyah(v[0], surah.englishName);
                            });
                          } else {
                            onPlayAyah({
                              ...BISMILLAH_AYAH,
                              surahNumber: surah.number,
                            }, surah.englishName);
                          }
                        } else {
                          getSurahVerses(9).then((v) => {
                            if (v[0]) onPlayAyah(v[0], surah.englishName);
                          });
                        }
                      }}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition active:scale-95"
                      title={surah.number !== 9 && surah.number !== 1 ? "Recite Surah (Starts with Bismillah)" : "Recite Surah"}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={(e) => handleDownload(surah.number, e)}
                      className={`p-1.5 rounded-lg border transition ${
                        isDownloaded
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-stone-900 text-stone-500 border-stone-800 hover:text-stone-300'
                      }`}
                      title={isDownloaded ? "Offline ready" : "Download offline"}
                    >
                      {downloadingId === surah.number ? (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      ) : isDownloaded ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gemini AI Ayah Tafsir & Deeper Meaning Modal */}
      <AyahTafsirModal
        isOpen={tafsirModalOpen}
        onClose={() => setTafsirModalOpen(false)}
        ayah={selectedTafsirAyah}
        surah={activeSurahMeta || (selectedTafsirAyah ? SURAHS_LIST.find((s) => s.number === selectedTafsirAyah.surahNumber) || null : null)}
        onPlayAyah={onPlayAyah}
        onNavigateAyah={handleNavigateTafsirAyah}
        hasPrevAyah={
          Boolean(selectedTafsirAyah && verses.findIndex((v) => v.numberInSurah === selectedTafsirAyah.numberInSurah) > 0)
        }
        hasNextAyah={
          Boolean(selectedTafsirAyah && verses.findIndex((v) => v.numberInSurah === selectedTafsirAyah.numberInSurah) < verses.length - 1)
        }
      />
    </div>
  );
};
