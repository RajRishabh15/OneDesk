import { useState, useRef, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

/**
 * CustomTimePicker - Glassmorphic time picker replacing <input type="time">.
 * 
 * @param {string} value - Time string 'HH:mm' (24-hour) or 'All Day' or ''
 * @param {function} onChange - Handler receiving ({ target: { value: string } })
 * @param {string} placeholder - Default 'Select time'
 * @param {boolean} disabled
 * @param {string} className
 * @param {object} style
 * @param {string} align - 'left' | 'right'
 */
export default function CustomTimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  className = '',
  style = {},
  align = 'left',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside or Escape
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

  // Format 24h 'HH:mm' into friendly 12h display
  function formatDisplayTime(val) {
    if (!val) return '';
    if (val.toLowerCase() === 'all day') return 'All Day';

    const parts = val.split(':');
    if (parts.length < 2) return val;

    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (isNaN(h)) return val;

    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${m} ${ampm}`;
  }

  function handleSelectTime(time24) {
    if (disabled) return;
    if (typeof onChange === 'function') {
      onChange({ target: { value: time24 } });
    }
    setOpen(false);
  }

  function handleClear(e) {
    e.stopPropagation();
    if (disabled) return;
    if (typeof onChange === 'function') {
      onChange({ target: { value: '' } });
    }
  }

  // Parse current value into 12h parts for manual selector
  let currentHour12 = 9;
  let currentMinute = '00';
  let currentAmpm = 'AM';

  if (value && value !== 'All Day') {
    const parts = value.split(':');
    if (parts.length >= 2) {
      let h = parseInt(parts[0], 10);
      if (!isNaN(h)) {
        currentAmpm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        currentHour12 = h === 0 ? 12 : h;
        currentMinute = parts[1].slice(0, 2);
      }
    }
  }

  function updateManualTime(newH, newM, newAmpm) {
    let h24 = newH;
    if (newAmpm === 'PM' && h24 < 12) h24 += 12;
    if (newAmpm === 'AM' && h24 === 12) h24 = 0;

    const hStr = String(h24).padStart(2, '0');
    const mStr = String(newM).padStart(2, '0');
    handleSelectTime(`${hStr}:${mStr}`);
  }

  const PRESETS = [
    { label: 'Morning', time: '09:00' },
    { label: 'Noon', time: '12:00' },
    { label: 'Afternoon', time: '14:00' },
    { label: 'Evening', time: '17:00' },
    { label: 'Night', time: '20:00' },
  ];

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
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="truncate">
          {value ? (
            <span className="font-medium text-[var(--text-primary)]">{formatDisplayTime(value)}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
              title="Clear time"
            >
              <X size={12} />
            </span>
          )}
          <Clock
            size={14}
            className={`transition-colors ${open ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`}
          />
        </div>
      </button>

      {/* Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Time picker"
          className={[
            'absolute top-full mt-2 z-50 rounded-2xl p-3.5 shadow-2xl border animate-fade-up w-64',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
          }}
        >
          {/* Quick Presets */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Quick Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3.5">
            {PRESETS.map((p) => {
              const isSelected = value === p.time;
              return (
                <button
                  key={p.time}
                  type="button"
                  onClick={() => handleSelectTime(p.time)}
                  className={[
                    'px-2 py-1.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between',
                    isSelected
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  <span>{p.label}</span>
                  <span className="text-[10px] font-mono opacity-70">{p.time}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper / Direct Select */}
          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Custom Time
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {/* Hour Select */}
              <select
                value={currentHour12}
                onChange={(e) => updateManualTime(parseInt(e.target.value, 10), currentMinute, currentAmpm)}
                className="bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none text-[var(--text-primary)] cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h} className="bg-[#120e24] text-white">
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>

              <span className="text-sm font-bold text-[var(--text-muted)]">:</span>

              {/* Minute Select */}
              <select
                value={currentMinute}
                onChange={(e) => updateManualTime(currentHour12, e.target.value, currentAmpm)}
                className="bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none text-[var(--text-primary)] cursor-pointer"
              >
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                  <option key={m} value={m} className="bg-[#120e24] text-white">
                    {m}
                  </option>
                ))}
              </select>

              {/* AM/PM Toggle */}
              <div className="flex rounded-xl border border-[var(--border-card)] bg-[var(--bg-surface)] p-0.5 ml-1">
                {['AM', 'PM'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateManualTime(currentHour12, currentMinute, mode)}
                    className={[
                      'px-2 py-1 rounded-lg text-[10px] font-bold transition-all',
                      currentAmpm === mode
                        ? 'bg-[var(--accent-color)] text-white shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-white',
                    ].join(' ')}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
