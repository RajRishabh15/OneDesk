import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect - Glassmorphic, accessible, beautiful dropdown replacement for <select>.
 * 
 * @param {string} value - Current selected value
 * @param {function} onChange - Change handler receiving either (value) or ({ target: { value } })
 * @param {Array<string|{value: string, label: string, color?: string, icon?: React.ReactNode}>} options
 * @param {string} placeholder
 * @param {boolean} disabled
 * @param {string} className
 * @param {object} style
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
  style = {},
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Normalize options into { value, label, color, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      // Auto-assign colors for common known priorities & statuses
      let color;
      const lower = opt.toLowerCase();
      if (lower === 'high') color = '#f43f5e';
      else if (lower === 'medium') color = '#f59e0b';
      else if (lower === 'low') color = '#10b981';
      else if (lower === 'todo') color = '#38bdf8';
      else if (lower === 'in progress') color = '#f59e0b';
      else if (lower === 'completed') color = '#10b981';
      else if (lower === 'work') color = '#818cf8';
      else if (lower === 'meeting') color = '#a855f7';
      else if (lower === 'personal') color = '#fb7185';
      else if (lower === 'urgent') color = '#f43f5e';

      return { value: opt, label: opt, color };
    }
    return opt;
  });

  const selectedOpt = normalizedOptions.find((opt) => opt.value === value);

  function handleSelect(val) {
    if (disabled) return;
    if (typeof onChange === 'function') {
      // Support both function(val) and function(syntheticEvent)
      const syntheticEvent = { target: { value: val } };
      onChange(syntheticEvent);
    }
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={[
          'w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all select-none',
          'flex items-center justify-between gap-2 text-left cursor-pointer',
          'hover:border-white/20 active:scale-[0.99]',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          open ? 'ring-2 ring-[var(--accent-glow)] border-[var(--accent-color)]' : '',
        ].join(' ')}
        style={{
          background: 'var(--bg-surface)',
          borderColor: open ? 'var(--accent-color)' : 'var(--border-card)',
          color: 'var(--text-primary)',
          ...style,
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOpt?.color && (
            <span
              className="h-2 w-2 rounded-full shrink-0 shadow-sm"
              style={{ background: selectedOpt.color }}
            />
          )}
          {selectedOpt?.icon && <span className="shrink-0">{selectedOpt.icon}</span>}
          <span className="truncate">
            {selectedOpt ? selectedOpt.label : <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 opacity-60 ${open ? 'rotate-180 opacity-100 text-[var(--accent-color)]' : ''}`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl p-1.5 space-y-0.5 shadow-2xl border animate-fade-up max-h-60 overflow-y-auto custom-scrollbar"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={[
                  'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer',
                  isSelected
                    ? 'bg-white/10 text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06]',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.color && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: opt.color }}
                    />
                  )}
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>

                {isSelected && (
                  <Check size={14} className="shrink-0" style={{ color: 'var(--accent-color)' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
