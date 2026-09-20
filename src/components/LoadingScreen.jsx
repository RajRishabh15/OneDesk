import OneDeskLogo from './OneDeskLogo';

export default function LoadingScreen({ message = 'Loading workspace…' }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(30, 27, 75, 0.6) 0%, #090715 100%)',
      }}
    >
      {/* Ambient Pulsing Aura */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(99,102,241,0.3) 50%, transparent 70%)',
          }}
        />

        {/* Outer Rotating Glowing Dash Ring */}
        <div className="absolute -inset-3.5 rounded-full border border-indigo-500/20 animate-spin" style={{ animationDuration: '6s' }} />

        {/* OneDesk Logo */}
        <div className="relative shadow-[0_0_30px_rgba(99,102,241,0.5)] rounded-[14px]">
          <OneDeskLogo size={52} />
        </div>
      </div>

      {/* Website Title */}
      <div className="mt-6 text-center">
        <h1
          className="text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent"
          style={{ textShadow: '0 2px 20px rgba(99,102,241,0.4)' }}
        >
          OneDesk
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300/60 mt-1">
          Personal Workspace
        </p>
      </div>

      {/* Modern Capsule Shimmer Progress Bar */}
      <div className="mt-6 w-36 h-1 rounded-full bg-white/10 overflow-hidden relative">
        <div
          className="absolute inset-y-0 w-1/2 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)',
            animation: 'shimmerSlide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>

      {message && (
        <p className="mt-3 text-xs text-stone-400 font-mono tracking-wide opacity-80">
          {message}
        </p>
      )}

      <style>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
