import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, wide = false }) {
  const panelRef = useRef(null);

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
        ].join(' ')}
        style={{
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-card)',
          boxShadow: '0 32px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        {/* Thin accent line at the top */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] rounded-t-[32px] pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--border-card) 40%, rgba(255,255,255,0.18) 50%, var(--border-card) 60%, transparent)',
          }}
        />

        {/* Mobile grab handle bar */}
        <div className="w-10 h-1 rounded-full bg-stone-400/40 dark:bg-stone-600/40 mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Header - Fixed & pinned, never scrolls away */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0 z-10"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-card-solid)',
          }}
        >
          <h2
            className="text-base font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body - Clean scrollable content with sleek custom scrollbar */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto overscroll-contain flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
