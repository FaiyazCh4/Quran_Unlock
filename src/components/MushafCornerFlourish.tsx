import React, { useId } from 'react';
import { MushafTheme } from '../services/storageService';

interface MushafCornerFlourishProps {
  position: 'top-left' | 'bottom-right';
  theme?: MushafTheme;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Elegant, authentic gold-colored Islamic ornamental corner flourish (SVG icon)
 * modeled after classical Medina Mushaf manuscript illumination (Tazhib / تذهيب).
 * Placed in corners of parchment backgrounds to replicate printed Quran pages.
 */
export const MushafCornerFlourish: React.FC<MushafCornerFlourishProps> = ({
  position,
  theme = 'cream',
  className = '',
  size = 'md',
}) => {
  const uid = useId().replace(/:/g, '_');
  const isTopLeft = position === 'top-left';

  // Size variations
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-16 sm:h-16',
    md: 'w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
    lg: 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
  }[size];

  // Position classes
  const positionClasses = isTopLeft
    ? 'top-1 left-1 sm:top-2 sm:left-2'
    : 'bottom-1 right-1 sm:bottom-2 sm:right-2 rotate-180';

  // Theme-specific glow and opacity adjustments
  const themeGlowClass =
    theme === 'night'
      ? 'opacity-85 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]'
      : theme === 'warm'
      ? 'opacity-80 filter drop-shadow-[0_1px_2px_rgba(146,64,14,0.3)]'
      : 'opacity-75 filter drop-shadow-[0_1px_2px_rgba(180,83,9,0.25)]';

  const goldPrimaryId = `gold-prim-${position}-${uid}`;
  const goldSecondaryId = `gold-sec-${position}-${uid}`;
  const goldJewelId = `gold-jewel-${position}-${uid}`;
  const goldStrokeId = `gold-stroke-${position}-${uid}`;

  return (
    <div
      className={`absolute ${positionClasses} pointer-events-none select-none z-10 transition-all duration-300 ${themeGlowClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich metallic gold gradient for illumination bands */}
          <linearGradient id={goldPrimaryId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="18%" stopColor="#b45309" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="52%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="88%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Lighter radiant gold for delicate fill details */}
          <linearGradient id={goldSecondaryId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fde047" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
          </linearGradient>

          {/* Fine gold outline stroke */}
          <linearGradient id={goldStrokeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Center jewel and beading radial highlight */}
          <radialGradient id={goldJewelId} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
        </defs>

        {/* 1. Outer Corner Border Frame Lines with Elegant Terminals */}
        <path
          d="M 6,94 L 6,6 L 94,6"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 11,84 L 11,11 L 84,11"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="0.8"
          strokeOpacity="0.8"
        />

        {/* Outer Arm Spearhead Finials */}
        {/* Horizontal top terminal */}
        <path
          d="M 94,6 C 96,3 99,2 101,6 C 99,10 96,9 94,6 Z"
          fill={`url(#${goldPrimaryId})`}
        />
        <circle cx="95" cy="6" r="1.2" fill={`url(#${goldJewelId})`} />

        {/* Vertical left terminal */}
        <path
          d="M 6,94 C 3,96 2,99 6,101 C 10,99 9,96 6,94 Z"
          fill={`url(#${goldPrimaryId})`}
        />
        <circle cx="6" cy="95" r="1.2" fill={`url(#${goldJewelId})`} />

        {/* 2. Classical Islamic Cusped (Ogee / Scalloped) Corner Arches */}
        <path
          d="M 11,74 Q 20,68 22,56 Q 34,42 46,34 Q 58,22 64,20 Q 68,14 74,11"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M 11,79 Q 24,72 27,59 Q 41,45 53,37 Q 66,24 72,21 Q 74,15 79,11"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="0.75"
          strokeDasharray="1.5 1.5"
          fill="none"
        />

        {/* 3. Outer Corner Crown Knot & Trefoil (at corner apex 6,6) */}
        <path
          d="M 6,6 C 9,10 14,11 16,16 C 11,14 10,9 6,6 Z"
          fill={`url(#${goldPrimaryId})`}
        />
        <path
          d="M 9,6 C 12,8 15,9 18,12 C 15,15 14,18 12,18 C 9,15 8,12 6,9 C 8,7 9,6 9,6 Z"
          fill={`url(#${goldSecondaryId})`}
          opacity="0.9"
        />
        <circle cx="9" cy="9" r="1.5" fill={`url(#${goldJewelId})`} />

        {/* 4. Central Arabesque Palmette & Tazhib Medallion along 45° diagonal */}
        {/* Diagonal Palmette Core Leaf pointing toward center */}
        <path
          d="M 28,28 C 32,36 38,44 48,50 C 53,53 58,58 60,60 C 58,58 53,53 50,48 C 44,38 36,32 28,28 Z"
          fill={`url(#${goldPrimaryId})`}
        />
        {/* Central Lotus Tip Leaf */}
        <path
          d="M 45,45 C 50,48 55,53 58,58 C 53,55 48,50 45,45 Z"
          fill={`url(#${goldSecondaryId})`}
        />
        {/* Outer Palmette Wings (Rumî lobes) */}
        <path
          d="M 38,38 C 36,44 36,50 40,54 C 42,50 44,46 44,42 Z"
          fill={`url(#${goldPrimaryId})`}
        />
        <path
          d="M 38,38 C 44,36 50,36 54,40 C 50,42 46,44 42,44 Z"
          fill={`url(#${goldPrimaryId})`}
        />

        {/* 5. Central 8-Pointed Star Rosette Medallion (Jewel center at 26,26) */}
        <path
          d="M 26,19 L 28.5,23.5 L 33,26 L 28.5,28.5 L 26,33 L 23.5,28.5 L 19,26 L 23.5,23.5 Z"
          fill={`url(#${goldPrimaryId})`}
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="0.6"
        />
        <circle cx="26" cy="26" r="2.8" fill={`url(#${goldJewelId})`} />
        <circle cx="26" cy="26" r="1.2" fill="#ffffff" />

        {/* 6. Intricate Islimi Scrollwork & Floral Spirals */}
        {/* Horizontal scroll tendril */}
        <path
          d="M 26,20 C 33,16 43,21 51,16 C 56,13 61,16 64,14"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 38,18 C 41,14 45,15 44,19 C 43,21 40,21 39,19 Z"
          fill={`url(#${goldSecondaryId})`}
        />
        <circle cx="64" cy="14" r="1.3" fill={`url(#${goldJewelId})`} />

        {/* Vertical scroll tendril */}
        <path
          d="M 20,26 C 16,33 21,43 16,51 C 13,56 16,61 14,64"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 18,38 C 14,41 15,45 19,44 C 21,43 21,40 19,39 Z"
          fill={`url(#${goldSecondaryId})`}
        />
        <circle cx="14" cy="64" r="1.3" fill={`url(#${goldJewelId})`} />

        {/* Secondary inner graceful curl */}
        <path
          d="M 28,32 C 32,38 34,44 32,48 C 30,51 26,49 27,45 C 28,42 31,42 32,44"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M 32,28 C 38,32 44,34 48,32 C 51,30 49,26 45,27 C 42,28 42,31 44,32"
          stroke={`url(#${goldStrokeId})`}
          strokeWidth="0.8"
          fill="none"
        />

        {/* 7. Ornamental Gilded Filigree Pearls (Beads) along lines & arches */}
        {/* Border line beads */}
        <circle cx="28" cy="6" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="48" cy="6" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="68" cy="6" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="84" cy="6" r="1.1" fill={`url(#${goldJewelId})`} />

        <circle cx="6" cy="28" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="6" cy="48" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="6" cy="68" r="1.1" fill={`url(#${goldJewelId})`} />
        <circle cx="6" cy="84" r="1.1" fill={`url(#${goldJewelId})`} />

        {/* Scalloped arch accent jewels */}
        <circle cx="16" cy="65" r="1.2" fill={`url(#${goldJewelId})`} />
        <circle cx="23" cy="54" r="1.3" fill={`url(#${goldJewelId})`} />
        <circle cx="35" cy="40" r="1.4" fill={`url(#${goldJewelId})`} />
        <circle cx="48" cy="30" r="1.4" fill={`url(#${goldJewelId})`} />
        <circle cx="59" cy="21" r="1.3" fill={`url(#${goldJewelId})`} />
        <circle cx="69" cy="14" r="1.2" fill={`url(#${goldJewelId})`} />
      </svg>
    </div>
  );
};
