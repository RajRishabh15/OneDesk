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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import GhostFibers from '../components/GhostFibers';
import OneDeskLogo from '../components/OneDeskLogo';

export const THEME_FIBER_COLORS = {
  dark:   { glowLine: '#140E35', glowColor: '#3437A0' },
  light:  { glowLine: '#c7d2fe', glowColor: '#818cf8' },
  aurora: { glowLine: '#042a18', glowColor: '#059669' },
  rose:   { glowLine: '#3b0a1e', glowColor: '#e11d48' },
  ocean:  { glowLine: '#042040', glowColor: '#0284c7' },
  amber:  { glowLine: '#3a1c00', glowColor: '#d97706' },
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
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
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
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-xs font-medium animate-fade-in flex items-start gap-2"
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
          className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl text-white py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold transition-all shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
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
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-8 overflow-x-hidden transition-colors duration-500"
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl text-xs font-semibold"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor:
                toast.type === 'theme'
                  ? (toast.isWhite ? 'rgba(255,255,255,0.4)' : toast.color)
                  : toast.enabled
                  ? 'var(--accent-color)'
                  : 'var(--border-card)',
              color: 'var(--text-primary)',
              boxShadow:
                toast.type === 'theme'
                  ? (toast.isWhite ? '0 8px 24px -4px rgba(255,255,255,0.2)' : `0 8px 24px -4px ${toast.color}66`)
                  : toast.enabled
                  ? '0 8px 24px -4px var(--accent-glow)'
                  : '0 8px 24px -4px rgba(0,0,0,0.6)',
            }}
          >
            {toast.type === 'theme' ? (
              <Palette
                size={13}
                style={{ color: toast.isWhite ? '#ffffff' : toast.color }}
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
                    ? toast.color
                    : toast.enabled
                    ? '#34d399'
                    : '#f43f5e',
                border: toast.type === 'theme' && toast.isWhite ? '1px solid rgba(0,0,0,0.25)' : 'none',
                boxShadow:
                  toast.type === 'theme'
                    ? (toast.isWhite ? '0 0 6px rgba(255,255,255,0.8)' : `0 0 8px ${toast.color}bb`)
                    : toast.enabled
                    ? '0 0 6px #34d399'
                    : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Main Auth Container — Dynamic Safe Spacing for All Phone Heights */}
      <div className="relative z-10 w-full max-w-[420px] my-auto pt-14 sm:pt-20 pb-16 sm:pb-8">
        {/* Auth Glass Card */}
        <div
          className="rounded-[24px] sm:rounded-[32px] border p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300 w-full"
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
          <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
            <div
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border shadow-md mb-2 sm:mb-3 transition-transform hover:scale-105 duration-200"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
              }}
            >
              <OneDeskLogo size={34} className="sm:w-[38px] sm:h-[38px]" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              OneDesk
            </h2>
            <p className="text-[11px] sm:text-xs mt-0.5 sm:mt-1" style={{ color: 'var(--text-muted)' }}>
              Personal workspace &amp; productivity operating system
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign in / Create account) */}
          <div
            className="grid grid-cols-2 p-1 rounded-full border mb-5 sm:mb-6"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-card)',
            }}
          >
            <Link
              to="/login"
              className={`py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full text-center transition-all ${
                activeTab === 'login' ? 'shadow-md' : 'hover:text-[var(--text-primary)]'
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
              className={`py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full text-center transition-all ${
                activeTab === 'signup' ? 'shadow-md' : 'hover:text-[var(--text-primary)]'
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
    <div className="space-y-1 sm:space-y-1.5">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={15}
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
          className={`w-full rounded-xl sm:rounded-2xl border py-2.5 sm:py-3 text-sm font-medium outline-none transition-all ${
            Icon ? 'pl-10' : 'pl-3.5 sm:pl-4'
          } ${isPassword ? 'pr-11' : 'pr-3.5 sm:pr-4'}`}
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
            className="absolute right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg text-xs transition-colors hover:text-[var(--text-primary)] cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
