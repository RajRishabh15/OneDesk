import { useMemo, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronUp,
  Bell,
  LogOut,
  User as UserIcon,
  Gamepad2,
  LayoutGrid,
  MoreHorizontal,
  CircleCheck,
  CalendarDays,
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
  Plus,
  Palette,
  Key,
  Database,
  Trash2,
  MessageSquareHeart,
  ExternalLink,
  Info,
  Navigation,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import OneDeskLogo from './OneDeskLogo';

/* ── Searchable Pages Registry ─────────────────────────── */
const PAGE_ITEMS = [
  {
    id: 'page-home',
    label: 'Home Dashboard',
    description: 'Workspace command center, glanceable metrics & focus tasks',
    keywords: ['home', 'dashboard', 'overview', 'main', 'start', 'metrics', 'glance', 'focus'],
    icon: Home,
    path: '/',
    color: '#818cf8',
  },
  {
    id: 'page-tasks',
    label: 'Tasks & Todo',
    description: 'Organize to-do items, track priorities, statuses & deadlines',
    keywords: ['tasks', 'todo', 'task list', 'to do', 'checklist', 'work', 'kanban', 'priority', 'status', 'deadline'],
    icon: CheckSquare,
    path: '/tasks',
    color: '#f43f5e',
  },
  {
    id: 'page-notes',
    label: 'Notes & Notebook',
    description: 'Capture markdown drafts, quick ideas & personal journal entries',
    keywords: ['notes', 'notebook', 'drafts', 'journal', 'scratchpad', 'ideas', 'docs', 'text', 'markdown', 'write'],
    icon: StickyNote,
    path: '/notes',
    color: '#10b981',
  },
  {
    id: 'page-calendar',
    label: 'Schedule & Calendar',
    description: 'Daily agenda, timeblocking, calendar milestones & events',
    keywords: ['schedule', 'calendar', 'agenda', 'planner', 'timeline', 'timeblock', 'meetings', 'events', 'date', 'month', 'week'],
    icon: Calendar,
    path: '/calendar',
    color: '#f59e0b',
  },
  {
    id: 'page-funzone',
    label: 'Fun Zone Arcade',
    description: 'Retro mini games & focus micro-breaks to recharge',
    keywords: ['fun', 'zone', 'funzone', 'game', 'games', 'arcade', 'play', 'break', 'breaktime', 'retro', 'mini games', 'chill'],
    icon: Gamepad2,
    path: '/fun-zone',
    badge: 'NEW',
    color: '#ec4899',
  },
  {
    id: 'page-appearance',
    label: 'Themes & Appearance',
    description: 'Explore 11 workspace themes, notebook styling & canvas waves',
    keywords: ['appearance', 'themes', 'styles', 'colors', 'palettes', 'notebook style', 'dark mode', 'light mode', 'design'],
    icon: Palette,
    path: '/settings/appearance',
    color: '#06b6d4',
  },
  {
    id: 'page-settings',
    label: 'Settings & Preferences',
    description: 'Account profile, sound chimes, alerts, privacy & feedback',
    keywords: ['settings', 'preferences', 'configuration', 'options', 'account', 'profile', 'sound', 'haptics'],
    icon: Settings,
    path: '/settings',
    color: '#a855f7',
  },
  {
    id: 'page-landing',
    label: 'OneDesk Landing Page',
    description: 'Redesigned public landing page, feature showcase & highlights',
    keywords: ['landing', 'landing page', 'welcome', 'showcase', 'website', 'features', 'intro', 'about onedesk', 'preview'],
    icon: Sparkles,
    path: '/landing',
    badge: 'SHOWCASE',
    color: '#3b82f6',
  },
];

/* ── Searchable Quick Actions Registry ─────────────────── */
const ACTION_ITEMS = [
  {
    id: 'action-task',
    label: '+ Create New Task',
    description: 'Add an action item with priority & due date',
    keywords: ['new task', 'add task', 'create task', '+ task', 'make task', 'schedule task'],
    icon: CheckSquare,
    action: 'newTask',
    path: '/tasks',
    color: '#f43f5e',
  },
  {
    id: 'action-note',
    label: '+ Create Quick Note',
    description: 'Capture markdown thoughts or journal draft',
    keywords: ['new note', 'add note', 'create note', '+ note', 'write note', 'journal entry'],
    icon: FileText,
    action: 'newNote',
    path: '/notes',
    color: '#10b981',
  },
  {
    id: 'action-event',
    label: '+ Schedule Calendar Event',
    description: 'Block time on your daily schedule or calendar',
    keywords: ['schedule event', 'new event', 'add event', '+ event', 'block time', 'meeting', 'book slot'],
    icon: CalendarPlus,
    action: 'newEvent',
    path: '/calendar',
    color: '#f59e0b',
  },
  {
    id: 'action-feedback',
    label: 'Share User Feedback',
    description: 'Direct Google Form link to suggest features & report issues',
    keywords: ['feedback', 'share feedback', 'google form', 'form', 'gform', 'survey', 'report issue', 'suggest', 'review', 'rating'],
    icon: MessageSquareHeart,
    url: 'https://forms.gle/SBwAELPdwsbXjFpk8',
    external: true,
    badge: 'GOOGLE FORM',
    color: '#ec4899',
  },
];

/* ── Searchable Settings & System Registry ─────────────── */
const SETTINGS_ITEMS = [
  {
    id: 'profile',
    label: 'Profile & Account',
    description: 'Update display name, avatar picture, Google account',
    keywords: ['profile', 'name', 'avatar', 'photo', 'picture', 'account', 'user', 'display', 'google photo'],
    icon: UserIcon,
    path: '/settings',
    navState: { openModal: 'editProfile' },
    color: '#818cf8',
  },
  {
    id: 'password',
    label: 'Password & Security',
    description: 'Update password, reset credentials & enhance data security',
    keywords: ['password', 'security', 'login', 'change password', 'reset', 'credentials', 'auth', 'protection', 'forgot password'],
    icon: Key,
    path: '/settings',
    navState: { openModal: 'changePassword' },
    color: '#f59e0b',
  },
  {
    id: 'appearance',
    label: 'Appearance & Themes',
    description: '11 themes, ruled notebook styles, dark mode & background waves',
    keywords: ['theme', 'dark', 'light', 'appearance', 'color', 'notebook', 'style', 'palette', 'mode', 'background', 'wave'],
    icon: Palette,
    path: '/settings/appearance',
    color: '#34d399',
  },
  {
    id: 'sensory',
    label: 'Sensory & Audio Dynamics',
    description: 'Audio chimes, tactile spring physics & ambient waves',
    keywords: ['sound', 'audio', 'chime', 'bell', 'sound effects', 'haptic', 'spring', 'physics', 'wave', 'sensory', 'dynamics'],
    icon: Sparkles,
    path: '/settings',
    color: '#06b6d4',
  },
  {
    id: 'notifications',
    label: 'Notifications & Alerts',
    description: 'Browser desktop notifications for deadlines & schedule',
    keywords: ['notification', 'alert', 'reminder', 'deadline', 'bell', 'push', 'desktop', 'browser alert'],
    icon: Bell,
    path: '/settings',
    color: '#f472b6',
  },
  {
    id: 'feedback-section',
    label: 'User Feedback & Suggestions',
    description: 'Submit feedback via Google Form or suggest improvements',
    keywords: ['feedback', 'user feedback', 'google form', 'gform', 'survey', 'form', 'suggestions', 'report', 'support'],
    icon: MessageSquareHeart,
    path: '/settings',
    url: 'https://forms.gle/SBwAELPdwsbXjFpk8',
    color: '#ec4899',
  },
  {
    id: 'app-info',
    label: 'App Info (v1.11.26)',
    description: 'Build #OD1.11-1, release notes & all systems normal status',
    keywords: ['info', 'app info', 'version', 'build', 'v1.11', 'od1.11-1', 'release date', 'system info', 'status', 'changelog', 'developer', 'updates', 'whats new'],
    icon: Info,
    path: '/settings',
    navState: { openModal: 'changelog' },
    badge: 'v1.11.26',
    color: '#10b981',
  },
  {
    id: 'danger',
    label: 'Delete Account (Danger Zone)',
    description: 'Permanently wipe workspace account and cloud data',
    keywords: ['delete', 'account', 'remove', 'danger', 'terminate', 'deactivate', 'wipe', 'danger zone'],
    icon: Trash2,
    path: '/settings',
    navState: { openModal: 'deleteAccount' },
    color: '#f87171',
  },
];

/* ── Searchable theme keywords ─────────────────────────── */
const THEME_SEARCH_KEYWORDS = {
  dark: ['dark', 'midnight', 'indigo', 'night', 'deep', 'black', 'dark mode', 'standard dark'],
  light: ['light', 'daylight', 'day', 'stone', 'white', 'bright', 'light mode', 'standard light'],
  'notebook-light': ['notebook', 'notebook light', 'journal', 'parchment', 'paper', 'writer', 'book', 'sepia', 'ruled paper', 'study', 'ivory'],
  'notebook-dark': ['notebook', 'notebook dark', 'journal', 'obsidian', 'brass', 'leather', 'dark notebook', 'dark journal', 'spine', 'vintage'],
  aurora: ['aurora', 'green', 'emerald', 'mint', 'northern lights', 'forest', 'nature'],
  ocean: ['ocean', 'blue', 'cyan', 'sea', 'water', 'aqua', 'marine', 'deep blue'],
  rose: ['rose', 'rosé', 'pink', 'blush', 'red', 'cream', 'pastel', 'wine'],
  amber: ['amber', 'ember', 'gold', 'orange', 'warm', 'honey', 'sunset', 'autumn'],
  peacock: ['peacock', 'teal', 'turquoise', 'cyan', 'green', 'blue', 'sea', 'feather'],
  lavender: ['lavender', 'violet', 'purple', 'lilac', 'plum', 'dream'],
  babypink: ['baby pink', 'babypink', 'pink', 'pastel', 'cotton candy', 'sakura', 'sweet pink'],
};

const navLinks = [
  { to: '/',          label: 'Home',     icon: Home,        end: true },
  { to: '/tasks',     label: 'Tasks',    icon: CheckSquare },
  { to: '/notes',     label: 'Notes',    icon: StickyNote },
  { to: '/calendar',  label: 'Schedule', icon: Calendar },
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
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isNotebook = theme === 'notebook-light' || theme === 'notebook-dark';
  const isLight = theme === 'light' || theme === 'notebook-light';

  const [query, setQuery]                       = useState('');
  const [searchOpen, setSearchOpen]             = useState(false);
  const [profileOpen, setProfileOpen]           = useState(false);
  const [notifOpen, setNotifOpen]               = useState(false);
  const [quickAddOpen, setQuickAddOpen]         = useState(false);
  const [mobileQuickSheetOpen, setMobileQuickSheetOpen] = useState(false);
  const location = useLocation();
  const touchStartY = useRef(0);

  useEffect(() => {
    setMobileQuickSheetOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobileQuickSheetOpen) {
        setMobileQuickSheetOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileQuickSheetOpen]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 60) {
      if (playChime) playChime('pop');
      setMobileQuickSheetOpen(false);
    }
  };

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
      navigate('/', { replace: true });
    }
  }

  /* ── Helper to dismiss all top nav dropdowns safely ── */
  function closeAllDropdowns() {
    setProfileOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
    setQuickAddOpen(false);
  }

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
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        isDefault: true,
        pages: PAGE_ITEMS.slice(0, 4),
        actions: ACTION_ITEMS,
        settings: SETTINGS_ITEMS.slice(0, 4),
        themes: THEMES.filter(t => !t.comingSoon).slice(0, 4),
        tasks: tasks.slice(0, 3),
        notes: notes.slice(0, 3),
        events: events.slice(0, 3),
      };
    }

    const isGenericThemeSearch = ['theme', 'themes', 'palette', 'palettes', 'color', 'colors', 'mode', 'modes', 'look', 'skin'].includes(q);
    const isGenericPageSearch = ['page', 'pages', 'navigate', 'goto', 'go to', 'open', 'view', 'screen'].includes(q);
    const isGenericActionSearch = ['action', 'actions', 'create', 'new', 'add', '+', 'quick', 'make'].includes(q);
    const isGenericSettingsSearch = ['setting', 'settings', 'config', 'preference', 'preferences', 'option', 'options', 'system'].includes(q);

    return {
      isDefault: false,
      pages: PAGE_ITEMS.filter(p => {
        if (isGenericPageSearch) return true;
        const nameNorm = p.label.toLowerCase();
        const descNorm = p.description.toLowerCase();
        const kw = p.keywords || [];
        return nameNorm.includes(q) || descNorm.includes(q) || kw.some(k => k.includes(q) || q.includes(k));
      }),
      actions: ACTION_ITEMS.filter(a => {
        if (isGenericActionSearch) return true;
        const nameNorm = a.label.toLowerCase();
        const descNorm = a.description.toLowerCase();
        const kw = a.keywords || [];
        return nameNorm.includes(q) || descNorm.includes(q) || kw.some(k => k.includes(q) || q.includes(k));
      }),
      settings: SETTINGS_ITEMS.filter(s => {
        if (isGenericSettingsSearch) return true;
        const nameNorm = s.label.toLowerCase();
        const descNorm = s.description.toLowerCase();
        const kw = s.keywords || [];
        return nameNorm.includes(q) || descNorm.includes(q) || kw.some(k => k.includes(q) || q.includes(k));
      }),
      themes: THEMES.filter(t => {
        if (t.comingSoon) return false;
        if (isGenericThemeSearch) return true;
        const kw = THEME_SEARCH_KEYWORDS[t.id] || [];
        const nameNorm = t.name.toLowerCase();
        const descNorm = t.description?.toLowerCase() || '';
        const idNorm = t.id.toLowerCase();
        const modeNorm = t.mode?.toLowerCase() || '';

        return (
          nameNorm.includes(q) ||
          idNorm.includes(q) ||
          descNorm.includes(q) ||
          modeNorm === q ||
          kw.some(k => k.includes(q) || q.includes(k))
        );
      }),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
      notes: notes.filter(n => n.title.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q)),
      events: events.filter(ev => ev.title.toLowerCase().includes(q) || ev.description?.toLowerCase().includes(q)),
    };
  }, [query, notes, tasks, events]);

  const totalResultsCount =
    results.pages.length +
    results.actions.length +
    results.settings.length +
    results.themes.length +
    results.tasks.length +
    results.notes.length +
    results.events.length;

  function handleSelectSearchResult(item, type) {
    if (playChime) playChime('pop');
    setSearchOpen(false);
    setQuery('');

    if (type === 'theme') {
      setTheme(item);
      if (playChime) playChime('success');
      return;
    }

    if (item.url && item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.action === 'newTask') {
      navigate('/tasks', { state: { createTask: true } });
      return;
    }
    if (item.action === 'newNote') {
      navigate('/notes', { state: { createNote: true } });
      return;
    }
    if (item.action === 'newEvent') {
      navigate('/calendar', { state: { createEvent: true } });
      return;
    }

    if (item.path) {
      navigate(item.path, { state: item.navState || {} });
      return;
    }

    if (type === 'task') {
      navigate('/tasks');
      return;
    }
    if (type === 'note') {
      navigate('/notes');
      return;
    }
    if (type === 'event') {
      navigate('/calendar');
      return;
    }
  }

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
      {/* ── Global Dismiss Backdrop for Open Dropdowns (Absorbs Dismissal Clicks, Prevents Misclicks / Overclicks) ── */}
      {(profileOpen || notifOpen || searchOpen || quickAddOpen) && (
        <div
          className="fixed inset-0 z-30 pointer-events-auto select-none cursor-default"
          aria-hidden="true"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAllDropdowns();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAllDropdowns();
          }}
        />
      )}
      {/* ════════════════════════════════════════════
          DESKTOP NAV  (md+)
      ════════════════════════════════════════════ */}
      <header className="hidden md:flex fixed top-4 sm:top-5 inset-x-0 z-40 justify-center px-6 pointer-events-none">
        <div
          className={`pointer-events-auto relative flex items-center gap-3 px-4 sm:px-5 py-2.5 transition-all duration-300${isNotebook ? ' nb-bookmark-pill' : ''}`}
          style={{
            background:     'var(--bg-card-solid)',
            borderRadius:   '24px',
            border:         '1px solid var(--border-card)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow:      isNotebook
              ? '0 6px 28px rgba(120,80,30,0.18), 0 1px 0 rgba(255,255,255,0.06) inset'
              : '0 12px 45px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset',
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
                        style={{ background: 'var(--accent-gradient)' }}
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
              {searchOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2.5 w-[420px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-2xl p-3.5 space-y-3 animate-menu-pop z-50 max-h-[72vh] overflow-y-auto custom-scrollbar"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-card)',
                    backdropFilter: 'blur(36px)',
                    WebkitBackdropFilter: 'blur(36px)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.08) inset',
                  }}
                >
                  <SearchDropdownView
                    results={results}
                    query={query}
                    totalCount={totalResultsCount}
                    theme={theme}
                    onSelect={handleSelectSearchResult}
                    onSeeCategory={(cat) => handleSelectSearchResult(null, cat)}
                  />
                </div>
              )}
            </div>

            {/* Fun Zone — game icon navigates to /fun-zone */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setQuickAddOpen(false); setProfileOpen(false); setNotifOpen(false); setSearchOpen(false); navigate('/fun-zone'); }}
                className="h-[34px] w-[34px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-white"
                style={{
                  background: 'var(--accent-gradient)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                aria-label="Fun Zone"
                title="Fun Zone"
              >
                <Gamepad2
                  size={17}
                  strokeWidth={2.2}
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
                  boxShadow: 'none',
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
                  onClick={(e) => e.stopPropagation()}
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
                        style={{ background: 'var(--accent-gradient)' }}
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
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 active:scale-90 cursor-pointer"
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
                    className="relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer"
                    style={{
                      background: notifOpen ? 'var(--bg-card-solid)' : 'var(--bg-surface)',
                      borderColor: notifOpen ? 'var(--accent-color)' : 'var(--border-subtle)',
                      color: notifOpen ? 'var(--accent-color)' : 'var(--text-muted)',
                      boxShadow: 'none',
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
                  className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer"
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
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer p-0.5 overflow-hidden"
                    style={{
                      background: profileOpen ? 'var(--bg-card-solid)' : 'var(--bg-surface)',
                      borderColor: profileOpen ? 'var(--accent-color)' : 'var(--border-subtle)',
                      boxShadow: 'none',
                    }}
                    aria-label="Account Profile"
                  >
                    <div
                      className="h-full w-full rounded-full overflow-hidden grid place-items-center text-white text-[11px] font-black shrink-0 select-none shadow-sm"
                      style={{ background: 'var(--accent-gradient)' }}
                    >
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user?.name || 'User'}
                          className="h-full w-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials || <UserIcon size={12} />
                      )}
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
            className="fixed inset-x-3.5 top-[62px] max-w-sm mx-auto rounded-2xl border shadow-2xl p-4 space-y-3 animate-menu-pop z-50 overflow-y-auto max-h-[70vh]"
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
            {results.themes.length > 0 && (
              <ThemeSearchGroup
                items={results.themes}
                currentTheme={theme}
                onSelect={(themeId) => {
                  setTheme(themeId);
                  if (playChime) playChime('success');
                  setSearchOpen(false);
                  setQuery('');
                }}
              />
            )}
            {results.settings.length > 0 && (
              <SettingsSearchGroup
                items={results.settings}
                onSelect={(item) => { if (playChime) playChime('pop'); setSearchOpen(false); setQuery(''); navigate(item.path, { state: item.navState || {} }); }}
              />
            )}
            <SearchGroup label="Tasks"    count={results.tasks.length}  items={results.tasks.map(t  => t.title)}  onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/tasks'); }} />
            <SearchGroup label="Notes"    count={results.notes.length}  items={results.notes.map(n  => n.title)}  onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/notes'); }} />
            <SearchGroup label="Schedule" count={results.events.length} items={results.events.map(e => e.title)} onSee={() => { if (playChime) playChime('pop'); setSearchOpen(false); navigate('/calendar'); }} />
            {results.notes.length + results.tasks.length + results.events.length + results.settings.length + results.themes.length === 0 && (
              <p className="text-xs py-3 text-center" style={{ color: 'var(--text-muted)' }}>No results for &ldquo;{query}&rdquo;.</p>
            )}
          </div>
        )}

        {/* Mobile Profile Dropdown */}
        {profileOpen && (
          <div
            ref={mobileProfileDropdownRef}
            onClick={(e) => e.stopPropagation()}
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
                  style={{ background: 'var(--accent-gradient)' }}
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
          Clean Theme-Adaptive Floating Dock (No Glass, No Glow)
      ════════════════════════════════════════════ */}
      <nav
        className={`md:hidden fixed bottom-3 inset-x-3.5 max-w-[420px] mx-auto select-none ${(profileOpen || notifOpen || searchOpen) ? 'z-20 pointer-events-none' : 'z-40'}`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Simple Squircle Dock Shell — 100% Theme Adaptive (No Glass Gimmicks) */}
        <div
          className="relative w-full h-[64px] rounded-[24px] border px-2 grid grid-cols-5 items-center justify-items-center transition-all duration-200 z-10"
          style={{
            background: 'var(--bg-card-solid)',
            borderColor: 'var(--border-card)',
            boxShadow: isLight
              ? '0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)'
              : '0 12px 30px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            onClick={() => playChime && playChime('pop')}
            className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer select-none active:scale-95 transition-transform"
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-[52px] h-[32px] rounded-[16px] flex items-center justify-center transition-all duration-200 relative"
                  style={{
                    background: isActive
                      ? (isLight
                          ? 'color-mix(in srgb, var(--accent-color) 16%, transparent)'
                          : 'color-mix(in srgb, var(--accent-color) 22%, transparent)')
                      : 'transparent',
                  }}
                >
                  <LayoutGrid
                    size={18}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className="transition-colors duration-200"
                    style={{
                      color: isActive
                        ? (isLight ? 'var(--accent-color)' : '#ffffff')
                        : 'var(--text-muted)',
                    }}
                  />
                </div>
                <span
                  className="text-[11px] tracking-tight mt-1 leading-none transition-colors duration-200"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? (isLight ? 'var(--accent-color)' : '#ffffff')
                      : 'var(--text-muted)',
                  }}
                >
                  Home
                </span>
              </>
            )}
          </NavLink>

          {/* 2. Tasks */}
          <NavLink
            to="/tasks"
            onClick={() => playChime && playChime('pop')}
            className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer select-none active:scale-95 transition-transform"
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-[52px] h-[32px] rounded-[16px] flex items-center justify-center transition-all duration-200 relative"
                  style={{
                    background: isActive
                      ? (isLight
                          ? 'color-mix(in srgb, var(--accent-color) 16%, transparent)'
                          : 'color-mix(in srgb, var(--accent-color) 22%, transparent)')
                      : 'transparent',
                  }}
                >
                  <CircleCheck
                    size={18}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className="transition-colors duration-200"
                    style={{
                      color: isActive
                        ? (isLight ? 'var(--accent-color)' : '#ffffff')
                        : 'var(--text-muted)',
                    }}
                  />
                </div>
                <span
                  className="text-[11px] tracking-tight mt-1 leading-none transition-colors duration-200"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? (isLight ? 'var(--accent-color)' : '#ffffff')
                      : 'var(--text-muted)',
                  }}
                >
                  Tasks
                </span>
              </>
            )}
          </NavLink>

          {/* 3. More (Quick Sheet Trigger — Resting Pill) */}
          <button
            type="button"
            onClick={() => {
              if (playChime) playChime('pop');
              setMobileQuickSheetOpen(prev => !prev);
            }}
            className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer select-none active:scale-95 transition-transform"
            aria-label="More actions"
          >
            <div
              className="w-[52px] h-[32px] rounded-[16px] flex items-center justify-center transition-all duration-200 relative"
              style={{
                background: mobileQuickSheetOpen
                  ? (isLight
                      ? 'color-mix(in srgb, var(--accent-color) 16%, transparent)'
                      : 'color-mix(in srgb, var(--accent-color) 22%, transparent)')
                  : (isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)'),
              }}
            >
              <MoreHorizontal
                size={18}
                strokeWidth={2.3}
                className="transition-colors duration-200"
                style={{
                  color: mobileQuickSheetOpen
                    ? (isLight ? 'var(--accent-color)' : '#ffffff')
                    : 'var(--text-muted)',
                }}
              />
            </div>
            <span
              className="text-[11px] tracking-tight mt-1 leading-none transition-colors duration-200"
              style={{
                fontWeight: mobileQuickSheetOpen ? 700 : 500,
                color: mobileQuickSheetOpen
                  ? (isLight ? 'var(--accent-color)' : '#ffffff')
                  : 'var(--text-muted)',
              }}
            >
              More
            </span>
          </button>

          {/* 4. Planner */}
          <NavLink
            to="/calendar"
            onClick={() => playChime && playChime('pop')}
            className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer select-none active:scale-95 transition-transform"
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-[52px] h-[32px] rounded-[16px] flex items-center justify-center transition-all duration-200 relative"
                  style={{
                    background: isActive
                      ? (isLight
                          ? 'color-mix(in srgb, var(--accent-color) 16%, transparent)'
                          : 'color-mix(in srgb, var(--accent-color) 22%, transparent)')
                      : 'transparent',
                  }}
                >
                  <CalendarDays
                    size={18}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className="transition-colors duration-200"
                    style={{
                      color: isActive
                        ? (isLight ? 'var(--accent-color)' : '#ffffff')
                        : 'var(--text-muted)',
                    }}
                  />
                </div>
                <span
                  className="text-[11px] tracking-tight mt-1 leading-none transition-colors duration-200"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? (isLight ? 'var(--accent-color)' : '#ffffff')
                      : 'var(--text-muted)',
                  }}
                >
                  Planner
                </span>
              </>
            )}
          </NavLink>

          {/* 5. Notes */}
          <NavLink
            to="/notes"
            onClick={() => playChime && playChime('pop')}
            className="flex flex-col items-center justify-center w-full h-full py-1 group cursor-pointer select-none active:scale-95 transition-transform"
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-[52px] h-[32px] rounded-[16px] flex items-center justify-center transition-all duration-200 relative"
                  style={{
                    background: isActive
                      ? (isLight
                          ? 'color-mix(in srgb, var(--accent-color) 16%, transparent)'
                          : 'color-mix(in srgb, var(--accent-color) 22%, transparent)')
                      : 'transparent',
                  }}
                >
                  <FileText
                    size={18}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className="transition-colors duration-200"
                    style={{
                      color: isActive
                        ? (isLight ? 'var(--accent-color)' : '#ffffff')
                        : 'var(--text-muted)',
                    }}
                  />
                </div>
                <span
                  className="text-[11px] tracking-tight mt-1 leading-none transition-colors duration-200"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? (isLight ? 'var(--accent-color)' : '#ffffff')
                      : 'var(--text-muted)',
                  }}
                >
                  Notes
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          FLUID MOBILE MORE BOTTOM SHEET
          Clean Theme-Adaptive Sheet (No Glass Reflections, No Border Glow)
      ════════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex items-end justify-center sheet-container-smooth ${
          mobileQuickSheetOpen ? 'open' : ''
        }`}
        aria-hidden={!mobileQuickSheetOpen}
      >
        {/* Subtle Backdrop with buttery fade */}
        <div
          className="fixed inset-0 bg-black/60 sheet-backdrop-smooth"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileQuickSheetOpen(false);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileQuickSheetOpen(false);
          }}
        />

        {/* Sheet Panel — 100% Theme Adaptive Canvas with Butter-Smooth Slide Up & Down */}
        <div
          className="relative w-full rounded-t-[32px] border-t border-x p-5 pt-3.5 sheet-panel-smooth z-10 max-h-[85vh] overflow-y-auto custom-scrollbar overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-card)',
              boxShadow: isLight
                ? '0 -10px 30px rgba(0, 0, 0, 0.08)'
                : '0 -12px 36px rgba(0, 0, 0, 0.65)',
              paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom, 1.75rem))',
            }}
          >
            {/* Minimal Centered Drag Handle */}
            <div
              className="h-1.5 w-12 rounded-full mx-auto mb-4 opacity-30"
              style={{ background: 'var(--text-muted)' }}
            />

            {/* Header: Theme Dot + Title + Subtitle + Close Button */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: 'var(--accent-color)' }}
                  />
                  <h3
                    className="text-[17px] font-bold tracking-tight font-display"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    More
                  </h3>
                </div>
                <p
                  className="text-xs font-normal mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Settings, themes &amp; arcade
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileQuickSheetOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center border transition-all active:scale-90 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* 3 Theme-Consistent Action Cards (Clean, No Glow) */}
            <div className="space-y-2.5 relative z-10">
              {/* 1. Settings */}
              <button
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setMobileQuickSheetOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-[20px] border transition-all duration-200 text-left active:scale-[0.98] group relative overflow-hidden cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: 'var(--bg-card-solid)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    <Settings size={20} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[15px] font-bold tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Settings
                    </div>
                    <div
                      className="text-xs leading-relaxed mt-0.5 break-words"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Preferences, account &amp; sensory controls
                    </div>
                  </div>
                </div>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* 2. Themes */}
              <button
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setMobileQuickSheetOpen(false);
                  navigate('/appearance');
                }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-[20px] border transition-all duration-200 text-left active:scale-[0.98] group relative overflow-hidden cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: 'var(--bg-card-solid)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    <Palette size={20} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="text-[15px] font-bold tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Themes
                      </div>
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider transition-all"
                        style={{
                          background: 'var(--bg-card-solid)',
                          borderColor: 'var(--accent-color)',
                          color: 'var(--accent-color)',
                        }}
                      >
                        {(THEMES.find(t => t.id === theme)?.name || theme).toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="text-xs leading-relaxed mt-0.5 break-words"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Color palettes, styling &amp; visual effects
                    </div>
                  </div>
                </div>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* 3. Fun Zone */}
              <button
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setMobileQuickSheetOpen(false);
                  navigate('/fun-zone');
                }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-[20px] border transition-all duration-200 text-left active:scale-[0.98] group relative overflow-hidden cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: 'var(--bg-card-solid)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    <Gamepad2 size={20} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[15px] font-bold tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Fun Zone
                    </div>
                    <div
                      className="text-xs leading-relaxed mt-0.5 break-words"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Arcade mini games &amp; focus micro-breaks
                    </div>
                  </div>
                </div>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>
          </div>
        </div>
    </>
  );
}

/* ── Unified Search Dropdown View ── */
function SearchDropdownView({ results, query, totalCount, theme, onSelect, onSeeCategory }) {
  const isDefault = results.isDefault;

  return (
    <div className="space-y-3.5">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          {isDefault ? (
            <>
              <Compass size={13} style={{ color: 'var(--accent-color)' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Quick Launcher &amp; Actions
              </span>
            </>
          ) : (
            <>
              <Search size={13} style={{ color: 'var(--accent-color)' }} />
              <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Results for &ldquo;{query}&rdquo;
              </span>
              <span
                className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--accent-color) 15%, transparent)',
                  color: 'var(--accent-color)',
                }}
              >
                {totalCount}
              </span>
            </>
          )}
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {isDefault ? 'Explore' : 'Global Search'}
        </span>
      </div>

      {/* Pages Section */}
      {results.pages && results.pages.length > 0 && (
        <PageSearchGroup items={results.pages} onSelect={onSelect} />
      )}

      {/* Quick Actions Section */}
      {results.actions && results.actions.length > 0 && (
        <ActionSearchGroup items={results.actions} onSelect={onSelect} />
      )}

      {/* Settings Section */}
      {results.settings && results.settings.length > 0 && (
        <SettingsSearchGroup items={results.settings} onSelect={onSelect} />
      )}

      {/* Themes Section */}
      {results.themes && results.themes.length > 0 && (
        <ThemeSearchGroup
          items={results.themes}
          currentTheme={theme}
          onSelect={(themeId) => onSelect(themeId, 'theme')}
        />
      )}

      {/* User Data Sections */}
      {!isDefault && (
        <>
          <SearchGroup
            label="Tasks"
            count={results.tasks.length}
            items={results.tasks.map(t => t.title)}
            onSee={() => onSeeCategory('task')}
          />
          <SearchGroup
            label="Notes"
            count={results.notes.length}
            items={results.notes.map(n => n.title)}
            onSee={() => onSeeCategory('note')}
          />
          <SearchGroup
            label="Schedule"
            count={results.events.length}
            items={results.events.map(e => e.title)}
            onSee={() => onSeeCategory('event')}
          />
        </>
      )}

      {/* Empty State */}
      {!isDefault && totalCount === 0 && (
        <div className="py-6 px-4 text-center">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Try searching for <span style={{ color: 'var(--accent-color)' }}>tasks</span>, <span style={{ color: 'var(--accent-color)' }}>notes</span>, <span style={{ color: 'var(--accent-color)' }}>themes</span>, <span style={{ color: 'var(--accent-color)' }}>funzone</span>, <span style={{ color: 'var(--accent-color)' }}>feedback</span>, or <span style={{ color: 'var(--accent-color)' }}>app info</span>.
          </p>
        </div>
      )}

      {/* Footer shortcut tip */}
      <div className="pt-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border font-mono text-[9px]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>Esc</kbd> dismiss
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border font-mono text-[9px]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>Ctrl+K</kbd> search anytime
        </span>
      </div>
    </div>
  );
}

/* ── Pages search result group ── */
function PageSearchGroup({ items, onSelect }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Navigation size={10} style={{ color: 'var(--accent-color)' }} />
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Pages &amp; Navigation <span className="opacity-60">({items.length})</span>
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              onClick={() => onSelect(item, 'page')}
              className="flex items-start gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer group transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 mt-0.5"
                style={{
                  background: `${item.color}18`,
                  borderColor: `${item.color}35`,
                  color: item.color,
                }}
              >
                <Icon size={13} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-[11.5px] leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--accent-color) 15%, transparent)',
                        color: 'var(--accent-color)',
                        border: '1px solid color-mix(in srgb, var(--accent-color) 30%, transparent)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10.5px] leading-relaxed break-words mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </div>
              </div>
              <ArrowRight size={12} className="shrink-0 opacity-30 group-hover:opacity-80 transition-opacity self-center mt-1" style={{ color: 'var(--accent-color)' }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Actions search result group ── */
function ActionSearchGroup({ items, onSelect }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={10} style={{ color: '#fbbf24' }} />
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Quick Actions <span className="opacity-60">({items.length})</span>
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              onClick={() => onSelect(item, 'action')}
              className="flex items-start gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer group transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 mt-0.5"
                style={{
                  background: `${item.color}18`,
                  borderColor: `${item.color}35`,
                  color: item.color,
                }}
              >
                <Icon size={13} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-[11.5px] leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0"
                      style={{
                        background: 'rgba(236,72,153,0.15)',
                        color: '#ec4899',
                        border: '1px solid rgba(236,72,153,0.3)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.external && (
                    <ExternalLink size={10} className="opacity-60 shrink-0" />
                  )}
                </div>
                <div className="text-[10.5px] leading-relaxed break-words mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </div>
              </div>
              <ArrowRight size={12} className="shrink-0 opacity-30 group-hover:opacity-80 transition-opacity self-center mt-1" style={{ color: 'var(--accent-color)' }} />
            </li>
          );
        })}
      </ul>
    </div>
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
        <button onClick={onSee} className="text-[10px] font-semibold cursor-pointer hover:underline" style={{ color: 'var(--accent-color)' }}>
          View all
        </button>
      </div>
      <ul className="space-y-1">
        {items.slice(0, 4).map((t, i) => (
          <li
            key={i}
            onClick={onSee}
            className="text-xs leading-snug break-words py-1.5 px-2.5 rounded-lg cursor-pointer transition-colors"
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

/* ── Settings search result group ── */
function SettingsSearchGroup({ items, onSelect }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Settings size={10} style={{ color: 'var(--text-muted)' }} />
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Settings &amp; System <span className="opacity-60">({items.length})</span>
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              onClick={() => onSelect(item, 'setting')}
              className="flex items-start gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer group transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 mt-0.5"
                style={{
                  background: `${item.color}18`,
                  borderColor: `${item.color}35`,
                  color: item.color,
                }}
              >
                <Icon size={13} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-[11.5px] leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[8px] font-extrabold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--accent-color) 15%, transparent)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.url && (
                    <ExternalLink size={10} className="opacity-60 shrink-0" />
                  )}
                </div>
                <div className="text-[10.5px] leading-relaxed break-words mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </div>
              </div>
              <ArrowRight size={12} className="shrink-0 opacity-30 group-hover:opacity-80 transition-opacity self-center mt-1" style={{ color: 'var(--accent-color)' }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Theme search result group ── */
function ThemeSearchGroup({ items, currentTheme, onSelect }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Palette size={10} style={{ color: 'var(--accent-color)' }} />
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Themes <span className="opacity-60">({items.length})</span>
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((t) => {
          const isActive = currentTheme === t.id;
          const [bg, surface, accent] = t.preview || ['#000', '#222', '#6366f1'];
          const isWhite = t.id === 'light' || t.id === 'notebook-light';

          return (
            <li
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="flex items-start gap-2.5 text-xs py-2 px-2.5 rounded-xl cursor-pointer group transition-all"
              style={{
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-surface)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Mini color swatch preview */}
              <div
                className="w-7 h-5 rounded-md shrink-0 border relative overflow-hidden flex items-end p-0.5 shadow-xs transition-transform group-hover:scale-105 mt-1"
                style={{
                  background: bg,
                  borderColor: isWhite ? '#d6cdc0' : 'rgba(255,255,255,0.18)',
                }}
              >
                <div
                  className="w-full h-1.5 rounded-sm opacity-80"
                  style={{ background: surface }}
                />
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white/20 shadow-xs"
                  style={{ background: accent }}
                />
              </div>

              {/* Theme title & description */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="font-semibold text-[11.5px] leading-snug break-words"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t.name}
                  </span>
                  {isActive && (
                    <span
                      className="text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                      style={{
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <div
                  className="text-[10.5px] leading-relaxed break-words mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t.description}
                </div>
              </div>

              {/* Action */}
              <div className="self-center mt-0.5 shrink-0">
                {isActive ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-color)', color: '#fff' }}
                    title="Currently active"
                  >
                    <Check size={11} strokeWidth={2.8} />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 transition-all opacity-85 group-hover:opacity-100 group-hover:scale-105 active:scale-95"
                    style={{
                      background: 'var(--accent-gradient)',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(t.id);
                    }}
                  >
                    Apply
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
