import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Check,
  Lock,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sliders,
  Layers,
  Eye,
  Info,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function Appearance() {
  const { theme, setTheme } = useTheme();
  const { settings, toggleSetting, playChime } = useSettings();
  const navigate = useNavigate();

  const activeThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  function handleThemeSelect(t) {
    if (t.comingSoon) {
      if (playChime) playChime('warning');
      return;
    }
    setTheme(t.id);
    if (playChime) playChime('pop');
  }

  function handleToggleSetting(key) {
    if (toggleSetting) toggleSetting(key);
    if (playChime) playChime('pop');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-28 sm:pb-20 animate-fade-in select-none">
      {/* ── Top Navigation & Back Header ────────────────────── */}
      <div className="flex flex-col gap-2 pt-1 sm:pt-2">
        <button
          type="button"
          onClick={() => {
            if (playChime) playChime('pop');
            navigate('/settings');
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <ArrowLeft size={14} />
          <span>Settings</span>
        </button>

        <div className="flex items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Appearance & Themes
            </h1>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Customize your workspace aesthetics, color schemes, and visual dynamics.
            </p>
          </div>

          <div
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
              color: 'var(--accent-color)',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: activeThemeObj.preview[2] }}
            />
            <span>{activeThemeObj.name} Theme</span>
          </div>
        </div>
      </div>

      {/* ── Theme Selection Gallery ─────────────────────────── */}
      <div
        className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6 backdrop-blur-2xl transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <Palette size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Choose a Theme
            </h3>
            <p className="text-[11px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
              Tap any palette to instantly apply it across the application.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {THEMES.map((t) => {
            const [bg, surface, accent] = t.preview;
            const active = theme === t.id;
            const isWhite = t.id === 'light';
            const isLocked = Boolean(t.comingSoon);

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeSelect(t)}
                disabled={isLocked}
                aria-disabled={isLocked}
                className={`group relative flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 ${
                  isLocked
                    ? 'opacity-85 cursor-not-allowed border-dashed hover:border-amber-500/40'
                    : active
                    ? 'ring-2 ring-[var(--accent-color)] shadow-lg cursor-pointer active:scale-[0.98]'
                    : 'hover:border-[var(--border-card)] hover:bg-[var(--bg-surface)] cursor-pointer active:scale-[0.98]'
                }`}
                style={{
                  background: active ? 'var(--bg-surface)' : 'var(--bg-card-solid)',
                  borderColor: active
                    ? 'var(--accent-color)'
                    : isLocked
                    ? 'rgba(245, 158, 11, 0.35)'
                    : 'var(--border-subtle)',
                }}
              >
                {/* Palette Canvas Preview */}
                <div
                  className="w-full h-12 sm:h-16 rounded-xl mb-3 relative overflow-hidden border shadow-inner flex items-end p-1.5 sm:p-2"
                  style={{
                    background: bg,
                    borderColor: isWhite ? '#e5e7eb' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className="absolute inset-x-2 bottom-2 h-4 sm:h-5 rounded-lg shadow-xs opacity-90 border border-white/5"
                    style={{ background: surface }}
                  />
                  <div
                    className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                    style={{ background: accent }}
                  />

                  {/* Coming Soon Glass Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-all group-hover:bg-black/50">
                      <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-sm text-amber-300 backdrop-blur-md">
                        <Lock size={11} className="shrink-0 text-amber-400" />
                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="min-w-0 pr-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                        {t.name}
                      </p>
                      {isLocked && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/25 tracking-wide uppercase">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {t.description}
                    </p>
                  </div>

                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isLocked
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : active
                        ? 'border-transparent text-white'
                        : 'border-[var(--border-subtle)] opacity-30'
                    }`}
                    style={{
                      background: isLocked ? 'rgba(245, 158, 11, 0.12)' : active ? 'var(--accent-gradient)' : 'transparent',
                    }}
                  >
                    {isLocked ? (
                      <Lock size={9} strokeWidth={2.5} />
                    ) : (
                      active && <Check size={10} strokeWidth={3} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Background & Sensory Visuals ────────────────────── */}
      <div
        className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6 backdrop-blur-2xl transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Visual Effects & Dynamics
            </h3>
            <p className="text-[11px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
              Background motion and sensory cues.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Ambient Background Waves */}
          <div
            onClick={() => handleToggleSetting('ghostFibers')}
            className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer hover:border-[var(--accent-color)] active:scale-[0.99]"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--bg-card-solid)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-color)',
                }}
              >
                <Layers size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  Ambient Background Waves
                </p>
                <p className="text-[10px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Render floating wave fibers behind your workspace.
                </p>
              </div>
            </div>

            <Toggle
              on={settings?.ghostFibers !== false}
              onToggle={() => handleToggleSetting('ghostFibers')}
              label="Toggle ambient background fibers"
            />
          </div>

          {/* Sound & Audio Feedback */}
          <div
            onClick={() => handleToggleSetting('soundEffects')}
            className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer hover:border-[var(--accent-color)] active:scale-[0.99]"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--bg-card-solid)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-color)',
                }}
              >
                {settings?.soundEffects !== false ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  Interactive Sound Effects
                </p>
                <p className="text-[10px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Subtle chimes for task completions and actions.
                </p>
              </div>
            </div>

            <Toggle
              on={settings?.soundEffects !== false}
              onToggle={() => handleToggleSetting('soundEffects')}
              label="Toggle interactive sound effects"
            />
          </div>

          {/* Due Task Badges */}
          <div
            onClick={() => handleToggleSetting('dueTaskBadges')}
            className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer hover:border-[var(--accent-color)] active:scale-[0.99]"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--bg-card-solid)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-color)',
                }}
              >
                <CheckCircle2 size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  Due Task Navigation Badges
                </p>
                <p className="text-[10px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Show badge count on the navigation dock when tasks are due.
                </p>
              </div>
            </div>

            <Toggle
              on={settings?.dueTaskBadges}
              onToggle={() => handleToggleSetting('dueTaskBadges')}
              label="Toggle due task badges"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        on ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-700'
      }`}
      style={{
        background: on ? 'var(--accent-gradient)' : undefined,
      }}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          on ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
