import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-9 h-9 text-[13px]',
    lg: 'w-12 h-12 text-[16px]',
    xl: 'w-16 h-16 text-[22px]',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* iOS App Icon container */}
      <div
        className={`${sizeMap[size]} rounded-[11px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-[1.5px] shadow-lg shadow-emerald-950/60 border border-emerald-400/40 relative overflow-hidden select-none flex items-center justify-center`}
      >
        {/* Subtle geometric radiant pattern & inner gleam */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />
        
        {/* Arabic Calligraphy: Al-Quran (الْقُرْآن) */}
        <span
          className="font-quran font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight leading-none text-center dir-rtl relative z-10 pt-0.5"
          style={{ letterSpacing: '0.02em' }}
        >
          الْقُرْآن
        </span>

        {/* Golden corner emblem accent */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400/30 rounded-full blur-xs pointer-events-none" />
      </div>
    </div>
  );
};
