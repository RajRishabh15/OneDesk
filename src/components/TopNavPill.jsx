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
  LayoutGrid,
  StickyNote,
  Calendar,
  BarChart2,
  Sliders,
  Home,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const navLinks = [
  { to: '/', label: 'Home',     icon: Home,        end: true },
  { to: '/tasks',    label: 'Tasks',    icon: CheckSquare },
  { to: '/notes',    label: 'Notes',    icon: StickyNote },
  { to: '/calendar', label: 'Schedule', icon: Calendar },
  { to: '/analytics',label: 'Insights', icon: BarChart2 },
];

const mobileLinks = [
  { to: '/',         label: 'Home',     icon: Home,        end: true },
  { to: '/tasks',    label: 'Tasks',    icon: CheckSquare },
  { to: '/notes',    label: 'Notes',    icon: StickyNote },
  { to: '/calendar', label: 'Schedule', icon: Calendar },
  { to: '/analytics',label: 'Insights', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function TopNavPill() {
  const { user, logout } = useAuth();
  const { tasks, notes, events } = useData();
  const navigate = useNavigate();

  const [query, setQuery]           = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const desktopSearchBoxRef   = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchBoxRef    = useRef(null);
  const mobileSearchInputRef  = useRef(null);
  const profileRef            = useRef(null);
  const desktopNotifRef       = useRef(null);
  const mobileNotifRef        = useRef(null);
  const quickAddRef           = useRef(null);

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  }

  /* ── close on outside click ── */
  useEffect(() => {
    function onDown(e) {
      const inDesktopSearch = desktopSearchBoxRef.current && desktopSearchBoxRef.current.contains(e.target);
      const inMobileSearch  = mobileSearchBoxRef.current && mobileSearchBoxRef.current.contains(e.target);
      if (!inDesktopSearch && !inMobileSearch) setSearchOpen(false);

      const inDesktopNotif  = desktopNotifRef.current && desktopNotifRef.current.contains(e.target);
      const inMobileNotif   = mobileNotifRef.current && mobileNotifRef.current.contains(e.target);
      if (!inDesktopNotif && !inMobileNotif) setNotifOpen(false);

      if (profileRef.current    && !profileRef.current.contains(e.target))    setProfileOpen(false);
      if (quickAddRef.current   && !quickAddRef.current.contains(e.target))   setQuickAddOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
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

  const dueSoon = tasks.filter(
    t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) <= new Date(Date.now() + 86400000)
  );

  const initials = (user?.name || user?.email || 'OD')
    .split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP NAV  (md+)
      ════════════════════════════════════════════ */}
      <header className="hidden md:flex fixed top-4 inset-x-0 z-40 justify-center px-6 pointer-events-none">
        <div
          className="pointer-events-auto relative flex items-center gap-3 px-3 py-2 transition-all duration-300"
          style={{
            background:     'var(--bg-card)',
            borderRadius:   '20px',
            border:         '1px solid var(--border-card)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow:      '0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset',
            width:          'fit-content',
            maxWidth:       '860px',
          }}
        >
          {/* ── LEFT CLUSTER: Logo + Notifications ─────────── */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div
                className="h-7 w-7 rounded-[10px] p-[1.5px] grid place-items-center shadow-md transition-transform group-hover:scale-105"
                style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 10px var(--accent-glow)' }}
              >
                <div
                  className="h-full w-full rounded-[8px] grid place-items-center text-[11px] font-bold"
                  style={{ background: 'var(--bg-page)', color: 'var(--accent-color)' }}
                >✦</div>
              </div>
              <span
                className="font-display text-sm font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >OneDesk</span>
            </Link>

            {/* Divider */}
            <div className="h-4 w-px mx-1" style={{ background: 'var(--border-card)' }} />

            {/* Notification Bell */}
            <div className="relative" ref={desktopNotifRef}>
              <button
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); setQuickAddOpen(false); setSearchOpen(false); }}
                className="relative h-[30px] w-[30px] rounded-[10px] flex items-center justify-center transition-all hover:brightness-125 active:scale-95"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                aria-label="Notifications"
              >
                <Bell size={13} />
                {dueSoon.length > 0 && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-[1.5px] ring-[var(--bg-card)]" />
                )}
              </button>

              {notifOpen && (
                <div
                  className="absolute left-0 mt-2.5 w-72 rounded-2xl border shadow-2xl p-3 animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)' }}
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
                    <ul className="space-y-1.5 max-h-56 overflow-y-auto">
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
            className="flex items-center gap-0.5 px-1 py-1 rounded-[14px]"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 rounded-[10px] text-[11px] font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'shadow-sm'
                      : 'hover:opacity-90'
                  }`
                }
                style={({ isActive }) => isActive
                  ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }
                  : { color: 'var(--text-muted)' }
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-3 rounded-full"
                        style={{ background: 'var(--accent-gradient)', boxShadow: '0 0 6px var(--accent-glow)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── RIGHT CLUSTER: Search + Add + Account ─── */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Search — single morphing pill, spring-width transition */}
            <div className="relative" ref={desktopSearchBoxRef}>
              {/* The pill itself — width springs open/closed */}
              <div
                className="flex items-center overflow-hidden rounded-[10px] border"
                style={{
                  height: '30px',
                  width: searchOpen ? '192px' : '30px',
                  /* Spring easing: fast out, slight overshoot, then settle */
                  transition: 'width 0.42s cubic-bezier(0.34, 1.45, 0.64, 1), border-color 0.25s ease, background 0.25s ease',
                  background: searchOpen ? 'var(--bg-card)' : 'var(--bg-surface)',
                  borderColor: searchOpen ? 'var(--border-card)' : 'var(--border-subtle)',
                  boxShadow: searchOpen ? '0 2px 12px rgba(0,0,0,0.25)' : 'none',
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
                  className="h-full w-[30px] shrink-0 flex items-center justify-center transition-colors duration-200"
                  style={{ color: searchOpen ? 'var(--accent-color)' : 'var(--text-muted)' }}
                >
                  <Search size={13} />
                </button>

                {/* Input — fades in after pill opens */}
                <input
                  ref={desktopSearchInputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 min-w-0 bg-transparent text-[11px] outline-none"
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
                  className="h-7 w-7 shrink-0 flex items-center justify-center"
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
                  <X size={11} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && query.trim() && (
                <div
                  className="absolute right-0 top-full mt-2.5 w-80 rounded-2xl border shadow-2xl p-3 space-y-3 animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)' }}
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

            {/* Quick Add — plus icon expands to options */}
            <div className="relative" ref={quickAddRef}>
              <button
                onClick={() => { setQuickAddOpen(v => !v); setProfileOpen(false); setNotifOpen(false); setSearchOpen(false); }}
                className="h-[30px] w-[30px] rounded-[10px] flex items-center justify-center transition-all hover:brightness-110 active:scale-95 text-white"
                style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 12px var(--accent-glow)' }}
                aria-label="Quick add"
              >
                <Plus
                  size={16}
                  style={{ transition: 'transform 0.2s ease', transform: quickAddOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                />
              </button>

              {quickAddOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-48 rounded-2xl border shadow-2xl overflow-hidden animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)' }}
                >
                  <div className="px-3 pt-2.5 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Create</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {[
                      { label: 'New Task',  icon: CheckSquare, color: 'var(--accent-color)', to: '/tasks' },
                      { label: 'New Note',  icon: FileText,    color: '#34d399',             to: '/notes' },
                      { label: 'New Event', icon: CalendarPlus,color: '#fbbf24',             to: '/calendar' },
                    ].map(({ label, icon: Icon, color, to }) => (
                      <button
                        key={to}
                        onClick={() => { setQuickAddOpen(false); navigate(to); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span
                          className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${color}20`, color }}
                        >
                          <Icon size={13} />
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thin divider */}
            <div className="h-4 w-px" style={{ background: 'var(--border-card)' }} />

            {/* Account + Settings merged */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); setQuickAddOpen(false); setSearchOpen(false); }}
                className="flex items-center gap-1.5 rounded-[12px] px-2 py-1 transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="h-5 w-5 rounded-[7px] grid place-items-center text-white text-[9px] font-black shrink-0"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {initials || <UserIcon size={10} />}
                </div>
                <span className="text-[11px] font-semibold max-w-[72px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-52 rounded-2xl border shadow-2xl animate-menu-pop z-50 overflow-hidden"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)' }}
                >
                  {/* User info */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <div
                        className="h-8 w-8 rounded-[10px] grid place-items-center text-white text-xs font-black shrink-0"
                        style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 8px var(--accent-glow)' }}
                      >
                        {initials}
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
      <header className="md:hidden fixed top-0 inset-x-0 z-40">
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background:     'var(--bg-card)',
            borderBottom:   '1px solid var(--border-subtle)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Left: Logo + Name */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div
              className="h-7 w-7 rounded-[10px] p-[1.5px] grid place-items-center shadow-md"
              style={{ background: 'var(--accent-gradient)', boxShadow: '0 2px 8px var(--accent-glow)' }}
            >
              <div
                className="h-full w-full rounded-[8px] grid place-items-center text-[11px] font-bold"
                style={{ background: 'var(--bg-page)', color: 'var(--accent-color)' }}
              >✦</div>
            </div>
            <span className="font-display text-sm font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              OneDesk
            </span>
          </Link>

          {/* Right: Notifications + Search morphing pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Notification Bell */}
            <div className="relative" ref={mobileNotifRef}>
              <button
                type="button"
                onClick={() => { setNotifOpen(v => !v); setSearchOpen(false); }}
                className="relative h-8 w-8 rounded-[10px] flex items-center justify-center transition-all active:scale-95 border"
                style={{
                  background: notifOpen ? 'var(--bg-card)' : 'var(--bg-surface)',
                  borderColor: notifOpen ? 'var(--border-card)' : 'var(--border-subtle)',
                  color: notifOpen ? 'var(--accent-color)' : 'var(--text-muted)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                aria-label="Notifications"
              >
                <Bell size={14} />
                {dueSoon.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-[1.5px] ring-[var(--bg-card)]" />
                )}
              </button>

              {/* Mobile Notification Dropdown */}
              {notifOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-72 rounded-2xl border shadow-2xl p-3 animate-menu-pop z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
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
                    <ul className="space-y-1.5 max-h-56 overflow-y-auto">
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

            {/* Mobile Search morphing pill */}
            <div className="relative flex items-center" ref={mobileSearchBoxRef}>
            <div
              className="flex items-center overflow-hidden rounded-[10px] border"
              style={{
                height: '32px',
                width: searchOpen ? '180px' : '32px',
                transition: 'width 0.42s cubic-bezier(0.34, 1.45, 0.64, 1), border-color 0.25s ease, background 0.25s ease',
                background: searchOpen ? 'var(--bg-surface)' : 'var(--bg-surface)',
                borderColor: searchOpen ? 'var(--border-card)' : 'var(--border-subtle)',
                boxShadow: searchOpen ? '0 2px 12px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(v => {
                    const next = !v;
                    if (next) setTimeout(() => mobileSearchInputRef.current?.focus(), 220);
                    return next;
                  });
                }}
                className="h-full w-8 shrink-0 flex items-center justify-center transition-colors duration-200"
                style={{ color: searchOpen ? 'var(--accent-color)' : 'var(--text-muted)' }}
              >
                <Search size={14} />
              </button>

              <input
                ref={mobileSearchInputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 min-w-0 bg-transparent text-[12px] outline-none"
                style={{
                  color: 'var(--text-primary)',
                  opacity: searchOpen ? 1 : 0,
                  transition: 'opacity 0.18s ease',
                  transitionDelay: searchOpen ? '0.18s' : '0s',
                  pointerEvents: searchOpen ? 'auto' : 'none',
                }}
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (query) {
                    setQuery('');
                    mobileSearchInputRef.current?.focus();
                  } else {
                    setSearchOpen(false);
                  }
                }}
                className="h-full w-8 shrink-0 flex items-center justify-center"
                style={{
                  color: 'var(--text-muted)',
                  opacity: searchOpen ? 0.55 : 0,
                  transition: 'opacity 0.15s ease',
                  transitionDelay: searchOpen ? '0.22s' : '0s',
                  pointerEvents: searchOpen ? 'auto' : 'none',
                }}
              >
                <X size={12} />
              </button>
            </div>

            {/* Mobile search results dropdown */}
            {searchOpen && query.trim() && (
              <div
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl p-3 space-y-3 animate-menu-pop z-50"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', backdropFilter: 'blur(28px)' }}
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
        </div>
      </div>
    </header>

      {/* ════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR  (< md)
      ════════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 animate-tab-bar pb-safe"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Bleed gradient above bar */}
        <div
          className="absolute inset-x-0 -top-8 h-8 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-page), transparent)' }}
        />
        <div
          className="mx-3 mb-3 flex items-center justify-around rounded-[22px] px-1 py-2 border"
          style={{
            background:     'var(--bg-card)',
            borderColor:    'var(--border-card)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow:      '0 -4px 32px rgba(0,0,0,0.35)',
          }}
        >
          {mobileLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-[14px] transition-all ${
                  isActive ? '' : 'opacity-50 hover:opacity-80'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'var(--bg-surface)', color: 'var(--accent-color)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[9px] font-bold tracking-wide">{label}</span>
                  {isActive && (
                    <span
                      className="h-1 w-3 rounded-full"
                      style={{ background: 'var(--accent-gradient)', boxShadow: '0 0 6px var(--accent-glow)' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
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
