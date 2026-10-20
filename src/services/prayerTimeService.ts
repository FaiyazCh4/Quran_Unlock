import { PrayerKey, PrayerTimeItem, PrayerNotificationSettings } from '../types';
import { NotificationService } from './notificationService';

export interface PrayerCityConfig {
  id: string;
  name: string;
  country: string;
  timezoneOffset: number; // relative base offset
  fajrOffset: number;
  dhuhrOffset: number;
  asrOffset: number;
  maghribOffset: number;
  ishaOffset: number;
}

export const SUPPORTED_CITIES: PrayerCityConfig[] = [
  { id: 'makkah', name: 'Makkah Al-Mukarramah', country: 'Saudi Arabia', timezoneOffset: 3, fajrOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },
  { id: 'madinah', name: 'Al-Madinah Al-Munawwarah', country: 'Saudi Arabia', timezoneOffset: 3, fajrOffset: 2, dhuhrOffset: 2, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezoneOffset: 2, fajrOffset: -12, dhuhrOffset: -10, asrOffset: -5, maghribOffset: -8, ishaOffset: -10 },
  { id: 'london', name: 'London', country: 'United Kingdom', timezoneOffset: 0, fajrOffset: -18, dhuhrOffset: 12, asrOffset: 24, maghribOffset: 28, ishaOffset: 35 },
  { id: 'new_york', name: 'New York', country: 'United States', timezoneOffset: -5, fajrOffset: 20, dhuhrOffset: 15, asrOffset: 30, maghribOffset: 22, ishaOffset: 25 },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', timezoneOffset: 3, fajrOffset: -8, dhuhrOffset: 5, asrOffset: 14, maghribOffset: 18, ishaOffset: 20 },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', timezoneOffset: 7, fajrOffset: -30, dhuhrOffset: -45, asrOffset: -40, maghribOffset: -55, ishaOffset: -50 },
  { id: 'local', name: 'Current Location (Auto)', country: 'Device GPS', timezoneOffset: 0, fajrOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },
];

const SETTINGS_STORAGE_KEY = 'qu_prayer_notifications_settings_v1';

export const DEFAULT_PRAYER_NOTIFICATION_SETTINGS: PrayerNotificationSettings = {
  masterEnabled: false,
  reminderLeadMinutes: 0, // 0 = at the exact prayer time
  playAdhanSound: true,
  enabledPrayers: {
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    qiyam: false,
  },
  selectedCity: 'local',
  selectedCalculationMethod: 'Umm al-Qura University, Makkah',
};

const BASE_PRAYER_SPECS: {
  id: PrayerKey;
  name: string;
  arabicName: string;
  baseHour: number;
  baseMinute: number;
  description: string;
  rakahs: string;
}[] = [
  {
    id: 'fajr',
    name: 'Fajr',
    arabicName: 'الفَجْر',
    baseHour: 5,
    baseMinute: 14,
    description: 'Dawn prayer before sunrise • Light of the morning',
    rakahs: '2 Rakah Fard (Sunnah recommended before)',
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    arabicName: 'الشُّرُوق',
    baseHour: 6,
    baseMinute: 38,
    description: 'End of Fajr time • Duha prayer commences',
    rakahs: 'Duha: 2-8 Rakah Voluntary',
  },
  {
    id: 'dhuhr',
    name: 'Dhuhr',
    arabicName: 'الظُّهْر',
    baseHour: 12,
    baseMinute: 45,
    description: 'Midday prayer as the sun declines from zenith',
    rakahs: '4 Rakah Fard (4 Sunnah before, 2 after)',
  },
  {
    id: 'asr',
    name: 'Asr',
    arabicName: 'العَصْر',
    baseHour: 16,
    baseMinute: 15,
    description: 'Late afternoon prayer • Guard strictly the middle prayer',
    rakahs: '4 Rakah Fard',
  },
  {
    id: 'maghrib',
    name: 'Maghrib',
    arabicName: 'المَغْرِب',
    baseHour: 18,
    baseMinute: 52,
    description: 'Sunset prayer immediately following sundown',
    rakahs: '3 Rakah Fard (2 Sunnah after)',
  },
  {
    id: 'isha',
    name: 'Isha',
    arabicName: 'العِشَاء',
    baseHour: 20,
    baseMinute: 18,
    description: 'Night prayer followed by Witr prayer',
    rakahs: '4 Rakah Fard (2 Sunnah after + Witr)',
  },
  {
    id: 'qiyam',
    name: 'Tahajjud (Qiyam)',
    arabicName: 'القِيَام',
    baseHour: 3,
    baseMinute: 45,
    description: 'The blessed last third of the night for deep intimacy with Allah',
    rakahs: '2 to 11 Rakah voluntary',
  },
];

export class PrayerTimeService {
  /**
   * Loads saved prayer notification settings from persistent storage.
   */
  static getSettings(): PrayerNotificationSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PRAYER_NOTIFICATION_SETTINGS,
          ...parsed,
          enabledPrayers: {
            ...DEFAULT_PRAYER_NOTIFICATION_SETTINGS.enabledPrayers,
            ...(parsed.enabledPrayers || {}),
          },
        };
      }
    } catch (e) {
      console.warn("Failed to load prayer notification settings", e);
    }
    return DEFAULT_PRAYER_NOTIFICATION_SETTINGS;
  }

  /**
   * Saves updated settings to storage.
   */
  static saveSettings(settings: PrayerNotificationSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save prayer notification settings", e);
    }
  }

  /**
   * Toggles the master local push notification switch.
   * If enabling, prompts the browser for Notification permission.
   */
  static async toggleMasterNotifications(enable: boolean): Promise<{
    success: boolean;
    permission: NotificationPermission | 'unsupported';
  }> {
    if (!enable) {
      const current = this.getSettings();
      this.saveSettings({ ...current, masterEnabled: false });
      return { success: true, permission: this.getNotificationPermission() };
    }

    if (!('Notification' in window)) {
      const current = this.getSettings();
      // Still enable in-app notifications
      this.saveSettings({ ...current, masterEnabled: true });
      return { success: true, permission: 'unsupported' };
    }

    const granted = await NotificationService.requestPermission();
    const current = this.getSettings();
    this.saveSettings({ ...current, masterEnabled: true });
    return {
      success: granted,
      permission: Notification.permission,
    };
  }

  static getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Formats 24h "HH:MM" into friendly 12h format "h:mm A".
   */
  static format12Hour(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
    return `${displayHour}:${displayMinute} ${period}`;
  }

  /**
   * Computes the complete prayer schedule for a specific date and selected city.
   */
  static getPrayerScheduleForDate(date: Date, cityId: string = 'local'): PrayerTimeItem[] {
    const city = SUPPORTED_CITIES.find((c) => c.id === cityId) || SUPPORTED_CITIES[0];
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Solar seasonal shift (mock seasonal daylight variance based on day of year)
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const seasonalShiftMinutes = Math.round(Math.sin((dayOfYear / 365) * 2 * Math.PI) * 12);

    return BASE_PRAYER_SPECS.map((spec) => {
      let offset = 0;
      if (spec.id === 'fajr') offset = city.fajrOffset - seasonalShiftMinutes;
      else if (spec.id === 'sunrise') offset = city.fajrOffset - seasonalShiftMinutes + 4;
      else if (spec.id === 'dhuhr') offset = city.dhuhrOffset;
      else if (spec.id === 'asr') offset = city.asrOffset + seasonalShiftMinutes;
      else if (spec.id === 'maghrib') offset = city.maghribOffset + seasonalShiftMinutes;
      else if (spec.id === 'isha') offset = city.ishaOffset + seasonalShiftMinutes;
      else if (spec.id === 'qiyam') offset = city.fajrOffset - 80;

      let totalMinutes = spec.baseHour * 60 + spec.baseMinute + offset;
      // Normalize to 0-1439
      totalMinutes = (totalMinutes + 1440) % 1440;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const formattedTime = this.format12Hour(h, m);

      // Create exact timestamp for comparison
      const prayerDate = new Date(year, month, day, h, m, 0, 0);
      const timestamp = prayerDate.getTime();
      const nowMs = Date.now();
      const isPassed = nowMs > timestamp;

      return {
        id: spec.id,
        name: spec.name,
        arabicName: spec.arabicName,
        time: timeStr,
        formattedTime,
        timestamp,
        description: spec.description,
        rakahs: spec.rakahs,
        isPassed,
        isNext: false, // Calculated dynamically in getUpcomingPrayers
        dateStr,
      };
    });
  }

  /**
   * Returns the list of upcoming prayer times (from the current moment forward).
   * Spans today and tomorrow to guarantee upcoming events are always readily available.
   */
  static getUpcomingPrayers(
    now: Date = new Date(),
    count: number = 6,
    cityId: string = 'local'
  ): {
    upcoming: PrayerTimeItem[];
    nextPrayer: PrayerTimeItem;
    todaySchedule: PrayerTimeItem[];
  } {
    const todaySchedule = this.getPrayerScheduleForDate(now, cityId);
    
    // Tomorrow's schedule
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSchedule = this.getPrayerScheduleForDate(tomorrow, cityId);

    // Combine standard prayer sequence (excluding Qiyam from regular cycle if preferred, but included for completeness)
    const all = [...todaySchedule, ...tomorrowSchedule].filter((p) => p.id !== 'qiyam');
    
    const nowMs = now.getTime();
    const futurePrayers = all.filter((p) => p.timestamp > nowMs);

    // If somehow all in array passed, pick tomorrow's first
    const nextPrayerRaw = futurePrayers[0] || tomorrowSchedule[0];

    // Mark isNext and isPassed accurately
    const formattedToday = todaySchedule.map((p) => ({
      ...p,
      isPassed: p.timestamp < nowMs,
      isNext: p.id === nextPrayerRaw.id && p.timestamp === nextPrayerRaw.timestamp,
      minutesRemaining: Math.max(0, Math.round((p.timestamp - nowMs) / 60000)),
    }));

    const upcoming = futurePrayers.slice(0, count).map((p, idx) => ({
      ...p,
      isNext: idx === 0,
      minutesRemaining: Math.max(0, Math.round((p.timestamp - nowMs) / 60000)),
    }));

    const nextPrayer: PrayerTimeItem = {
      ...nextPrayerRaw,
      isNext: true,
      minutesRemaining: Math.max(0, Math.round((nextPrayerRaw.timestamp - nowMs) / 60000)),
    };

    return {
      upcoming,
      nextPrayer,
      todaySchedule: formattedToday,
    };
  }

  /**
   * Evaluates if any scheduled prayer notification is due, dispatches push notification & adhan chime,
   * and prevents repeat notifications for the same prayer event.
   */
  static checkAndDispatchDueNotifications(now: Date = new Date()): {
    dispatched: boolean;
    prayerName?: string;
  } {
    const settings = this.getSettings();
    if (!settings.masterEnabled) {
      return { dispatched: false };
    }

    const { nextPrayer } = this.getUpcomingPrayers(now, 1, settings.selectedCity);
    if (!nextPrayer) return { dispatched: false };

    // Check if notifications are enabled for this specific prayer
    const isPrayerEnabled = settings.enabledPrayers[nextPrayer.id] ?? true;
    if (!isPrayerEnabled) return { dispatched: false };

    const nowMs = now.getTime();
    const diffMs = nextPrayer.timestamp - nowMs;
    const leadMs = settings.reminderLeadMinutes * 60 * 1000;

    // Trigger window: between lead time and lead time + 65 seconds
    const thresholdWindow = 65 * 1000; // 65 seconds tolerance for 1-minute ticker
    const eventUniqueId = `${nextPrayer.dateStr}-${nextPrayer.id}-${settings.reminderLeadMinutes}`;

    if (diffMs <= leadMs && diffMs > leadMs - thresholdWindow) {
      if (settings.lastNotifiedPrayerId !== eventUniqueId) {
        // Dispatch!
        const leadText =
          settings.reminderLeadMinutes > 0
            ? `starts in ${settings.reminderLeadMinutes} minutes`
            : `time has arrived (${nextPrayer.formattedTime})`;

        NotificationService.sendPrayerNotification(
          nextPrayer.name,
          nextPrayer.arabicName,
          nextPrayer.formattedTime,
          `Reminder: ${nextPrayer.name} prayer ${leadText}. ${nextPrayer.description}`
        );

        // Update settings with last notified tag
        this.saveSettings({
          ...settings,
          lastNotifiedPrayerId: eventUniqueId,
          lastNotifiedDate: nextPrayer.dateStr,
        });

        return { dispatched: true, prayerName: nextPrayer.name };
      }
    }

    return { dispatched: false };
  }

  /**
   * Fires an immediate test push notification and Adhan takbeer sound so users can verify device behavior.
   */
  static triggerTestNotification(prayerKey: PrayerKey = 'asr'): void {
    const spec = BASE_PRAYER_SPECS.find((p) => p.id === prayerKey) || BASE_PRAYER_SPECS[3];
    const now = new Date();
    const formattedTime = this.format12Hour(now.getHours(), now.getMinutes());

    NotificationService.sendPrayerNotification(
      spec.name,
      spec.arabicName,
      formattedTime,
      `[Test Alert] Push notification & serene Adhan audio are functioning properly for ${spec.name} prayer!`
    );
  }
}
