import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const SettingsContext = createContext(null);

const STORAGE_KEY = 'onedesk_settings';

const DEFAULT_SETTINGS = {
  dueTaskBadges: true,
  reminderAlerts: false,
  bouncyAnimations: true,
  soundEffects: true,
  ghostFibers: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const audioCtxRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota/private mode errors
    }
  }, [settings]);

  // Apply bouncyAnimations side-effect to document
  useEffect(() => {
    if (settings.bouncyAnimations) {
      document.documentElement.classList.remove('reduce-bounciness');
    } else {
      document.documentElement.classList.add('reduce-bounciness');
    }
  }, [settings.bouncyAnimations]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key) => {
    setSettings((prev) => {
      const newVal = !prev[key];
      return { ...prev, [key]: newVal };
    });
  }, []);

  // Web Audio API Synthesized UI Chimes (Zero external sound files required)
  const playChime = useCallback((type = 'success') => {
    if (!settings.soundEffects) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // Crisp dual-tone completion chime (E5 -> G#5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(830.61, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'pop') {
        // Soft bubble pop for toggles/chips
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch {
      // Audio playback fails silently if browser blocks autoplay
    }
  }, [settings.soundEffects]);

  // Native Browser Notification Dispatcher
  const sendPushNotification = useCallback((title, options = {}) => {
    if (!('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      const notif = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn('Push notification error:', e);
      return false;
    }
  }, []);

  // Native Browser Notification Permission Request
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support desktop notifications.');
      return false;
    }

    try {
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        updateSetting('reminderAlerts', true);
        sendPushNotification('OneDesk: Push Notifications Active', {
          body: 'You will receive timely desktop alerts for upcoming tasks, deadlines, and schedule events.',
        });
        return true;
      } else {
        updateSetting('reminderAlerts', false);
        alert('Notification permission was blocked. Please enable notifications for this site in your browser settings.');
        return false;
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  }, [updateSetting, sendPushNotification]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        toggleSetting,
        playChime,
        sendPushNotification,
        requestNotificationPermission,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
