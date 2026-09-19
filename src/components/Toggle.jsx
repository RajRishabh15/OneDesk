export default function Toggle({ on = false, onToggle, label, icon: Icon, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label || 'Toggle switch'}
      disabled={disabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-[2px] transition-all duration-200 focus:outline-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        boxSizing: 'border-box',
        background: on
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : 'var(--bg-surface)',
        border: `1px solid ${on ? 'rgba(99, 102, 241, 0.5)' : 'var(--border-card)'}`,
        boxShadow: on ? '0 0 14px rgba(99, 102, 241, 0.45)' : 'none',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block h-[18px] w-[18px] rounded-full transition-transform duration-200 ease-out"
        style={{
          transform: on ? 'translateX(20px)' : 'translateX(0px)',
          background: on ? '#ffffff' : 'var(--text-muted)',
          boxShadow: on ? '0 2px 6px rgba(0, 0, 0, 0.35)' : 'none',
        }}
      />
    </button>
  );
}
