import { useNavigate } from 'react-router-dom';
import { StickyNote, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto pt-6 sm:pt-14 pb-28 sm:pb-20 px-4 select-none animate-fade-in">
      <div
        className="rounded-3xl border p-8 sm:p-12 text-center backdrop-blur-xl shadow-lg relative overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
        }}
      >
        {/* Simple Note Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shadow-sm"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <StickyNote size={28} />
          </div>
        </div>

        {/* Clean Status Tag */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold mb-4"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
          <span>Under Redesign</span>
        </div>

        {/* Heading */}
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-bold font-display tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Notes Redesign in Progress
        </h1>

        {/* Simple Description */}
        <p
          className="mt-3 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          We’re refreshing the Notes page with a cleaner look and smoother workflow. Coming alive soon!
        </p>

        {/* Data Safe & Synced Badge */}
        <div
          className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span className="text-[11px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
            All your existing notes and data remain completely safe and synced.
          </span>
        </div>

        {/* Simple Navigation Action */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => handleNavigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
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
