import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Volume1,
  RotateCcw, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Gauge, 
  Minus, 
  Plus, 
  Sliders,
  Radio,
  Lock,
  Smartphone,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Minimize2,
  Maximize2,
  EyeOff,
  Eye
} from 'lucide-react';
import { Ayah, Reciter } from '../types';
import { RECITERS, getAyahAudioUrl, getAyahAudioFallbackUrls } from '../data/quranData';
import { splitQuranWords, getWordTimings, getActiveWordIndex } from '../services/quranWordService';
import { StorageService } from '../services/storageService';
import { AudioWaveformAnalyzer } from './AudioWaveformAnalyzer';
import { webAudioRecitation } from '../services/webAudioRecitationService';
import { NotificationService } from '../services/notificationService';

interface AudioPlayerBarProps {
  currentAyah: Ayah | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  selectedReciter: Reciter;
  onChangeReciter: (reciter: Reciter) => void;
  surahName?: string;
  onClose?: () => void;
  onPlayStateChange?: (playing: boolean) => void;
  onPlaybackProgress?: (currentTime: number, duration: number, progressRatio: number) => void;
  externalSeekRatio?: number | null;
  onSeekHandled?: () => void;
  onNavigateToReader?: () => void;
  currentTab?: string;
}

const SPEED_PRESETS = [
  { value: 0.75, label: '0.75x', tag: 'Tartil • Slow' },
  { value: 0.85, label: '0.85x', tag: 'Gentle' },
  { value: 1.0, label: '1.0x', tag: 'Normal' },
  { value: 1.25, label: '1.25x', tag: 'Brisk' },
  { value: 1.5, label: '1.5x', tag: 'Fast • Hifz' },
];

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentAyah,
  isPlaying,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  selectedReciter,
  onChangeReciter,
  surahName = 'Surah Al-Fatiha',
  onClose,
  onPlayStateChange,
  onPlaybackProgress,
  externalSeekRatio,
  onSeekHandled,
  onNavigateToReader,
  currentTab,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(() => StorageService.getPlaybackSpeed());
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [showRecitersModal, setShowRecitersModal] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showBackgroundInfo, setShowBackgroundInfo] = useState(false);
  const [isWakeLockOn, setIsWakeLockOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  // Default to hidden when reciting so the floating player never irritates or blocks the Quran text
  const [isPlayerHidden, setIsPlayerHidden] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Auto-hide player whenever recitation starts or changes ayah
  useEffect(() => {
    if (isPlaying) {
      setIsPlayerHidden(true);
    }
  }, [currentAyah?.numberInSurah, currentAyah?.surahNumber, isPlaying]);
  
  // Volume & audio hardware guarantee states
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamSourceIndex, setStreamSourceIndex] = useState<number>(0);
  const [testSoundPlaying, setTestSoundPlaying] = useState<boolean>(false);

  // Multi-CDN Fallback URLs (EveryAyah -> Quran.com Cloudflare Edge -> QuranCDN -> Islamic Network)
  const fallbackUrls = useMemo(() => {
    if (!currentAyah) return [];
    return getAyahAudioFallbackUrls(
      currentAyah.surahNumber,
      currentAyah.numberInSurah,
      selectedReciter,
      currentAyah.number
    );
  }, [currentAyah?.surahNumber, currentAyah?.numberInSurah, currentAyah?.number, selectedReciter]);

  const currentStreamUrl = fallbackUrls[streamSourceIndex] || (
    currentAyah ? getAyahAudioUrl(currentAyah.surahNumber, currentAyah.numberInSurah, selectedReciter) : ''
  );

  const audioSrc = currentStreamUrl;

  // Words breakdown and timing for current reciting verse
  const words = currentAyah ? splitQuranWords(currentAyah.text) : [];
  const wordTimings = currentAyah ? getWordTimings(words) : [];
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, progress / duration)) : 0;
  const activeWordIdx = isPlaying ? getActiveWordIndex(wordTimings, progressRatio) : -1;
  const activeWord = activeWordIdx >= 0 && activeWordIdx < words.length ? words[activeWordIdx] : null;

  // Toggle Screen Wake Lock
  const handleToggleWakeLock = async () => {
    const nextState = !isWakeLockOn;
    const success = await webAudioRecitation.setWakeLock(nextState);
    setIsWakeLockOn(nextState && success);
  };

  // Bind Native Media Session Action Handlers (iOS & Android lock screen controls)
  useEffect(() => {
    webAudioRecitation.setMediaSessionActions({
      onPlay: () => {
        webAudioRecitation.ensureAudioContext();
        onTogglePlay();
      },
      onPause: () => {
        onTogglePlay();
      },
      onNext: () => {
        webAudioRecitation.ensureAudioContext();
        onNextAyah();
      },
      onPrev: () => {
        webAudioRecitation.ensureAudioContext();
        onPrevAyah();
      },
      onSeek: (targetTime: number) => {
        handleWaveformSeek(targetTime);
      },
      onSkipSeconds: (deltaSeconds: number) => {
        if (audioRef.current) {
          const dur = audioRef.current.duration || duration || 1;
          const target = Math.max(0, Math.min(dur, audioRef.current.currentTime + deltaSeconds));
          handleWaveformSeek(target);
        }
      },
    });
  }, [onTogglePlay, onNextAyah, onPrevAyah, duration]);

  // Handle external seek requests (e.g. user clicked a specific word in ReaderTab)
  useEffect(() => {
    if (externalSeekRatio !== null && externalSeekRatio !== undefined && audioRef.current) {
      const dur = audioRef.current.duration || duration || 1;
      const targetTime = Math.max(0, Math.min(dur, externalSeekRatio * dur));
      audioRef.current.currentTime = targetTime;
      setProgress(targetTime);
      onPlaybackProgress?.(targetTime, dur, externalSeekRatio);
      webAudioRecitation.syncPlaybackState(isPlaying, targetTime, dur, playbackRate);
      onSeekHandled?.();
    }
  }, [externalSeekRatio, duration, isPlaying, playbackRate, onPlaybackProgress, onSeekHandled]);

  // Synchronize audio volume and mute state to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Reset stream source index on Ayah change
  useEffect(() => {
    setStreamSourceIndex(0);
    setUsingFallback(false);
  }, [currentAyah?.surahNumber, currentAyah?.numberInSurah]);

  // Single unified audio playback & source sync controller
  const prevSrcRef = useRef<string>('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;

    // Check if audio source changed
    const srcChanged = Boolean(audioSrc && audioSrc !== prevSrcRef.current);
    if (srcChanged) {
      prevSrcRef.current = audioSrc;
      audio.src = audioSrc;
      audio.load();
      setProgress(0);
      setAudioError(null);

      // Initialize Web Audio Context and attach audio pipeline
      webAudioRecitation.ensureAudioContext();
      webAudioRecitation.attachAudioElement(audio);
      webAudioRecitation.startKeepAlive();

      // Synchronize Lock Screen metadata
      webAudioRecitation.updateMediaSession({
        title: currentAyah.numberInSurah === 0
          ? `${surahName} • Opening Bismillah`
          : `${surahName} • Ayah ${currentAyah.numberInSurah}`,
        artist: `${selectedReciter.name} (${selectedReciter.subname})`,
        album: 'The Noble Quran (القرآن الكريم)',
        surahNumber: currentAyah.surahNumber,
        ayahNumber: currentAyah.numberInSurah,
      });
    }

    if (isPlaying) {
      webAudioRecitation.ensureAudioContext();
      webAudioRecitation.startKeepAlive();
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioError(null);
            webAudioRecitation.syncPlaybackState(
              true, 
              audio.currentTime || 0, 
              audio.duration || duration, 
              playbackRate
            );
          })
          .catch((err) => {
            if (err.name === 'AbortError') {
              // Ignore play interruption by next ayah/load
              return;
            }
            console.warn("[Talawat Audio] Playback prevented by browser policy:", err);
            setAudioError("Tap to Play Talawat");
          });
      }
    } else {
      audio.pause();
      webAudioRecitation.syncPlaybackState(
        false, 
        audio.currentTime || 0, 
        audio.duration || duration, 
        playbackRate
      );
    }
  }, [audioSrc, isPlaying, playbackRate, isMuted, volume, currentAyah?.surahNumber, currentAyah?.numberInSurah, selectedReciter.id, surahName]);

  // High-frequency requestAnimationFrame loop while playing for buttery-smooth word synchronization
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (audioRef.current && isPlaying) {
        const curr = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setProgress(curr);
        if (dur > 0) {
          setDuration(dur);
          onPlaybackProgress?.(curr, dur, curr / dur);
        }
      }
      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, onPlaybackProgress]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setProgress(curr);
      setDuration(dur);
      if (onPlaybackProgress && dur > 0) {
        onPlaybackProgress(curr, dur, curr / dur);
      }
      // Sync state with device lock screen player
      webAudioRecitation.syncPlaybackState(isPlaying, curr, dur, playbackRate);
    }
  };

  const handleEnded = () => {
    // Keep Web Audio awake during Ayah transition
    webAudioRecitation.ensureAudioContext();
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      onNextAyah();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    handleWaveformSeek(val);
  };

  const handleWaveformSeek = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
      const dur = audioRef.current.duration || duration || 1;
      if (onPlaybackProgress && dur > 0) {
        onPlaybackProgress(val, dur, val / dur);
      }
    }
  };

  const handleSeekToWord = (index: number) => {
    if (wordTimings[index] && audioRef.current) {
      const dur = audioRef.current.duration || duration || 1;
      const targetTime = wordTimings[index].startRatio * dur;
      audioRef.current.currentTime = targetTime;
      setProgress(targetTime);
      onPlaybackProgress?.(targetTime, dur, wordTimings[index].startRatio);
    }
  };

  const handleSetRate = (newRate: number) => {
    const clamped = Math.min(1.5, Math.max(0.75, Math.round(newRate * 100) / 100));
    setPlaybackRate(clamped);
    StorageService.savePlaybackSpeed(clamped);
    if (audioRef.current) {
      audioRef.current.playbackRate = clamped;
    }
  };

  const stepRate = (delta: number) => {
    handleSetRate(playbackRate + delta);
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    handleSetRate(rates[nextIdx]);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['all', 'one', 'none'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIdx]);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.warn("Audio recitation load failed on current stream:", e);
    if (audioRef.current && fallbackUrls.length > 0) {
      const nextIndex = streamSourceIndex + 1;
      if (nextIndex < fallbackUrls.length) {
        console.log(`[Audio] Auto-switching to fallback CDN #${nextIndex}:`, fallbackUrls[nextIndex]);
        setStreamSourceIndex(nextIndex);
        setUsingFallback(true);
        audioRef.current.src = fallbackUrls[nextIndex];
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().then(() => setAudioError(null)).catch(() => {
            setAudioError("Tap Play to resume recitation");
          });
        }
        return;
      }
    }
    setAudioError("Audio stream paused. Tap Play to listen.");
  };

  if (!currentAyah) return null;

  // Auto-hide the players when reciting starts to prevent irritating or obscuring the Surah
  if (isPlayerHidden) {
    return (
      <>
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => {
            setAudioError(null);
            onPlayStateChange?.(true);
          }}
          onPause={() => onPlayStateChange?.(false)}
          onError={handleAudioError}
        />
        {/* Discreet minimal floating indicator (Zero screen overlap, peaceful reading) */}
        <div className="fixed bottom-20 right-3 z-40 animate-fade-in pointer-events-auto flex items-center gap-1.5 bg-stone-950/90 border border-emerald-500/40 rounded-full px-2.5 py-1 shadow-2xl backdrop-blur-xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold active:scale-90 transition cursor-pointer shrink-0"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current translate-x-0.2" />}
          </button>

          <button
            onClick={() => {
              setIsPlayerHidden(false);
              setIsMinimized(false);
            }}
            className="flex items-center gap-1.5 text-xs transition active:scale-95 cursor-pointer max-w-[140px] truncate"
            title="Recitation active. Tap to expand player"
          >
            <span className="font-mono text-[10px] font-semibold text-emerald-300 truncate">
              {currentAyah.numberInSurah === 0 ? 'Bismillah' : `Ayah ${currentAyah.numberInSurah}`}
            </span>
            <Eye className="w-3 h-3 text-stone-400 hover:text-white shrink-0" />
          </button>

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-0.5 rounded-full text-stone-500 hover:text-stone-300 transition shrink-0"
              title="Stop recitation"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-18 left-0 right-0 z-40 px-3">
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => {
            setAudioError(null);
            onPlayStateChange?.(true);
          }}
          onPause={() => onPlayStateChange?.(false)}
          onError={handleAudioError}
        />
        <div className="max-w-md mx-auto ios-glass-emerald rounded-full px-3 py-1.5 shadow-xl border border-emerald-500/40 flex items-center justify-between gap-2 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onTogglePlay}
              className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30 active:scale-90 transition shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
            </button>
            <div className="truncate text-xs">
              <span className="font-semibold text-white truncate block">
                {currentAyah.numberInSurah === 0 ? `${surahName} • Bismillah` : `${surahName} • Ayah ${currentAyah.numberInSurah}`}
              </span>
              <span className="text-[10px] text-emerald-300 font-mono truncate block">
                {selectedReciter.name.split(' ')[0]} • {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition"
              title="Expand player"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Close recitation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-18 left-0 right-0 z-40 px-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => {
          setAudioError(null);
          onPlayStateChange?.(true);
        }}
        onPause={() => onPlayStateChange?.(false)}
        onError={handleAudioError}
      />

      <div className="max-w-md mx-auto ios-glass-emerald rounded-2xl p-3 shadow-2xl border border-emerald-500/30 backdrop-blur-2xl transition-all duration-300">
        {/* Top bar: Info and expand toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Interactive Volume / Mute Toggle Button */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (audioRef.current) {
                  audioRef.current.muted = nextMuted;
                  audioRef.current.volume = nextMuted ? 0 : volume;
                }
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition active:scale-90 cursor-pointer ${
                isMuted
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-400 animate-pulse'
                  : 'bg-emerald-900/60 border-emerald-400/30 text-emerald-300 hover:bg-emerald-800/60'
              }`}
              title={isMuted ? "Audio Muted - Tap to Unmute!" : `Volume ${Math.round(volume * 100)}% (Tap to Mute)`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-emerald-300" />
              ) : (
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-emerald-300 animate-pulse' : 'text-stone-300'}`} />
              )}
            </button>
            <div className="truncate">
              <div className="flex items-center gap-1.5 flex-wrap">
                {isMuted && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-bold animate-pulse">
                    MUTED
                  </span>
                )}
                <span 
                  onClick={() => onNavigateToReader?.()}
                  className={`font-semibold text-xs text-white truncate ${onNavigateToReader ? 'hover:underline cursor-pointer' : ''}`}
                  title={onNavigateToReader ? 'Click to open in Mushaf' : undefined}
                >
                  {currentAyah.numberInSurah === 0 
                    ? `${surahName} • Opening Bismillah` 
                    : `${surahName} • Ayah ${currentAyah.numberInSurah}`}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {currentAyah.numberInSurah === 0 ? 'Bismillah' : currentAyah.juz ? `Juz ${currentAyah.juz}` : 'Ayah'}
                </span>
                {/* Web Audio API background active badge */}
                <button
                  onClick={() => setShowBackgroundInfo((prev) => !prev)}
                  className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-400/40 text-[9px] text-emerald-300 font-mono transition cursor-pointer active:scale-95"
                  title="Web Audio API Background Playback Active. Tap for lock screen & background details."
                >
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span>Web Audio</span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-300 truncate">
                <span>{selectedReciter.name}</span>
                {currentTab && currentTab !== 'reader' && onNavigateToReader && (
                  <button
                    onClick={onNavigateToReader}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-0.5"
                  >
                    <span>Mushaf</span>
                    <span>➔</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Play & Expand controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onPrevAyah}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/60 active:scale-95 transition"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 active:scale-90 transition"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
            </button>
            <button
              onClick={onNextAyah}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/60 active:scale-95 transition"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            {/* Speed Adjustment Control (0.75x - 1.5x) */}
            <button
              onClick={() => {
                setShowSpeedModal((prev) => !prev);
                setShowRecitersModal(false);
              }}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-lg font-mono text-[11px] transition border active:scale-95 ${
                showSpeedModal
                  ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 ring-2 ring-emerald-500/20'
                  : playbackRate !== 1
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-stone-900/60 text-stone-300 hover:text-white hover:bg-stone-800/80 border-stone-700/50'
              }`}
              title={`Recitation Speed: ${playbackRate}x (Click to select speeds 0.75x – 1.5x)`}
            >
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>{playbackRate.toFixed(playbackRate % 1 === 0 ? 1 : 2)}x</span>
            </button>
            <button
              onClick={() => setIsPlayerHidden(true)}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-stone-800/60 transition"
              title="Hide player (Recitation continues in background)"
            >
              <EyeOff className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition"
              title="Minimize player to thin pill"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition"
              title={isExpanded ? "Collapse player studio" : "Expand recitation studio"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Audio load / autoplay notification if error */}
        {audioError && (
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-400/50 flex items-center justify-between text-xs text-emerald-200 shadow-lg animate-pulse">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-[11px] font-semibold text-white truncate">{audioError}</span>
            </div>
            <button
              onClick={() => {
                if (audioRef.current) {
                  webAudioRecitation.ensureAudioContext();
                  audioRef.current.volume = 1.0;
                  audioRef.current.muted = false;
                  setIsMuted(false);
                  audioRef.current.play().then(() => setAudioError(null)).catch(() => {});
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition active:scale-95 shrink-0 shadow cursor-pointer ml-2"
            >
              Play Now
            </button>
          </div>
        )}

        {/* Compact Mode Slim Scrubber Track (Never blocks the Surah) */}
        {!isExpanded && (
          <div className="mt-2 pt-1 border-t border-white/5 flex items-center gap-2">
            <span className="text-[10px] font-mono text-stone-400 w-8 text-right shrink-0">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.05"
              value={progress}
              onChange={handleSeek}
              className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-stone-800 rounded-lg appearance-none"
              aria-label="Seek Recitation"
            />
            <span className="text-[10px] font-mono text-stone-400 w-8 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Dynamic Visual Audio Waveform Analyzer & Interactive Scrubber (Expanded Studio Only) */}
        {isExpanded && (
          <>
            <div className="mt-2">
              <AudioWaveformAnalyzer
                audioElement={audioRef.current}
                isPlaying={isPlaying}
                currentTime={progress}
                duration={duration}
                onSeek={handleWaveformSeek}
                currentAyah={currentAyah}
                activeWordIndex={activeWordIdx}
                wordsCount={words.length}
              />
            </div>

            {/* Live Active Word Recitation Spotlight Badge */}
            {isPlaying && activeWord && (
              <div dir="rtl" className="mt-2 px-2.5 py-1.5 rounded-xl bg-stone-900/80 border border-amber-400/30 flex items-center justify-between gap-2 shadow-inner rtl-flow">
                <div className="flex items-center gap-2">
                  <span className="font-quran text-lg font-bold text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
                    {activeWord}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                    Word {activeWordIdx + 1}/{words.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 dir-ltr" dir="ltr">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-semibold tracking-wider">RTL RECITATION</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Expanded options: Speed, Repeat, Reciter switcher & Word Timeline */}
        {isExpanded && (
          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 space-y-2.5 text-xs">
            {/* Interactive Word Track / Timeline with authentic Right-to-Left order */}
            {words.length > 0 && (
              <div className="p-2 rounded-xl bg-stone-950/70 border border-stone-800">
                <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1.5 font-mono">
                  <span>RECITING RIGHT-TO-LEFT (RTL ➔)</span>
                  <span className="text-amber-400/80">{words.length} words • Tap to jump</span>
                </div>
                <div dir="rtl" className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 rtl-flow justify-start">
                  {words.map((word, wIdx) => {
                    const isCurr = isPlaying && wIdx === activeWordIdx;
                    const isPast = isPlaying && wIdx < activeWordIdx;
                    return (
                      <button
                        key={wIdx}
                        onClick={() => handleSeekToWord(wIdx)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-quran transition-all ${
                          isCurr
                            ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-400/40 scale-105 ring-1 ring-amber-300'
                            : isPast
                            ? 'bg-stone-800/80 text-amber-200/90 hover:bg-stone-700'
                            : 'bg-stone-900/60 text-stone-400 hover:text-white hover:bg-stone-800'
                        }`}
                        title={`Word ${wIdx + 1}: ${word} (click to jump)`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recitation Speed Adjustment Control (0.75x – 1.5x) */}
            <div className="p-2.5 rounded-xl bg-stone-950/75 border border-stone-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recitation Speed</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    0.75x – 1.5x
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {playbackRate.toFixed(2)}x
                  </span>
                  {playbackRate !== 1 && (
                    <button
                      onClick={() => handleSetRate(1.0)}
                      className="text-[10px] text-stone-400 hover:text-emerald-300 underline font-mono transition"
                    >
                      Reset (1.0x)
                    </button>
                  )}
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-5 gap-1.5">
                {SPEED_PRESETS.map((p) => {
                  const isSelected = Math.abs(playbackRate - p.value) < 0.02;
                  return (
                    <button
                      key={p.value}
                      onClick={() => handleSetRate(p.value)}
                      className={`py-1 px-1 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-sm shadow-emerald-500/20 scale-102 ring-1 ring-emerald-400/40'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      }`}
                      title={`${p.label} - ${p.tag}`}
                    >
                      <div className="text-[11px] font-mono leading-tight">{p.label}</div>
                      <div className="text-[8px] text-stone-400 truncate scale-90">{p.tag}</div>
                    </button>
                  );
                })}
              </div>

              {/* Fine adjustment slider between 0.75x and 1.5x */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => stepRate(-0.05)}
                  disabled={playbackRate <= 0.75}
                  className="w-5 h-5 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition text-xs font-mono"
                  title="Decrease speed by 0.05x"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => handleSetRate(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none"
                />
                <button
                  onClick={() => stepRate(0.05)}
                  disabled={playbackRate >= 1.5}
                  className="w-5 h-5 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition text-xs font-mono"
                  title="Increase speed by 0.05x"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex justify-between text-[8px] font-mono text-stone-400 px-0.5">
                <span>0.75x (Tartil)</span>
                <span>1.0x (Standard)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Reciter selector */}
              <button
                onClick={() => {
                  setShowRecitersModal(!showRecitersModal);
                  setShowSpeedModal(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-900/60 hover:bg-stone-800/80 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium transition"
              >
                <span>Reciter: {selectedReciter.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2">
                {/* Repeat Mode */}
                <button
                  onClick={toggleRepeat}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition active:scale-95 ${
                    repeatMode === 'one'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : repeatMode === 'all'
                      ? 'bg-stone-900/60 border-stone-700/50 text-stone-300'
                      : 'bg-stone-900/40 border-stone-800 text-stone-500'
                  }`}
                  title={`Repeat: ${repeatMode === 'one' ? 'Repeat Ayah' : repeatMode === 'all' ? 'Continuous Surah' : 'Stop after Ayah'}`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{repeatMode === 'one' ? '1x Ayah' : repeatMode === 'all' ? 'Continuous' : 'Once'}</span>
                </button>
              </div>
            </div>

            {/* Speaker Output & Volume Control */}
            <div className="p-2.5 rounded-xl bg-stone-950/75 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>Speaker Output: {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                </div>
                
                {/* Instant Speaker Test Button */}
                <button
                  onClick={() => {
                    setTestSoundPlaying(true);
                    NotificationService.playAdhanTakbeer();
                    setTimeout(() => setTestSoundPlaying(false), 2500);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold active:scale-95 transition cursor-pointer"
                  title="Play a test chime to verify device speakers and unblock audio"
                >
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{testSoundPlaying ? 'Playing chime...' : 'Test Speakers'}</span>
                </button>
              </div>

              {/* Volume Slider & Quick Preset Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                    isMuted 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-stone-900 text-stone-300 border-stone-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (isMuted && val > 0) setIsMuted(false);
                  }}
                  className="flex-1 accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  aria-label="Volume Slider"
                />

                <span className="text-[10px] font-mono text-stone-400 w-8 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* CDN Stream Switcher */}
              <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] flex-wrap gap-1">
                <span className="text-stone-400">Audio Stream:</span>
                <div className="flex items-center gap-1">
                  {[
                    { idx: 0, label: 'EveryAyah (Direct)' },
                    { idx: 1, label: 'Quran.com CDN' },
                    { idx: 3, label: 'Islamic Network' },
                  ].map((stream) => (
                    <button
                      key={stream.idx}
                      onClick={() => {
                        setStreamSourceIndex(stream.idx);
                        if (audioRef.current && fallbackUrls[stream.idx]) {
                          audioRef.current.src = fallbackUrls[stream.idx];
                          audioRef.current.load();
                          if (isPlaying) audioRef.current.play().catch(() => {});
                        }
                      }}
                      className={`px-2 py-0.5 rounded-md font-mono text-[9px] transition cursor-pointer ${
                        streamSourceIndex === stream.idx
                          ? 'bg-emerald-500 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {stream.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Web Audio API Background & Lock Screen Controls */}
            <div className="p-2.5 rounded-xl bg-stone-950/75 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Background & Lock Screen</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    Web Audio API
                  </span>
                </div>
                <button
                  onClick={() => setShowBackgroundInfo(true)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-mono"
                >
                  How it works
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-stone-200">Lock Screen</div>
                    <div className="text-stone-400 text-[9px]">Play, Pause, Skip active</div>
                  </div>
                </div>

                <button
                  onClick={handleToggleWakeLock}
                  className={`p-2 rounded-lg border flex items-center gap-2 text-left transition active:scale-95 ${
                    isWakeLockOn
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800/80'
                  }`}
                  title="Keep screen awake while reciting Quran"
                >
                  <Smartphone className={`w-3.5 h-3.5 shrink-0 ${isWakeLockOn ? 'text-amber-400' : 'text-stone-400'}`} />
                  <div>
                    <div className="font-semibold">Keep Screen On</div>
                    <div className="text-[9px] text-stone-400">{isWakeLockOn ? 'Enabled (Awake)' : 'System Default'}</div>
                  </div>
                </button>
              </div>

              {currentTab && currentTab !== 'reader' && onNavigateToReader && (
                <button
                  onClick={onNavigateToReader}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium text-xs transition active:scale-98"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Return to Mushaf Reader</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Recitation Speed Selection Popup Modal */}
        {showSpeedModal && (
          <div className="mt-2 p-3 rounded-xl bg-stone-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-800">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Recitation Speed</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  0.75x – 1.5x
                </span>
              </div>
              <div className="flex items-center gap-2">
                {playbackRate !== 1 && (
                  <button
                    onClick={() => handleSetRate(1.0)}
                    className="text-[10px] text-stone-400 hover:text-emerald-300 underline font-mono transition"
                  >
                    Reset (1.0x)
                  </button>
                )}
                <button
                  onClick={() => setShowSpeedModal(false)}
                  className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition"
                  title="Close speed controls"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Speed Preset Buttons */}
            <div className="grid grid-cols-5 gap-1.5 mb-2.5">
              {SPEED_PRESETS.map((p) => {
                const isSelected = Math.abs(playbackRate - p.value) < 0.02;
                return (
                  <button
                    key={p.value}
                    onClick={() => handleSetRate(p.value)}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-md shadow-emerald-500/20 scale-102 ring-1 ring-emerald-400/50'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/70 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-mono font-semibold">{p.label}</span>
                    <span className="text-[9px] text-stone-400 truncate max-w-full scale-90">{p.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Fine Adjustment Slider (0.75x to 1.5x) */}
            <div className="p-2.5 rounded-lg bg-stone-950/70 border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-stone-400" />
                  Fine Adjustment
                </span>
                <span className="font-mono font-bold text-emerald-400 text-xs">
                  {playbackRate.toFixed(2)}x
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => stepRate(-0.05)}
                  disabled={playbackRate <= 0.75}
                  className="w-6 h-6 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition text-xs font-mono"
                  title="Decrease speed by 0.05x"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => handleSetRate(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none"
                />

                <button
                  onClick={() => stepRate(0.05)}
                  disabled={playbackRate >= 1.5}
                  className="w-6 h-6 rounded flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800 transition text-xs font-mono"
                  title="Increase speed by 0.05x"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-stone-400 px-0.5">
                <span>0.75x (Tartil)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-stone-400 text-center font-sans">
              Slow down for Tajweed precision & word memorization • Speed up for Hifz revision
            </p>
          </div>
        )}

        {/* Reciters selection popup */}
        {showRecitersModal && (
          <div className="mt-2 p-2 rounded-xl bg-stone-900/95 border border-stone-700/70 shadow-2xl space-y-1">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
              Select Reciter
            </p>
            {RECITERS.map((rec) => (
              <button
                key={rec.id}
                onClick={() => {
                  onChangeReciter(rec);
                  setShowRecitersModal(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                  selectedReciter.id === rec.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-stone-300 hover:bg-stone-800/80'
                }`}
              >
                <div>
                  <div className="font-medium">{rec.name}</div>
                  <div className="text-[10px] text-stone-400">{rec.subname}</div>
                </div>
                {selectedReciter.id === rec.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}

        {/* Web Audio API Background & Lock Screen Explanation Modal */}
        {showBackgroundInfo && (
          <div className="mt-2 p-3.5 rounded-2xl bg-stone-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Web Audio Background Playback</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">Uninterrupted Recitations</p>
                </div>
              </div>
              <button
                onClick={() => setShowBackgroundInfo(false)}
                className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-950/70 border border-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-medium">Continuous Across Tabs</strong>
                  Your recitation keeps playing uninterrupted whether you are in the Mushaf, reviewing daily wisdom in Shield, doing Dhikr, or checking your reading goals.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-950/70 border border-stone-800">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-medium">Device Lock Screen & Dynamic Island</strong>
                  When you lock your phone or turn off your screen, native iOS / Android media controls display the Surah name and reciter, allowing you to Play, Pause, or Skip Ayahs without unlocking.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-950/70 border border-stone-800">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-medium">Web Audio DAC Engine</strong>
                  Powered by Web Audio API keepalive technology that prevents browser mobile battery governors from terminating audio between verses.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBackgroundInfo(false)}
              className="w-full py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-semibold text-xs hover:bg-emerald-400 transition"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
