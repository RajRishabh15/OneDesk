import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Layers,
  Clock,
  Plus,
  PlusCircle,
  Check,
  ArrowUpRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Flame,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Calendar as CalendarIcon,
  Trash2,
  Zap,
  CheckCircle2,
  Save
} from 'lucide-react';

// Use local date to avoid UTC timezone shift for IST (+5:30)
function localISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

import Modal from '../components/Modal';
import { LabeledInput } from './Notes';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const priorityPill = {
  High: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  Medium: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  Low: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, notes, events, setTaskStatus, addTask, deleteTask, addNote, addEvent } = useData();

  // Quick Task & Modal States
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState('Medium');
  const [inlineCategory, setInlineCategory] = useState('Focus');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Today' | 'High' | 'Completed'

  // Scratchpad Tab in Right Column ('notes' | 'scratchpad')
  const [notesTab, setNotesTab] = useState('notes');
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('lifeos_dashboard_scratchpad') || '';
  });
  const [scratchpadSaved, setScratchpadSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('lifeos_dashboard_scratchpad', scratchpadText);
  }, [scratchpadText]);

  function handleSaveScratchpadAsNote() {
    if (!scratchpadText.trim()) return;
    const lines = scratchpadText.trim().split('\n');
    const title = lines[0].slice(0, 50) || 'Quick Scratchpad Note';
    const description = lines.slice(1).join('\n').trim() || lines[0];
    addNote({
      title,
      description,
      category: 'Personal',
      tags: 'scratchpad,quick',
      color: 'violet',
    });
    setScratchpadSaved(true);
    setTimeout(() => setScratchpadSaved(false), 2200);
  }

  // Modals Forms
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date().toISOString().slice(0, 10),
    category: 'Work',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    category: 'work',
    description: '',
  });

  // Focus Sprint / Pomodoro Mini-Timer State
  // Modes: 25m ('pomodoro'), 45m ('deep'), 5m ('break'), 15m ('sprint')
  const [timerPreset, setTimerPreset] = useState('25m');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  function handleToggleTimer() {
    if (timerSeconds === 0) {
      setTimerSeconds(timerTotalSeconds);
    }
    setTimerActive((prev) => !prev);
  }

  function handleSelectPreset(preset, seconds) {
    setTimerActive(false);
    setTimerPreset(preset);
    setTimerTotalSeconds(seconds);
    setTimerSeconds(seconds);
  }

  const timerPct = Math.round(((timerTotalSeconds - timerSeconds) / timerTotalSeconds) * 100);

  const formattedTimer = `${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(
    timerSeconds % 60
  ).padStart(2, '0')}`;

  // Date and Tasks calculations
  const today = useMemo(() => localISO(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return localISO(d);
  }, []);

  const completed = tasks.filter((t) => t.status === 'Completed');
  const pending = tasks.filter((t) => t.status !== 'Completed');
  const inProgress = tasks.filter((t) => t.status === 'In Progress');
  const highPriorityPending = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed');
  const todaysEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Filtered tasks for the focus checklist
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Today') {
      return tasks.filter((t) => t.dueDate === today && t.status !== 'Completed');
    }
    if (activeFilter === 'High') {
      return highPriorityPending;
    }
    if (activeFilter === 'Completed') {
      return completed.slice(0, 10);
    }
    return pending.slice(0, 9);
  }, [tasks, activeFilter, today, highPriorityPending, completed, pending]);

  // Nearest upcoming deadline (task or event, today or future)
  const nextDeadline = useMemo(() => {
    const all = [
      ...events.filter((e) => e.date >= today).map((e) => ({ ...e, isTask: false })),
      ...tasks
        .filter((t) => t.dueDate && t.dueDate >= today && t.status !== 'Completed')
        .map((t) => ({ id: t.id, title: t.title, date: t.dueDate, time: '', isTask: true })),
    ];
    return (
      all.sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))[0] || null
    );
  }, [events, tasks, today]);

  function relativeDay(iso) {
    if (!iso) return '';
    if (iso === today) return 'Today';
    if (iso === tomorrow) return 'Tomorrow';
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const pct = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 100;

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  let greetingTime = 'Good morning';
  let GreetingIcon = Sun;
  if (hour < 5) {
    greetingTime = 'Good night';
    GreetingIcon = Moon;
  } else if (hour < 12) {
    greetingTime = 'Good morning';
    GreetingIcon = Sunrise;
  } else if (hour < 17) {
    greetingTime = 'Good afternoon';
    GreetingIcon = Sun;
  } else if (hour < 21) {
    greetingTime = 'Good evening';
    GreetingIcon = Sunset;
  } else {
    greetingTime = 'Good night';
    GreetingIcon = Moon;
  }

  const displayName = user?.name || 'Rishabh';

  // Format today's date banner string
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Calculate day of year / week number
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((new Date() - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);

  function handleQuickTaskAdd(e) {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;
    addTask({
      title: inlineTaskTitle.trim(),
      priority: inlinePriority,
      dueDate: today,
      status: 'Todo',
      category: inlineCategory,
    });
    setInlineTaskTitle('');
  }

  function handleModalTaskSubmit(e) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    addTask({
      ...taskForm,
      title: taskForm.title.trim(),
      status: 'Todo',
    });
    setTaskModalOpen(false);
    setTaskForm({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: today,
      category: 'Work',
    });
  }

  function handleModalEventSubmit(e) {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    addEvent({
      ...eventForm,
      title: eventForm.title.trim(),
      reminder: false,
    });
    setEventModalOpen(false);
    setEventForm({
      title: '',
      date: today,
      time: '10:00',
      category: 'work',
      description: '',
    });
  }

  // Active target task for focus sprint
  const targetFocusTask = highPriorityPending[0] || pending[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up max-w-7xl mx-auto pb-12">

      {/* ══════════════════════════════════════════════════════════════
          1. TOP ROW: FLUID SQUARE GREETING (LEFT) + 4 WIDGETS 2x2 (RIGHT)
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left: Fluid Square "Good morning" Box (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative rounded-[28px] sm:rounded-[32px] glass-panel-fluid p-6 sm:p-7 md:p-8 overflow-hidden flex flex-col justify-between h-full before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-indigo-400/50 before:to-transparent">
            {/* Ambient Floating Light Orbs */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl animate-float-orb" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl animate-float-orb-slow" />

            {/* Top: Status Capsule & Date */}
            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Live Workspace</span>
                  <span className="opacity-40">•</span>
                  <span className="font-semibold text-emerald-400">
                    {pending.length} focus active
                  </span>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <CalendarIcon size={12} className="opacity-70" />
                  <span>{todayFormatted}</span>
                  <span className="opacity-40">•</span>
                  <span>W{weekNumber}</span>
                </div>
              </div>

              {/* Greeting Headline */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl grid place-items-center border shadow-inner transition-transform hover:rotate-6 duration-300 shrink-0"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-card)',
                    }}
                  >
                    <GreetingIcon size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black tracking-tight leading-tight">
                    {greetingTime},{' '}
                    <span
                      className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-sm"
                      style={{
                        backgroundImage: 'var(--accent-gradient, linear-gradient(135deg, #818cf8, #c084fc))',
                      }}
                    >
                      {displayName}
                    </span>
                  </h1>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {highPriorityPending.length > 0 ? (
                    <span>
                      You have <strong className="text-rose-400 font-semibold">{highPriorityPending.length} high-priority</strong>{' '}
                      {highPriorityPending.length === 1 ? 'item' : 'items'} queued. Focus on the essentials first.
                    </span>
                  ) : pending.length > 0 ? (
                    <span>
                      Workspace running clean with <strong className="text-cyan-400 font-semibold">{pending.length} active</strong> tasks on track.
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">
                      ✨ All scheduled items completed! Peak flow achieved.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom: Action Buttons */}
            <div className="relative z-10 flex items-center gap-2.5 pt-5 flex-wrap">
              <button
                onClick={() => setTaskModalOpen(true)}
                className="group flex items-center gap-2 rounded-full font-bold text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'var(--accent-gradient)',
                  boxShadow: '0 4px 20px var(--accent-glow)',
                }}
              >
                <PlusCircle size={15} className="transition-transform group-hover:rotate-90 duration-300" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => {
                  const timerEl = document.getElementById('focus-sprint-station');
                  timerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  if (!timerActive) handleToggleTimer();
                }}
                className="glass-btn-fluid flex items-center gap-2 rounded-full font-semibold text-xs px-3.5 sm:px-4 py-2.5 transition-all"
                style={{ color: 'var(--text-primary)' }}
              >
                <Zap size={14} className="text-amber-400 fill-amber-400/20" />
                <span>{timerActive ? 'Sprint Active' : 'Focus Sprint'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right: 4 Stat Widgets in 2x2 Grid (lg:col-span-7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-full">
          
          {/* Card 1: PENDING TASKS */}
          <div className="relative rounded-[24px] glass-panel-fluid p-5 group flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-pink-500/60 before:to-transparent hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
                PENDING TASKS
              </span>
              <div className="h-8 w-8 rounded-xl bg-pink-500/15 text-pink-400 grid place-items-center transition-transform group-hover:scale-110">
                <TrendingUp size={15} />
              </div>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {pending.length}
              </p>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                of {tasks.length} total
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {highPriorityPending.length} High
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {tasks.filter((t) => t.priority === 'Medium' && t.status !== 'Completed').length} Med
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tasks.filter((t) => t.priority === 'Low' && t.status !== 'Completed').length} Low
              </span>
            </div>
          </div>

          {/* Card 2: ACTIVE FOCUS */}
          <div className="relative rounded-[24px] glass-panel-fluid p-5 group flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-cyan-500/60 before:to-transparent hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
                ACTIVE FOCUS
              </span>
              <div className="h-8 w-8 rounded-xl bg-cyan-500/15 text-cyan-400 grid place-items-center transition-transform group-hover:scale-110">
                <Layers size={15} />
              </div>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {inProgress.length || (pending.length > 0 ? 1 : 0)}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                In Progress
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 font-mono">
              <span className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                {highPriorityPending[0]?.title || pending[0]?.title || 'All focus items clear'}
              </span>
            </div>
          </div>

          {/* Card 3: NEXT DEADLINE */}
          <Link
            to="/calendar"
            className="relative rounded-[24px] glass-panel-fluid p-5 group flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-amber-500/60 before:to-transparent hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
                NEXT DEADLINE
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-400 grid place-items-center transition-transform group-hover:scale-110">
                <Clock size={15} />
              </div>
            </div>

            <p className="text-base sm:text-lg font-bold tracking-tight my-2 truncate group-hover:text-amber-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
              {nextDeadline?.title || 'No upcoming tasks'}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 font-mono">
              <span style={{ color: 'var(--text-muted)' }}>
                {nextDeadline?.isTask ? 'Task due' : 'Event'}
              </span>
              <span className="font-extrabold text-amber-400 flex items-center gap-1">
                {nextDeadline ? `${relativeDay(nextDeadline.date)}${nextDeadline.time ? ' · ' + nextDeadline.time : ''}` : 'All clear'}
                <ArrowUpRight size={12} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Card 4: HEALTH INDEX */}
          <div className="relative rounded-[24px] glass-panel-fluid p-5 group flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/60 before:to-transparent hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
                HEALTH INDEX
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-400 grid place-items-center transition-transform group-hover:scale-110">
                <Flame size={15} />
              </div>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {pct}
              </p>
              <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                / 100
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 font-mono">
              <span style={{ color: 'var(--text-muted)' }}>Velocity Rating</span>
              <span className="font-bold text-emerald-400">
                {pct >= 80 ? 'Peak Flow 🔥' : pct >= 50 ? 'Steady ⚡' : 'Building Up 🌱'}
              </span>
            </div>
          </div>

        </div>

      </div>


      {/* ══════════════════════════════════════════════════════════════
          3. MAIN TWO-COLUMN DECK: FOCUS CHECKLIST & REALIGNED WIDGETS
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* ───────────────────────────────────────────────────────────
            LEFT COLUMN (7 COLS): FOCUS CHECKLIST & PRIORITY STREAM
        ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-[28px] glass-panel-fluid p-6 sm:p-7 relative overflow-hidden flex flex-col h-full">
            
            {/* Header: Title + Filter Pills + View All */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Focus Checklist & Priorities
                  </h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold"
                    style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {filteredTasks.length}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Interactive priority stream for your active workspace
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/tasks"
                  className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent-color, #818cf8)' }}
                >
                  Kanban Board <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'All', label: 'All Pending' },
                { id: 'Today', label: 'Due Today' },
                { id: 'High', label: 'High Priority' },
                { id: 'Completed', label: 'Completed' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                    activeFilter === pill.id
                      ? 'shadow-sm text-white'
                      : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                  style={
                    activeFilter === pill.id
                      ? {
                          background: 'var(--accent-gradient)',
                          boxShadow: '0 2px 10px var(--accent-glow)',
                        }
                      : {
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                        }
                  }
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Fast Inline Task Add Bar */}
            <form
              onSubmit={handleQuickTaskAdd}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all mb-4 focus-within:ring-1"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="h-5 w-5 rounded-full border border-dashed border-stone-400 flex items-center justify-center shrink-0">
                <Plus size={12} style={{ color: 'var(--text-muted)' }} />
              </div>

              <input
                id="dashboard-inline-task"
                type="text"
                value={inlineTaskTitle}
                onChange={(e) => setInlineTaskTitle(e.target.value)}
                placeholder="Quick-add a focus task... (Press Enter ↵)"
                className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-stone-400"
                style={{ color: 'var(--text-primary)' }}
              />

              {/* Priority toggle inside input */}
              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={inlinePriority}
                  onChange={(e) => setInlinePriority(e.target.value)}
                  className="text-[11px] font-bold rounded-lg px-2 py-1 outline-none border cursor-pointer"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: inlinePriority === 'High' ? '#f43f5e' : inlinePriority === 'Medium' ? '#f59e0b' : '#10b981',
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={inlineCategory}
                  onChange={(e) => setInlineCategory(e.target.value)}
                  className="text-[11px] font-bold rounded-lg px-2 py-1 outline-none border cursor-pointer hidden sm:block"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <option value="Focus">Focus</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>

                {inlineTaskTitle.trim() && (
                  <button
                    type="submit"
                    className="text-xs font-bold text-white px-3.5 py-1 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
                    style={{ background: 'var(--accent-gradient)' }}
                  >
                    Save
                  </button>
                )}
              </div>
            </form>

            {/* Checklist Items Stream (Expanded & Fluid) */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[560px] pr-1">
              {filteredTasks.length === 0 ? (
                <div
                  className="h-full min-h-[260px] flex flex-col items-center justify-center py-12 px-4 rounded-2xl text-center border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 mb-3 shadow-inner">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {activeFilter === 'Completed'
                      ? 'No tasks completed yet'
                      : activeFilter === 'High'
                      ? 'No high-priority tasks pending'
                      : 'All focus tasks clear'}
                  </p>
                  <p className="text-xs mt-1 max-w-sm" style={{ color: 'var(--text-muted)' }}>
                    {activeFilter === 'Completed'
                      ? 'Mark tasks done to see your accomplishment stream.'
                      : 'Capture a new task above or launch a Focus Sprint to stay in peak flow.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isDone = task.status === 'Completed';
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 group hover:scale-[1.005]"
                      style={{
                        background: isDone ? 'rgba(255,255,255,0.02)' : 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {/* Left: Checkbox + Title & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => setTaskStatus(task.id, isDone ? 'Todo' : 'Completed')}
                          className={`h-5 w-5 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                              : 'border border-stone-400 hover:border-emerald-400 hover:bg-emerald-500/20 text-transparent hover:text-emerald-400'
                          }`}
                          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-medium truncate transition-all ${
                              isDone ? 'line-through opacity-45' : ''
                            }`}
                            style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}
                          >
                            {task.title}
                          </p>

                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {task.dueDate && (
                              <span
                                className={
                                  task.dueDate < today && !isDone
                                    ? 'text-rose-400 font-bold'
                                    : task.dueDate === today
                                    ? 'text-amber-400 font-semibold'
                                    : ''
                                }
                              >
                                Due {relativeDay(task.dueDate)}
                              </span>
                            )}
                            <span>•</span>
                            <span>{task.category || 'Focus'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Priority Pill + Delete on hover */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            priorityPill[task.priority] || priorityPill.Medium
                          }`}
                        >
                          {task.priority}
                        </span>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-all"
                          title="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────
            RIGHT COLUMN (5 COLS): REALIGNED THREE MODERN BOXES
        ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          {/* ══════════════════════════════════════════════════════════
              Box 1: Focus Sprint Station (Redesigned & Interactive)
          ══════════════════════════════════════════════════════════ */}
          <div id="focus-sprint-station" className="rounded-[28px] glass-panel-fluid p-6 relative overflow-hidden">
            
            {/* Header: Title + Presets */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-400 grid place-items-center shadow-xs">
                  <Zap size={16} className="fill-amber-400/20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Focus Sprint Station
                  </h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Cadenced intervals for uninterrupted flow
                  </p>
                </div>
              </div>

              {/* Interval Preset Switcher */}
              <div
                className="flex items-center p-0.5 rounded-xl border text-[11px] font-bold"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {[
                  { label: '15m', sec: 15 * 60 },
                  { label: '25m', sec: 25 * 60 },
                  { label: '45m', sec: 45 * 60 },
                  { label: '5m', sec: 5 * 60 },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSelectPreset(p.label, p.sec)}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      timerPreset === p.label ? 'bg-indigo-500 text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Center Stage */}
            <div
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div>
                <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono" style={{ color: 'var(--text-primary)' }}>
                  {formattedTimer}
                </span>
                <p className="text-[11px] mt-0.5 truncate max-w-[190px]" style={{ color: 'var(--text-muted)' }}>
                  {timerActive ? (
                    <span className="text-emerald-400 font-semibold">⚡ Sprint underway — stay focused</span>
                  ) : targetFocusTask ? (
                    <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{targetFocusTask.title}</strong></span>
                  ) : (
                    <span>Deep Work Cadence</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleTimer}
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                    timerActive
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/25'
                  }`}
                  title={timerActive ? 'Pause sprint' : 'Start sprint'}
                >
                  {timerActive ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-white" />}
                </button>

                <button
                  onClick={() => handleSelectPreset(timerPreset, timerTotalSeconds)}
                  className="h-11 w-11 rounded-2xl glass-btn-fluid flex items-center justify-center transition-transform hover:rotate-45"
                  title="Reset sprint"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Glowing Micro Progress Bar */}
            <div className="mt-3 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${timerPct}%`,
                  background: timerPreset === '5m' ? '#10b981' : 'var(--accent-gradient)',
                }}
              />
            </div>
          </div>


          {/* ══════════════════════════════════════════════════════════
              Box 2: Today's Agenda & Schedule Timeline
          ══════════════════════════════════════════════════════════ */}
          <div className="rounded-[28px] glass-panel-fluid p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/15 text-indigo-400 grid place-items-center">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Today's Agenda & Schedule
                  </h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {todaysEvents.length} {todaysEvents.length === 1 ? 'event' : 'events'} queued for today
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEventModalOpen(true)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold glass-btn-fluid flex items-center gap-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Plus size={12} />
                  <span>Event</span>
                </button>
                <Link
                  to="/calendar"
                  className="text-xs font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent-color, #818cf8)' }}
                >
                  Calendar <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>

            {todaysEvents.length === 0 ? (
              <div
                className="py-6 px-4 rounded-2xl text-center border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  No calendar events scheduled today
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Your schedule is wide open for uninterrupted focus.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaysEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-3 rounded-2xl border transition-all hover:bg-white/[0.04]"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_6px_#818cf8]" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {evt.title}
                        </p>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {evt.time || 'All Day'} • {evt.category || 'General'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-medium shrink-0">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* ══════════════════════════════════════════════════════════
              Box 3: Quick Notes & Live Scratchpad (Realigned & Functional)
          ══════════════════════════════════════════════════════════ */}
          <div className="rounded-[28px] glass-panel-fluid p-6 relative overflow-hidden flex-1 flex flex-col">
            
            {/* Header with Switcher Tabs */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-pink-500/15 text-pink-400 grid place-items-center">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {notesTab === 'notes' ? 'Recent Notes' : 'Live Scratchpad'}
                  </h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {notesTab === 'notes' ? 'Your latest thoughts & docs' : 'Auto-saving instant notepad'}
                  </p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div
                className="flex items-center p-0.5 rounded-xl border text-[11px] font-bold"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setNotesTab('notes')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    notesTab === 'notes' ? 'bg-pink-500 text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setNotesTab('scratchpad')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    notesTab === 'scratchpad' ? 'bg-indigo-500 text-white shadow-xs' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  Scratchpad
                </button>
              </div>
            </div>

            {/* Tab 1: Recent Notes Cards */}
            {notesTab === 'notes' ? (
              <div className="space-y-2 flex-1">
                {recentNotes.length === 0 ? (
                  <div
                    className="py-8 px-4 rounded-2xl text-center border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      No notes authored yet
                    </p>
                    <Link
                      to="/notes"
                      className="text-xs font-semibold text-pink-400 hover:underline mt-1 inline-block"
                    >
                      + Create your first note
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {recentNotes.map((note) => (
                      <Link
                        key={note.id}
                        to="/notes"
                        className="p-3 rounded-2xl border hover:border-white/20 transition-all group block"
                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-semibold truncate group-hover:text-pink-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {note.title || 'Untitled Note'}
                          </p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/5 border border-white/5 font-mono" style={{ color: 'var(--text-muted)' }}>
                            {note.category || 'Note'}
                          </span>
                        </div>
                        <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {note.description || note.content || 'No content...'}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-right">
                  <Link
                    to="/notes"
                    className="text-xs font-semibold inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--accent-color, #818cf8)' }}
                  >
                    All Notes <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              /* Tab 2: Live Scratchpad Area */
              <div className="flex flex-col flex-1 space-y-2">
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Jot down quick ideas, phone numbers, or fleeting thoughts here... (Auto-saved)"
                  rows={4}
                  className="w-full rounded-2xl p-3 text-xs sm:text-sm bg-transparent outline-none border resize-none focus:border-indigo-400/50 transition-all leading-relaxed"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />

                <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
                  <span style={{ color: 'var(--text-muted)' }}>
                    {scratchpadSaved ? (
                      <span className="text-emerald-400 font-bold">✓ Saved to notes!</span>
                    ) : (
                      <span>{scratchpadText.length} characters • Auto-saved</span>
                    )}
                  </span>

                  {scratchpadText.trim() && (
                    <button
                      onClick={handleSaveScratchpadAsNote}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                      style={{ background: 'var(--accent-gradient)' }}
                    >
                      <Save size={12} />
                      <span>Save as Note</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. CREATE NEW TASK MODAL
      ══════════════════════════════════════════════════════════════ */}
      <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Create New Task">
        <form onSubmit={handleModalTaskSubmit} className="space-y-4">
          <LabeledInput
            label="Task Title"
            placeholder="e.g. Design sprint review slides"
            value={taskForm.title}
            onChange={(v) => setTaskForm((f) => ({ ...f, title: v }))}
            required
          />
          <LabeledInput
            label="Description"
            placeholder="Brief details or bullet points..."
            value={taskForm.description}
            onChange={(v) => setTaskForm((f) => ({ ...f, description: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm((f) => ({ ...f, priority: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="High" style={{ background: 'var(--bg-card)' }}>High</option>
                <option value="Medium" style={{ background: 'var(--bg-card)' }}>Medium</option>
                <option value="Low" style={{ background: 'var(--bg-card)' }}>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setTaskModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
              style={{
                background: 'var(--accent-gradient)',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════
          5. SCHEDULE EVENT MODAL
      ══════════════════════════════════════════════════════════════ */}
      <Modal open={eventModalOpen} onClose={() => setEventModalOpen(false)} title="Schedule New Event">
        <form onSubmit={handleModalEventSubmit} className="space-y-4">
          <LabeledInput
            label="Event Title"
            placeholder="e.g. Design review meeting"
            value={eventForm.title}
            onChange={(v) => setEventForm((f) => ({ ...f, title: v }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Date
              </label>
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Time
              </label>
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Category
            </label>
            <select
              value={eventForm.category}
              onChange={(e) => setEventForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="work" style={{ background: 'var(--bg-card)' }}>Work</option>
              <option value="meeting" style={{ background: 'var(--bg-card)' }}>Meeting</option>
              <option value="personal" style={{ background: 'var(--bg-card)' }}>Personal</option>
              <option value="urgent" style={{ background: 'var(--bg-card)' }}>Urgent</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setEventModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
              style={{
                background: 'var(--accent-gradient)',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
            >
              Save Event
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
