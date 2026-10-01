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
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between select-none bg-[#09090b] text-[#f4f4f5]">
      {/* ── Subtle Neutral Ambient Radial Background ──────────── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] rounded-full blur-[130px] pointer-events-none opacity-25 -z-1"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-15 -z-1"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* ── Top Navigation Bar (No theme options) ─────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-2xl bg-zinc-950/70">
          {/* Brand Logo & Version Pill */}
          <Link
            to="/"
            onClick={() => playChime && playChime('pop')}
            className="flex items-center gap-2 sm:gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <OneDeskLogo size={24} className="shrink-0 sm:w-7 sm:h-7" />
            <span className="font-display font-black text-sm sm:text-base tracking-tight text-white">
              OneDesk
            </span>
            <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              v2.0
            </span>
          </Link>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => handleAction('/')}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <span>Go to Workspace</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAction('/login')}
                  className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('/signup')}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white"
                >
                  <span>Get Started</span>
                  <ArrowRight size={13} />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Main Hero & Interactive Showcase Deck ─────────────── */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] font-bold shadow-xs backdrop-blur-md bg-white/[0.03] text-indigo-300">
              <Sparkles size={12} className="animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide uppercase font-mono text-[10px]">The Unified Life & Work OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black font-display tracking-tight leading-[1.12] text-white">
              One place for everything you{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                think, plan & create.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 text-zinc-400">
              Stop context switching between fragmented apps. OneDesk merges priority tasks, fluid notes, synced timelines, and momentum tools into one frictionless desktop.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => handleAction(user ? '/' : '/signup')}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white"
              >
                <span>{user ? 'Open Workspace' : 'Get Started Free'}</span>
                <ArrowRight size={15} />
              </button>

              {!user && (
                <button
                  type="button"
                  onClick={() => handleAction('/login')}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/10 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200"
                >
                  <span>Sign In</span>
                  <ChevronRight size={14} className="text-zinc-400" />
                </button>
              )}
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[11px] font-medium text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400 shrink-0" />
                <span>Instant Offline-First</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>Encrypted Cloud Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-indigo-400 shrink-0" />
                <span>Clean Focused Design</span>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Interactive Live Preview Deck */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <div className="rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-300 bg-zinc-950/70">
              {/* Module Nav Pills inside the Card */}
              <div className="flex items-center justify-between gap-1 p-1 rounded-2xl border border-white/5 mb-3.5 sm:mb-4 bg-white/[0.03]">
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
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'shadow-md scale-[1.02] bg-zinc-900 border border-white/10 text-indigo-400'
                          : 'opacity-60 hover:opacity-100 hover:bg-white/5 text-zinc-400 border border-transparent'
                      }`}
                    >
                      <Icon size={13} />
                      <span className="hidden xs:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Interactive Card Content */}
              <div className="min-h-[220px] sm:min-h-[240px] flex flex-col justify-between">
                {activeTab === 'tasks' && (
                  <div className="space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-zinc-200">Focus Sprint</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                        {completedDemoTask ? '3/3 Completed' : '2/3 Completed'}
                      </span>
                    </div>

                    {/* Interactive Task 1 */}
                    <div
                      onClick={() => {
                        setCompletedDemoTask(!completedDemoTask);
                        if (playChime) playChime('pop');
                      }}
                      className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-indigo-500/50 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            completedDemoTask ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {completedDemoTask && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span
                          className={`text-xs font-semibold truncate transition-all text-zinc-200 ${
                            completedDemoTask ? 'line-through opacity-40' : ''
                          }`}
                        >
                          Ship OneDesk v2.0 Production Release
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        High
                      </span>
                    </div>

                    {/* Task 2 */}
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-4 h-4 rounded-md border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-semibold truncate line-through opacity-40 text-zinc-200">
                          Refine Apple Liquid Glass Navigation Bar
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Medium
                      </span>
                    </div>

                    {/* Task 3 */}
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-4 h-4 rounded-md border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-semibold truncate line-through opacity-40 text-zinc-200">
                          Configure Google & Firebase Email Auth
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Low
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Quarterly Product Vision</span>
                        <span className="text-[10px] font-mono text-zinc-500">Saved 2m ago</span>
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        Build a workspace where focus is effortless. Unify task matrices, interactive notes, and calm schedules into a single window.
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">#strategy</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30">#ideas</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">#synced</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-[11px] text-zinc-400">
                      <span>⚡ Redesign 2.0 pipeline active</span>
                      <span className="text-emerald-400 font-bold">Coming Alive Soon</span>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold px-1 text-zinc-200">
                      <span>Today’s Agenda</span>
                      <span className="text-[10px] text-indigo-400 font-mono">3 Events</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3">
                        <Clock size={14} className="text-indigo-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-zinc-200">Architecture & Core Sync Review</p>
                          <p className="text-[10px] text-zinc-400">10:00 AM – 11:30 AM · Workspace Room</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                        <Clock size={14} className="text-emerald-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-zinc-200">Design Polish & Color Palettes</p>
                          <p className="text-[10px] text-zinc-400">02:00 PM – 03:00 PM · Studio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'funzone' && (
                  <div className="space-y-2.5 animate-fade-in text-center py-2">
                    <div className="w-12 h-12 rounded-2xl mx-auto border border-pink-500/30 bg-pink-500/10 flex items-center justify-center shadow-lg text-pink-400">
                      <Gamepad2 size={24} />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-200">Focus & Micro-Break Arcade</h4>
                    <p className="text-[11px] max-w-xs mx-auto text-zinc-400 leading-relaxed">
                      Recharge your mental stamina between deep work sprints with integrated mini games, puzzles, and momentum trackers.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border border-pink-500/30 bg-pink-500/10 text-pink-300">
                      <Star size={10} className="fill-pink-400" />
                      <span>Earn Focus Points Daily</span>
                    </div>
                  </div>
                )}

                {/* Bottom preview dock footer */}
                <div className="pt-3 border-t border-white/5 mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Interactive Live Preview</span>
                  <Link
                    to={user ? '/' : '/signup'}
                    onClick={() => playChime && playChime('pop')}
                    className="font-bold flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    <span>Try it in your workspace</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2 sm:py-2.5 rounded-full border border-white/10 text-[11px] backdrop-blur-xl bg-zinc-950/70 text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© 2026 OneDesk</span>
            <span>·</span>
            <span>All-in-one productivity suite</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-zinc-200 hover:underline" onClick={() => playChime && playChime('pop')}>
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-zinc-200 hover:underline" onClick={() => playChime && playChime('pop')}>
              Create Account
            </Link>
            <span className="hidden sm:inline">·</span>
            <span className="text-emerald-400 font-medium">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
