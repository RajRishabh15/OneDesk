import { useNavigate } from 'react-router-dom';
import {
  StickyNote,
  Sparkles,
  Wrench,
  Palette,
  Layers,
  Zap,
  Clock,
  ArrowRight,
  Hammer,
  Cpu,
  FileCode2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
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

const UPCOMING_FEATURES = [
  {
    icon: FileCode2,
    title: 'Rich Block Editor',
    description: 'Full Markdown support with live code syntax highlighting, checklists, and dynamic tables.',
    tag: 'Editor 2.0',
    accent: '#6366f1',
  },
  {
    icon: Layers,
    title: 'Infinite Visual Canvas',
    description: 'Organize your thoughts into mindmaps, drag-and-drop sticky boards, and connected nodes.',
    tag: 'Spatial',
    accent: '#38bdf8',
  },
  {
    icon: Zap,
    title: 'Zero-Latency Sync',
    description: 'Offline-first database architecture ensuring instant load times and automatic conflict resolution.',
    tag: 'Speed',
    accent: '#34d399',
  },
  {
    icon: Cpu,
    title: 'AI Synthesis & Insights',
    description: 'Instant document summaries, smart tagging, and semantic knowledge retrieval across all your notes.',
    tag: 'Intelligence',
    accent: '#c084fc',
  },
];

export default function Notes() {
  const navigate = useNavigate();
  const { playChime } = useSettings();

  function handleNavigate(path) {
    if (playChime) playChime('pop');
    navigate(path);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-28 sm:pb-20 animate-fade-in select-none">
      {/* ── Main Maintenance Hero Card ────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-10 md:p-14 text-center backdrop-blur-2xl shadow-xl transition-all"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
        }}
      >
        {/* Ambient Gradient Glow Backdrop */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent-color) 0%, rgba(99,102,241,0) 70%)',
          }}
        />

        {/* Floating Construction / Redesign Icon Pod */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border flex items-center justify-center shadow-lg relative"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {/* Pulsing ring */}
            <div
              className="absolute inset-0 rounded-3xl animate-ping opacity-20"
              style={{ background: 'var(--accent-color)' }}
            />
            <StickyNote size={36} className="relative z-10" style={{ color: 'var(--accent-color)' }} />
          </div>

          {/* Badges on corner */}
          <div
            className="absolute -bottom-2 -right-2 p-2 rounded-xl border shadow-md flex items-center justify-center"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              color: '#f59e0b',
            }}
          >
            <Hammer size={16} />
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center justify-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase"
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Under Maintenance & Redesign</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight max-w-2xl mx-auto leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Notes is Evolving Into Something Extraordinary
        </h1>

        {/* Description */}
        <p
          className="mt-4 text-xs sm:text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          We are performing a complete architectural overhaul and aesthetic redesign of the Notes workspace to give you a fluid, lightning-fast, and deeply organized drafting sanctuary.
        </p>

        {/* Coming Alive Soon Banner */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border shadow-lg backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.18))',
              borderColor: 'var(--accent-color)',
            }}
          >
            <Sparkles size={18} className="animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
            <span
              className="text-sm sm:text-base font-extrabold tracking-wide uppercase font-display bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent"
            >
              Coming Alive Soon
            </span>
          </div>
          <span className="text-[11px] font-medium mt-2" style={{ color: 'var(--text-muted)' }}>
            Phase 3 Redesign Pipeline Active
          </span>
        </div>

        {/* Navigation Quick Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            style={{
              background: 'var(--accent-color)',
              borderColor: 'transparent',
              color: '#ffffff',
            }}
          >
            <span>Back to Dashboard</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/tasks')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <CheckCircle2 size={15} style={{ color: 'var(--accent-color)' }} />
            <span>Manage Tasks</span>
          </button>
        </div>
      </div>

      {/* ── Upcoming Features Teaser Grid ────────────────────── */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Palette size={16} style={{ color: 'var(--accent-color)' }} />
          <h2 className="text-sm sm:text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            What’s in the Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {UPCOMING_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 backdrop-blur-xl group hover:border-[var(--border-card)]"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: feat.accent,
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight border uppercase"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: feat.accent,
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
