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
  BellRing, 
  BellOff, 
  CheckCircle2, 
  RotateCw, 
  Navigation as NavigationIcon, 
  Sparkles, 
  MapPin, 
  Sliders, 
  Calendar, 
  Check, 
  AlertCircle, 
  Radio, 
  ChevronRight, 
  X,
  Play
} from 'lucide-react';
import { 
  PrayerTimeService, 
  SUPPORTED_CITIES 
} from '../services/prayerTimeService';
import { 
  PrayerKey, 
  PrayerTimeItem, 
  PrayerNotificationSettings 
} from '../types';
import { NotificationService } from '../services/notificationService';

export const PrayersTab: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [compassHeading, setCompassHeading] = useState<number>(118); // Simulated heading toward Makkah
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] = useState<PrayerNotificationSettings>(
    PrayerTimeService.getSettings()
  );
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>(
    PrayerTimeService.getNotificationPermission()
  );
  const [testNotificationFeedback, setTestNotificationFeedback] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState<{
    prayerName: string;
    arabicName: string;
    time: string;
    body: string;
  } | null>(null);

  const [completedSunnah, setCompletedSunnah] = useState<Record<string, boolean>>({
    fajr_sunnah: true,
    duha: false,
    rawatib_dhuhr: true,
    tahajjud: false,
  });

  // Ticker for current time and automated notification checker (every second for fluid countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check every 30 seconds if any prayer notification is due
      if (now.getSeconds() % 30 === 0) {
        PrayerTimeService.checkAndDispatchDueNotifications(now);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Listen for in-app dispatched prayer notifications
  useEffect(() => {
    const handleDispatched = (e: any) => {
      if (e.detail) {
        setActiveBanner({
          prayerName: e.detail.prayerName,
          arabicName: e.detail.arabicName,
          time: e.detail.time,
          body: e.detail.body,
        });
        // Auto-dismiss banner after 8 seconds
        setTimeout(() => setActiveBanner(null), 8000);
      }
    };

    window.addEventListener('prayer-notification-dispatched', handleDispatched);
    return () => window.removeEventListener('prayer-notification-dispatched', handleDispatched);
  }, []);

  // Sync notification permission state
  useEffect(() => {
    setPermissionState(PrayerTimeService.getNotificationPermission());
  }, [notificationSettings.masterEnabled]);

  // Retrieve upcoming prayers, next prayer, and today's schedule from the mock service
  const { upcoming, nextPrayer, todaySchedule } = PrayerTimeService.getUpcomingPrayers(
    currentTime,
    5,
    notificationSettings.selectedCity
  );

  // Precise countdown calculation to next prayer
  const nowMs = currentTime.getTime();
  const diffMs = Math.max(0, nextPrayer.timestamp - nowMs);
  const diffTotalSeconds = Math.floor(diffMs / 1000);
  const remainingHours = Math.floor(diffTotalSeconds / 3600);
  const remainingMinutes = Math.floor((diffTotalSeconds % 3600) / 60);
  const remainingSeconds = diffTotalSeconds % 60;

  // Toggle master push notifications
  const handleToggleMasterNotifications = async () => {
    const nextState = !notificationSettings.masterEnabled;
    const result = await PrayerTimeService.toggleMasterNotifications(nextState);
    
    const updated = PrayerTimeService.getSettings();
    setNotificationSettings(updated);
    setPermissionState(result.permission);

    if (nextState) {
      if (result.permission === 'granted') {
        setTestNotificationFeedback('Push notifications enabled successfully!');
      } else if (result.permission === 'denied') {
        setTestNotificationFeedback('Notifications were denied in browser permissions.');
      } else {
        setTestNotificationFeedback('Local alerts enabled. In-app chimes will play.');
      }
      setTimeout(() => setTestNotificationFeedback(null), 4000);
    }
  };

  // Toggle individual prayer alerts
  const handleToggleIndividualPrayer = (prayerKey: PrayerKey) => {
    const updatedEnabled = {
      ...notificationSettings.enabledPrayers,
      [prayerKey]: !notificationSettings.enabledPrayers[prayerKey],
    };
    const updated: PrayerNotificationSettings = {
      ...notificationSettings,
      enabledPrayers: updatedEnabled,
    };
    setNotificationSettings(updated);
    PrayerTimeService.saveSettings(updated);
  };

  // Change lead time
  const handleChangeLeadMinutes = (minutes: number) => {
    const updated: PrayerNotificationSettings = {
      ...notificationSettings,
      reminderLeadMinutes: minutes,
    };
    setNotificationSettings(updated);
    PrayerTimeService.saveSettings(updated);
  };

  // Change selected city
  const handleChangeCity = (cityId: string) => {
    const updated: PrayerNotificationSettings = {
      ...notificationSettings,
      selectedCity: cityId,
    };
    setNotificationSettings(updated);
    PrayerTimeService.saveSettings(updated);
  };

  // Trigger test notification
  const handleTriggerTest = () => {
    PrayerTimeService.triggerTestNotification(nextPrayer.id);
    setTestNotificationFeedback(`Triggered test alert for ${nextPrayer.name}!`);
    setTimeout(() => setTestNotificationFeedback(null), 4000);
  };

  const handleToggleAdhan = () => {
    if (!isPlayingAdhan) {
      NotificationService.playAdhanTakbeer();
      setIsPlayingAdhan(true);
      setTimeout(() => setIsPlayingAdhan(false), 5000);
    } else {
      setIsPlayingAdhan(false);
    }
  };

  const toggleSunnah = (key: string) => {
    setCompletedSunnah((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPrayerIcon = (id: PrayerKey) => {
    switch (id) {
      case 'fajr':
        return Sunrise;
      case 'sunrise':
        return Sun;
      case 'dhuhr':
        return Sun;
      case 'asr':
        return Sunset;
      case 'maghrib':
        return Sunset;
      case 'isha':
      case 'qiyam':
        return Moon;
      default:
        return Sun;
    }
  };

  const activeCity = SUPPORTED_CITIES.find((c) => c.id === notificationSettings.selectedCity) || SUPPORTED_CITIES[0];

  return (
    <div className="space-y-4 pb-28 animate-fade-in relative">
      {/* Live In-App Notification Toast Banner */}
      {activeBanner && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-900/95 via-stone-900/95 to-emerald-950/95 border border-emerald-400/50 shadow-2xl backdrop-blur-xl animate-bounce-short flex items-start justify-between gap-3 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-emerald-300">
                  Time for {activeBanner.prayerName} ({activeBanner.arabicName})
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-mono">
                  {activeBanner.time}
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5 leading-snug">
                {activeBanner.body}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveBanner(null)}
            className="p-1 rounded-lg text-stone-400 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner: Next Prayer with Live Fluid Countdown */}
      <div className="ios-glass-card rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header Row with Location and Master Notification Toggle Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Upcoming Prayers
            </span>
            <div className="flex items-center gap-1 text-[11px] text-stone-300 truncate">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{activeCity.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Notification Settings Button */}
            <button
              onClick={() => setShowNotificationModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition active:scale-95 ${
                notificationSettings.masterEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/20'
                  : 'bg-stone-900/90 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
              title="Configure Prayer Notifications"
              aria-label="Prayer Notifications"
            >
              {notificationSettings.masterEnabled ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-[11px]">Alerts ON</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[11px]">Alerts OFF</span>
                </>
              )}
            </button>

            {/* Adhan Preview Audio Button */}
            <button
              onClick={handleToggleAdhan}
              className={`p-1.5 rounded-full border transition active:scale-95 ${
                isPlayingAdhan 
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50 animate-pulse' 
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
              title="Preview Adhan Call to Prayer"
              aria-label="Preview Adhan"
            >
              {isPlayingAdhan ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Countdown Display */}
        <div className="mt-3.5 flex items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-stone-400 font-medium">Next Upcoming Prayer</div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span>{nextPrayer.name}</span>
              <span className="font-amiri text-lg text-emerald-400 font-normal">
                {nextPrayer.arabicName}
              </span>
            </div>
            <div className="text-sm font-semibold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>at {nextPrayer.formattedTime}</span>
              {notificationSettings.masterEnabled && notificationSettings.enabledPrayers[nextPrayer.id] && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.2 rounded-md border border-emerald-500/20">
                  <Bell className="w-2.5 h-2.5" />
                  <span>Notified</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 max-w-[200px] leading-snug">
              {nextPrayer.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">COUNTDOWN</div>
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
              {remainingHours > 0 ? `${remainingHours}h ` : ''}
              {String(remainingMinutes).padStart(2, '0')}m {String(remainingSeconds).padStart(2, '0')}s
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} current
            </div>
          </div>
        </div>
      </div>

      {/* Quick Notification Settings Card & Master Push Toggle */}
      <div className="ios-glass-card rounded-3xl p-4.5 border border-emerald-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
              notificationSettings.masterEnabled
                ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-300'
                : 'bg-stone-800 text-stone-400 border border-stone-700'
            }`}>
              {notificationSettings.masterEnabled ? (
                <BellRing className="w-5 h-5 text-emerald-400 animate-pulse" />
              ) : (
                <BellOff className="w-5 h-5 text-stone-400" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Prayer Push Notifications</span>
                {permissionState === 'granted' && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                    Permission Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-stone-300">
                {notificationSettings.masterEnabled
                  ? `Active: ${notificationSettings.reminderLeadMinutes === 0 ? 'At exact adhan time' : `${notificationSettings.reminderLeadMinutes}m before prayer`}`
                  : 'Receive timely local alerts & serene Adhan chimes'}
              </p>
            </div>
          </div>

          {/* Master Push Notification Toggle Switch */}
          <button
            onClick={handleToggleMasterNotifications}
            className={`w-13 h-7.5 rounded-full p-1 transition-colors relative shrink-0 active:scale-95 cursor-pointer ${
              notificationSettings.masterEnabled
                ? 'bg-emerald-500 shadow-md shadow-emerald-500/30'
                : 'bg-stone-800 border border-stone-700'
            }`}
            title={notificationSettings.masterEnabled ? 'Disable notifications' : 'Enable notifications'}
            aria-label="Toggle Prayer Notifications"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                notificationSettings.masterEnabled ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Feedback message if testing or toggled */}
        {testNotificationFeedback && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 animate-fade-in flex items-center justify-between">
            <span>{testNotificationFeedback}</span>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        {/* Quick action row when notifications are enabled */}
        {notificationSettings.masterEnabled && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400">Timing:</span>
              {[0, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleChangeLeadMinutes(mins)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    notificationSettings.reminderLeadMinutes === mins
                      ? 'bg-emerald-500 text-stone-950 font-bold'
                      : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {mins === 0 ? 'Exact' : `-${mins}m`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerTest}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold active:scale-95 transition"
                title="Send sample alert to check sound and push notification"
              >
                <Sparkles className="w-3 h-3" />
                <span>Test Alert</span>
              </button>

              <button
                onClick={() => setShowNotificationModal(true)}
                className="text-[11px] text-stone-400 hover:text-stone-200 underline"
              >
                Customize
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Prayers Sequence from Mock Service */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Upcoming Prayer Schedule
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            Chronological Order
          </span>
        </div>

        <div className="grid gap-2">
          {upcoming.map((prayer, index) => {
            const Icon = getPrayerIcon(prayer.id);
            const isAlertActive = notificationSettings.masterEnabled && notificationSettings.enabledPrayers[prayer.id];

            return (
              <div
                key={`${prayer.dateStr}-${prayer.id}-${index}`}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                  prayer.isNext
                    ? 'bg-gradient-to-r from-emerald-950/70 via-stone-900 to-stone-900 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    prayer.isNext
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400 border border-stone-700/60'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{prayer.name}</span>
                      <span className="font-amiri text-xs text-stone-400">{prayer.arabicName}</span>
                      {prayer.isNext && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          NEXT
                        </span>
                      )}
                      {prayer.dateStr !== todaySchedule[0]?.dateStr && (
                        <span className="text-[9px] text-stone-400 bg-stone-800 px-1.5 py-0.2 rounded">
                          Tomorrow
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                      {prayer.rakahs || prayer.description}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3 shrink-0">
                  <div>
                    <div className={`text-base font-bold font-mono ${
                      prayer.isNext ? 'text-emerald-400' : 'text-stone-200'
                    }`}>
                      {prayer.formattedTime}
                    </div>
                    {prayer.minutesRemaining !== undefined && (
                      <div className="text-[10px] text-stone-400">
                        {prayer.minutesRemaining < 60
                          ? `in ${prayer.minutesRemaining}m`
                          : `in ${Math.floor(prayer.minutesRemaining / 60)}h ${prayer.minutesRemaining % 60}m`}
                      </div>
                    )}
                  </div>

                  {/* Individual Prayer Notification Toggle Button */}
                  <button
                    onClick={() => handleToggleIndividualPrayer(prayer.id)}
                    className={`p-1.5 rounded-lg border transition active:scale-90 ${
                      isAlertActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-stone-800/80 text-stone-500 border-stone-700 hover:text-stone-300'
                    }`}
                    title={isAlertActive ? `Mute ${prayer.name} notification` : `Enable ${prayer.name} notification`}
                    aria-label={`Toggle ${prayer.name} alert`}
                  >
                    {isAlertActive ? <Bell className="w-3.5 h-3.5 fill-current" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location / Calculation City Quick Switcher */}
      <div className="ios-glass-card rounded-3xl p-4 border border-stone-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Calculation & Coordinates
            </h3>
          </div>
          <span className="text-[10px] text-stone-400">Mock Service</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {SUPPORTED_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => handleChangeCity(city.id)}
              className={`p-2 rounded-xl text-left border text-xs transition active:scale-95 ${
                notificationSettings.selectedCity === city.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
            >
              <div className="font-semibold truncate">{city.name}</div>
              <div className="text-[9px] text-stone-500 truncate">{city.country}</div>
            </button>
          ))}
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
            <span className="absolute top-1 text-[10px] font-bold text-red-400 font-mono">N</span>
            <span className="absolute bottom-1 text-[10px] font-bold text-stone-500 font-mono">S</span>
            <span className="absolute right-1 text-[10px] font-bold text-stone-500 font-mono">E</span>
            <span className="absolute left-1 text-[10px] font-bold text-stone-500 font-mono">W</span>

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
              Align device horizontally. The golden indicator points precisely to the Holy Kaaba in Makkah Al-Mukarramah.
            </p>
            <button
              onClick={() => setCompassHeading((prev) => (prev + 15) % 360)}
              className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 underline mx-auto sm:mx-0 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Calibrate Sensor</span>
            </button>
          </div>
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
          <span className="text-[10px] text-stone-400">Daily Rewards</span>
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
                className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between cursor-pointer ${
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

      {/* Comprehensive Prayer Notifications Customization Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl ios-glass border border-emerald-500/40 p-5 shadow-2xl text-stone-100 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowNotificationModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-stone-950/80 rounded-[14px] flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Prayer Alert Preferences</h3>
                <p className="text-xs text-stone-400">
                  Local device notifications & Adhan chimes
                </p>
              </div>
            </div>

            {/* Master Push Notification Toggle */}
            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enable Push Notifications</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {notificationSettings.masterEnabled ? 'Active: Ready to alert on prayer times' : 'Disabled'}
                </div>
              </div>

              <button
                onClick={handleToggleMasterNotifications}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                  notificationSettings.masterEnabled ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-stone-800'
                }`}
              >
                <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                  notificationSettings.masterEnabled ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Reminder Lead Time Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                ALERT TIMING
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { value: 0, label: 'At Adhan' },
                  { value: 5, label: '5m Before' },
                  { value: 10, label: '10m Before' },
                  { value: 15, label: '15m Before' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleChangeLeadMinutes(item.value)}
                    className={`p-2 rounded-xl text-center text-xs font-semibold transition active:scale-95 cursor-pointer ${
                      notificationSettings.reminderLeadMinutes === item.value
                        ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/25'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Prayer Toggles */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                NOTIFY FOR SPECIFIC PRAYERS
              </label>
              <div className="space-y-1">
                {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'] as PrayerKey[]).map((key) => {
                  const isChecked = notificationSettings.enabledPrayers[key] ?? true;
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <div
                      key={key}
                      onClick={() => handleToggleIndividualPrayer(key)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/80 cursor-pointer hover:bg-stone-850 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white capitalize">{label}</span>
                        {key === 'fajr' && (
                          <span className="text-[9px] text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded font-mono">
                            Dawn
                          </span>
                        )}
                        {key === 'qiyam' && (
                          <span className="text-[9px] text-purple-300 bg-purple-500/15 px-1.5 py-0.2 rounded font-mono">
                            Night
                          </span>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isChecked 
                          ? 'bg-emerald-500 border-emerald-400 text-stone-950' 
                          : 'bg-stone-800 border-stone-700'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Alert Button */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <button
                onClick={handleTriggerTest}
                className="w-full py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Send Immediate Test Alert & Adhan</span>
              </button>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-stone-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
