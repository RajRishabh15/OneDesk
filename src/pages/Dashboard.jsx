import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Check,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

// Local date string to prevent timezone offset issues
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

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, notes, events, setTaskStatus, addTask, deleteTask, addNote, addEvent } = useData();

  // Modals & form state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState('Medium');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const priorityRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Today' | 'Completed'

  // Close priority dropdown on outside click
  useEffect(() => {
    function onDown(e) {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Right column tab ('scratchpad' | 'notes')
  const [sideTab, setSideTab] = useState('scratchpad');
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('lifeos_dashboard_scratchpad') || '';
  });
  const [scratchpadSaved, setScratchpadSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('lifeos_dashboard_scratchpad', scratchpadText);
  }, [scratchpadText]);

  function handleSaveScratchpad() {
    if (!scratchpadText.trim()) return;
    const lines = scratchpadText.trim().split('\n');
    const title = lines[0].slice(0, 50) || 'Quick Scratchpad Note';
    const description = lines.slice(1).join('\n').trim() || lines[0];
    addNote({
      title,
      description,
      category: 'Personal',
      tags: 'scratchpad',
      color: 'violet',
    });
    setScratchpadSaved(true);
    setTimeout(() => setScratchpadSaved(false), 2000);
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

  // Date and Time Calculations
  const today = useMemo(() => localISO(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return localISO(d);
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Time-of-day greeting for Typewriter
  const hour = new Date().getHours();
  const timeGreeting = useMemo(() => {
    if (hour < 12) return 'Good morning.';
    if (hour < 17) return 'Good afternoon.';
    if (hour < 22) return 'Good evening.';
    return 'Good night.';
  }, [hour]);

  // Phrases to loop infinitely: [Time Greeting] -> backspace -> [Welcome back.] -> backspace -> loop
  const phrases = useMemo(() => [timeGreeting, 'Welcome back.'], [timeGreeting]);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timer;

    if (!isDeleting) {
      if (charIdx < currentPhrase.length) {
        // Typing characters
        timer = setTimeout(() => {
          setCharIdx((prev) => prev + 1);
        }, 70);
      } else {
        // Finished typing phrase: pause so user can read comfortably
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (charIdx > 0) {
        // Backspacing characters
        timer = setTimeout(() => {
          setCharIdx((prev) => prev - 1);
        }, 38);
      } else {
        // Finished backspacing: brief breath before typing next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx, phrases]);

  const typedGreeting = phrases[phraseIdx].slice(0, charIdx);
  const displayName = user?.name || 'Rishabh';

  // Task & Event metrics
  const completed = tasks.filter((t) => t.status === 'Completed');
  const pending = tasks.filter((t) => t.status !== 'Completed');
  const highPriorityPending = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed');
  const todaysEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const pct = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 100;

  // Filtered task stream
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Today') {
      return tasks.filter((t) => t.dueDate === today && t.status !== 'Completed');
    }
    if (activeFilter === 'Completed') {
      return completed.slice(0, 10);
    }
    return pending.slice(0, 9);
  }, [tasks, activeFilter, today, completed, pending]);

  // Nearest upcoming deadline (task or event)
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

  function handleQuickTaskAdd(e) {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;
    addTask({
      title: inlineTaskTitle.trim(),
      priority: inlinePriority,
      dueDate: today,
      status: 'Todo',
      category: 'Focus',
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

  // Top focus target task
  const targetTask = highPriorityPending[0] || pending[0];

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-up max-w-5xl mx-auto pb-16 pt-2 sm:pt-4">

      {/* ══════════════════════════════════════════════════════════════
          1. CENTERED HERO: TYPEWRITER GREETING -> NAME -> INFO
      ══════════════════════════════════════════════════════════════ */}
      <section className="text-center flex flex-col items-center justify-center space-y-2 py-6 sm:py-12">
        
        {/* 1. Dynamic Typewriter Greeting: Large Hero */}
        <div
          className="inline-flex items-center justify-center text-[clamp(2rem,7vw,5.5rem)] font-black tracking-tight leading-tight select-none text-center max-w-4xl px-2"
          style={{ color: 'var(--text-primary)', minHeight: '1.2em' }}
        >
          <span className="inline-block">{typedGreeting || '\u00A0'}</span>
          <span className="inline-block w-[3px] sm:w-[5px] h-[0.82em] align-middle bg-indigo-400 ml-1.5 sm:ml-2.5 animate-cursor-blink shrink-0" />
        </div>

        {/* 2. User Name */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight pt-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {displayName}
        </h1>

        {/* 3. Other Info */}
        <div
          className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium pt-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>{todayFormatted}</span>
          <span className="opacity-40">•</span>
          <span>
            {pending.length === 0 ? 'All tasks complete' : `${pending.length} focus ${pending.length === 1 ? 'task' : 'tasks'} remaining`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setTaskModalOpen(true)}
            className="btn-glass-primary rounded-full px-4 py-2 text-xs font-semibold"
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>

          <button
            type="button"
            onClick={() => setEventModalOpen(true)}
            className="btn-glass rounded-full px-4 py-2 text-xs font-semibold"
          >
            <CalendarIcon size={13} style={{ color: 'var(--accent-color)' }} />
            <span>Schedule</span>
          </button>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          2. QUICK UPDATES BAR (GLANCEABLE WORKSPACE INTELLIGENCE)
      ══════════════════════════════════════════════════════════════ */}
      <div className="rounded-[28px] glass-panel-fluid p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          
          {/* Quick Update 1: Immediate Priority Task */}
          <div className="sm:px-4 first:pl-0 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Focus Task
              </span>
              {targetTask && (
                <button
                  type="button"
                  onClick={() => setTaskStatus(targetTask.id, 'Completed')}
                  className="btn-glass px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-emerald-400"
                  title="Mark as done"
                >
                  <Check size={11} strokeWidth={2.5} /> Done
                </button>
              )}
            </div>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {targetTask?.title || 'All focus tasks clear'}
            </p>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {pending.length} {pending.length === 1 ? 'task' : 'tasks'} queued
            </span>
          </div>

          {/* Quick Update 2: Upcoming Schedule */}
          <div className="sm:px-4 pt-3 sm:pt-0 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-amber-400 flex items-center gap-1.5">
                <Clock size={11} />
                Next Event
              </span>
              <Link to="/calendar" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5">
                Calendar <ArrowUpRight size={10} />
              </Link>
            </div>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {nextDeadline?.title || 'No upcoming events'}
            </p>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {nextDeadline ? `${relativeDay(nextDeadline.date)}${nextDeadline.time ? ' at ' + nextDeadline.time : ''}` : 'Day is open'}
            </span>
          </div>

          {/* Quick Update 3: Velocity & Momentum */}
          <div className="sm:px-4 last:pr-0 pt-3 sm:pt-0 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1.5">
                <TrendingUp size={11} />
                Daily Velocity
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                {pct}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                +{completed.length} completed
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                • {pending.length} remaining
              </span>
            </div>
            {/* Minimal thin progress bar */}
            <div className="w-full h-1 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: 'var(--accent-gradient)',
                }}
              />
            </div>
          </div>

        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════
          3. MAIN WORKSPACE: FOCUS CHECKLIST & QUIET SIDE PANEL
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column (7 cols): Clean Focus Checklist */}
        <div className="lg:col-span-7 rounded-[28px] glass-panel-fluid p-6 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Focus Tasks
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {filteredTasks.length}
              </span>
            </div>

            {/* Clean minimal text filter */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              {['All', 'Today', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`transition-colors ${
                    activeFilter === tab
                      ? 'text-white border-b-2 border-indigo-400 pb-0.5'
                      : 'hover:text-stone-300'
                  }`}
                  style={{
                    color: activeFilter === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Quick-Add Input */}
          <form
            onSubmit={handleQuickTaskAdd}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all focus-within:border-indigo-400/50"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <input
              type="text"
              value={inlineTaskTitle}
              onChange={(e) => setInlineTaskTitle(e.target.value)}
              placeholder="Add a task for today... (Press Enter ↵)"
              className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-stone-400"
              style={{ color: 'var(--text-primary)' }}
            />

            {/* Custom Frosted Glass Priority Selector */}
            <div className="relative shrink-0" ref={priorityRef}>
              <button
                type="button"
                onClick={() => setPriorityOpen((v) => !v)}
                className="chip-glass px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer select-none"
                style={{
                  color: inlinePriority === 'High' ? '#fb7185' : inlinePriority === 'Medium' ? '#fbbf24' : '#34d399',
                  borderColor: inlinePriority === 'High' ? 'rgba(251,113,133,0.35)' : inlinePriority === 'Medium' ? 'rgba(251,191,36,0.35)' : 'rgba(52,211,153,0.35)',
                  background: inlinePriority === 'High' ? 'rgba(251,113,133,0.12)' : inlinePriority === 'Medium' ? 'rgba(251,191,36,0.12)' : 'rgba(52,211,153,0.12)',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: inlinePriority === 'High' ? '#fb7185' : inlinePriority === 'Medium' ? '#fbbf24' : '#34d399',
                  }}
                />
                <span>{inlinePriority}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${priorityOpen ? 'rotate-180' : ''}`} />
              </button>

              {priorityOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-32 rounded-xl border p-1 shadow-2xl animate-menu-pop z-30 overflow-hidden"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-card)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {[
                    { id: 'High', color: '#fb7185' },
                    { id: 'Medium', color: '#fbbf24' },
                    { id: 'Low', color: '#34d399' },
                  ].map(({ id, color }) => {
                    const isSelected = inlinePriority === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setInlinePriority(id);
                          setPriorityOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-white/10 text-white font-bold'
                            : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                          <span style={{ color: isSelected ? color : undefined }}>{id}</span>
                        </div>
                        {isSelected && <Check size={11} style={{ color }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                <CheckCircle2 size={24} className="mx-auto mb-2 opacity-40 text-emerald-400" />
                <p className="text-xs font-semibold">
                  {activeFilter === 'Completed' ? 'No completed tasks yet' : 'All focus tasks clear'}
                </p>
                <p className="text-[11px] mt-0.5 opacity-70">
                  {activeFilter === 'Completed' ? 'Check off items above to see them here.' : 'Add a task or take a breather.'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isDone = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all hover:bg-white/[0.02] group"
                    style={{
                      background: isDone ? 'rgba(255,255,255,0.01)' : 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => setTaskStatus(task.id, isDone ? 'Todo' : 'Completed')}
                        className={`h-4.5 w-4.5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'border border-stone-400 hover:border-emerald-400 hover:bg-emerald-500/20 text-transparent hover:text-emerald-400'
                        }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </button>

                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium truncate ${
                            isDone ? 'line-through opacity-40' : ''
                          }`}
                          style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}
                        >
                          {task.title}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {task.dueDate && <span>Due {relativeDay(task.dueDate)}</span>}
                          <span>•</span>
                          <span>{task.category || 'General'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            task.priority === 'High'
                              ? '#f43f5e'
                              : task.priority === 'Medium'
                              ? '#f59e0b'
                              : '#10b981',
                        }}
                        title={`Priority: ${task.priority}`}
                      />

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-400 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/tasks"
              className="text-xs font-semibold inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color, #818cf8)' }}
            >
              Open Tasks Board <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Today's Schedule & Scratchpad */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Today's Schedule */}
          <div className="rounded-[28px] glass-panel-fluid p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Today's Schedule
              </h3>
              <Link to="/calendar" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: 'var(--accent-color, #818cf8)' }}>
                Calendar <ArrowUpRight size={11} />
              </Link>
            </div>

            {todaysEvents.length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                No events scheduled for today.
              </p>
            ) : (
              <div className="space-y-2">
                {todaysEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-3 rounded-2xl border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {evt.title}
                      </p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {evt.time || 'All Day'}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5" style={{ color: 'var(--text-muted)' }}>
                      {evt.category || 'Event'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Scratchpad & Quick Notes */}
          <div className="rounded-[28px] glass-panel-fluid p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-3 text-xs font-bold">
                <button
                  onClick={() => setSideTab('scratchpad')}
                  className={`transition-colors ${
                    sideTab === 'scratchpad'
                      ? 'text-white border-b-2 border-indigo-400 pb-0.5'
                      : 'hover:text-stone-300'
                  }`}
                  style={{
                    color: sideTab === 'scratchpad' ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  Scratchpad
                </button>
                <button
                  onClick={() => setSideTab('notes')}
                  className={`transition-colors ${
                    sideTab === 'notes'
                      ? 'text-white border-b-2 border-indigo-400 pb-0.5'
                      : 'hover:text-stone-300'
                  }`}
                  style={{
                    color: sideTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  Recent Notes
                </button>
              </div>

              {sideTab === 'notes' && (
                <Link to="/notes" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: 'var(--accent-color, #818cf8)' }}>
                  All <ArrowUpRight size={11} />
                </Link>
              )}
            </div>

            {sideTab === 'scratchpad' ? (
              <div className="space-y-2">
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Jot down quick thoughts... (auto-saved)"
                  rows={4}
                  className="w-full rounded-2xl p-3.5 text-xs bg-transparent outline-none border resize-none focus:border-indigo-400/50 transition-all leading-relaxed"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span style={{ color: 'var(--text-muted)' }}>
                    {scratchpadSaved ? (
                      <span className="text-emerald-400 font-bold">✓ Saved to notes!</span>
                    ) : (
                      <span>Auto-saved</span>
                    )}
                  </span>
                  {scratchpadText.trim() && (
                    <button
                      type="button"
                      onClick={handleSaveScratchpad}
                      className="btn-glass-primary rounded-full px-4 py-1.5 text-xs font-semibold"
                    >
                      Save as Note
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotes.length === 0 ? (
                  <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                    No notes authored yet.
                  </p>
                ) : (
                  recentNotes.map((note) => (
                    <Link
                      key={note.id}
                      to="/notes"
                      className="block p-2.5 rounded-xl border hover:border-white/20 transition-all"
                      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                    >
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {note.title || 'Untitled'}
                      </p>
                      <p className="text-[11px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {note.description || note.content || 'Empty note...'}
                      </p>
                    </Link>
                  ))
                )}
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
              className="btn-glass rounded-xl px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glass-primary rounded-xl px-5 py-2 text-xs font-bold"
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
            placeholder="e.g. Weekly planning sync"
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
              className="btn-glass rounded-xl px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glass-primary rounded-xl px-5 py-2 text-xs font-bold"
            >
              Save Event
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
