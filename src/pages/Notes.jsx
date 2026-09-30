import { useNavigate } from 'react-router-dom';
import { StickyNote, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function LabeledInput({ label, value, onChange, placeholder = '', type = 'text', required = false, ...rest }) {
  return (
    <div>
      {label && (
        <label
          className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-card)',
          color: 'var(--text-primary)',
        }}
        {...rest}
      />
    </div>
  );
}

export default function Notes() {
  const navigate = useNavigate();
  const { playChime } = useSettings();

  function handleNavigate(path) {
    if (playChime) playChime('pop');
    navigate(path);
  }

  return (
    <div className="max-w-2xl mx-auto pt-4 sm:pt-14 pb-28 sm:pb-20 px-3.5 sm:px-4 select-none animate-fade-in">
      {/* ── Main Box with Continuous Progressive Moving Green Light Border ── */}
      <div
        className="relative rounded-2xl sm:rounded-3xl border p-6 sm:p-10 md:p-12 text-center backdrop-blur-2xl shadow-xl transition-all overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
        }}
      >
        {/* SVG Perimeter Moving Green Light Beam */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible rounded-2xl sm:rounded-3xl z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="movingGreenBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.95" />
            </linearGradient>
            <filter id="greenLightGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="24"
            ry="24"
            fill="none"
            stroke="url(#movingGreenBeam)"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="100"
            className="animate-border-beam"
            filter="url(#greenLightGlow)"
          />
        </svg>
          {/* Simple Note Icon */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-sm"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-color)',
              }}
            >
              <StickyNote size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>

          {/* Clean Status Tag */}
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-semibold mb-3 sm:mb-4"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
            <span>Under Redesign</span>
          </div>

          {/* Heading */}
          <h1
            className="text-lg sm:text-2xl md:text-3xl font-bold font-display tracking-tight leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            Notes Redesign in Progress
          </h1>

          {/* Simple Description */}
          <p
            className="mt-2 sm:mt-3 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            We’re refreshing the Notes page with a cleaner look and smoother workflow.
          </p>

          {/* Round Bubble for Coming Back Very Soon */}
          <div className="mt-4 sm:mt-5 flex justify-center">
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 max-w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(52, 211, 153, 0.08))',
                borderColor: 'rgba(52, 211, 153, 0.4)',
                boxShadow: '0 0 18px rgba(52, 211, 153, 0.2)',
              }}
            >
              <Sparkles size={13} className="text-emerald-400 animate-pulse shrink-0 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm font-bold tracking-wide text-emerald-300 font-display truncate">
                Coming back very soon ✨
              </span>
            </div>
          </div>

          {/* Data Safe & Synced Badge */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <div
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs max-w-md text-left"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                All your existing notes and data remain completely safe and synced.
              </span>
            </div>
          </div>

          {/* Simple Navigation Action */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: 'var(--accent-color)',
                borderColor: 'transparent',
                color: '#ffffff',
              }}
            >
              <span>Back to Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
    </div>
  );
}
