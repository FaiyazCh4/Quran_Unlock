import React, { useState } from 'react';
import { Lock, Unlock, Volume2, Sparkles, X, ArrowRight, ShieldCheck, Heart, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlockedApp, Ayah } from '../types';
import { NotificationService } from '../services/notificationService';
import { AYAT_AL_KURSI, OFFLINE_SURAHS_DATA, getAyahAudioUrl } from '../data/quranData';
import { RECITERS } from '../data/quranData';

interface AppBlockerModalProps {
  app: BlockedApp;
  onClose: () => void;
  onUnlocked: (appId: string, durationMinutes: number) => void;
  onOpenMushaf: () => void;
}

const SAMPLE_UNLOCK_AYAHS: Ayah[] = [
  AYAT_AL_KURSI,
  OFFLINE_SURAHS_DATA[94][4], // Inna ma'al usri yusra
  OFFLINE_SURAHS_DATA[93][2], // Maa wadda'aka rabbuka wa maa qalaa
  OFFLINE_SURAHS_DATA[103][0], // Wal 'Asr
  OFFLINE_SURAHS_DATA[1][0], // Bismillah
  OFFLINE_SURAHS_DATA[67][0], // Tabarakallazee biyadihil mulk
  OFFLINE_SURAHS_DATA[112][0], // Qul Huwallahu Ahad
];

export const AppBlockerModal: React.FC<AppBlockerModalProps> = ({
  app,
  onClose,
  onUnlocked,
  onOpenMushaf,
}) => {
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(5);

  const currentAyah = SAMPLE_UNLOCK_AYAHS[currentAyahIndex];

  const handleNextAyah = () => {
    if (audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
    }
    setCurrentAyahIndex((prev) => (prev + 1) % SAMPLE_UNLOCK_AYAHS.length);
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    const audioUrl = getAyahAudioUrl(currentAyah.surahNumber, currentAyah.numberInSurah, RECITERS[0]);
    const audio = new Audio(audioUrl);
    setAudioObj(audio);
    setIsPlayingAudio(true);

    audio.play().catch((err) => {
      console.warn("Audio play issue", err);
      setIsPlayingAudio(false);
    });

    audio.onended = () => {
      setIsPlayingAudio(false);
    };
  };

  const handleCompleteUnlock = () => {
    if (audioObj) {
      audioObj.pause();
    }

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ffffff'],
      });
    } catch {
      // fallback
    }

    // Play synthesized unlock sound
    NotificationService.playUnlockSound();

    // Unlock for 30 minutes
    onUnlocked(app.id, 30);
  };

  const startEmergencyBypass = () => {
    setShowEmergency(true);
    let count = 5;
    setEmergencyCountdown(5);
    const interval = setInterval(() => {
      count -= 1;
      setEmergencyCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl ios-glass border border-emerald-500/30 p-5 shadow-2xl text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Screen Header */}
        <div className="text-center pt-2 pb-4">
          <div className="relative inline-block mb-3">
            <div className={`w-18 h-18 rounded-2xl bg-gradient-to-tr ${app.color} p-0.5 shadow-xl mx-auto flex items-center justify-center`}>
              <div className="w-full h-full bg-stone-950/70 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-black">{app.name.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 border-2 border-stone-950 flex items-center justify-center shadow-md">
              <Lock className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>{app.name} is Locked</span>
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto mt-1">
            Protected by <span className="text-emerald-400 font-semibold">Quran Unlock</span>. Recite 1 Ayah below to unlock for <span className="text-white font-medium">30 minutes</span>.
          </p>
        </div>

        {/* The Ayah Gateway Card */}
        <div className={`rounded-2xl p-4 shadow-inner transition-all duration-300 ${
          isPlayingAudio
            ? 'bg-gradient-to-b from-emerald-950/90 to-stone-950 border-2 border-emerald-400 ring-4 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
            : 'bg-gradient-to-b from-stone-900/90 to-stone-950 border border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Surah {currentAyah.surahNumber} • Ayah {currentAyah.numberInSurah}</span>
              {isPlayingAudio && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-black animate-pulse">
                  RECITING
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlayAudio}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                  isPlayingAudio
                    ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-bold'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                <span>{isPlayingAudio ? 'Listening...' : 'Recite'}</span>
              </button>
              <button
                onClick={handleNextAyah}
                className="p-1.5 rounded-full bg-stone-800/60 hover:bg-stone-700 text-stone-400 hover:text-white transition"
                title="Next Ayah"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="py-4 text-center">
            <p className={`font-quran text-2xl leading-loose text-center dir-rtl transition-all duration-300 ${
              isPlayingAudio
                ? 'text-emerald-300 font-bold drop-shadow-[0_0_14px_rgba(52,211,153,0.6)]'
                : 'text-emerald-100'
            } selection:bg-emerald-700`}>
              {currentAyah.text}
            </p>
          </div>

          {/* Translation */}
          <div className="pt-2 text-stone-300 text-xs leading-relaxed text-center border-t border-stone-800/60 italic font-light">
            "{currentAyah.translation}"
          </div>

          {/* Transliteration if available */}
          {currentAyah.transliteration && (
            <div className="mt-1.5 text-[11px] text-stone-500 text-center font-mono">
              {currentAyah.transliteration}
            </div>
          )}
        </div>

        {/* Action Button: Recited & Unlock */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleCompleteUnlock}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 active:scale-[0.98] transition"
          >
            <Unlock className="w-4 h-4 stroke-[2.5]" />
            <span>I have recited • Unlock {app.name}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenMushaf();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900/60 hover:bg-stone-800/70 text-stone-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-stone-800 transition"
          >
            <span>Open Full Mushaf Reader instead</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Emergency Mindful Pause Section */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 text-center">
          {!showEmergency ? (
            <button
              onClick={startEmergencyBypass}
              className="text-[11px] text-stone-500 hover:text-stone-400 underline underline-offset-2 transition"
            >
              Need urgent access for work/study?
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Mindful Pause Check</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-tight">
                Take a deep breath and ask: <span className="italic text-amber-200">"Is this scrolling truly necessary right now?"</span>
              </p>
              {emergencyCountdown > 0 ? (
                <div className="text-center py-1 text-xs text-stone-400 font-mono">
                  Take a breath... <span className="font-bold text-amber-400">{emergencyCountdown}s</span>
                </div>
              ) : (
                <button
                  onClick={() => onUnlocked(app.id, 5)}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/40 transition"
                >
                  Unlock for 5-minute emergency only
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
