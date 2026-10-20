export class NotificationService {
  private static audioCtx: AudioContext | null = null;

  // Plays a serene harmonic chime using Web Audio API (100% offline, no external audio file required!)
  static playReminderChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // Gentle harmonic bell (F minor chord / peaceful chime)
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      frequencies.forEach((freq, index) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.18 / (index + 1), now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 1.9);
      });
    } catch (e) {
      console.warn("Audio chime failed", e);
    }
  }

  // Tactile bead click sound for digital tasbih
  static playBeadClickSound(pitchFactor: number = 1.0) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // High-frequency subtle wooden click / resonant crystal bead
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Crisp subtle pop around 880Hz * pitchFactor
      osc.frequency.setValueAtTime(820 * pitchFactor, now);
      osc.frequency.exponentialRampToValueAtTime(320 * pitchFactor, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      this.triggerHaptic();
    } catch {
      // ignore
    }
  }

  // Trigger device haptic vibration
  static triggerHaptic(durationMs: number = 15) {
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(durationMs);
      }
    } catch {
      // ignore
    }
  }

  // Celebratory harp flourish for unlocking an app or reaching a goal!
  static playUnlockSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  // Plays a serene melodic Adhan motif using Web Audio API (offline, zero external latency)
  static playAdhanTakbeer() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // Reverent Adhan vocal-range notes: F3 (174.61), A3 (220), C4 (261.63), D4 (293.66), C4 (261.63), A3 (220)
      const adhanMotif = [
        { freq: 174.61, time: 0.0, dur: 0.6, gain: 0.16 }, // Al-
        { freq: 220.00, time: 0.45, dur: 0.8, gain: 0.20 }, // la-
        { freq: 261.63, time: 1.1, dur: 1.1, gain: 0.22 },  // hu
        { freq: 293.66, time: 2.0, dur: 0.7, gain: 0.19 },  // Ak-
        { freq: 261.63, time: 2.6, dur: 1.4, gain: 0.21 },  // bar
      ];

      adhanMotif.forEach(({ freq, time, dur, gain: vol }) => {
        const osc = this.audioCtx!.createOscillator();
        const oscHarmonic = this.audioCtx!.createOscillator();
        const gainNode = this.audioCtx!.createGain();

        osc.type = 'sine';
        oscHarmonic.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        oscHarmonic.frequency.setValueAtTime(freq * 2, now + time);

        gainNode.gain.setValueAtTime(0, now + time);
        gainNode.gain.linearRampToValueAtTime(vol, now + time + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gainNode);
        oscHarmonic.connect(gainNode);
        gainNode.connect(this.audioCtx!.destination);

        osc.start(now + time);
        oscHarmonic.start(now + time);
        osc.stop(now + time + dur + 0.1);
        oscHarmonic.stop(now + time + dur + 0.1);
      });

      this.triggerHaptic(40);
    } catch (e) {
      console.warn("Adhan motif playback error", e);
    }
  }

  static sendNotification(title: string, body: string) {
    this.playReminderChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn("Native notification dispatch error", e);
      }
    }
  }

  static sendPrayerNotification(prayerName: string, arabicName: string, time: string, customMessage?: string) {
    this.playAdhanTakbeer();
    this.triggerHaptic(60);

    const title = `🕋 Time for ${prayerName} (${arabicName}) • ${time}`;
    const body = customMessage || `Hayya 'ala-s-Salah — The call to prayer has arrived. Take a moment to connect with Allah.`;

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `prayer-${prayerName.toLowerCase()}-${Date.now()}`,
        });
      } catch (e) {
        console.warn("Native prayer notification error", e);
      }
    }

    // Emit event so the app can show an in-app banner toast if active
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prayer-notification-dispatched', {
          detail: { prayerName, arabicName, time, body, timestamp: Date.now() },
        })
      );
    }
  }
}

