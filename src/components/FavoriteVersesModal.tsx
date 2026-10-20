import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Search, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Filter,
  Share2,
  ExternalLink
} from 'lucide-react';
import { FavoriteVerse, HighlightColor, Ayah } from '../types';

interface FavoriteVersesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteVerse[];
  onRemoveFavorite: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onSelectVerse: (surahNumber: number, ayahNumberInSurah: number) => void;
  onPlayAyah?: (ayah: Ayah, surahName: string) => void;
  onOpenTafsir?: (ayah: Ayah) => void;
  onSetHighlightColor?: (surahNumber: number, ayahNumberInSurah: number, color?: HighlightColor) => void;
}

const HIGHLIGHT_COLOR_INFO: Record<HighlightColor, { label: string; bgClass: string; dotClass: string; borderClass: string }> = {
  amber: { label: 'Golden Amber', bgClass: 'bg-amber-400/20 text-amber-300', dotClass: 'bg-amber-400', borderClass: 'border-amber-400/40' },
  emerald: { label: 'Emerald Green', bgClass: 'bg-emerald-500/20 text-emerald-300', dotClass: 'bg-emerald-400', borderClass: 'border-emerald-400/40' },
  rose: { label: 'Rose Coral', bgClass: 'bg-rose-500/20 text-rose-300', dotClass: 'bg-rose-400', borderClass: 'border-rose-400/40' },
  sky: { label: 'Sky Blue', bgClass: 'bg-sky-500/20 text-sky-300', dotClass: 'bg-sky-400', borderClass: 'border-sky-400/40' },
  purple: { label: 'Royal Purple', bgClass: 'bg-purple-500/20 text-purple-300', dotClass: 'bg-purple-400', borderClass: 'border-purple-400/40' },
};

export const FavoriteVersesModal: React.FC<FavoriteVersesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onUpdateNote,
  onSelectVerse,
  onPlayAyah,
  onOpenTafsir,
  onSetHighlightColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<HighlightColor | 'all'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter((fav) => {
    const matchesColor = selectedColorFilter === 'all' || fav.highlightColor === selectedColorFilter;
    if (!matchesColor) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      fav.surahEnglishName.toLowerCase().includes(q) ||
      fav.surahName.includes(q) ||
      fav.arabicText.includes(q) ||
      fav.translation.toLowerCase().includes(q) ||
      (fav.urduTranslation && fav.urduTranslation.includes(q)) ||
      (fav.note && fav.note.toLowerCase().includes(q)) ||
      `${fav.surahNumber}:${fav.ayahNumberInSurah}`.includes(q)
    );
  });

  const handleStartEditNote = (fav: FavoriteVerse) => {
    setEditingNoteId(fav.id);
    setNoteDraft(fav.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, noteDraft);
    setEditingNoteId(null);
  };

  const handleCopy = (fav: FavoriteVerse) => {
    const text = `${fav.arabicText}\n\n${fav.urduTranslation ? `${fav.urduTranslation}\n\n` : ''}"${fav.translation}"\n— [Surah ${fav.surahEnglishName} ${fav.surahNumber}:${fav.ayahNumberInSurah}]`;
    navigator.clipboard?.writeText(text);
    setCopiedId(fav.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleJumpToVerse = (fav: FavoriteVerse) => {
    onSelectVerse(fav.surahNumber, fav.ayahNumberInSurah);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-stone-800 bg-stone-900/95 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Star className="w-5 h-5 fill-amber-400/30 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Favorite Verses
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                  {favorites.length}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Your personal highlighted Quranic verses & reflections
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800/80 text-stone-400 hover:text-white border border-stone-700/80 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-stone-800/80 bg-stone-950/50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search saved verses by keyword, meaning, Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-400/60 focus:outline-none text-xs text-white placeholder-stone-500 shadow-inner"
            />
          </div>

          {/* Color filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setSelectedColorFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedColorFilter === 'all'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white border border-stone-700/60'
              }`}
            >
              All ({favorites.length})
            </button>

            {(['amber', 'emerald', 'rose', 'sky', 'purple'] as HighlightColor[]).map((col) => {
              const info = HIGHLIGHT_COLOR_INFO[col];
              const count = favorites.filter((f) => f.highlightColor === col).length;
              return (
                <button
                  key={col}
                  onClick={() => setSelectedColorFilter(col)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    selectedColorFilter === col
                      ? `${info.bgClass} font-bold ring-1 ${info.borderClass}`
                      : 'bg-stone-800/60 text-stone-400 hover:text-white border border-stone-700/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${info.dotClass}`} />
                  <span>{info.label.split(' ')[0]}</span>
                  <span className="opacity-70 font-mono text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Favorite Verses */}
        <div className="p-4 sm:p-5 overflow-y-auto ios-scroll flex-1 space-y-4">
          {filteredFavorites.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                <Star className="w-7 h-7 text-amber-400/50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-300">
                  {favorites.length === 0 ? 'No Favorite Verses Saved Yet' : 'No Verses Match Your Search'}
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {favorites.length === 0 
                    ? 'Tap the Star icon next to any Ayah in the Quran Reader or select text to highlight and save verses to your spiritual favorites.'
                    : 'Try clearing your search query or selecting a different highlight color filter.'}
                </p>
              </div>
            </div>
          ) : (
            filteredFavorites.map((fav) => {
              const colorInfo = fav.highlightColor ? HIGHLIGHT_COLOR_INFO[fav.highlightColor] : null;
              const ayahObj: Ayah = {
                number: fav.ayahNumber,
                numberInSurah: fav.ayahNumberInSurah,
                text: fav.arabicText,
                translation: fav.translation,
                urduTranslation: fav.urduTranslation,
                surahNumber: fav.surahNumber,
              };

              return (
                <div
                  key={fav.id}
                  className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden border ${
                    fav.highlightColor === 'amber'
                      ? 'ayah-highlight-amber border-amber-400/40'
                      : fav.highlightColor === 'emerald'
                      ? 'ayah-highlight-emerald border-emerald-400/40'
                      : fav.highlightColor === 'rose'
                      ? 'ayah-highlight-rose border-rose-400/40'
                      : fav.highlightColor === 'sky'
                      ? 'ayah-highlight-sky border-sky-400/40'
                      : fav.highlightColor === 'purple'
                      ? 'ayah-highlight-purple border-purple-400/40'
                      : 'bg-stone-900/95 border-stone-800'
                  }`}
                >
                  {/* Top Bar: Reference, Highlight Pill & Actions */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleJumpToVerse(fav)}
                        className="font-bold text-xs text-white hover:text-amber-300 flex items-center gap-1.5 transition group"
                        title="Open this Surah & jump directly to this verse"
                      >
                        <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-mono text-[11px] flex items-center justify-center font-bold">
                          {fav.surahNumber}
                        </span>
                        <span>{fav.surahEnglishName}</span>
                        <span className="text-stone-400 font-mono text-[11px]">
                          [{fav.surahNumber}:{fav.ayahNumberInSurah}]
                        </span>
                        <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-amber-300 transition" />
                      </button>

                      {colorInfo && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${colorInfo.bgClass} border ${colorInfo.borderClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colorInfo.dotClass}`} />
                          <span>{colorInfo.label}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Recite Audio */}
                      {onPlayAyah && (
                        <button
                          onClick={() => onPlayAyah(ayahObj, fav.surahEnglishName)}
                          className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-emerald-500/20 text-stone-300 hover:text-emerald-300 border border-stone-700/60 transition cursor-pointer"
                          title="Listen to recitation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Tafsir */}
                      {onOpenTafsir && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenTafsir(ayahObj);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-purple-500/20 text-stone-300 hover:text-purple-300 border border-stone-700/60 transition cursor-pointer"
                          title="View concise explanation & Tafsir"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                      )}

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(fav)}
                        className="p-1.5 rounded-lg bg-stone-800/80 text-stone-300 hover:text-white border border-stone-700/60 transition cursor-pointer"
                        title="Copy verse"
                      >
                        {copiedId === fav.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Remove Favorite */}
                      <button
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-1.5 rounded-lg bg-stone-800/80 text-stone-400 hover:text-rose-400 border border-stone-700/60 transition cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="py-3 text-right">
                    <p dir="rtl" className="font-quran text-xl sm:text-2xl text-amber-100 leading-[2.5] select-text">
                      {fav.arabicText}
                    </p>
                  </div>

                  {/* Urdu Translation in Noori Nastaleeq */}
                  {fav.urduTranslation && (
                    <div dir="rtl" className="pt-2 text-base sm:text-lg text-amber-200 font-nastaleeq leading-[2.3] text-right border-t border-white/10 select-text">
                      {fav.urduTranslation}
                    </div>
                  )}

                  {/* English Translation */}
                  <div className="pt-2 text-xs sm:text-sm text-stone-100 leading-relaxed font-sans select-text border-t border-white/5">
                    "{fav.translation}"
                  </div>

                  {/* Highlighted text snippet if specific */}
                  {fav.highlightedText && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/20 text-xs text-amber-200/90 font-mono">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-sans">
                        Selected excerpt:
                      </span>
                      "{fav.highlightedText}"
                    </div>
                  )}

                  {/* Personal Reflection / Note Section */}
                  <div className="mt-3 pt-2.5 border-t border-white/5">
                    {editingNoteId === fav.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Add your spiritual reflection, morning routine reminder, or why this verse is special to you..."
                          rows={2}
                          className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                          autoFocus
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 rounded-lg text-xs text-stone-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(fav.id)}
                            className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        {fav.note ? (
                          <div 
                            onClick={() => handleStartEditNote(fav)}
                            className="flex items-start gap-1.5 text-stone-300 hover:text-white cursor-pointer bg-stone-950/60 p-2 rounded-xl border border-white/5 flex-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-[11px] leading-relaxed italic">"{fav.note}"</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditNote(fav)}
                            className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1 transition"
                          >
                            <MessageSquare className="w-3 h-3 text-stone-500" />
                            <span>Add personal reflection / note</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleJumpToVerse(fav)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs flex items-center gap-1 transition shrink-0"
                        >
                          <span>Open Verse</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
