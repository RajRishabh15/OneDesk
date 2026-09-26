import { useMemo, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  User as UserIcon,
  Plus,
  CheckSquare,
  FileText,
  CalendarPlus,
  X,
  StickyNote,
  Calendar,
  Sliders,
  Home,
  Settings,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import OneDeskLogo from './OneDeskLogo';

const navLinks = [
  { to: '/',         label: 'Home',     icon: Home,        end: true },
  { to: '/tasks',    label: 'Tasks',    icon: CheckSquare },
  { to: '/notes',    label: 'Notes',    icon: StickyNote },
  { to: '/calendar', label: 'Schedule', icon: Calendar },
];

const mobileLinks = [
  { to: '/',         label: 'Home',     icon: Home,        end: true },
  { to: '/tasks',    label: 'Tasks',    icon: CheckSquare },
  { to: '/notes',    label: 'Notes',    icon: StickyNote },
  { to: '/calendar', label: 'Schedule', icon: Calendar },
];

const quickActions = [
  {
    title: 'New Task',
    subtitle: 'Action item with priority & due date',
    to: '/tasks',
    icon: CheckSquare,
    color: 'var(--accent-color)',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.12))',
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    title: 'Quick Note',
    subtitle: 'Capture ideas, drafts & markdown',
    to: '/notes',
    icon: FileText,
    color: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.12))',
    border: 'rgba(52,211,153,0.3)',
    glow: 'rgba(52,211,153,0.25)',
  },
  {
    title: 'Schedule Event',
    subtitle: 'Block calendar meeting or milestone',
    to: '/calendar',
    icon: CalendarPlus,
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(245,158,11,0.12))',
    border: 'rgba(251,191,36,0.3)',
    glow: 'rgba(251,191,36,0.25)',
  },
];

export default function TopNavPill() {
  const { user, logout } = useAuth();
  const { tasks, notes, events, addTask } = useData();
  const { settings, playChime } = useSettings();
  const navigate = useNavigate();

  const [query, setQuery]                       = useState('');
  const [searchOpen, setSearchOpen]             = useState(false);
  const [profileOpen, setProfileOpen]           = useState(false);
  const [notifOpen, setNotifOpen]               = useState(false);
  const [quickAddOpen, setQuickAddOpen]         = useState(false);
  const [mobileQuickSheetOpen, setMobileQuickSheetOpen] = useState(false);

  const [quickTaskTitle, setQuickTaskTitle]     = useState('');
  const [quickTaskSuccess, setQuickTaskSuccess] = useState(false);
  const [quickTaskSubmitting, setQuickTaskSubmitting] = useState(false);

  const desktopSearchBoxRef   = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchBoxRef    = useRef(null);
  const mobileSearchInputRef  = useRef(null);
  const profileRef            = useRef(null);
  const mobileProfileRef      = useRef(null);
  const mobileProfileDropdownRef = useRef(null);
  const desktopNotifRef       = useRef(null);
  const mobileNotifRef        = useRef(null);
  const mobileNotifDropdownRef   = useRef(null);
  const mobileSearchDropdownRef  = useRef(null);
  const quickAddRef           = useRef(null);

  async function handleQuickInlineTask(e) {
    e.preventDefault();
    if (!quickTaskTitle.trim() || quickTaskSubmitting) return;
    setQuickTaskSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addTask({
        title: quickTaskTitle.trim(),
        priority: 'Medium',
        status: 'Todo',
        dueDate: today,
      });
      setQuickTaskTitle('');
      setQuickTaskSuccess(true);
      setTimeout(() => {
        setQuickTaskSuccess(false);
        setQuickAddOpen(false);
        setMobileQuickSheetOpen(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setQuickTaskSubmitting(false);
    }
  }

  async function handleLogout() {
    setProfileOpen(false);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  }

  /* ── close on outside click ── */
  useEffect(() => {
    function onDown(e) {
      const inDesktopSearch = desktopSearchBoxRef.current && desktopSearchBoxRef.current.contains(e.target);
      const inMobileSearch  = (mobileSearchBoxRef.current && mobileSearchBoxRef.current.contains(e.target)) ||
                              (mobileSearchDropdownRef.current && mobileSearchDropdownRef.current.contains(e.target));
      if (!inDesktopSearch && !inMobileSearch) setSearchOpen(false);

      const inDesktopNotif  = desktopNotifRef.current && desktopNotifRef.current.contains(e.target);
      const inMobileNotif   = (mobileNotifRef.current && mobileNotifRef.current.contains(e.target)) ||
                              (mobileNotifDropdownRef.current && mobileNotifDropdownRef.current.contains(e.target));
      if (!inDesktopNotif && !inMobileNotif) setNotifOpen(false);

      const inDesktopProfile = profileRef.current && profileRef.current.contains(e.target);
      const inMobileProfile  = (mobileProfileRef.current && mobileProfileRef.current.contains(e.target)) ||
                               (mobileProfileDropdownRef.current && mobileProfileDropdownRef.current.contains(e.target));
      if (!inDesktopProfile && !inMobileProfile) setProfileOpen(false);

      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) setQuickAddOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, []);

  /* ── Ctrl+K ── */
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => {
          if (window.innerWidth >= 768) {
            desktopSearchInputRef.current?.focus();
          } else {
            mobileSearchInputRef.current?.focus();
          }
        }, 60);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
        setQuickAddOpen(false);
        setMobileQuickSheetOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { notes: [], tasks: [], events: [] };
    const q = query.toLowerCase();
    return {
      notes:  notes.filter(n  => n.title.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q)),
      tasks:  tasks.filter(t  => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
      events: events.filter(ev => ev.title.toLowerCase().includes(q) || ev.description?.toLowerCase().includes(q)),
    };
  }, [query, notes, tasks, events]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const dueSoon = useMemo(() => {
    const cutoff = now + 86400000;
    return tasks.filter(
      t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate).getTime() <= cutoff
    );
  }, [tasks, now]);

  const initials = useMemo(() => {
    const raw = (user?.name || user?.email || 'U').trim();
    return raw ? raw[0].toUpperCase() : 'U';
  }, [user]);

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP NAV  (md+)
      ════════════════════════════════════════════ */}
      <header className="hidden md:flex fixed top-4 sm:top-5 inset-x-0 z-40 justify-center px-6 pointer-events-none">
        <div
          className="pointer-events-auto relative flex items-center gap-3 px-4 sm:px-5 py-2.5 transition-all duration-300"
          style={{
            background:     'var(--bg-card-solid)',
            borderRadius:   '24px',
            border:         '1px solid var(--border-card)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow:      '0 12px 45px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset',
            width:          'fit-content',
            maxWidth:       'min(1100px, calc(100vw - 48px))',
          }}
        >
          {/* ── LEFT CLUSTER: Logo + Notifications ─────────── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(99,102,241,0.35)]">
                <OneDeskLogo size={28} />
              </div>
              <span
                className="font-display text-[15px] font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >OneDesk</span>
            </Link>

            {/* Divider */}
            <div className="h-5 w-px mx-1.5" style={{ background: 'var(--border-card)' }} />

            {/* Notification Bell */}
            <div className="relative" ref={desktopNotifRef}>
              <button
                type="button"
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); setQuickAddOpen(false); setSearchOpen(false); }}
                className="relative h-[34px] w-[34px] rounded-[11px] flex items-center justify-center transition-all hover:brightness-125 active:scale-95 border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                aria-label="Notifications"
              >
                <Bell size={15} />
                {dueSoon.length > 0 && settings.dueTaskBadges && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-[1.5px] ring-[var(--bg-card)]" />
                )}
              </button>

              {notifOpen && (
                <div
                  className="absolute left-0 mt-2.5 w-72 rounded-2xl border shadow-2xl p-3 animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card-solid)', borderColor: 'var(--border-card)', backdropFilter: 'blur(32px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</p>
                    {dueSoon.length > 0 && (
                      <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                        {dueSoon.length} due
                      </span>
                    )}
                  </div>
                  {dueSoon.length === 0 ? (
                    <p className="text-xs py-3 text-center" style={{ color: 'var(--text-muted)' }}>All caught up ✓</p>
                  ) : (
                    <ul className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                      {dueSoon.slice(0, 5).map(t => (
                        <li
                          key={t.id}
                          className="text-xs p-2 rounded-xl cursor-pointer transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => { setNotifOpen(false); navigate('/tasks'); }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="font-semibold block truncate">{t.title}</span>
                          <span className="block text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>Due {t.dueDate}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── CENTER: Nav Tabs ────────────────────────── */}
          <nav
            className="flex items-center gap-1 px-1.5 py-1 rounded-[16px]"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-[12px] text-xs font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'shadow-sm'
                      : 'hover:opacity-90'
                  }`
                }
                style={({ isActive }) => isActive
                  ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }
                  : { color: 'var(--text-muted)' }
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-3.5 rounded-full"
                        style={{ background: 'var(--accent-gradient)', boxShadow: '0 0 6px var(--accent-glow)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── RIGHT CLUSTER: Search + Add + Account ─── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Search — single morphing pill, spring-width transition */}
            <div className="relative" ref={desktopSearchBoxRef}>
              {/* The pill itself — width springs open/closed */}
              <div
                className="flex items-center overflow-hidden rounded-[11px] border"
                style={{
                  height: '34px',
                  width: searchOpen ? '175px' : '34px',
                  /* Spring easing: fast out, slight overshoot, then settle */
                  transition: 'width 0.38s cubic-bezier(0.34, 1.45, 0.64, 1), border-color 0.25s ease, background 0.25s ease',
                  background: searchOpen ? 'var(--bg-card)' : 'var(--bg-surface)',
                  borderColor: searchOpen ? 'var(--border-card)' : 'var(--border-subtle)',
                  boxShadow: searchOpen ? '0 2px 14px rgba(0,0,0,0.25)' : 'none',
                }}
              >
                {/* Search icon — always the leftmost element, acts as trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(v => {
                      const next = !v;
                      if (next) setTimeout(() => desktopSearchInputRef.current?.focus(), 220);
                      return next;
                    });
                  }}
                  title="Search (Ctrl+K)"
                  className="h-full w-[34px] shrink-0 flex items-center justify-center transition-colors duration-200"
                  style={{ color: searchOpen ? 'var(--accent-color)' : 'var(--text-muted)' }}
                >
                  <Search size={14} />
                </button>

                {/* Input — fades in after pill opens */}
                <input
                  ref={desktopSearchInputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 min-w-0 bg-transparent text-xs outline-none"
                  style={{
                    color: 'var(--text-primary)',
                    opacity: searchOpen ? 1 : 0,
                    transition: 'opacity 0.18s ease',
                    transitionDelay: searchOpen ? '0.18s' : '0s',
                    pointerEvents: searchOpen ? 'auto' : 'none',
                  }}
                />

                {/* Clear or close — fades in when open */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (query) {
                      setQuery('');
                      desktopSearchInputRef.current?.focus();
                    } else {
                      setSearchOpen(false);
                    }
                  }}
                  className="h-8 w-8 shrink-0 flex items-center justify-center"
                  style={{
                    color: 'var(--text-muted)',
                    opacity: searchOpen ? 0.55 : 0,
                    transition: 'opacity 0.15s ease',
                    transitionDelay: searchOpen ? '0.22s' : '0s',
                    pointerEvents: searchOpen ? 'auto' : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = searchOpen ? '0.55' : '0'}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && query.trim() && (
                <div
                  className="absolute right-0 top-full mt-2.5 w-80 rounded-2xl border shadow-2xl p-3 space-y-3 animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card-solid)', borderColor: 'var(--border-card)', backdropFilter: 'blur(32px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                >
                  <SearchGroup label="Tasks"    count={results.tasks.length}  items={results.tasks.map(t  => t.title)}  onSee={() => { setSearchOpen(false); navigate('/tasks'); }} />
                  <SearchGroup label="Notes"    count={results.notes.length}  items={results.notes.map(n  => n.title)}  onSee={() => { setSearchOpen(false); navigate('/notes'); }} />
                  <SearchGroup label="Schedule" count={results.events.length} items={results.events.map(e => e.title)} onSee={() => { setSearchOpen(false); navigate('/calendar'); }} />
                  {results.notes.length + results.tasks.length + results.events.length === 0 && (
                    <p className="text-xs py-2 text-center" style={{ color: 'var(--text-muted)' }}>No results for "{query}".</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Add — plus icon expands to fluid Quick Create card */}
            <div className="relative" ref={quickAddRef}>
              <button
                type="button"
                onClick={() => { setQuickAddOpen(v => !v); setProfileOpen(false); setNotifOpen(false); setSearchOpen(false); }}
                className="h-[34px] w-[34px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-white"
                style={{
                  background: 'var(--accent-gradient)',
                  boxShadow: quickAddOpen ? '0 0 20px var(--accent-glow)' : '0 2px 14px var(--accent-glow)',
                }}
                aria-label="Quick Create"
                title="Quick Create"
              >
                <Plus
                  size={17}
                  strokeWidth={2.4}
                  style={{
                    transition: 'transform 0.28s cubic-bezier(0.34, 1.45, 0.64, 1)',
                    transform: quickAddOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {quickAddOpen && (
                <div
                  className="absolute right-0 mt-3 w-80 rounded-[28px] border shadow-2xl p-3.5 space-y-2.5 animate-menu-pop z-50 overflow-hidden"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-card)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-1 pt-0.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-400 border border-indigo-500/25 bg-indigo-500/10">
                      <Sparkles size={11} className="animate-pulse text-indigo-400" />
                      <span>Quick Create</span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border"
                      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    >
                      ESC
                    </span>
                  </div>

                  {/* Micro tagline */}
                  <p className="text-[11px] font-medium px-1 -mt-1" style={{ color: 'var(--text-muted)' }}>
                    Capture actionable items & notes instantly
                  </p>

                  {/* 3 Fluid Action Cards */}
                  <div className="space-y-1.5">
                    {quickActions.map(action => (
                      <button
                        key={action.to}
                        onClick={() => { setQuickAddOpen(false); navigate(action.to); }}
                        className="w-full flex items-center justify-between p-2.5 rounded-[20px] border transition-all duration-200 text-left group hover:scale-[1.015] active:scale-[0.98]"
                        style={{
                          background: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = action.border;
                          e.currentTarget.style.boxShadow = `0 4px 18px ${action.glow}`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="h-9 w-9 rounded-[13px] flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-110"
                            style={{
                              background: action.gradient,
                              borderColor: action.border,
                              color: action.color,
                            }}
                          >
                            <action.icon size={17} strokeWidth={2.2} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                              {action.title}
                            </div>
                            <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                              {action.subtitle}
                            </div>
                          </div>
                        </div>
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 opacity-60 group-hover:opacity-100"
                          style={{ color: action.color }}
                        >
                          <ArrowRight size={13} />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Inline quick task entry */}
                  <div className="pt-1.5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <form onSubmit={handleQuickInlineTask} className="relative">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all focus-within:border-indigo-400 shadow-sm"
                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                      >
                        <CheckSquare size={13} style={{ color: 'var(--accent-color)' }} />
                        <input
                          type="text"
                          value={quickTaskTitle}
                          onChange={e => setQuickTaskTitle(e.target.value)}
                          placeholder="Quick add task for today... ↵"
                          className="flex-1 min-w-0 text-xs bg-transparent outline-none placeholder:text-stone-400"
                          style={{ color: 'var(--text-primary)' }}
                        />
                        <button
                          type="submit"
                          disabled={!quickTaskTitle.trim() || quickTaskSubmitting}
                          className="h-5 w-5 rounded-full flex items-center justify-center transition-transform active:scale-90 disabled:opacity-30 shrink-0"
                          style={{ background: 'var(--accent-gradient)', color: '#fff' }}
                          title="Save task"
                        >
                          <Plus size={12} strokeWidth={2.8} />
                        </button>
                      </div>
                      {quickTaskSuccess && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-xs font-bold animate-menu-pop">
                          <Check size={13} className="mr-1.5" /> Task captured for today!
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Thin divider */}
            <div className="h-5 w-px" style={{ background: 'var(--border-card)' }} />

            {/* Account + Settings merged — Name-based logo */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); setQuickAddOpen(false); setSearchOpen(false); }}
                className="h-[34px] w-[34px] rounded-full flex items-center justify-center transition-all hover:brightness-110 hover:scale-105 active:scale-95 border"
                style={{
                  background: profileOpen ? 'var(--bg-card)' : 'var(--bg-surface)',
                  borderColor: profileOpen ? 'var(--accent-color)' : 'var(--border-subtle)',
                  boxShadow: profileOpen ? '0 0 14px var(--accent-glow)' : 'none',
                }}
                title={user?.name ? `${user.name} (Account)` : 'Account'}
                aria-label="Account profile"
              >
                <div
                  className="h-7 w-7 rounded-full grid place-items-center text-white text-xs font-black tracking-tight shrink-0 select-none shadow-sm overflow-hidden"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    initials || <UserIcon size={12} />
                  )}
                </div>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-52 rounded-2xl border shadow-2xl animate-menu-pop z-50 overflow-hidden"
                  style={{ background: 'var(--bg-card-solid)', borderColor: 'var(--border-card)', backdropFilter: 'blur(32px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                >
                  {/* User info */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center text-white text-xs font-black shrink-0 overflow-hidden"
                        style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 8px var(--accent-glow)' }}
                      >
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                        <p className="text-[10px] truncate font-mono" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span
                        className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
                      >
                        <Sliders size={12} />
                      </span>
                      Settings & Preferences
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all text-rose-400"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,113,133,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span
                        className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(251,113,133,0.1)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.2)' }}
                      >
                        <LogOut size={12} />
                      </span>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          MOBILE TOP BAR  (< md)
      ════════════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 select-none">
        <div
          className="relative flex items-center justify-between px-3.5 h-14"
          style={{
            background: 'var(--bg-card-solid)',
            borderBottom: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.3)',
          }}
        >
          {/* Hairline Specular Reflection Line on Bottom Edge */}
          <div
            className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            }}
          />

          {searchOpen ? (
            /* Full-width Search Bar Mode on Mobile — Square bar inline morph */
            <div className="flex items-center gap-2 w-full animate-fade-in">
              <button
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setSearchOpen(false);
                  setQuery('');
                }}
                className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 active:scale-90 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
                aria-label="Close search"
              >
                <ArrowLeft size={16} />
              </button>
              <div
                className="flex-1 flex items-center gap-2 px-3 h-9 rounded-xl border shadow-inner transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                }}
              >
                <Search size={14} style={{ color: 'var(--accent-color)' }} />
                <input
                  ref={mobileSearchInputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tasks, notes, schedule…"
                  className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm outline-none font-medium"
                  style={{ color: 'var(--text-primary)' }}
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      if (playChime) playChime('pop');
                      setQuery('');
                      mobileSearchInputRef.current?.focus();
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors active:scale-90"
                    aria-label="Clear query"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Normal Mode: Brand on Left, Squircle Action Cluster on Right */
            <>
              {/* Left: Brand Logo (White Themed Badge) + Typography */}
              <Link
                to="/"
                onClick={() => playChime && playChime('pop')}
                className="flex items-center gap-2.5 shrink-0 group active:scale-95 transition-transform"
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center border transition-all duration-200 shrink-0 select-none shadow-md"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
                  }}
                >
                  <OneDeskLogo size={24} />
                </div>
                <span
                  className="font-display text-[15px] font-extrabold tracking-tight leading-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  OneDesk
                </span>
              </Link>

              {/* Right: Notifications + Search Trigger + Account Profile */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile Notification Bell */}
                <div className="relative" ref={mobileNotifRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (playChime) playChime('pop');
                      setNotifOpen(v => !v);
                      setSearchOpen(false);
                      setProfileOpen(false);
                    }}
                    className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer"
                    style={{
                      background: notifOpen ? 'var(--bg-card-solid)' : 'var(--bg-surface)',
                      borderColor: notifOpen ? 'var(--accent-color)' : 'var(--border-subtle)',
                      color: notifOpen ? 'var(--accent-color)' : 'var(--text-muted)',
                      boxShadow: notifOpen ? '0 0 14px var(--accent-glow)' : 'none',
                    }}
                    aria-label="Notifications"
                  >
                    <Bell size={15} strokeWidth={notifOpen ? 2.3 : 1.8} />
                    {dueSoon.length > 0 && settings.dueTaskBadges && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-card)] shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Mobile Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (playChime) playChime('pop');
                    setSearchOpen(true);
                    setNotifOpen(false);
                    setProfileOpen(false);
                    setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
                  }}
                  className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  aria-label="Open search"
                >
                  <Search size={15} strokeWidth={1.8} />
                </button>

                {/* Mobile Account Profile Button */}
                <div className="relative" ref={mobileProfileRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (playChime) playChime('pop');
                      setProfileOpen(v => !v);
                      setNotifOpen(false);
                      setSearchOpen(false);
                    }}
                    className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer p-0.5"
                    style={{
                      background: profileOpen ? 'var(--bg-card-solid)' : 'var(--bg-surface)',
                      borderColor: profileOpen ? 'var(--accent-color)' : 'var(--border-subtle)',
                      boxShadow: profileOpen ? '0 0 14px var(--accent-glow)' : 'none',
                    }}
                    aria-label="Account Profile"
                  >
                    <div
                      className="h-full w-full rounded-[9px] grid place-items-center text-white text-[11px] font-black shrink-0 select-none shadow-sm"
                      style={{ background: 'var(--accent-gradient)' }}
                    >
                      {initials || <UserIcon size={12} />}
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Notification Popover — FIXED and CENTERED within screen margins, NEVER clips! */}
        {notifOpen && (
          <div
            ref={mobileNotifDropdownRef}
            className="fixed inset-x-3.5 top-[62px] max-w-sm mx-auto rounded-2xl border shadow-2xl p-4 animate-menu-pop z-50 overflow-hidden"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <div
              className="absolute top-0 inset-x-4 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              }}
            />
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-lg flex items-center justify-center border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <Bell size={13} style={{ color: 'var(--accent-color)' }} />
                </div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</p>
              </div>
              <div className="flex items-center gap-2">
                {dueSoon.length > 0 && (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {dueSoon.length} due
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (playChime) playChime('pop');
                    setNotifOpen(false);
                  }}
                  className="h-6 w-6 rounded-lg flex items-center justify-center text-stone-400 hover:text-white active:scale-90 transition-all"
                  aria-label="Close"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {dueSoon.length === 0 ? (
              <div className="py-5 text-center">
                <Check size={22} className="mx-auto text-emerald-400 mb-1 opacity-80" />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>All caught up ✓</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>No urgent deadlines pending</p>
              </div>
            ) : (
              <ul className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {dueSoon.map(t => (
                  <li
                    key={t.id}
                    className="text-xs p-2.5 rounded-xl cursor-pointer transition-all border active:scale-[0.98]"
                    style={{
                      color: 'var(--text-primary)',
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                    }}
                    onClick={() => {
                      if (playChime) playChime('pop');
                      setNotifOpen(false);
                      navigate('/tasks');
                    }}
                  >
                    <span className="font-semibold block truncate">{t.title}</span>
                    <span className="block text-[10px] font-mono mt-0.5 text-rose-400 font-medium">Due {t.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Mobile Search Results Dropdown — FIXED and CENTERED within screen margins, NEVER clips! */}
        {searchOpen && query.trim() && (
          <div
            ref={mobileSearchDropdownRef}
            className="fixed inset-x-3.5 top-[62px] max-w-sm mx-auto rounded-2xl border shadow-2xl p-4 space-y-3 animate-menu-pop z-50 overflow-hidden"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <div
              className="absolute top-0 inset-x-4 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              }}
            />
            <SearchGroup label="Tasks"    count={results.tasks.length}  items={results.tasks.map(t  => t.title)}  onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/tasks'); }} />
            <SearchGroup label="Notes"    count={results.notes.length}  items={results.notes.map(n  => n.title)}  onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/notes'); }} />
            <SearchGroup label="Schedule" count={results.events.length} items={results.events.map(e => e.title)} onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/calendar'); }} />
            {results.notes.length + results.tasks.length + results.events.length === 0 && (
              <p className="text-xs py-3 text-center" style={{ color: 'var(--text-muted)' }}>No results for "{query}".</p>
            )}
          </div>
        )}

        {/* Mobile Profile Dropdown */}
        {profileOpen && (
          <div
            ref={mobileProfileDropdownRef}
            className="fixed right-3.5 top-[62px] w-64 rounded-2xl border shadow-2xl animate-menu-pop z-50 overflow-hidden"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <div
              className="absolute top-0 inset-x-4 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              }}
            />
            <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="h-9 w-9 rounded-xl grid place-items-center text-white text-xs font-black shrink-0 select-none shadow-sm overflow-hidden"
                  style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 8px var(--accent-glow)' }}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                  <p className="text-[10px] truncate font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span
                  className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <Sliders size={12} />
                </span>
                Settings & Preferences
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all text-rose-400 cursor-pointer active:scale-95"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,113,133,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border border-rose-500/30 bg-rose-500/10">
                  <LogOut size={12} />
                </span>
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════
          MOBILE BOTTOM BAR  (< md)
          Edge-to-Edge Native Mobile Dock — No Square Back!
      ════════════════════════════════════════════ */}
      {/* ════════════════════════════════════════════
          MOBILE BOTTOM BAR  (< md)
          Brand New Next-Gen Floating Island Capsule Dock
      ════════════════════════════════════════════ */}
      {/* Bottom Vignette Gradient Shield — smoothly dissolves content before it slides under the dock */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 h-28 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, var(--bg-page) 20%, rgba(9,7,21,0.85) 60%, transparent 100%)',
        }}
      />

      {/* Floating Island Dock */}
      <nav
        className="md:hidden fixed bottom-3.5 inset-x-3 max-w-[400px] mx-auto z-40 select-none"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          className="h-[58px] px-2.5 rounded-full border shadow-2xl backdrop-blur-3xl flex items-center justify-between relative overflow-hidden transition-all duration-300"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 16px 45px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          {/* Top Hairline Specular Highlight */}
          <div
            className="absolute top-0 inset-x-6 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
            }}
          />

          {/* 1. Home */}
          <NavLink
            to="/"
            end
            onClick={() => playChime && playChime('pop')}
            className={({ isActive }) =>
              `relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'px-3.5 py-1.5 font-bold'
                  : 'p-2.5 opacity-50 hover:opacity-85'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
            })}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-1.5">
                <Home size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="text-xs font-bold tracking-tight animate-fade-in">
                    Home
                  </span>
                )}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent-color)',
                      boxShadow: '0 0 6px var(--accent-color)',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>

          {/* 2. Tasks */}
          <NavLink
            to="/tasks"
            onClick={() => playChime && playChime('pop')}
            className={({ isActive }) =>
              `relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'px-3.5 py-1.5 font-bold'
                  : 'p-2.5 opacity-50 hover:opacity-85'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
            })}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-1.5">
                <CheckSquare size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="text-xs font-bold tracking-tight animate-fade-in">
                    Tasks
                  </span>
                )}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent-color)',
                      boxShadow: '0 0 6px var(--accent-color)',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>

          {/* 3. Center Hero Action Button (Quick Create FAB) */}
          <div className="flex items-center justify-center shrink-0 px-0.5">
            <button
              type="button"
              onClick={() => {
                if (playChime) playChime('pop');
                setMobileQuickSheetOpen(v => !v);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-90 cursor-pointer border shadow-lg group relative"
              style={{
                background: 'var(--accent-gradient)',
                borderColor: 'rgba(255,255,255,0.25)',
                boxShadow: mobileQuickSheetOpen
                  ? '0 0 24px var(--accent-glow)'
                  : '0 4px 16px var(--accent-glow)',
              }}
              aria-label="Quick Create"
              title="Quick Create"
            >
              <Plus
                size={19}
                strokeWidth={2.8}
                style={{
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.45, 0.64, 1)',
                  transform: mobileQuickSheetOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>

          {/* 4. Notes */}
          <NavLink
            to="/notes"
            onClick={() => playChime && playChime('pop')}
            className={({ isActive }) =>
              `relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'px-3.5 py-1.5 font-bold'
                  : 'p-2.5 opacity-50 hover:opacity-85'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
            })}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-1.5">
                <StickyNote size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="text-xs font-bold tracking-tight animate-fade-in">
                    Notes
                  </span>
                )}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent-color)',
                      boxShadow: '0 0 6px var(--accent-color)',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>

          {/* 5. Schedule */}
          <NavLink
            to="/calendar"
            onClick={() => playChime && playChime('pop')}
            className={({ isActive }) =>
              `relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'px-3.5 py-1.5 font-bold'
                  : 'p-2.5 opacity-50 hover:opacity-85'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
            })}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-1.5">
                <Calendar size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="text-xs font-bold tracking-tight animate-fade-in">
                    Schedule
                  </span>
                )}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--accent-color)',
                      boxShadow: '0 0 6px var(--accent-color)',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          FLUID MOBILE QUICK CREATE BOTTOM SHEET
      ════════════════════════════════════════════ */}
      {mobileQuickSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={() => setMobileQuickSheetOpen(false)}
          />

          {/* Sheet Panel */}
          <div
            className="relative w-full rounded-t-[32px] border-t border-x p-5 pt-3 animate-sheet-bounce z-10 max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
            }}
          >
            {/* Drag Handle */}
            <div className="h-1.5 w-12 rounded-full bg-white/25 mx-auto mb-3.5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent-gradient)' }} />
                  <h3 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Quick Create
                  </h3>
                </div>
                <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  Capture ideas, to-dos & calendar milestones
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileQuickSheetOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center border transition-all active:scale-90"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Inline Quick Task Add Form */}
            <form onSubmit={handleQuickInlineTask} className="relative mb-3.5">
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border transition-all focus-within:border-indigo-400 shadow-sm"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <CheckSquare size={16} style={{ color: 'var(--accent-color)' }} />
                <input
                  type="text"
                  value={quickTaskTitle}
                  onChange={e => setQuickTaskTitle(e.target.value)}
                  placeholder="Quick task for today... (Tap Enter ↵)"
                  className="flex-1 min-w-0 text-xs sm:text-sm bg-transparent outline-none placeholder:text-stone-400"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  disabled={!quickTaskTitle.trim() || quickTaskSubmitting}
                  className="h-7 w-7 rounded-full flex items-center justify-center transition-transform active:scale-90 disabled:opacity-30 shrink-0"
                  style={{ background: 'var(--accent-gradient)', color: '#fff' }}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
              {quickTaskSuccess && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-emerald-400 text-xs font-bold animate-menu-pop">
                  <Check size={14} className="mr-1.5" /> Task captured for today!
                </div>
              )}
            </form>

            {/* 3 Large Action Cards */}
            <div className="space-y-2 mb-4">
              {quickActions.map(action => (
                <button
                  key={action.to}
                  onClick={() => { setMobileQuickSheetOpen(false); navigate(action.to); }}
                  className="w-full flex items-center justify-between p-3 rounded-[20px] border transition-all duration-200 text-left active:scale-[0.98]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-10 w-10 rounded-[14px] flex items-center justify-center shrink-0 border"
                      style={{
                        background: action.gradient,
                        borderColor: action.border,
                        color: action.color,
                      }}
                    >
                      <action.icon size={19} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {action.title}
                      </div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {action.subtitle}
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-card)', color: action.color }}
                  >
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Jump Spaces Bar */}
            <div className="pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Quick Jump Spaces
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileQuickSheetOpen(false); navigate('/settings'); }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-full border text-xs font-bold transition-all active:scale-95"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Settings size={15} style={{ color: 'var(--accent-color)' }} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Search results group helper ── */
function SearchGroup({ label, count, items, onSee }) {
  if (count === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label} <span className="opacity-60">({count})</span>
        </p>
        <button onClick={onSee} className="text-[10px] font-semibold" style={{ color: 'var(--accent-color)' }}>
          View all
        </button>
      </div>
      <ul className="space-y-0.5">
        {items.slice(0, 3).map((t, i) => (
          <li
            key={i}
            onClick={onSee}
            className="truncate text-xs py-1 px-2.5 rounded-lg cursor-pointer transition-colors"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
