import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Modal({ open, onClose, title, children, wide = false }) {
  const panelRef = useRef(null);
  const { theme } = useTheme();
  const isNotebook = theme === 'notebook-light' || theme === 'notebook-dark';

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      // Lock page body scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
      {/* Fullscreen Backdrop — mounted directly to document.body so it covers 100% of the entire viewport */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[
          'relative w-full outline-none flex flex-col',
          'rounded-t-[32px] sm:rounded-[32px]',
          'max-h-[92vh] sm:max-h-[88vh]',
          'overflow-hidden',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md',
          'animate-modal-up shadow-2xl',
          isNotebook ? 'nb-modal-panel nb-brass-corner' : '',
        ].filter(Boolean).join(' ')}
        style={isNotebook ? {} : {
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-card)',
          boxShadow: '0 32px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        {/* Notebook decorative accents */}
        {isNotebook && <div className="nb-ribbon-bookmark" />}

        {/* Thin accent line at the top */}
        {!isNotebook && (
          <div
            className="absolute inset-x-0 top-0 h-[1px] rounded-t-[32px] pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--border-card) 40%, rgba(255,255,255,0.18) 50%, var(--border-card) 60%, transparent)',
            }}
          />
        )}

        {/* Mobile grab handle bar */}
        <div className="w-10 h-1 rounded-full bg-stone-400/40 dark:bg-stone-600/40 mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Wire Ring Binder Coils Header on Notebook Mode */}
        {isNotebook && (
          <div className="nb-wire-binder pt-2 px-6 pb-0">
            <div className="nb-wire-ring" />
            <div className="nb-wire-ring" />
            <div className="nb-wire-ring" />
            <div className="nb-wire-ring" />
            <div className="nb-wire-ring" />
            <div className="nb-wire-ring" />
          </div>
        )}

        {/* Header - Fixed & pinned, never scrolls away */}
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0 z-10 ${
            isNotebook ? 'nb-modal-header' : ''
          }`}
          style={{
            borderBottom: isNotebook ? '2px solid var(--nb-rule-color)' : '1px solid var(--border-subtle)',
            background: isNotebook ? undefined : 'var(--bg-card-solid)',
          }}
        >
          <h2
            className={`font-bold tracking-tight ${
              isNotebook
                ? 'nb-hand text-lg sm:text-xl text-[var(--accent-color)] flex items-center gap-1.5'
                : 'text-base text-[var(--text-primary)]'
            }`}
          >
            {isNotebook && <span>✎</span>}
            <span>{title}</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
              isNotebook
                ? 'hover:brightness-125 border border-[var(--nb-rule-color)]'
                : 'hover:bg-white/10'
            }`}
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body - Clean scrollable content with notebook ruled paper styling */}
        <div
          className={`px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto overscroll-contain flex-1 custom-scrollbar ${
            isNotebook ? 'nb-ruled nb-margin' : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
