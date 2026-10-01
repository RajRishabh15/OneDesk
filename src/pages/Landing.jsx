import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckSquare,
  StickyNote,
  Calendar,
  Gamepad2,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  Clock,
  Layers,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import OneDeskLogo from '../components/OneDeskLogo';

export default function Landing() {
  const { user } = useAuth();
  const { playChime } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tasks');
  const [completedDemoTask, setCompletedDemoTask] = useState(false);

  function handleAction(path) {
    if (playChime) playChime('pop');
    navigate(path);
  }

  function handleTabClick(tabKey) {
    if (playChime) playChime('pop');
    setActiveTab(tabKey);
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] lg:h-screen lg:overflow-hidden flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] overflow-x-hidden">
      {/* ── Subtle Neutral Ambient Radial Background ──────────── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[360px] sm:w-[600px] lg:w-[750px] h-[220px] xs:h-[260px] sm:h-[400px] rounded-full blur-[80px] xs:blur-[90px] sm:blur-[130px] pointer-events-none opacity-25 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[240px] xs:w-[280px] sm:w-[400px] h-[180px] xs:h-[200px] sm:h-[300px] rounded-full blur-[70px] xs:blur-[80px] sm:blur-[120px] pointer-events-none opacity-15 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* ── Top Navigation Bar (No theme options) ─────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-2.5 sm:pt-4">
        <nav className="flex items-center justify-between px-2.5 xs:px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-2xl bg-zinc-950/70">
          {/* Brand Logo & Version Pill */}
          <Link
            to="/"
            onClick={() => playChime && playChime('pop')}
            className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-w-0"
          >
            <OneDeskLogo size={22} className="shrink-0 sm:w-7 sm:h-7" />
            <span className="font-display font-black text-sm sm:text-base tracking-tight text-white truncate">
              OneDesk
            </span>
            <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              v2.0
            </span>
          </Link>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => handleAction('/')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-indigo-600 hover:bg-indigo-500 text-white touch-manipulation min-h-[36px]"
              >
                <span>Workspace</span>
                <ArrowRight size={13} className="sm:w-3.5 sm:h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAction('/login')}
                  className="px-2.5 xs:px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation min-h-[36px]"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('/signup')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-3 xs:px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white touch-manipulation min-h-[36px]"
                >
                  <span>Get Started</span>
                  <ArrowRight size={12} className="hidden xs:inline-block sm:w-3.5 sm:h-3.5" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Main Hero & Interactive Showcase Deck ─────────────── */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 xs:py-6 lg:py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-6 space-y-3.5 xs:space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-bold shadow-xs backdrop-blur-md bg-white/[0.03] text-indigo-300">
              <Sparkles size={11} className="animate-spin text-amber-400 sm:w-3 sm:h-3 shrink-0" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide uppercase font-mono text-[9px] sm:text-[10px]">The Unified Life & Work OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-[26px] xs:text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black font-display tracking-tight leading-[1.16] sm:leading-[1.12] text-white">
              One place for everything you{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                think, plan & create.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xs xs:text-[13px] sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 text-zinc-400 px-1 xs:px-0">
              Stop context switching between fragmented apps. OneDesk merges priority tasks, fluid notes, synced timelines, and momentum tools into one frictionless desktop.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1 w-full max-w-xs sm:max-w-md mx-auto lg:mx-0">
              <button
                type="button"
                onClick={() => handleAction(user ? '/' : '/signup')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white min-h-[44px] touch-manipulation"
              >
                <span>{user ? 'Open Workspace' : 'Get Started Free'}</span>
                <ArrowRight size={14} className="sm:w-3.5 sm:h-3.5" />
              </button>

              {!user && (
                <button
                  type="button"
                  onClick={() => handleAction('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/10 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200 min-h-[44px] touch-manipulation"
                >
                  <span>Sign In</span>
                  <ChevronRight size={13} className="text-zinc-400 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-3.5 gap-y-2 sm:gap-6 text-[10px] sm:text-[11px] font-medium text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-amber-400 shrink-0" />
                <span>Offline-Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
                <span>Encrypted Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={12} className="text-indigo-400 shrink-0" />
                <span>Calm & Focused</span>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Interactive Live Preview Deck */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 p-3 xs:p-4 sm:p-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-300 bg-zinc-950/70">
              {/* Module Nav Pills inside the Card */}
              <div className="flex items-center justify-between gap-1 p-1 rounded-xl sm:rounded-2xl border border-white/5 mb-3 sm:mb-4 bg-white/[0.03]">
                {[
                  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                  { id: 'notes', label: 'Notes', icon: StickyNote },
                  { id: 'schedule', label: 'Schedule', icon: Calendar },
                  { id: 'funzone', label: 'Fun Zone', icon: Gamepad2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 px-1 xs:px-1.5 rounded-lg sm:rounded-xl text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all cursor-pointer touch-manipulation min-h-[36px] ${
                        active
                          ? 'shadow-md scale-[1.02] bg-zinc-900 border border-white/10 text-indigo-400'
                          : 'opacity-60 hover:opacity-100 hover:bg-white/5 text-zinc-400 border border-transparent'
                      }`}
                    >
                      <Icon size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Interactive Card Content */}
              <div className="min-h-[210px] sm:min-h-[240px] flex flex-col justify-between">
                {activeTab === 'tasks' && (
                  <div className="space-y-2 sm:space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] sm:text-xs font-bold text-zinc-200">Focus Sprint</span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md border text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                        {completedDemoTask ? '3/3 Completed' : '2/3 Completed'}
                      </span>
                    </div>

                    {/* Interactive Task 1 */}
                    <div
                      onClick={() => {
                        setCompletedDemoTask(!completedDemoTask);
                        if (playChime) playChime('pop');
                      }}
                      className="p-2.5 sm:p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer transition-all hover:border-indigo-500/50 active:scale-[0.99] touch-manipulation"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <div
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                            completedDemoTask ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {completedDemoTask && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span
                          className={`text-[11px] sm:text-xs font-semibold truncate transition-all text-zinc-200 ${
                            completedDemoTask ? 'line-through opacity-40' : ''
                          }`}
                        >
                          Ship OneDesk v2.0 Production Release
                        </span>
                      </div>
                      <span className="shrink-0 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        High
                      </span>
                    </div>

                    {/* Task 2 */}
                    <div className="p-2.5 sm:p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold truncate line-through opacity-40 text-zinc-200">
                          Refine Apple Liquid Glass Navigation Bar
                        </span>
                      </div>
                      <span className="shrink-0 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Medium
                      </span>
                    </div>

                    {/* Task 3 */}
                    <div className="p-2.5 sm:p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold truncate line-through opacity-40 text-zinc-200">
                          Configure Google & Firebase Email Auth
                        </span>
                      </div>
                      <span className="shrink-0 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Low
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-2.5 sm:space-y-3 animate-fade-in">
                    <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold text-indigo-400 truncate">Quarterly Product Vision</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 shrink-0">Saved 2m ago</span>
                      </div>
                      <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-300">
                        Build a workspace where focus is effortless. Unify task matrices, interactive notes, and calm schedules into a single window.
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">#strategy</span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30">#ideas</span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">#synced</span>
                      </div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400">
                      <span>⚡ Redesign 2.0 pipeline active</span>
                      <span className="text-emerald-400 font-bold">Coming Alive Soon</span>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold px-1 text-zinc-200">
                      <span>Today’s Agenda</span>
                      <span className="text-[9px] sm:text-[10px] text-indigo-400 font-mono">3 Events</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 sm:p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-2.5 sm:gap-3">
                        <Clock size={13} className="text-indigo-400 shrink-0 sm:w-3.5 sm:h-3.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] sm:text-xs font-bold truncate text-zinc-200">Architecture & Core Sync Review</p>
                          <p className="text-[9px] sm:text-[10px] text-zinc-400 truncate">10:00 AM – 11:30 AM · Workspace Room</p>
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2.5 sm:gap-3">
                        <Clock size={13} className="text-emerald-400 shrink-0 sm:w-3.5 sm:h-3.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] sm:text-xs font-bold truncate text-zinc-200">Design Polish & Color Palettes</p>
                          <p className="text-[9px] sm:text-[10px] text-zinc-400 truncate">02:00 PM – 03:00 PM · Studio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'funzone' && (
                  <div className="space-y-2 animate-fade-in text-center py-1 sm:py-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl mx-auto border border-pink-500/30 bg-pink-500/10 flex items-center justify-center shadow-lg text-pink-400">
                      <Gamepad2 size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-200">Focus & Micro-Break Arcade</h4>
                    <p className="text-[10px] sm:text-[11px] max-w-xs mx-auto text-zinc-400 leading-relaxed px-2">
                      Recharge your mental stamina between deep work sprints with integrated mini games, puzzles, and momentum trackers.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border border-pink-500/30 bg-pink-500/10 text-pink-300">
                      <Star size={9} className="fill-pink-400 sm:w-2.5 sm:h-2.5 shrink-0" />
                      <span>Earn Focus Points Daily</span>
                    </div>
                  </div>
                )}

                {/* Bottom preview dock footer */}
                <div className="pt-2 sm:pt-3 border-t border-white/5 mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-500">
                  <span className="truncate">Interactive Live Preview</span>
                  <Link
                    to={user ? '/' : '/signup'}
                    onClick={() => playChime && playChime('pop')}
                    className="font-bold flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline touch-manipulation shrink-0"
                  >
                    <span>Try in workspace</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 pt-1 sm:pt-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-full border border-white/10 text-[10px] sm:text-[11px] backdrop-blur-xl bg-zinc-950/70 text-zinc-400 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>© 2026 OneDesk</span>
            <span>·</span>
            <span>All-in-one productivity suite</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-4">
            <Link to="/login" className="hover:text-zinc-200 hover:underline transition-colors touch-manipulation py-0.5" onClick={() => playChime && playChime('pop')}>
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-zinc-200 hover:underline transition-colors touch-manipulation py-0.5" onClick={() => playChime && playChime('pop')}>
              Create Account
            </Link>
            <span className="hidden sm:inline">·</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

