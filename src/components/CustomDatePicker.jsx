import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * CustomDatePicker - Glassmorphic, dark-mode-native date picker replacing <input type="date">.
 * 
 * @param {string} value - Date string formatted as 'YYYY-MM-DD'
 * @param {function} onChange - Handler receiving ({ target: { value: 'YYYY-MM-DD' } })
 * @param {string} placeholder - Default 'Pick a date'
 * @param {boolean} disabled
 * @param {boolean} required
 * @param {string} className
 * @param {object} style
 * @param {string} align - 'left' | 'right' dropdown alignment
 */
export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  required = false,
  className = '',
  style = {},
  align = 'left',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial selected date or default to today's view
  const parsedDate = value ? new Date(value + 'T00:00:00') : null;
  const today = new Date();

  const [viewDate, setViewDate] = useState(() => {
    return parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
  });

  // Sync view when value changes from outside
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) setViewDate(d);
    }
  }, [value]);

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

  // Helpers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  function formatDisplayDate(val) {
    if (!val) return '';
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime())) return val;

    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const formatted = d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return isToday ? `Today (${formatted})` : formatted;
  }

  function handleSelectDate(d) {
    if (disabled) return;
    const yearStr = d.getFullYear();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    const isoString = `${yearStr}-${monthStr}-${dayStr}`;

    if (typeof onChange === 'function') {
      onChange({ target: { value: isoString } });
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

  function handleQuickSelect(offsetDays) {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    handleSelectDate(target);
  }

  // Month navigation
  function prevMonth(e) {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth(e) {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  }

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month overflow days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    calendarDays.push({ date: d, isCurrentMonth: true });
  }

  // Next month overflow days (fill 35 or 42 grid)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  const selectedIso = value ? value : '';

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
            <span className="font-medium text-[var(--text-primary)]">{formatDisplayDate(value)}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !required && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
              title="Clear date"
            >
              <X size={12} />
            </span>
          )}
          <CalendarIcon
            size={14}
            className={`transition-colors ${open ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`}
          />
        </div>
      </button>

      {/* Floating Calendar Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Calendar picker"
          className={[
            'absolute top-full mt-2 z-50 rounded-2xl p-3.5 shadow-2xl border animate-fade-up w-72 sm:w-80',
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
          <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => handleQuickSelect(0)}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-white/10 hover:text-white transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(1)}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-white/10 hover:text-white transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(7)}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-white/10 hover:text-white transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              +1 Week
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={prevMonth}
              className="h-7 w-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="text-xs font-bold tracking-tight text-[var(--text-primary)]">
              {monthNames[month]} {year}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="h-7 w-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
              <span key={w} className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider">
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map(({ date: d, isCurrentMonth }, idx) => {
              const yStr = d.getFullYear();
              const mStr = String(d.getMonth() + 1).padStart(2, '0');
              const dStr = String(d.getDate()).padStart(2, '0');
              const currentIso = `${yStr}-${mStr}-${dStr}`;

              const isSelected = selectedIso === currentIso;
              const isToday =
                d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(d)}
                  className={[
                    'h-7 w-7 sm:h-8 sm:w-8 mx-auto rounded-xl flex items-center justify-center text-xs font-semibold transition-all cursor-pointer select-none active:scale-90',
                    isSelected
                      ? 'bg-[var(--accent-color)] text-white shadow-md font-bold scale-105'
                      : isToday
                      ? 'border border-[var(--accent-color)] text-[var(--text-primary)] hover:bg-white/10'
                      : isCurrentMonth
                      ? 'text-[var(--text-primary)] hover:bg-white/[0.08]'
                      : 'text-[var(--text-muted)] opacity-30 hover:opacity-60',
                  ].join(' ')}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border-subtle)] text-[11px]">
            {value && !required ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-[var(--text-muted)] hover:text-rose-400 transition-colors font-medium cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => handleQuickSelect(0)}
              className="text-[var(--accent-color)] hover:underline font-bold cursor-pointer"
            >
              Select Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
