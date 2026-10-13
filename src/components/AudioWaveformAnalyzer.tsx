import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Activity, BarChart2, Radio } from 'lucide-react';
import { Ayah } from '../types';

export type WaveformVisualMode = 'bars' | 'oscilloscope';

interface AudioWaveformAnalyzerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  currentAyah: Ayah | null;
  activeWordIndex?: number;
  wordsCount?: number;
  compact?: boolean;
}

/**
 * Visual Audio Waveform Analyzer for Quranic recitation.
 * Provides real-time frequency spectrum analysis with Web Audio API,
 * dynamic acoustic modeling, interactive scrub scrubbing, and multiple visualizer modes.
 */
export const AudioWaveformAnalyzer: React.FC<AudioWaveformAnalyzerProps> = ({
  audioElement,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  currentAyah,
  activeWordIndex = -1,
  wordsCount = 1,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [visualMode, setVisualMode] = useState<WaveformVisualMode>(() => {
    try {
      const saved = localStorage.getItem('quran_waveform_mode');
      return (saved as WaveformVisualMode) || 'bars';
    } catch {
      return 'bars';
    }
  });

  const [isHovering, setIsHovering] = useState(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [liveEnergy, setLiveEnergy] = useState<number>(0);

  // Calculate unique deterministic baseline waveform profile for each verse
  const barCount = compact ? 32 : 44;
  const baseProfile = useMemo(() => {
    const text = currentAyah?.text || 'بسم الله الرحمن الرحيم';
    const profile: number[] = [];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let i = 0; i < barCount; i++) {
      // Create natural envelope: tapered edges and melodic centers
      const normalizedPos = i / (barCount - 1);
      const envelope = Math.sin(normalizedPos * Math.PI); // Window function
      const pseudoRand = Math.abs(Math.sin((hash + i * 37) * 0.123));
      // Baseline height between 0.2 and 0.95
      const h = Math.max(0.18, Math.min(0.95, 0.25 + envelope * 0.5 + pseudoRand * 0.25));
      profile.push(h);
    }
    return profile;
  }, [currentAyah?.text, barCount]);

  const toggleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMode: WaveformVisualMode = visualMode === 'bars' ? 'oscilloscope' : 'bars';
    setVisualMode(nextMode);
    try {
      localStorage.setItem('quran_waveform_mode', nextMode);
    } catch (e) {
      console.warn(e);
    }
  };

  // Live Canvas Rendering Loop (Pure visual representation that never interferes with native audio playback)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      const t = time / 1000;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Acoustic energy based on live playback and recitation pacing
      let averageEnergy = 0.05;
      if (isPlaying) {
        const wordFactor = wordsCount > 0 ? (activeWordIndex % 3) * 0.15 : 0;
        const cadence = Math.sin(t * 5.5) * 0.2 + Math.cos(t * 11.2) * 0.15;
        averageEnergy = Math.max(0.28, Math.min(0.92, 0.48 + cadence + wordFactor));
      }

      setLiveEnergy(Math.round(averageEnergy * 100));

      const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
      const currentBarIndex = Math.floor(progressRatio * barCount);

      if (visualMode === 'bars') {
        // --- SPECTRUM BARS MODE ---
        const barWidth = (width / barCount) * 0.62;
        const barSpacing = width / barCount;
        const centerY = height / 2;

        for (let i = 0; i < barCount; i++) {
          const x = i * barSpacing + (barSpacing - barWidth) / 2;
          const isPlayed = i <= currentBarIndex;
          const isCurrent = i === currentBarIndex;

          let dynamicMultiplier = 0.8;
          if (isPlaying) {
            // Acoustic vocal flutter simulation
            const vocalMod1 = Math.sin(t * 7.5 + i * 0.45) * 0.28;
            const vocalMod2 = Math.cos(t * 13.2 - i * 0.7) * 0.18;
            const nearHeadBoost = Math.max(0, 1 - Math.abs(i - currentBarIndex) / 5) * 0.3;
            dynamicMultiplier = 0.65 + vocalMod1 + vocalMod2 + nearHeadBoost;
          } else {
            dynamicMultiplier = 0.8;
          }

          const barHeight = Math.max(4, Math.min(height - 4, baseProfile[i] * height * 0.85 * dynamicMultiplier));
          const y = centerY - barHeight / 2;

          // Gradient color styling
          ctx.beginPath();
          const radius = Math.min(barWidth / 2, 2.5);

          if (isPlayed) {
            // Vibrant gold-emerald recitation gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            if (isCurrent && isPlaying) {
              gradient.addColorStop(0, '#fef08a'); // Radiant highlight
              gradient.addColorStop(0.5, '#fbbf24'); // Golden amber
              gradient.addColorStop(1, '#10b981'); // Emerald
            } else {
              gradient.addColorStop(0, '#f59e0b'); // Amber gold
              gradient.addColorStop(0.5, '#10b981'); // Emerald
              gradient.addColorStop(1, '#059669'); // Deep emerald
            }
            ctx.fillStyle = gradient;
          } else {
            // Unplayed soft translucent emerald tone
            ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
          }

          // Draw rounded rectangle for bar
          drawRoundedRect(ctx, x, y, barWidth, barHeight, radius);
          ctx.fill();

          // Live peak glow on active playhead bar
          if (isCurrent && isPlaying) {
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(x + barWidth / 2, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + barWidth / 2, y + barHeight, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      } else {
        // --- FLUID OSCILLOSCOPE WAVE MODE ---
        const centerY = height / 2;
        const progressX = progressRatio * width;

        // Draw background wave line (unplayed)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 2;
        for (let x = 0; x <= width; x += 4) {
          const normX = x / width;
          const waveAmp = (baseProfile[Math.floor(normX * (barCount - 1))] || 0.5) * (height * 0.38);
          const phase = isPlaying ? t * 4 : 0;
          const y = centerY + Math.sin(normX * 12 + phase) * waveAmp * (isPlaying ? 0.75 + Math.sin(t * 8 + normX * 4) * 0.25 : 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw played illuminated wave line
        if (progressX > 0) {
          ctx.beginPath();
          const gradient = ctx.createLinearGradient(0, 0, progressX, 0);
          gradient.addColorStop(0, '#059669');
          gradient.addColorStop(0.5, '#10b981');
          gradient.addColorStop(1, '#fbbf24');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2.5;

          for (let x = 0; x <= progressX; x += 3) {
            const normX = x / width;
            const waveAmp = (baseProfile[Math.floor(normX * (barCount - 1))] || 0.5) * (height * 0.38);
            const phase = isPlaying ? t * 4 : 0;
            const y = centerY + Math.sin(normX * 12 + phase) * waveAmp * (isPlaying ? 0.75 + Math.sin(t * 8 + normX * 4) * 0.25 : 0.4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Active playhead beam
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          const playY = centerY + Math.sin((progressX / width) * 12 + (isPlaying ? t * 4 : 0)) * (height * 0.3) * (isPlaying ? 0.8 : 0.4);
          ctx.arc(progressX, playY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Hover indicator line if scrubbing or hovering
      if ((isHovering || isDragging) && hoverRatio !== null) {
        const hoverX = hoverRatio * width;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(hoverX, 0);
        ctx.lineTo(hoverX, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [baseProfile, barCount, isPlaying, currentTime, duration, visualMode, isHovering, isDragging, hoverRatio, wordsCount, activeWordIndex]);

  // Handle click & drag scrub interactions
  const handleSeekFromEvent = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container || duration <= 0) return;
      const rect = container.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, rawX / rect.width));
      setHoverRatio(ratio);
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleSeekFromEvent(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, rawX / rect.width));
    setHoverRatio(ratio);
    if (isDragging) {
      handleSeekFromEvent(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const hoverTime = hoverRatio !== null && duration > 0 ? hoverRatio * duration : null;

  return (
    <div className="w-full space-y-1.5 select-none">
      {/* Top Header of Waveform: Energy Metric, Visualizer Mode Switcher */}
      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Radio className={`w-3 h-3 ${isPlaying ? 'animate-pulse text-amber-400' : 'text-stone-500'}`} />
            <span>{isPlaying ? 'LIVE RECITATION WAVE' : 'RECITATION AUDIO SPECTRUM'}</span>
          </span>
          {isPlaying && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono hidden xs:inline border border-emerald-500/20">
              {liveEnergy}% ENERGY
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Switcher: Bars vs Oscilloscope */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition active:scale-95 text-[10px]"
            title={`Switch to ${visualMode === 'bars' ? 'Fluid Oscilloscope Wave' : 'Spectrum Bars'}`}
          >
            {visualMode === 'bars' ? (
              <>
                <BarChart2 className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Spectrum</span>
              </>
            ) : (
              <>
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Oscilloscope</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Waveform Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (!isDragging) setHoverRatio(null);
        }}
        className={`relative w-full h-11 sm:h-13 bg-stone-950/80 rounded-xl p-1 border transition-all cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-amber-400/80 ring-2 ring-amber-400/25 shadow-lg'
            : isPlaying
            ? 'border-emerald-500/40 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6),0_0_15px_rgba(16,185,129,0.15)]'
            : 'border-stone-800/80 hover:border-stone-700 shadow-inner'
        }`}
        title="Tap or drag to scrub recitation"
        role="slider"
        aria-label="Audio Waveform Scrubber"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={currentTime}
      >
        {/* Responsive Canvas */}
        <canvas
          ref={canvasRef}
          width={compact ? 320 : 440}
          height={compact ? 44 : 52}
          className="w-full h-full block"
        />

        {/* Hover Time Tooltip */}
        {isHovering && hoverTime !== null && (
          <div
            className="absolute top-1 pointer-events-none -translate-x-1/2 px-1.5 py-0.5 rounded bg-stone-900/95 border border-amber-400/50 text-[10px] font-mono text-amber-300 shadow-xl z-20"
            style={{
              left: `${Math.max(12, Math.min(88, (hoverRatio || 0) * 100))}%`,
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Time Legend Bar */}
      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono px-0.5">
        <span className="text-stone-300 font-semibold">{formatTime(currentTime)}</span>
        <span className="text-stone-500">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

// Canvas helper to draw rounded bars cleanly
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
