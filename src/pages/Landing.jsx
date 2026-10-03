import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckSquare,
  StickyNote,
  FileText,
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
  BookOpen,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import OneDeskLogo from '../components/OneDeskLogo';

function NotebookWatermark({ subtitle = 'your life, organized on paper ✦' }) {
  return (
    <div className="pt-4 xs:pt-6 sm:pt-8 pb-2 xs:pb-3 flex flex-col items-center justify-center select-none pointer-events-none">
      <div className="relative inline-block rotate-[-2.5deg] text-center">
        <span className="font-handwriting text-4xl xs:text-5xl sm:text-6xl font-bold tracking-wider text-[#78716c]/40 hover:text-[#78716c]/60 transition-colors">
          onedesk
        </span>
        <svg
          viewBox="0 0 140 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-28 xs:w-32 sm:w-40 h-3 mx-auto mt-0.5 stroke-[#78716c]/35"
        >
          <path
            d="M2 9C24 3 50 12 76 6C100 2 122 10 138 5"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-handwriting text-[11px] xs:text-xs sm:text-sm text-[#a8a29e]/60 mt-1 rotate-[0.5deg] text-center px-2">
        {subtitle}
      </span>
    </div>
  );
}

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
    <div
      className="relative min-h-screen min-h-[100dvh] flex flex-col justify-between text-[#292524] overflow-x-hidden"
      style={{
        backgroundColor: '#f5f0e6',
        backgroundImage: `radial-gradient(#ded5c5 1.2px, transparent 1.2px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── Top Leather/Stationery Header ─────────────────────── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="flex items-center justify-between px-2.5 xs:px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl sm:rounded-full border border-[#dcd4c5] shadow-xs backdrop-blur-md bg-[#faf7f0]/90">
          {/* Brand Logo & Notebook Edition Pill */}
          <Link
            to="/"
            onClick={() => playChime && playChime('pop')}
            className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation min-w-0"
          >
            <OneDeskLogo size={24} className="shrink-0 sm:w-7 sm:h-7" />
            <span className="font-display font-black text-sm xs:text-base sm:text-lg tracking-tight text-[#1c1917] truncate">
              OneDesk
            </span>
            <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#d6cdc0] bg-[#ede6d8] text-[#78716c]">
              Personal Edition
            </span>
          </Link>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => handleAction('/')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 xs:px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs bg-[#1c1917] hover:bg-[#292524] text-[#faf7f0] touch-manipulation min-h-[36px]"
              >
                <span>Open Notebook</span>
                <ArrowRight size={13} className="sm:w-3.5 sm:h-3.5 text-amber-200" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAction('/login')}
                  className="px-2 xs:px-3 sm:px-4 py-1.5 rounded-full text-[11px] xs:text-xs font-bold text-[#57534e] hover:text-[#1c1917] border border-[#dcd4c5] bg-[#ede6d8]/60 hover:bg-[#ede6d8] transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation min-h-[36px]"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('/signup')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 xs:px-3.5 sm:px-5 py-1.5 rounded-full text-[11px] xs:text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs bg-[#1c1917] hover:bg-[#292524] text-[#faf7f0] touch-manipulation min-h-[36px]"
                >
                  <span>Get Started</span>
                  <ArrowRight size={12} className="hidden xs:inline-block sm:w-3.5 sm:h-3.5 text-amber-200" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Main Notebook Canvas ──────────────────────────────── */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-6 flex-1 flex flex-col justify-center">
        {/* The Notebook Container */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#ded5c6] bg-[#fbf9f4] shadow-[0_8px_30px_rgba(60,50,40,0.08),0_1px_3px_rgba(60,50,40,0.05)] overflow-hidden">
          
          {/* Mobile Top Spiral Coil Wire Loops (Steno / Reporter's Notepad style) */}
          <div className="lg:hidden flex items-center justify-between px-3 sm:px-6 py-2 border-b border-[#e5ddcf] bg-[#f2ecdf] overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#44403c] shadow-inner" />
                <div
                  className="absolute -top-1 w-3.5 h-4.5 rounded-full border-[2px] border-stone-400 pointer-events-none"
                  style={{
                    borderColor: '#a8a29e',
                    borderTopColor: '#e7e5e4',
                    borderBottomColor: '#78716c',
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dual Page Layout on Desktop / Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[540px]">
            
            {/* ── Left Page: Hero Manifesto & Actions ─────────────── */}
            <div
              className="lg:col-span-6 p-4 xs:p-6 sm:p-8 lg:p-9 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#e5ddcf]"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(148, 163, 184, 0.12) 32px)',
              }}
            >
              {/* Red Vertical Margin Line */}
              <div className="absolute top-0 bottom-0 left-5 sm:left-7 w-[1.5px] bg-rose-400/40 pointer-events-none hidden sm:block" />

              <div className="space-y-4 sm:space-y-5 sm:pl-5">
                {/* Washi Tape Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-900 border-y border-amber-300/60 shadow-xs text-[10px] sm:text-[11px] font-bold rotate-[-1.5deg] tracking-wide font-mono uppercase rounded-xs">
                  <span>✦</span>
                  <span>The Unified Life & Work Notebook</span>
                  <span>✦</span>
                </div>

                {/* Main Headline with Marker Highlighter */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black font-display tracking-tight leading-[1.18] sm:leading-[1.15] text-[#1c1917]">
                  One place for everything you{' '}
                  <span className="relative inline-block mt-0.5 max-w-full">
                    <span className="relative z-10 px-1.5 xs:px-2 py-0.5 text-[#1c1917] font-black">
                      think, plan & create.
                    </span>
                    <span
                      className="absolute inset-0 bg-[#fde047]/80 rounded-xs -rotate-1 transform -skew-x-2 z-0"
                      style={{
                        boxShadow: '0 2px 8px rgba(253, 224, 71, 0.3)',
                      }}
                    />
                  </span>
                </h1>

                {/* Subtitle with authentic editorial clarity */}
                <p className="text-xs xs:text-[13px] sm:text-sm md:text-base leading-relaxed text-[#57534e] max-w-xl">
                  Stop context switching between fragmented apps. OneDesk merges daily priorities, fluid notes, synced timelines, and focus tools into one quiet, personal life notebook.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => handleAction(user ? '/' : '/signup')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-[#1c1917] hover:bg-[#292524] text-[#fbf9f4] min-h-[44px] touch-manipulation"
                  >
                    <span>{user ? 'Open Workspace' : 'Start My Notebook Free'}</span>
                    <ArrowRight size={14} className="text-amber-300" />
                  </button>

                  {!user && (
                    <button
                      type="button"
                      onClick={() => handleAction('/login')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-[#d6cdc0] text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#ede6d8]/60 hover:bg-[#ede6d8] text-[#44403c] min-h-[44px] touch-manipulation"
                    >
                      <span>Sign In</span>
                      <ChevronRight size={13} className="text-[#78716c]" />
                    </button>
                  )}
                </div>

                {/* Handwritten margin note & arrow */}
                <div className="pt-1 flex items-center gap-2">
                  <span className="font-handwriting text-xl sm:text-2xl text-amber-800 rotate-[-1.5deg]">
                    free forever, cloud-synced ✨
                  </span>
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="stroke-amber-700 -rotate-12">
                    <path d="M2 10C8 6 14 6 21 11M21 11L16 7M21 11L18 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Bottom Sticky Note Pinned with Paperclip */}
              <div className="mt-5 pt-4 sm:pl-5 border-t border-[#e5ddcf]/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#78716c]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-semibold">Ready on all devices</span>
                </div>

                {/* Ink Rubber Stamp */}
                <div className="border border-dashed border-rose-500/80 text-rose-600 font-mono text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded rotate-[-2deg] tracking-wider uppercase select-none opacity-90">
                  ★ ARCHIVE VERIFIED ★
                </div>
              </div>
            </div>

            {/* ── Right Page: Interactive Notebook Deck with Tabs ─── */}
            <div
              className="lg:col-span-6 p-3.5 xs:p-5 sm:p-8 flex flex-col justify-between bg-[#fcfbf7] relative"
              style={{
                backgroundImage: activeTab === 'funzone'
                  ? 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
                  : 'repeating-linear-gradient(transparent, transparent 31px, rgba(148, 163, 184, 0.12) 32px)',
                backgroundSize: activeTab === 'funzone' ? '18px 18px' : 'auto',
              }}
            >
              <div>
                {/* Notebook Index Tabs (protruding divider tabs) */}
                <div className="flex items-end gap-1 xs:gap-1.5 sm:gap-2 mb-4 border-b border-[#e5ddcf] overflow-x-auto no-scrollbar">
                  {[
                    {
                      id: 'tasks',
                      label: 'Tasks',
                      icon: CheckSquare,
                      activeBg: 'bg-[#fef3c7]',
                      activeBorder: 'border-[#fde68a]',
                      activeText: 'text-[#92400e]',
                    },
                    {
                      id: 'notes',
                      label: 'Notes',
                      icon: FileText,
                      activeBg: 'bg-[#ecfdf5]',
                      activeBorder: 'border-[#a7f3d0]',
                      activeText: 'text-[#065f46]',
                    },
                    {
                      id: 'schedule',
                      label: 'Schedule',
                      icon: Calendar,
                      activeBg: 'bg-[#f0f9ff]',
                      activeBorder: 'border-[#bae6fd]',
                      activeText: 'text-[#075985]',
                    },
                    {
                      id: 'funzone',
                      label: 'Fun Zone',
                      icon: Gamepad2,
                      activeBg: 'bg-[#faf5ff]',
                      activeBorder: 'border-[#e9d5ff]',
                      activeText: 'text-[#6b21a8]',
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabClick(tab.id)}
                        className={`relative -mb-px flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2.5 xs:px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-t-xl sm:rounded-t-2xl text-[11px] xs:text-xs sm:text-[13px] font-bold border transition-all cursor-pointer touch-manipulation whitespace-nowrap ${
                          active
                            ? `${tab.activeBg} ${tab.activeBorder} ${tab.activeText} border-b-transparent shadow-xs z-10 scale-[1.01]`
                            : 'bg-[#f0ebd8]/80 text-[#64748b] border-[#ded7cb] hover:bg-[#ede6d8] hover:text-[#1c1917]'
                        }`}
                      >
                        <Icon size={13} className="shrink-0 sm:w-3.5 sm:h-3.5" strokeWidth={2.2} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Interactive Content Inside the Notebook Page ── */}
                <div className="min-h-[220px] sm:min-h-[250px] flex flex-col justify-between">
                  {/* TAB 1: Tasks Checklist */}
                  {activeTab === 'tasks' && (
                    <div className="space-y-2.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-mono text-xs font-bold text-[#44403c]">Priority Checklist</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 border border-amber-300/70 text-amber-900 font-bold">
                          {completedDemoTask ? '3/3 Checked' : '2/3 Checked'}
                        </span>
                      </div>

                      {/* Interactive Task 1 */}
                      <div
                        onClick={() => {
                          setCompletedDemoTask(!completedDemoTask);
                          if (playChime) playChime('pop');
                        }}
                        className="p-3 rounded-xl border border-[#dcd4c5] bg-[#faf7f0] flex items-center justify-between gap-2.5 cursor-pointer shadow-xs transition-all hover:border-[#a8a29e] active:scale-[0.99] touch-manipulation"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                              completedDemoTask ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#a8a29e] bg-white'
                            }`}
                          >
                            {completedDemoTask && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium truncate transition-all ${
                              completedDemoTask ? 'line-through text-[#a8a29e] decoration-rose-500 decoration-2' : 'text-[#1c1917]'
                            }`}
                          >
                            Ship OneDesk v3.0 Production Release
                          </span>
                        </div>
                        <span className="shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                          HIGH
                        </span>
                      </div>

                      {/* Task 2 */}
                      <div className="p-3 rounded-xl border border-[#dcd4c5] bg-[#faf7f0] flex items-center justify-between gap-2.5 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-4 h-4 rounded border border-emerald-600 bg-emerald-600 flex items-center justify-center text-white shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                          <span className="text-xs sm:text-sm font-medium truncate line-through text-[#a8a29e] decoration-rose-500 decoration-2">
                            Refine Notebook Paper & Tab Dividers
                          </span>
                        </div>
                        <span className="shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          MED
                        </span>
                      </div>

                      {/* Task 3 */}
                      <div className="p-3 rounded-xl border border-[#dcd4c5] bg-[#faf7f0] flex items-center justify-between gap-2.5 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-4 h-4 rounded border border-emerald-600 bg-emerald-600 flex items-center justify-center text-white shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                          <span className="text-xs sm:text-sm font-medium truncate line-through text-[#a8a29e] decoration-rose-500 decoration-2">
                            Configure Cloud Sync & Backup Vault
                          </span>
                        </div>
                        <span className="shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          LOW
                        </span>
                      </div>

                      {/* Notebook styled "onedesk" doodle watermark in the free space */}
                      <NotebookWatermark subtitle="your life, organized on paper ✦" />
                    </div>
                  )}

                  {/* TAB 2: Yellow Legal Pad Note */}
                  {activeTab === 'notes' && (
                    <div className="animate-fade-in space-y-3">
                      <div className="relative bg-[#fefce8] p-3.5 xs:p-4 rounded-xl border border-amber-200/80 shadow-xs space-y-2">
                        {/* Silver Paperclip */}
                        <div className="absolute -top-2.5 right-4 w-3.5 h-6 border-2 border-stone-400 rounded-full rotate-12 shadow-2xs" />

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 font-display">Product Vision Memo</span>
                          <span className="text-[10px] font-mono text-amber-800/70">saved 2m ago</span>
                        </div>
                        <p className="text-xs sm:text-[13px] leading-relaxed text-amber-900 font-editorial">
                          &ldquo;Build a workspace where focus is effortless. No flashing notifications, no bloated tabs — just your pure thoughts, organized cleanly on paper.&rdquo;
                        </p>
                        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">#strategy</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">#focus</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-200/80 text-emerald-900 border border-emerald-300">#synced</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg border border-[#e5ddcf] bg-[#faf7f0] flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-[#57534e]">
                        <span className="font-handwriting text-base xs:text-lg text-emerald-800">⚡ everything autosaves in real time</span>
                        <span className="font-mono text-[9px] xs:text-[10px] font-bold text-[#1c1917] shrink-0">v3.0 Notebook Engine</span>
                      </div>

                      {/* Notebook styled "onedesk" doodle watermark */}
                      <NotebookWatermark subtitle="capture ideas at the speed of thought ✦" />
                    </div>
                  )}

                  {/* TAB 3: Daily Agenda Planner */}
                  {activeTab === 'schedule' && (
                    <div className="animate-fade-in space-y-2.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold font-mono text-[#44403c]">Today’s Agenda</span>
                        <span className="text-[10px] font-mono text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded font-bold">3 Events</span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl border border-sky-300 bg-sky-50/80 flex items-center gap-2.5 shadow-xs">
                          <Clock size={14} className="text-sky-700 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-sky-950 truncate">Architecture & Core Sync Review</p>
                            <p className="text-[10px] text-sky-800 truncate font-mono">10:00 AM – 11:30 AM · Workspace Room</p>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 flex items-center gap-2.5 shadow-xs">
                          <Clock size={14} className="text-emerald-700 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-emerald-950 truncate">Design Polish & Notebook Aesthetics</p>
                            <p className="text-[10px] text-emerald-800 truncate font-mono">02:00 PM – 03:00 PM · Studio</p>
                          </div>
                        </div>
                      </div>

                      {/* Notebook styled "onedesk" doodle watermark */}
                      <NotebookWatermark subtitle="calm days, clearly planned ✦" />
                    </div>
                  )}

                  {/* TAB 4: Graph Paper Arcade Doodles */}
                  {activeTab === 'funzone' && (
                    <div className="animate-fade-in text-center py-2 space-y-2">
                      <div className="w-11 h-11 rounded-2xl mx-auto border-2 border-purple-400 bg-purple-100/90 flex items-center justify-center text-purple-900 shadow-xs">
                        <Gamepad2 size={22} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-[#1c1917]">Fun Zone & Micro-Break Arcade</h4>
                      <p className="text-[11px] sm:text-xs text-[#57534e] max-w-xs mx-auto leading-relaxed">
                        Recharge your mental stamina between deep work sprints with integrated mini games, puzzles, and focus trackers.
                      </p>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-300 bg-purple-100 text-purple-900 font-mono">
                        <Star size={10} className="fill-purple-600 text-purple-600" />
                        <span>Earn Focus Points Daily</span>
                      </div>

                      {/* Notebook styled "onedesk" doodle watermark */}
                      <NotebookWatermark subtitle="recharge your mind, stay sharp ✦" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Notebook Tear-Off Perforation & Link */}
              <div className="pt-3 border-t-2 border-dashed border-[#ded5c6] mt-4 flex items-center justify-between text-[10px] sm:text-[11px] text-[#78716c]">
                <span className="font-mono">Interactive Live Preview</span>
                <Link
                  to={user ? '/' : '/signup'}
                  onClick={() => playChime && playChime('pop')}
                  className="font-bold flex items-center gap-1 text-[#1c1917] hover:text-amber-800 hover:underline touch-manipulation shrink-0"
                >
                  <span>Try in your workspace</span>
                  <ArrowRight size={11} className="text-amber-700" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Notebook Footer ───────────────────────────────────── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 pt-1 sm:pt-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-full border border-[#dcd4c5] text-[10px] sm:text-[11px] backdrop-blur-md bg-[#faf7f0]/80 text-[#78716c] text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>© 2026 OneDesk</span>
            <span>·</span>
            <span>Crafted personal life notebook & suite</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-4 font-medium">
            <Link to="/login" className="hover:text-[#1c1917] hover:underline transition-colors touch-manipulation py-0.5" onClick={() => playChime && playChime('pop')}>
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-[#1c1917] hover:underline transition-colors touch-manipulation py-0.5" onClick={() => playChime && playChime('pop')}>
              Create Account
            </Link>
            <span className="hidden sm:inline">·</span>
            <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
