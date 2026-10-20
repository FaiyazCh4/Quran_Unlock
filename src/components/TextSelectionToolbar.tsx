import React from 'react';
import { Star, Copy, BookOpen, X, Sparkles } from 'lucide-react';
import { HighlightColor, Ayah } from '../types';

interface TextSelectionToolbarProps {
  position: { top: number; left: number } | null;
  selectedText: string;
  associatedAyah: Ayah | null;
  isFavorite: boolean;
  currentHighlightColor?: HighlightColor;
  onHighlight: (color: HighlightColor) => void;
  onClearHighlight: () => void;
  onToggleFavorite: () => void;
  onCopyText: () => void;
  onViewTafsir: () => void;
  onClose: () => void;
}

const COLOR_OPTIONS: { color: HighlightColor; label: string; bgClass: string; ringClass: string }[] = [
  { color: 'amber', label: 'Amber Gold', bgClass: 'bg-amber-400', ringClass: 'ring-amber-400' },
  { color: 'emerald', label: 'Emerald Green', bgClass: 'bg-emerald-400', ringClass: 'ring-emerald-400' },
  { color: 'rose', label: 'Rose Coral', bgClass: 'bg-rose-400', ringClass: 'ring-rose-400' },
  { color: 'sky', label: 'Sky Blue', bgClass: 'bg-sky-400', ringClass: 'ring-sky-400' },
  { color: 'purple', label: 'Purple', bgClass: 'bg-purple-400', ringClass: 'ring-purple-400' },
];

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  position,
  selectedText,
  associatedAyah,
  isFavorite,
  currentHighlightColor,
  onHighlight,
  onClearHighlight,
  onToggleFavorite,
  onCopyText,
  onViewTafsir,
  onClose,
}) => {
  if (!position) return null;

  return (
    <div
      style={{
        top: `${Math.max(12, position.top)}px`,
        left: `${Math.max(12, Math.min(window.innerWidth - 320, position.left))}px`,
      }}
      className="fixed z-50 animate-fade-in -translate-x-1/2 -translate-y-full mb-3 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-900/95 border border-amber-400/40 shadow-2xl backdrop-blur-xl text-xs text-white">
        {/* Highlight Color Pickers */}
        <div className="flex items-center gap-1 px-1.5 border-r border-white/10">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.color}
              onClick={() => onHighlight(c.color)}
              className={`w-5 h-5 rounded-full ${c.bgClass} transition-all duration-150 hover:scale-125 cursor-pointer relative ${
                currentHighlightColor === c.color ? `ring-2 ${c.ringClass} ring-offset-2 ring-offset-stone-900 scale-110` : 'opacity-85 hover:opacity-100'
              }`}
              title={`Highlight with ${c.label}`}
            />
          ))}
          {currentHighlightColor && (
            <button
              onClick={onClearHighlight}
              className="px-1.5 py-0.5 rounded text-[10px] text-stone-400 hover:text-rose-400 transition ml-0.5"
              title="Remove highlight"
            >
              Clear
            </button>
          )}
        </div>

        {/* Favorite Verse Action */}
        <button
          onClick={onToggleFavorite}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95 ${
            isFavorite
              ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
              : 'bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-amber-300'
          }`}
          title={isFavorite ? "Remove from Favorite Verses" : "Save as Favorite Verse"}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-stone-950 text-stone-950' : 'text-amber-400'}`} />
          <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>

        {/* View Tafsir */}
        <button
          onClick={onViewTafsir}
          className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium text-stone-300 hover:text-purple-300 hover:bg-stone-800 transition cursor-pointer"
          title="View concise explanation & Tafsir"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Tafsir</span>
        </button>

        {/* Copy */}
        <button
          onClick={onCopyText}
          className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          title="Copy selection"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-500 hover:text-stone-300 transition cursor-pointer ml-0.5"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Downward triangle pointer */}
      <div className="w-3 h-3 bg-stone-900 border-r border-b border-amber-400/40 rotate-45 mx-auto -mt-1.5 shadow-md" />
    </div>
  );
};
