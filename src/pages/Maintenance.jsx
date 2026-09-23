import { useState, useEffect } from 'react';
import {
  Wrench,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Cpu,
  Database,
  CheckCircle2,
  Clock,
  X,
  Radio,
} from 'lucide-react';
import OneDeskLogo from '../components/OneDeskLogo';
import GhostFibers from '../components/GhostFibers';

export default function Maintenance() {
  const [checking, setChecking] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setShowDialog(false);
    }
    if (showDialog) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDialog]);

  function handleCheckStatus() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setShowDialog(true);
    }, 450);
  }

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 sm:px-6 py-8 overflow-x-hidden selection:bg-indigo-500/30"
      style={{
        background: 'var(--bg-page, #090715)',
        color: 'var(--text-primary, #f5f3ff)',
      }}
    >
      {/* Background Animated Fibers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden fiber-canvas opacity-70">
        <GhostFibers
          lineColor="#140E35"
          glowColor="#4f46e5"
          speed={0.15}
          scale={2.2}
          rotation={0}
          rotationSpeed={0.15}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.12}
          twist={0.1}
          twistSpeed={1.0}
        />
      </div>

      {/* Top Center OneDesk Brand Pill */}
      <div className="fixed top-4 inset-x-0 mx-auto w-fit z-20 pointer-events-auto">
        <div
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-xl backdrop-blur-xl transition-all"
          style={{
            background: 'var(--bg-card-solid, rgba(13,10,27,0.85))',
            borderColor: 'var(--border-card, rgba(255,255,255,0.12))',
          }}
        >
          <OneDeskLogo size={18} />
          <span className="text-xs font-bold tracking-tight">OneDesk</span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
            }}
          >
            Maintenance Mode
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[460px] my-auto pt-16 pb-8">
        <div
          className="rounded-[28px] sm:rounded-[36px] border p-6 sm:p-9 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all text-center"
          style={{
            background: 'var(--bg-card-solid, #0d0a1b)',
            borderColor: 'var(--border-card, rgba(255,255,255,0.12))',
            boxShadow: '0 25px 60px -15px rgba(99,102,241,0.25)',
          }}
        >
          {/* Top Specular Line Highlight */}
          <div
            className="absolute top-0 inset-x-8 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />

          {/* Icon Badge */}
          <div className="flex justify-center mb-5">
            <div
              className="relative w-16 h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center border shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(99,102,241,0.18))',
                borderColor: 'rgba(245,158,11,0.3)',
                boxShadow: '0 12px 30px -8px rgba(245,158,11,0.3)',
              }}
            >
              <Wrench size={28} className="text-amber-400 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-[#0d0a1b] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold mb-3"
            style={{
              background: 'rgba(245,158,11,0.08)',
              borderColor: 'rgba(245,158,11,0.25)',
              color: '#fbbf24',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Scheduled Maintenance in Progress</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            We'll be right back.
          </h1>
          <p
            className="text-xs sm:text-sm leading-relaxed mb-6"
            style={{ color: 'var(--text-muted, rgba(245,243,255,0.6))' }}
          >
            OneDesk is temporarily offline while we perform planned system upgrades and speed enhancements. All your workspaces, notes, and tasks remain fully safe and encrypted.
          </p>

          {/* Live Component Status Grid */}
          <div
            className="rounded-2xl border p-3.5 mb-6 text-left space-y-2.5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'var(--border-subtle, rgba(255,255,255,0.08))',
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-wider px-1 flex items-center justify-between"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>System Upgrade Status</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Radio size={11} className="animate-pulse" /> Live
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg">
              <div className="flex items-center gap-2">
                <Database size={14} style={{ color: 'var(--accent-color, #818cf8)' }} />
                <span className="font-medium">Cloud Database Sync</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Upgrading
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu size={14} style={{ color: 'var(--accent-color, #818cf8)' }} />
                <span className="font-medium">Core Workspace Engine</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Optimizing
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg border-t border-[rgba(255,255,255,0.05)] pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="font-medium">Data Integrity & Security</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 size={12} />
                Secured
              </span>
            </div>
          </div>

          {/* Action Button: Check Status */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl text-white py-3 text-xs sm:text-sm font-bold transition-all shadow-md hover:brightness-110 active:scale-[0.98] cursor-pointer"
            style={{
              background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
              boxShadow: '0 6px 20px var(--accent-glow, rgba(99,102,241,0.4))',
            }}
          >
            <RefreshCw size={15} className={checking ? 'animate-spin' : ''} />
            <span>{checking ? 'Checking system status…' : 'Check if site is back'}</span>
          </button>

          {/* Maintenance Downtime Timer */}
          <div
            className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <Clock size={13} className="text-amber-400 shrink-0" />
            <span>
              Expected back: <strong className="text-white font-semibold">10:00 AM tomorrow</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-[10px] mt-6 tracking-widest uppercase"
          style={{ color: 'var(--text-muted, rgba(245,243,255,0.4))', opacity: 0.6 }}
        >
          OneDesk Cloud OS · Maintenance Protocol
        </p>
      </div>

      {/* Pop-up Dialog Box: "Not yet stay tuned" */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-sm rounded-[24px] sm:rounded-[30px] border p-6 shadow-2xl text-center transform transition-all"
            style={{
              background: 'var(--bg-card-solid, #0d0a1b)',
              borderColor: 'var(--border-card, rgba(255,255,255,0.14))',
              boxShadow: '0 25px 60px -10px var(--accent-glow, rgba(99,102,241,0.35))',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full border transition-all text-neutral-400 hover:text-white cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle, rgba(255,255,255,0.08))',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <X size={15} />
            </button>

            {/* Glowing Icon */}
            <div
              className="w-13 h-13 mx-auto mb-3.5 rounded-2xl border flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(99,102,241,0.18))',
                borderColor: 'rgba(245,158,11,0.3)',
                color: '#fbbf24',
                boxShadow: '0 8px 24px -4px rgba(245,158,11,0.25)',
              }}
            >
              <Sparkles size={22} className="animate-pulse" />
            </div>

            {/* Dialog Message */}
            <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white">
              Not yet, stay tuned!
            </h3>
            <p
              className="text-xs sm:text-sm leading-relaxed mb-5"
              style={{ color: 'var(--text-muted, rgba(245,243,255,0.7))' }}
            >
              Our engineers are actively rolling out improvements and database optimizations. We're on schedule to be back online by{' '}
              <strong className="text-white font-semibold">10:00 AM tomorrow</strong>.
            </p>

            {/* Confirmation Button */}
            <button
              type="button"
              onClick={() => setShowDialog(false)}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-[0.98] cursor-pointer"
              style={{
                background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
                boxShadow: '0 4px 16px var(--accent-glow, rgba(99,102,241,0.4))',
              }}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
