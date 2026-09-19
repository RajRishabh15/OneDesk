export default function Toggle({ on = false, onToggle, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label || 'Toggle switch'}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.(e);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-start rounded-full p-0.5 transition-all duration-200 ease-in-out focus:outline-none select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'
      }`}
      style={{
        boxSizing: 'border-box',
        background: on ? 'var(--accent-gradient)' : 'rgba(125, 130, 145, 0.22)',
        border: on ? '1px solid transparent' : '1px solid var(--border-card)',
        boxShadow: on
          ? '0 2px 12px var(--accent-glow)'
          : 'inset 0 1px 2px rgba(0,0,0,0.18)',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white transition-all duration-200 ease-out"
        style={{
          transform: on ? 'translateX(20px)' : 'translateX(0px)',
          boxShadow: on
            ? '0 2px 6px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0,0,0,0.2)'
            : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}
