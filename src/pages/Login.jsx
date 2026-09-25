import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Palette,
  Sparkles,
  Check,
  ArrowRight,
  Info,
  X,
  GitBranch,
  Code2,
  Radio,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import GhostFibers from '../components/GhostFibers';
import OneDeskLogo from '../components/OneDeskLogo';

export const THEME_FIBER_COLORS = {
  dark: { glowLine: '#140E35', glowColor: '#3437A0' },
  light: { glowLine: '#c7d2fe', glowColor: '#818cf8' },
  aurora: { glowLine: '#042a18', glowColor: '#059669' },
  rose: { glowLine: '#3b0a1e', glowColor: '#e11d48' },
  ocean: { glowLine: '#042040', glowColor: '#0284c7' },
  amber: { glowLine: '#3a1c00', glowColor: '#d97706' },
};

export default function Login() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const ok = await login(form);
    setIsLoading(false);
    if (ok) navigate('/');
  }

  return (
    <AuthShell activeTab="login">
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
        <Field
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <Field
          label="Password"
          icon={Lock}
          type="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
        />

        {authError && (
          <div
            className="p-2 sm:p-2.5 rounded-xl border text-xs font-medium animate-fade-in flex items-start gap-2"
            style={{
              background: 'rgba(244,63,94,0.1)',
              borderColor: 'rgba(244,63,94,0.25)',
              color: '#fb7185',
            }}
          >
            <span>{authError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl text-white py-2.5 text-sm font-bold transition-all shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
          style={{
            background: 'var(--accent-gradient)',
            boxShadow: '0 6px 20px var(--accent-glow)',
          }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          <span>{isLoading ? 'Signing in to OneDesk…' : 'Sign in to workspace'}</span>
          {!isLoading && <ArrowRight size={14} />}
        </button>
      </form>

      {/* Google Login Option (Coming Soon) */}
      <GoogleAuthButton mode="login" />
    </AuthShell>
  );
}

export function AuthShell({ children, activeTab = 'login' }) {
  const { theme, setTheme } = useTheme();
  const { settings, toggleSetting, playChime } = useSettings();
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const themeColors = THEME_FIBER_COLORS[theme] || THEME_FIBER_COLORS.dark;

  function handleThemeChange(newThemeId) {
    setTheme(newThemeId);
    if (playChime) playChime('pop');

    // Pop up notification strictly on mobile devices (<640px)
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const selectedTheme = THEMES.find((t) => t.id === newThemeId);
      const themeName = selectedTheme?.name || newThemeId;
      const isWhite = newThemeId === 'light';
      const circleColor = isWhite ? '#ffffff' : (selectedTheme?.color || selectedTheme?.preview?.[2] || '#818cf8');

      setToast({
        id: Date.now(),
        type: 'theme',
        text: `${themeName} theme applied`,
        color: circleColor,
        isWhite,
      });

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 2200);
    }
  }

  function handleToggleFibers() {
    const isCurrentlyOn = settings?.ghostFibers !== false;
    const willBeEnabled = !isCurrentlyOn;
    if (toggleSetting) toggleSetting('ghostFibers');
    if (playChime) playChime('pop');

    // Pop up notification strictly on mobile devices (<640px)
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setToast({
        id: Date.now(),
        type: 'bg',
        text: `Background animation ${willBeEnabled ? 'enabled' : 'disabled'}`,
        enabled: willBeEnabled,
      });

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 2200);
    }
  }

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-3 sm:px-6 pt-14 pb-16 sm:py-4 overflow-x-hidden transition-colors duration-500"
      style={{
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Dynamic Background Fibers */}
      {settings?.ghostFibers !== false && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden fiber-canvas">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <GhostFibers
              lineColor={themeColors.glowLine}
              glowColor={themeColors.glowColor}
              speed={0.2}
              scale={2}
              rotation={0}
              rotationSpeed={0.25}
              layers={4}
              waveAmplitude={0.015}
              waveFrequency={3}
              waveSpeed={0.15}
              layerSpeed={0.08}
              twist={0.1}
              twistFrequency={5}
              twistSpeed={1.2}
              lineFrequency={5}
              lineSpacing={2}
              lineSharpness={16}
              glowFalloff={10}
              glowIntensity={1.6}
              brightness={2}
              blueBoost={1.25}
              vignette={0.8}
              grain={0.05}
              dpr={1}
              lightMode={theme === 'light'}
              fps={60}
              paused={false}
            />
          </div>
          <div className="absolute inset-0 page-blur-layer" />
        </div>
      )}

      {/* Brand Pill — Top Centralized on Mobile, Top-Left on Desktop */}
      <div className="fixed top-3 sm:top-4 inset-x-0 sm:inset-x-auto sm:left-8 mx-auto sm:mx-0 w-fit z-30 pointer-events-auto">
        <div
          className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border shadow-lg backdrop-blur-xl transition-all"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            color: 'var(--text-primary)',
          }}
        >
          <OneDeskLogo size={20} className="shrink-0 sm:w-[22px] sm:h-[22px]" />
          <span className="font-display font-bold text-xs sm:text-sm tracking-tight">
            OneDesk
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            OS v2.0
          </span>
        </div>
      </div>

      {/* Floating Theme Customizer Pill — Bottom Centralized on Mobile, Top-Right on Desktop */}
      <div className="fixed bottom-3.5 sm:bottom-auto sm:top-4 inset-x-0 sm:inset-x-auto sm:right-8 mx-auto sm:mx-0 w-fit z-30 pointer-events-auto">
        <div
          className="flex items-center gap-1 sm:gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
          }}
        >
          <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-[var(--border-subtle)]">
            <Palette size={13} style={{ color: 'var(--accent-color)' }} />
            <span className="text-[11px] font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
              {THEMES.find((t) => t.id === theme)?.name || theme}
            </span>
          </div>

          {/* Quick theme bubbles */}
          <div className="flex items-center gap-1">
            {THEMES.map((t) => {
              const active = theme === t.id;
              const isWhite = t.id === 'light';
              const circleColor = isWhite ? '#ffffff' : (t.color || t.preview[2] || t.preview[0]);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  title={`${t.name}: ${t.description}`}
                  className="group relative flex items-center justify-center p-0.5 sm:p-1 rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    outline: 'none',
                    transform: active ? 'scale(1.18)' : 'scale(1)',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-all border shadow-sm"
                    style={{
                      background: circleColor,
                      borderColor: active
                        ? (isWhite ? 'var(--accent-color)' : '#ffffff')
                        : (isWhite ? 'rgba(0,0,0,0.3)' : 'transparent'),
                      boxShadow: active
                        ? (isWhite ? '0 0 10px rgba(255,255,255,0.9)' : `0 0 10px ${circleColor}aa`)
                        : 'none',
                    }}
                  >
                    {active && (
                      <Check
                        size={10}
                        className={isWhite ? 'text-stone-900' : 'text-white drop-shadow'}
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toggle fibers */}
          <button
            type="button"
            onClick={handleToggleFibers}
            title={settings?.ghostFibers !== false ? 'Disable animated background' : 'Enable animated background'}
            className="p-1 sm:p-1.5 rounded-full border transition-all ml-0.5 cursor-pointer"
            style={{
              background: settings?.ghostFibers !== false ? 'var(--bg-surface)' : 'transparent',
              borderColor: 'var(--border-subtle)',
              color: settings?.ghostFibers !== false ? 'var(--accent-color)' : 'var(--text-muted)',
            }}
          >
            <Sparkles size={12} />
          </button>
        </div>
      </div>

      {/* Mobile Pop-up Notification for Theme & Animated BG (Only for Mobile) */}
      {toast && (
        <div
          key={toast.id}
          className="sm:hidden fixed bottom-16 inset-x-0 mx-auto w-fit z-40 pointer-events-none animate-fade-in"
        >
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl text-xs font-semibold whitespace-nowrap"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor:
                toast.type === 'theme'
                  ? (toast.isWhite ? 'var(--border-card)' : toast.color)
                  : toast.enabled
                    ? 'var(--accent-color)'
                    : 'var(--border-card)',
              color: 'var(--text-primary)',
              boxShadow:
                toast.type === 'theme'
                  ? (toast.isWhite
                    ? '0 10px 28px -4px rgba(79,70,229,0.25), 0 2px 8px rgba(0,0,0,0.06)'
                    : `0 8px 24px -4px ${toast.color}66`)
                  : toast.enabled
                    ? '0 8px 24px -4px var(--accent-glow)'
                    : '0 8px 24px -4px rgba(0,0,0,0.6)',
            }}
          >
            {toast.type === 'theme' ? (
              <Palette
                size={13}
                style={{ color: toast.isWhite ? 'var(--accent-color)' : toast.color }}
              />
            ) : (
              <Sparkles
                size={13}
                style={{ color: toast.enabled ? 'var(--accent-color)' : 'var(--text-muted)' }}
              />
            )}
            <span>{toast.text}</span>
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background:
                  toast.type === 'theme'
                    ? (toast.isWhite ? 'var(--accent-color)' : toast.color)
                    : toast.enabled
                      ? '#34d399'
                      : '#f43f5e',
                boxShadow:
                  toast.type === 'theme'
                    ? (toast.isWhite ? '0 0 8px var(--accent-glow)' : `0 0 8px ${toast.color}bb`)
                    : toast.enabled
                      ? '0 0 6px #34d399'
                      : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Bottom-Right System Info Button & Dialog Box */}
      <SystemInfoButton />

      {/* Main Auth Container — Mobile responsive, compact centered container */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[390px] my-auto">
        {/* Auth Glass Card */}
        <div
          className="rounded-[22px] sm:rounded-[28px] border p-4 sm:p-5 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300 w-full"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 25px 60px -15px var(--accent-glow)',
          }}
        >
          {/* Top Specular Line Highlight */}
          <div
            className="absolute top-0 inset-x-8 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            }}
          />

          {/* Header Branding */}
          <div className="flex flex-col items-center text-center mb-2.5 sm:mb-3">
            <div
              className="p-1.5 sm:p-2 rounded-xl border shadow-md mb-1.5 transition-transform hover:scale-105 duration-200"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
              }}
            >
              <OneDeskLogo size={28} className="sm:w-[30px] sm:h-[30px]" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              OneDesk
            </h2>
            <p className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Personal workspace &amp; productivity system
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign in / Create account) */}
          <div
            className="grid grid-cols-2 p-0.5 rounded-full border mb-3 sm:mb-3.5"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <Link
              to="/login"
              className={`py-1 sm:py-1.5 text-xs font-bold rounded-full text-center transition-all ${activeTab === 'login' ? 'shadow-md' : 'hover:text-[var(--text-primary)]'
                }`}
              style={{
                background: activeTab === 'login' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'login' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className={`py-1 sm:py-1.5 text-xs font-bold rounded-full text-center transition-all ${activeTab === 'signup' ? 'shadow-md' : 'hover:text-[var(--text-primary)]'
                }`}
              style={{
                background: activeTab === 'signup' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'signup' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              Create account
            </Link>
          </div>

          {/* Page-Specific Form Children */}
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, type = 'text', placeholder, value, onChange, required, label, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={14}
            className="pointer-events-none absolute left-3.5 transition-colors shrink-0"
            style={{ color: 'var(--text-muted)' }}
          />
        )}
        <input
          type={effectiveType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl sm:rounded-2xl border py-2 sm:py-2.5 text-[14px] sm:text-sm font-medium outline-none transition-all ${Icon ? 'pl-9' : 'pl-3.5'
            } ${isPassword ? 'pr-10' : 'pr-3.5'}`}
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-color)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-card)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 sm:right-2 p-1.5 sm:p-2 rounded-lg text-xs transition-colors hover:text-[var(--text-primary)] cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] active:scale-95"
            style={{ color: 'var(--text-muted)' }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function GoogleIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function GoogleAuthButton({ mode = 'login' }) {
  const label = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  return (
    <div className="mt-2 sm:mt-2.5">
      {/* Hairline Divider with Flanking Lines and Center Rounded Box */}
      <div className="flex items-center gap-2.5 my-3 sm:my-3.5">
        <div className="flex-1 border-t border-[var(--border-subtle)]" />
        <span
          className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md border shadow-sm select-none shrink-0"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
            color: 'var(--text-muted)',
          }}
        >
          or
        </span>
        <div className="flex-1 border-t border-[var(--border-subtle)]" />
      </div>

      {/* Colorful Faded Google Option */}
      <div
        className="w-full flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border select-none opacity-70 cursor-not-allowed transition-all"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
        title="Google login is coming soon"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <GoogleIcon size={16} className="shrink-0" />
          <span className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {label}
          </span>
        </div>

        <span
          className="text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-300 shrink-0 ml-2"
        >
          Coming soon
        </span>
      </div>
    </div>
  );
}

export function SystemInfoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { playChime } = useSettings();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleToggle() {
    setIsOpen((prev) => {
      const next = !prev;
      if (playChime) playChime('pop');
      return next;
    });
  }

  return (
    <div
      ref={containerRef}
      className="hidden sm:block fixed bottom-5 right-6 sm:bottom-6 sm:right-8 z-30 pointer-events-auto"
    >
      {/* Floating Info Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        title="System Information & Version Details"
        aria-label="System information"
        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-200 cursor-pointer ${isOpen ? 'scale-110 shadow-2xl' : 'hover:scale-105 active:scale-95'
          }`}
        style={{
          background: 'var(--bg-card-solid)',
          borderColor: isOpen ? 'var(--accent-color)' : 'var(--border-card)',
          color: isOpen ? 'var(--accent-color)' : 'var(--text-muted)',
          boxShadow: isOpen
            ? '0 0 16px var(--accent-glow), 0 10px 25px rgba(0,0,0,0.3)'
            : '0 8px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Info size={17} strokeWidth={2.2} />
      </button>

      {/* Info Dialog Box */}
      {isOpen && (
        <div
          className="absolute bottom-13 right-0 w-80 rounded-2xl border p-4 sm:p-5 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fade-in select-none"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 25px 60px -12px var(--accent-glow), 0 12px 30px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top Specular Line Highlight */}
          <div
            className="absolute top-0 inset-x-6 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg border flex items-center justify-center"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-color)',
                }}
              >
                <Info size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  System Information
                </h3>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  OneDesk Workspace OS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (playChime) playChime('pop');
              }}
              className="p-1 rounded-lg transition-colors cursor-pointer hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-muted)' }}
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Details List */}
          <div className="space-y-2">
            {/* Website Version */}
            <div
              className="flex items-center justify-between p-2 rounded-xl border text-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <GitBranch size={13} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[11px] font-medium">Version</span>
              </div>
              <span
                className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full border"
                style={{
                  background: 'var(--bg-card-solid)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                v2.4.0
              </span>
            </div>

            {/* Developer Name */}
            <div
              className="flex items-center justify-between p-2 rounded-xl border text-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Code2 size={13} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[11px] font-medium">Developer</span>
              </div>
              <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Rishabh Raj
              </span>
            </div>

            {/* Sync Status */}
            <div
              className="flex items-center justify-between p-2 rounded-xl border text-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Radio size={13} className="text-emerald-400" />
                <span className="text-[11px] font-medium">Sync Status</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Operational
                </span>
              </div>
            </div>

            {/* Last Updated On */}
            <div
              className="flex items-center justify-between p-2 rounded-xl border text-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={13} style={{ color: 'var(--accent-color)' }} />
                <span className="text-[11px] font-medium">Last Updated</span>
              </div>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                25 Sep 2026
              </span>
            </div>
          </div>

          {/* Footer Status Line */}
          <div
            className="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px]"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span>Cloud Sync Active</span>
            <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--accent-color)' }}>
              <CheckCircle2 size={11} /> Verified Build
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


