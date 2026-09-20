import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  CheckSquare,
  LayoutGrid,
  Rows3,
  Search,
  X,
  SlidersHorizontal,
  Check,
  RotateCcw,
} from 'lucide-react';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

const columns = ['Todo', 'In Progress', 'Completed'];

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
  category: 'General',
  status: 'Todo',
};

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, setTaskStatus } = useData();
  const { playChime } = useSettings();
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState('status');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [dragId, setDragId] = useState(null);

  // Quick inline add state
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState('Medium');

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set();
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) cats.add(t.category.trim());
    });
    return Array.from(cats);
  }, [tasks]);

  // Active filter count (excluding query)
  const activeFilterCount =
    (filter !== 'All' ? 1 : 0) +
    (priorityFilter !== 'All' ? 1 : 0) +
    (categoryFilter !== 'All' ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  function resetAllFilters() {
    setFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSortBy('default');
  }

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileFilterOpen]);

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter !== 'All') {
      list = list.filter((t) => t.status === filter);
    }
    if (priorityFilter !== 'All') {
      list = list.filter((t) => t.priority === priorityFilter);
    }
    if (categoryFilter !== 'All') {
      list = list.filter((t) => t.category === categoryFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'dueDate') {
      list = [...list].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    } else if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      list = [...list].sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
    } else if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [tasks, filter, priorityFilter, categoryFilter, query, sortBy]);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, dueDate: localToday() });
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || localToday(),
      category: task.category || 'General',
      status: task.status || 'Todo',
    });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, title: form.title.trim() };
    if (editing) updateTask(editing.id, payload);
    else addTask(payload);
    setModalOpen(false);
  }

  function handleInlineAdd(e) {
    e.preventDefault();
    if (!inlineTitle.trim()) return;
    addTask({
      title: inlineTitle.trim(),
      priority: inlinePriority,
      dueDate: localToday(),
      status: filter === 'Completed' ? 'Completed' : filter === 'In Progress' ? 'In Progress' : 'Todo',
      category: 'General',
    });
    setInlineTitle('');
  }

  function toggleComplete(task) {
    const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    if (nextStatus === 'Completed') {
      playChime('success');
    }
    setTaskStatus(task.id, nextStatus);
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
              Tasks &amp; Execution
            </h1>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-card)',
                background: 'var(--bg-surface)',
              }}
            >
              <CheckSquare size={11} /> {completedCount}/{tasks.length} Done ({pct}%)
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Track your action items, sprints, and priorities with live progress tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="btn-glass-primary rounded-full px-5 py-2.5 text-xs w-full sm:w-auto shrink-0 shadow-md"
        >
          <Plus size={15} /> <span>Detailed task</span>
        </button>
      </div>

      {/* ── Enhanced Inline Quick-Add Bar ─────────────────────── */}
      <form
        onSubmit={handleInlineAdd}
        className="p-3 sm:p-3.5 rounded-[28px] border transition-all glass-card flex flex-wrap items-center gap-2.5 sm:gap-3"
        style={{ borderColor: 'var(--border-card)' }}
      >
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-card)' }}
        >
          <Plus size={12} style={{ color: 'var(--accent-color)' }} />
        </div>

        <input
          type="text"
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          placeholder="Quick add a task… (Type and press Enter)"
          className="flex-1 min-w-[180px] text-xs sm:text-sm bg-transparent outline-none"
          style={{ color: 'var(--text-primary)' }}
        />

        {/* Priority quick selector */}
        <div
          className="flex items-center p-0.5 gap-1 rounded-full border shrink-0"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
          }}
        >
          {['Low', 'Medium', 'High'].map((p) => {
            const active = inlinePriority === p;
            const color = p === 'High' ? '#fb7185' : p === 'Medium' ? '#fbbf24' : '#34d399';
            return (
              <button
                key={p}
                type="button"
                onClick={() => setInlinePriority(p)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 select-none ${
                  active ? 'shadow-sm' : 'opacity-60 hover:opacity-100 hover:bg-white/[0.04]'
                }`}
                style={{
                  background: active ? `${color}20` : 'transparent',
                  border: active ? `1px solid ${color}50` : '1px solid transparent',
                  color: active ? color : 'var(--text-muted)',
                  boxShadow: active ? `0 2px 8px ${color}20` : 'none',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={!inlineTitle.trim()}
          className="btn-glass-primary rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none"
        >
          Add
        </button>
      </form>

      {/* ── Search & Filter Controls ───────────────────────────── */}
      <div className="space-y-2.5">
        {/* DESKTOP & LAPTOP CONTROLS (sm:flex) - Clean, uncluttered, matching original UI */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs md:max-w-sm">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="w-full rounded-xl py-2 pl-9 pr-8 text-xs outline-none border transition-all glass-card"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--border-card)',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Desktop Status Pills Segmented Track */}
            <div
              className="flex items-center p-1 gap-1 rounded-full border overflow-x-auto scrollbar-none shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {['All', ...columns].map((c) => {
                const active = filter === c;
                const count = c === 'All' ? tasks.length : tasks.filter((t) => t.status === c).length;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 select-none ${
                      active ? 'shadow-sm font-bold' : 'hover:bg-white/[0.04]'
                    }`}
                    style={
                      active
                        ? {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-card)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          }
                        : {
                            color: 'var(--text-muted)',
                            border: '1px solid transparent',
                          }
                    }
                  >
                    <span>{c}</span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded-full"
                      style={{
                        background: active ? 'var(--bg-surface)' : 'transparent',
                        color: active ? 'var(--accent-color)' : 'var(--text-muted)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop View Switcher */}
            <div
              className="flex rounded-full p-1 gap-1 border shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <button
                type="button"
                onClick={() => setView('list')}
                aria-label="List view"
                className="p-1.5 rounded-full transition-all"
                style={
                  view === 'list'
                    ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }
                    : { color: 'var(--text-muted)' }
                }
              >
                <Rows3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView('kanban')}
                aria-label="Kanban view"
                className="p-1.5 rounded-full transition-all"
                style={
                  view === 'kanban'
                    ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }
                    : { color: 'var(--text-muted)' }
                }
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE CONTROLS (sm:hidden) - Full Search + Amazon Filter Button + View Switcher */}
        <div className="flex sm:hidden flex-col gap-2">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="w-full rounded-xl py-2 pl-9 pr-8 text-xs outline-none border transition-all glass-card"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--border-card)',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mobile Filter Trigger + View Switcher Row */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className={`btn-glass flex-1 px-4 py-2 rounded-full text-xs font-bold relative flex items-center justify-center gap-2 ${
                activeFilterCount > 0 ? 'border-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)] text-indigo-300' : ''
              }`}
              aria-label="Open filter menu"
            >
              <SlidersHorizontal size={14} className={activeFilterCount > 0 ? 'text-indigo-400' : 'text-stone-400'} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="h-4 min-w-[16px] px-1.5 rounded-full text-[9px] font-black bg-indigo-500 text-white flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile View Switcher */}
            <div
              className="flex rounded-full p-1 gap-1 border shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <button
                type="button"
                onClick={() => setView('list')}
                aria-label="List view"
                className="p-1.5 rounded-full transition-all"
                style={
                  view === 'list'
                    ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }
                    : { color: 'var(--text-muted)' }
                }
              >
                <Rows3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView('kanban')}
                aria-label="Kanban view"
                className="p-1.5 rounded-full transition-all"
                style={
                  view === 'kanban'
                    ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }
                    : { color: 'var(--text-muted)' }
                }
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips (MOBILE ONLY: sm:hidden) */}
        {activeFilterCount > 0 && (
          <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mr-0.5 shrink-0" style={{ color: 'var(--text-muted)' }}>
              Active:
            </span>
            {filter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold shrink-0">
                Status: {filter}
                <button type="button" onClick={() => setFilter('All')} className="hover:text-white"><X size={11} /></button>
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold shrink-0">
                Priority: {priorityFilter}
                <button type="button" onClick={() => setPriorityFilter('All')} className="hover:text-white"><X size={11} /></button>
              </span>
            )}
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold shrink-0">
                Category: {categoryFilter}
                <button type="button" onClick={() => setCategoryFilter('All')} className="hover:text-white"><X size={11} /></button>
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold shrink-0">
                Sort: {sortBy}
                <button type="button" onClick={() => setSortBy('default')} className="hover:text-white"><X size={11} /></button>
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[10px] font-bold text-rose-400 hover:underline px-1 shrink-0 inline-flex items-center gap-1"
            >
              <RotateCcw size={10} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Task Content (List or Kanban) ──────────────────────── */}
      {tasks.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center" hover={false}>
          <EmptyState
            icon={CheckSquare}
            title="No tasks yet"
            description="Type in the quick add bar above or click Detailed task to begin."
            actionLabel="Create detailed task"
            onAction={openNew}
          />
        </Card>
      ) : view === 'list' ? (
        filtered.length === 0 ? (
          <Card className="p-8 text-center" hover={false}>
            <EmptyState
              icon={CheckSquare}
              title="No matching tasks found"
              description={`No tasks match "${query}". Try adjusting your filters.`}
              actionLabel="Clear filter"
              onAction={() => { setFilter('All'); setQuery(''); }}
            />
          </Card>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={openEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )
      ) : (
        /* Kanban Columns */
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) setTaskStatus(dragId, col);
                  setDragId(null);
                }}
                className="min-h-[260px] rounded-[28px] border p-4 flex flex-col glass-card"
                style={{ borderColor: 'var(--border-card)' }}
              >
                <div className="mb-3 flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: col === 'Completed' ? '#34d399' : col === 'In Progress' ? '#38bdf8' : '#818cf8',
                      }}
                    />
                    <p className="text-xs font-bold font-display uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      {col}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      onToggleComplete={toggleComplete}
                      onEdit={openEdit}
                      onDelete={deleteTask}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div
                      className="h-28 grid place-items-center border border-dashed rounded-2xl text-xs font-mono"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detailed Task Modal ────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit task' : 'New task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Task title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done…"
              className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Description / Notes
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Add extra context, links, or checklist…"
              className="w-full rounded-2xl p-3.5 text-xs sm:text-sm outline-none border transition-all resize-none leading-relaxed"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none border transition-all"
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
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              >
                {columns.map((c) => (
                  <option key={c} value={c} style={{ background: 'var(--bg-card)' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Work, College"
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div
            className="flex items-center justify-end gap-2.5 pt-3"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-glass rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glass-primary rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
            >
              {editing ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Amazon-Style Mobile Filter Bottom Sheet ───────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Sheet Container */}
          <div
            className="relative w-full max-w-lg rounded-t-[32px] border-t border-[var(--border-card)] shadow-2xl animate-sheet-bounce max-h-[85vh] flex flex-col overflow-hidden z-10"
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow: '0 -12px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            {/* Tactile Pill Drag handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="h-1.5 w-12 rounded-full bg-white/25" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-400" />
                <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Filters &amp; Sort
                </h3>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeFilterCount} active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-rose-400 hover:underline inline-flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Horizontal Category Bubble Switcher */}
            <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
              <div className="flex items-center gap-1.5 p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-x-auto scrollbar-none">
                {[
                  { id: 'status', label: 'Status', active: filter !== 'All' },
                  { id: 'priority', label: 'Priority', active: priorityFilter !== 'All' },
                  { id: 'category', label: 'Category', active: categoryFilter !== 'All' },
                  { id: 'sort', label: 'Sort By', active: sortBy !== 'default' },
                ].map((tab) => {
                  const isSelected = activeDrawerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDrawerTab(tab.id)}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 select-none ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md font-bold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.active && (
                        <span
                          className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'} shadow-[0_0_6px_rgba(99,102,241,0.6)]`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full-width Category Options Panel */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
              {/* 1. Status options */}
              {activeDrawerTab === 'status' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Filter by Task Status
                    </p>
                    {filter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setFilter('All')}
                        className="text-[11px] text-indigo-400 hover:underline font-medium"
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', ...columns].map((c) => {
                      const isSelected = filter === c;
                      const count = c === 'All' ? tasks.length : tasks.filter((t) => t.status === c).length;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFilter(c)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-full border text-xs transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-[0_2px_12px_rgba(99,102,241,0.25)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${
                              c === 'Completed' ? 'bg-emerald-400' : c === 'In Progress' ? 'bg-sky-400' : c === 'Todo' ? 'bg-indigo-400' : 'bg-stone-400'
                            }`} />
                            <span className="truncate">{c}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-[var(--text-muted)]'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Priority options */}
              {activeDrawerTab === 'priority' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Filter by Priority Level
                    </p>
                    {priorityFilter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setPriorityFilter('All')}
                        className="text-[11px] text-indigo-400 hover:underline font-medium"
                      >
                        Reset Priority
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'All', label: 'All Priorities', color: '#94a3b8' },
                      { id: 'High', label: 'High Priority', color: '#fb7185' },
                      { id: 'Medium', label: 'Medium Priority', color: '#fbbf24' },
                      { id: 'Low', label: 'Low Priority', color: '#34d399' },
                    ].map((p) => {
                      const isSelected = priorityFilter === p.id;
                      const count = p.id === 'All' ? tasks.length : tasks.filter((t) => t.priority === p.id).length;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPriorityFilter(p.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-[0_2px_12px_rgba(99,102,241,0.25)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                            <span>{p.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-[var(--text-muted)]'
                            }`}>
                              {count}
                            </span>
                            {isSelected && <Check size={13} className="text-indigo-400" strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Category options */}
              {activeDrawerTab === 'category' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Filter by Category
                    </p>
                    {categoryFilter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setCategoryFilter('All')}
                        className="text-[11px] text-indigo-400 hover:underline font-medium"
                      >
                        Reset Category
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...availableCategories].map((cat) => {
                      const isSelected = categoryFilter === cat;
                      const count = cat === 'All' ? tasks.length : tasks.filter((t) => t.category === cat).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-[0_2px_12px_rgba(99,102,241,0.25)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/20'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-[var(--text-muted)]'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Sort By options */}
              {activeDrawerTab === 'sort' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Order &amp; Sequence
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'default', label: 'Default Sequence' },
                      { id: 'dueDate', label: 'Due Date (Soonest first)' },
                      { id: 'priority', label: 'Priority (High to Low)' },
                      { id: 'title', label: 'Alphabetical (A-Z)' },
                    ].map((s) => {
                      const isSelected = sortBy === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSortBy(s.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border text-xs transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-[0_2px_12px_rgba(99,102,241,0.25)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/20'
                          }`}
                        >
                          <span>{s.label}</span>
                          {isSelected && <Check size={13} className="text-indigo-400" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tactile Bubble Action Bar */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={resetAllFilters}
                className="btn-glass flex-1 py-3 text-xs font-bold rounded-full inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={13} />
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn-glass-primary flex-[2] py-3 text-xs font-bold rounded-full shadow-lg"
              >
                Show {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
