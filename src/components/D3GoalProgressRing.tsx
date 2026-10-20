import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Trophy, 
  Clock, 
  Zap, 
  Info,
  RotateCcw
} from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import confetti from 'canvas-confetti';

interface D3GoalProgressRingProps {
  currentMinutes: number;
  goalMinutes: number;
  size?: number;
  strokeWidth?: number;
  onScrubMinutes?: (minutes: number) => void;
  interactive?: boolean;
}

export const D3GoalProgressRing: React.FC<D3GoalProgressRingProps> = ({
  currentMinutes,
  goalMinutes,
  size = 170,
  strokeWidth = 14,
  onScrubMinutes,
  interactive = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevAngleRef = useRef<number>(0);
  
  const [hoveredInfo, setHoveredInfo] = useState<{
    percent: number;
    minutes: number;
    angleDeg: number;
    x: number;
    y: number;
  } | null>(null);

  const [activeMilestone, setActiveMilestone] = useState<{
    percent: number;
    title: string;
    description: string;
    reached: boolean;
  } | null>(null);

  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const validGoal = Math.max(1, goalMinutes);
  const progressRatio = Math.min(1.5, Math.max(0, currentMinutes / validGoal));
  const progressPercent = Math.round((currentMinutes / validGoal) * 100);
  const isCompleted = currentMinutes >= validGoal;

  // Milestone data points
  const milestones = useMemo(() => [
    { percent: 25, title: 'Quarter Gate', description: 'Initial focus attained • 1st app unlocked' },
    { percent: 50, title: 'Halfway Mark', description: 'Mindful stillness • Habit forming' },
    { percent: 75, title: 'Spiritual Depth', description: 'Deep reflection in divine verses' },
    { percent: 100, title: 'Daily Khatm Goal', description: 'Complete freedom • Shield unlocked for all apps' },
  ], []);

  // Radius calculations
  const center = size / 2;
  const outerRadius = (size - 16) / 2;
  const innerRadius = outerRadius - strokeWidth;
  const beadRadius = (innerRadius + outerRadius) / 2;

  // D3 Arc generator
  const arcGenerator = d3.arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(strokeWidth / 2);

  const backgroundArcData = {
    startAngle: 0,
    endAngle: 2 * Math.PI,
    innerRadius,
    outerRadius,
  };

  // Target angle in radians
  const targetAngle = Math.min(2 * Math.PI, progressRatio * 2 * Math.PI);

  // Render & animate D3 arc
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const progressPath = svg.select<SVGPathElement>('.d3-progress-arc');
    const sparkHead = svg.select<SVGCircleElement>('.d3-spark-head');
    const glowHalo = svg.select<SVGCircleElement>('.d3-spark-halo');

    const startAngle = prevAngleRef.current;
    const endAngle = targetAngle;

    // Custom D3 tween for smooth arc interpolation
    progressPath
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .attrTween('d', () => {
        const interpolate = d3.interpolate(startAngle, endAngle);
        return (t: number) => {
          const currentA = interpolate(t);
          return arcGenerator({
            startAngle: 0,
            endAngle: Math.max(0.001, currentA),
            innerRadius,
            outerRadius,
          }) || '';
        };
      })
      .on('end', () => {
        prevAngleRef.current = endAngle;
      });

    // Animate leading spark head
    const sparkAngle = endAngle - Math.PI / 2; // offset for 12 o'clock start
    const sparkX = center + beadRadius * Math.cos(sparkAngle);
    const sparkY = center + beadRadius * Math.sin(sparkAngle);

    if (endAngle > 0.05) {
      sparkHead
        .transition()
        .duration(850)
        .ease(d3.easeCubicOut)
        .attr('cx', sparkX)
        .attr('cy', sparkY)
        .attr('opacity', 1);

      glowHalo
        .transition()
        .duration(850)
        .ease(d3.easeCubicOut)
        .attr('cx', sparkX)
        .attr('cy', sparkY)
        .attr('opacity', 0.85);
    } else {
      sparkHead.attr('opacity', 0);
      glowHalo.attr('opacity', 0);
    }

    prevAngleRef.current = endAngle;
  }, [currentMinutes, goalMinutes, targetAngle, center, beadRadius, innerRadius, outerRadius]);

  // Polar coordinate interaction handler for scrubbing / hovering
  const handlePointerInteraction = (event: React.PointerEvent<SVGSVGElement>, commit: boolean = false) => {
    if (!interactive || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - center;
    const y = event.clientY - rect.top - center;

    const distance = Math.sqrt(x * x + y * y);
    // Only accept interactions near the ring
    if (distance < innerRadius - 15 || distance > outerRadius + 20) {
      if (!isScrubbing) setHoveredInfo(null);
      return;
    }

    // Angle from 12 o'clock (0 rad = top, clockwise)
    let angleRad = Math.atan2(y, x) + Math.PI / 2;
    if (angleRad < 0) angleRad += 2 * Math.PI;

    const scrubPercent = Math.min(100, Math.max(0, Math.round((angleRad / (2 * Math.PI)) * 100)));
    const scrubMinutes = Math.max(1, Math.round((scrubPercent / 100) * validGoal));

    setHoveredInfo({
      percent: scrubPercent,
      minutes: scrubMinutes,
      angleDeg: (angleRad * 180) / Math.PI,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    NotificationService.playBeadClickSound(1.0 + (scrubPercent / 100) * 0.4);

    if (commit && onScrubMinutes) {
      onScrubMinutes(scrubMinutes);
      NotificationService.triggerHaptic(25);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsScrubbing(true);
    handlePointerInteraction(e, true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isScrubbing) {
      handlePointerInteraction(e, true);
    } else {
      handlePointerInteraction(e, false);
    }
  };

  const handlePointerUp = () => {
    setIsScrubbing(false);
  };

  const handlePointerLeave = () => {
    if (!isScrubbing) {
      setHoveredInfo(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Interactive D3 SVG Surface */}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="overflow-visible touch-none cursor-pointer filter drop-shadow-lg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        aria-label={`Quran Reading Goal Progress Ring: ${progressPercent}%`}
      >
        <defs>
          {/* Radial & Linear Multi-Stop Gradients */}
          <linearGradient id="d3GoalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="d3GoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Glowing Shadow Filter */}
          <filter id="d3GlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="d3SparkGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${center}, ${center})`}>
          {/* 1. Background Groove Arc */}
          <path
            d={arcGenerator(backgroundArcData) || ''}
            className="fill-stone-900/90 stroke-stone-800/80"
            strokeWidth="1"
          />

          {/* 2. Concentric Decorative Guide Ring */}
          <circle
            r={beadRadius}
            fill="none"
            stroke="#44403c"
            strokeWidth="1"
            strokeDasharray="2 5"
            opacity="0.4"
          />

          {/* 3. D3 Dynamic Progress Arc (Updated via D3 Tween) */}
          <path
            className="d3-progress-arc"
            fill={isCompleted ? 'url(#d3GoalGradient)' : 'url(#d3GoalGradient)'}
            filter={isCompleted ? 'url(#d3GlowFilter)' : undefined}
          />
        </g>

        {/* 4. Interactive Milestone Beads at 25%, 50%, 75%, 100% */}
        {milestones.map((m) => {
          const angleRad = (m.percent / 100) * 2 * Math.PI - Math.PI / 2;
          const mx = center + beadRadius * Math.cos(angleRad);
          const my = center + beadRadius * Math.sin(angleRad);
          const reached = progressPercent >= m.percent;

          return (
            <g
              key={m.percent}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMilestone({ ...m, reached });
                NotificationService.playBeadClickSound(1.2);
              }}
            >
              {/* Outer pulsing ring if reached */}
              {reached && (
                <circle
                  cx={mx}
                  cy={my}
                  r="6.5"
                  className="fill-emerald-400/20 stroke-emerald-400/40 animate-ping"
                />
              )}

              {/* Milestone Bead Body */}
              <circle
                cx={mx}
                cy={my}
                r="4.2"
                className={`transition-colors duration-300 ${
                  reached
                    ? 'fill-emerald-300 stroke-emerald-500 shadow-md'
                    : 'fill-stone-800 stroke-stone-600'
                }`}
                strokeWidth="1.5"
              />

              {/* Inner core dot */}
              <circle
                cx={mx}
                cy={my}
                r="1.5"
                className={reached ? 'fill-stone-950' : 'fill-stone-500'}
              />
            </g>
          );
        })}

        {/* 5. Glowing Leading Head Spark (Animated via D3) */}
        <circle
          className="d3-spark-halo pointer-events-none"
          r={strokeWidth * 0.9}
          fill="#34d399"
          filter="url(#d3SparkGlow)"
          opacity="0"
        />
        <circle
          className="d3-spark-head pointer-events-none"
          r={strokeWidth * 0.42}
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0"
        />
      </svg>

      {/* Central Interactive HUD Statistics */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-2"
        style={{ width: size, height: size }}
      >
        {hoveredInfo ? (
          <div className="animate-fade-in flex flex-col items-center">
            <span className="text-xl font-black text-emerald-400 tracking-tight leading-none">
              {hoveredInfo.minutes}m
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300 mt-0.5">
              {hoveredInfo.percent}% Target
            </span>
            <span className="text-[8px] text-emerald-300/80 font-mono mt-0.5">
              Scrub to adjust
            </span>
          </div>
        ) : isCompleted ? (
          <div className="flex flex-col items-center">
            <div className="relative">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin-slow" />
            </div>
            <span className="text-base font-black text-white mt-0.5 leading-tight tracking-tight">
              100%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              UNLOCKED
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-white tracking-tight leading-none">
                {progressPercent}
              </span>
              <span className="text-xs font-bold text-emerald-400">%</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 mt-0.5 leading-tight">
              {currentMinutes}<span className="text-[9px] text-stone-400 font-normal">/{validGoal}m</span>
            </div>
            <span className="text-[8px] text-stone-400 font-medium uppercase tracking-wider mt-0.5 font-mono">
              Daily Habit
            </span>
          </div>
        )}
      </div>

      {/* Milestone Modal / Callout Tooltip */}
      {activeMilestone && (
        <div className="absolute -bottom-16 z-30 w-56 p-2.5 rounded-2xl bg-stone-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md animate-fade-in text-left">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeMilestone.percent}% Milestone</span>
            </div>
            <button
              onClick={() => setActiveMilestone(null)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              ✕
            </button>
          </div>
          <div className="text-xs font-semibold text-white mt-1">
            {activeMilestone.title}
          </div>
          <div className="text-[10px] text-stone-300 mt-0.5 leading-relaxed">
            {activeMilestone.description}
          </div>
          <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[9px]">
            <span className={activeMilestone.reached ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
              {activeMilestone.reached ? '✓ Completed today' : '○ Yet to reach'}
            </span>
            <span className="text-stone-400 font-mono">
              {Math.round((activeMilestone.percent / 100) * validGoal)} mins
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
