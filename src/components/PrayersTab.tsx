import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Clock, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Volume2, 
  VolumeX, 
  Bell, 
  CheckCircle2, 
  RotateCw,
  Navigation as NavigationIcon,
  Sparkles,
  MapPin
} from 'lucide-react';

interface PrayerTime {
  name: string;
  arabicName: string;
  time: string; // 24-hr format "HH:MM"
  icon: React.ComponentType<{ className?: string }>;
  isPassed: boolean;
  isNext: boolean;
  description: string;
}

export const PrayersTab: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [compassHeading, setCompassHeading] = useState<number>(118); // Simulated heading toward Makkah (~118° from typical western location)
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const [completedSunnah, setCompletedSunnah] = useState<Record<string, boolean>>({
    fajr_sunnah: true,
    duha: false,
    rawatib_dhuhr: true,
    tahajjud: false,
  });

  // Keep current time updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format current hours and minutes
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

  // Prayer times for today (realistic calculation base)
  const prayerSchedule: PrayerTime[] = [
    {
      name: 'Fajr',
      arabicName: 'الفَجْر',
      time: '05:14',
      icon: Sunrise,
      isPassed: currentTimeMinutes >= 5 * 60 + 14,
      isNext: currentTimeMinutes < 5 * 60 + 14,
      description: 'Dawn prayer before sunrise • 2 Rakah Fard',
    },
    {
      name: 'Sunrise',
      arabicName: 'الشُّرُوق',
      time: '06:38',
      icon: Sun,
      isPassed: currentTimeMinutes >= 6 * 60 + 38,
      isNext: currentTimeMinutes >= 5 * 60 + 14 && currentTimeMinutes < 6 * 60 + 38,
      description: 'End of Fajr time • Duha prayer commences',
    },
    {
      name: 'Dhuhr',
      arabicName: 'الظُّهْر',
      time: '12:45',
      icon: Sun,
      isPassed: currentTimeMinutes >= 12 * 60 + 45,
      isNext: currentTimeMinutes >= 6 * 60 + 38 && currentTimeMinutes < 12 * 60 + 45,
      description: 'Midday prayer • 4 Rakah Fard',
    },
    {
      name: 'Asr',
      arabicName: 'العَصْر',
      time: '16:15',
      icon: Sunset,
      isPassed: currentTimeMinutes >= 16 * 60 + 15,
      isNext: currentTimeMinutes >= 12 * 60 + 45 && currentTimeMinutes < 16 * 60 + 15,
      description: 'Late afternoon prayer • 4 Rakah Fard',
    },
    {
      name: 'Maghrib',
      arabicName: 'المَغْرِب',
      time: '18:52',
      icon: Sunset,
      isPassed: currentTimeMinutes >= 18 * 60 + 52,
      isNext: currentTimeMinutes >= 16 * 60 + 15 && currentTimeMinutes < 18 * 60 + 52,
      description: 'Sunset prayer • 3 Rakah Fard',
    },
    {
      name: 'Isha',
      arabicName: 'العِشَاء',
      time: '20:18',
      icon: Moon,
      isPassed: currentTimeMinutes >= 20 * 60 + 18,
      isNext: currentTimeMinutes >= 18 * 60 + 52 && currentTimeMinutes < 20 * 60 + 18,
      description: 'Night prayer • 4 Rakah Fard + Witr',
    },
  ];

  // Find next prayer
  const nextPrayer = prayerSchedule.find((p) => p.isNext) || prayerSchedule[0];

  // Calculate time remaining to next prayer
  const [nextHoursStr, nextMinsStr] = nextPrayer.time.split(':');
  let nextTotalMins = parseInt(nextHoursStr, 10) * 60 + parseInt(nextMinsStr, 10);
  if (nextTotalMins < currentTimeMinutes) {
    nextTotalMins += 24 * 60; // Next day Fajr
  }
  const diffMinutes = nextTotalMins - currentTimeMinutes;
  const remainingHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  const toggleSunnah = (key: string) => {
    setCompletedSunnah((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAdhan = () => {
    setIsPlayingAdhan(!isPlayingAdhan);
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Top Banner: Next Prayer Countdown */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Prayer Times
            </span>
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Local Coordinates</span>
            </span>
          </div>

          <button
            onClick={handleToggleAdhan}
            className={`p-2 rounded-full border transition active:scale-95 ${
              isPlayingAdhan 
                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50 animate-pulse' 
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
            title="Preview Adhan Call to Prayer"
          >
            {isPlayingAdhan ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-xs text-stone-400 font-medium">Next Prayer</div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span>{nextPrayer.name}</span>
              <span className="font-amiri text-lg text-emerald-400 font-normal">
                {nextPrayer.arabicName}
              </span>
            </div>
            <div className="text-sm font-semibold text-emerald-400 mt-0.5">
              at {nextPrayer.time}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">COUNTDOWN</div>
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
              {remainingHours}h {remainingMinutes}m
            </div>
            <div className="text-[11px] text-stone-400">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} current
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Qibla Compass Card */}
      <div className="ios-glass-card rounded-3xl p-5 border border-stone-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Qibla Direction</h2>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {compassHeading}° SE (Makkah)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
          {/* Circular Compass Dial */}
          <div className="relative w-36 h-36 rounded-full border-2 border-stone-700/80 bg-stone-900/80 shadow-2xl flex items-center justify-center">
            {/* North Indicator */}
            <span className="absolute top-1 text-[10px] font-bold text-red-400 font-mono">N</span>
            <span className="absolute bottom-1 text-[10px] font-bold text-stone-500 font-mono">S</span>
            <span className="absolute right-1 text-[10px] font-bold text-stone-500 font-mono">E</span>
            <span className="absolute left-1 text-[10px] font-bold text-stone-500 font-mono">W</span>

            {/* Dial Tick Rings */}
            <div className="absolute inset-2 rounded-full border border-stone-800/60 pointer-events-none" />

            {/* Qibla Needle Pointing to Makkah */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            >
              <div className="w-1.5 h-14 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-full shadow-lg shadow-emerald-500/50 flex flex-col items-center -translate-y-4">
                <div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm -mt-1.5 border border-amber-200" />
              </div>
            </div>

            {/* Center Pivot */}
            <div className="absolute w-4 h-4 rounded-full bg-stone-800 border-2 border-emerald-400 shadow-md flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 max-w-[210px]">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-300">
              <NavigationIcon className="w-3.5 h-3.5 fill-current" />
              <span>Facing the Kaaba</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Align device horizontally. The golden marker points precisely to the Holy Kaaba in Makkah Al-Mukarramah.
            </p>
            <button
              onClick={() => setCompassHeading((prev) => (prev + 15) % 360)}
              className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 underline mx-auto sm:mx-0"
            >
              <RotateCw className="w-3 h-3" />
              <span>Calibrate Sensor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Prayers Timetable */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 px-1">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Today's Timetable</span>
        </h2>

        <div className="grid gap-2">
          {prayerSchedule.map((prayer) => {
            const Icon = prayer.icon;
            return (
              <div
                key={prayer.name}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                  prayer.isNext
                    ? 'bg-gradient-to-r from-emerald-950/60 to-stone-900 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : prayer.isPassed
                    ? 'bg-stone-900/40 border-stone-800/60 opacity-75'
                    : 'bg-stone-900/60 border-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    prayer.isNext
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{prayer.name}</span>
                      <span className="font-amiri text-xs text-stone-400">{prayer.arabicName}</span>
                      {prayer.isNext && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          NEXT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400">{prayer.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-bold font-mono ${
                    prayer.isNext ? 'text-emerald-400' : 'text-stone-200'
                  }`}>
                    {prayer.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunnah & Nawafil Spiritual Checklist */}
      <div className="ios-glass-card rounded-3xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Sunnah & Nawafil Check
            </h3>
          </div>
          <span className="text-[10px] text-stone-400">Extra Barakah</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'fajr_sunnah', title: '2 Rakah Fajr Sunnah', reward: 'Better than the world & all in it' },
            { key: 'duha', title: 'Salat al-Duha (Forenoon)', reward: 'Charity for every joint in body' },
            { key: 'rawatib_dhuhr', title: '4 Rakah Before Dhuhr', reward: 'House built in Jannah' },
            { key: 'tahajjud', title: 'Tahajjud (Qiyam)', reward: 'Honor of the believer' },
          ].map((item) => {
            const isDone = completedSunnah[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggleSunnah(item.key)}
                className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <span className="text-xs font-semibold leading-snug">{item.title}</span>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-400 fill-emerald-500/20' : 'text-stone-600'}`} />
                </div>
                <span className="text-[9px] text-stone-500 mt-2 block">{item.reward}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
