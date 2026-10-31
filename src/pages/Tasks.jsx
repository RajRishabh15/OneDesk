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
  Calendar,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const isNotebook = theme === 'notebook-light' || theme === 'notebook-dark';

  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [dragId, setDragId] = useState(null);

  // Quick inline add state
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState('Medium');

  // Cycle priority on click for mobile speed
  function cycleInlinePriority() {
    if (playChime) playChime('pop');
    setInlinePriority((prev) => {
      if (prev === 'Medium') return 'High';
      if (prev === 'High') return 'Low';
      return 'Medium';
    });
  }

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set();
    tasks.forEach((t) => {
      if (t.category && t.category.trim() && t.category.trim() !== 'General') {
        cats.add(t.category.trim());
      }
    });
    return Array.from(cats);
  }, [tasks]);

  // Active filter count (excluding statusFilter which has its own visible pill tabs)
  const activeSecondaryFilterCount =
    (priorityFilter !== 'All' ? 1 : 0) +
    (categoryFilter !== 'All' ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  function resetAllFilters() {
    if (playChime) playChime('pop');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSortBy('default');
    setQuery('');
  }

  // Lock body scroll when mobile filter sheet is open
  useEffect(() => {
    if (filterSheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [filterSheetOpen]);

  const filtered = useMemo(() => {
    let list = tasks;
    if (statusFilter !== 'All') {
      list = list.filter((t) => t.status === statusFilter);
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
  }, [tasks, statusFilter, priorityFilter, categoryFilter, query, sortBy]);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  function openNew() {
    if (playChime) playChime('pop');
    setEditing(null);
    setForm({ ...emptyForm, dueDate: localToday() });
    setModalOpen(true);
  }

  function openEdit(task) {
    if (playChime) playChime('pop');
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
    if (!payload.title) return;
    if (playChime) playChime('pop');
    if (editing) updateTask(editing.id, payload);
    else addTask(payload);
    setModalOpen(false);
  }

  function handleInlineAdd(e) {
    e.preventDefault();
    if (!inlineTitle.trim()) return;
    if (playChime) playChime('pop');
    addTask({
      title: inlineTitle.trim(),
      priority: inlinePriority,
      dueDate: localToday(),
      status: statusFilter === 'Completed' ? 'Completed' : statusFilter === 'In Progress' ? 'In Progress' : 'Todo',
      category: 'General',
    });
    setInlineTitle('');
  }

  function toggleComplete(task) {
    const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    if (nextStatus === 'Completed') {
      if (playChime) playChime('success');
    } else {
      if (playChime) playChime('pop');
    }
    setTaskStatus(task.id, nextStatus);
  }

  const priorityColor =
    inlinePriority === 'High' ? '#fb7185' : inlinePriority === 'Medium' ? '#fbbf24' : '#34d399';

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-up max-w-5xl mx-auto pb-28 sm:pb-12 px-1 xs:px-2">
      {/* ── Compact Ergonomic Header with Integrated Progress ─────── */}
      <div
        className="pb-3 pt-1 flex flex-col gap-2.5"
        style={{ borderBottom: isNotebook ? '2px solid var(--nb-rule-color)' : '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {isNotebook && (
              <div className="nb-journal-date text-[10px] sm:text-xs mb-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ✦ Task Journal
              </div>
            )}
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Tasks
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all"
                style={{
                  color: 'var(--accent-color)',
                  borderColor: 'var(--border-card)',
                  background: 'var(--bg-surface)',
                  boxShadow: '0 0 8px var(--accent-glow)',
                }}
              >
                {completedCount}/{tasks.length} Done ({pct}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openNew}
              className="btn-glass-primary rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden xs:inline">New task</span>
            </button>
          </div>
        </div>

        {/* Liquid Horizontal Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden border transition-all" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: 'var(--accent-gradient)',
              boxShadow: pct > 0 ? '0 0 10px var(--accent-glow)' : 'none',
            }}
          />
        </div>
      </div>

      {/* ── Handy 1-Row Inline Quick-Add Bar ───────────────────── */}
      <form
        onSubmit={handleInlineAdd}
        className="p-1.5 sm:p-2 rounded-[22px] border transition-all glass-card flex items-center gap-2 shadow-xs"
        style={{ borderColor: 'var(--border-card)' }}
      >
        {/* Cycle Priority Chip (1 Tap to Change: Med -> High -> Low) */}
        <button
          type="button"
          onClick={cycleInlinePriority}
          title={`Priority: ${inlinePriority} (tap to cycle)`}
          className="h-7 sm:h-8 px-2.5 rounded-full border text-[10px] font-bold shrink-0 flex items-center gap-1.5 active:scale-90 transition-all select-none touch-manipulation"
          style={{
            background: `${priorityColor}18`,
            borderColor: `${priorityColor}45`,
            color: priorityColor,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: priorityColor }} />
          <span>{inlinePriority}</span>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          placeholder="Add a quick task..."
          className="flex-1 min-w-0 text-xs sm:text-sm bg-transparent outline-none placeholder:text-[var(--text-muted)]"
          style={{ color: 'var(--text-primary)' }}
        />

        {/* Submit Round Button */}
        <button
          type="submit"
          disabled={!inlineTitle.trim()}
          aria-label="Add task"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full btn-glass-primary flex items-center justify-center shrink-0 disabled:opacity-25 disabled:pointer-events-none active:scale-90 transition-transform shadow-xs"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      </form>

      {/* ── 1-Tap Status Filter Segmented Tabs (Mobile-Handy) ──── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full touch-pan-x flex-1">
          {[
            { id: 'All', label: 'All', count: tasks.length },
            { id: 'Todo', label: 'To Do', count: tasks.filter((t) => t.status === 'Todo').length },
            { id: 'In Progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress').length },
            { id: 'Completed', label: 'Done', count: completedCount },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (playChime) playChime('pop');
                  setStatusFilter(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 shrink-0 select-none active:scale-95 ${
                  active ? 'font-bold shadow-sm' : 'font-medium opacity-80 hover:opacity-100'
                }`}
                style={{
                  background: active ? 'var(--bg-card)' : 'var(--bg-surface)',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: active ? '1px solid var(--border-card)' : '1px solid var(--border-subtle)',
                  boxShadow: active ? '0 2px 8px var(--accent-glow)' : 'none',
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-full"
                  style={{
                    background: active ? 'var(--bg-surface)' : 'rgba(255,255,255,0.05)',
                    color: active ? 'var(--accent-color)' : 'var(--text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher Toggle (List / Kanban) */}
        <div
          className="hidden md:flex rounded-full p-0.5 gap-0.5 border shrink-0"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (playChime) playChime('pop');
              setView('list');
            }}
            aria-label="List view"
            className="p-1.5 rounded-full transition-all active:scale-90"
            style={
              view === 'list'
                ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 6px var(--accent-glow)' }
                : { color: 'var(--text-muted)' }
            }
          >
            <Rows3 size={13} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (playChime) playChime('pop');
              setView('kanban');
            }}
            aria-label="Kanban view"
            className="p-1.5 rounded-full transition-all active:scale-90"
            style={
              view === 'kanban'
                ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 6px var(--accent-glow)' }
                : { color: 'var(--text-muted)' }
            }
          >
            <LayoutGrid size={13} />
          </button>
        </div>
      </div>

      {/* ── Compact Search & Secondary Filters Bar ─────────────── */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-full py-1.5 pl-8 pr-7 text-xs outline-none border transition-all glass-card placeholder:text-[var(--text-muted)]"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-card)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Secondary Filter & Sort Trigger Button */}
        <button
          type="button"
          onClick={() => {
            if (playChime) playChime('pop');
            setFilterSheetOpen(true);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
            activeSecondaryFilterCount > 0 ? 'font-bold' : ''
          }`}
          style={{
            background: activeSecondaryFilterCount > 0 ? 'var(--bg-card)' : 'var(--bg-surface)',
            borderColor: activeSecondaryFilterCount > 0 ? 'var(--accent-color)' : 'var(--border-card)',
            color: activeSecondaryFilterCount > 0 ? 'var(--accent-color)' : 'var(--text-muted)',
            boxShadow: activeSecondaryFilterCount > 0 ? '0 0 10px var(--accent-glow)' : 'none',
          }}
          aria-label="Filter & Sort"
        >
          <SlidersHorizontal size={13} />
          <span className="hidden xs:inline">Filter</span>
          {activeSecondaryFilterCount > 0 && (
            <span
              className="h-4 min-w-[16px] px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: 'var(--accent-gradient)' }}
            >
              {activeSecondaryFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Active Filter Badges Bar (if secondary filters applied) ── */}
      {activeSecondaryFilterCount > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs touch-pan-x">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mr-0.5 shrink-0" style={{ color: 'var(--text-muted)' }}>
            Filters:
          </span>
          {priorityFilter !== 'All' && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--accent-color)',
              }}
            >
              Priority: {priorityFilter}
              <button type="button" onClick={() => setPriorityFilter('All')} className="hover:opacity-75"><X size={10} /></button>
            </span>
          )}
          {categoryFilter !== 'All' && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--accent-color)',
              }}
            >
              Category: {categoryFilter}
              <button type="button" onClick={() => setCategoryFilter('All')} className="hover:opacity-75"><X size={10} /></button>
            </span>
          )}
          {sortBy !== 'default' && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold shrink-0"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--accent-color)',
              }}
            >
              Sort: {sortBy}
              <button type="button" onClick={() => setSortBy('default')} className="hover:opacity-75"><X size={10} /></button>
            </span>
          )}
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[10px] font-bold hover:underline px-1 shrink-0 inline-flex items-center gap-1"
            style={{ color: '#fb7185' }}
          >
            <RotateCcw size={10} />
            Clear
          </button>
        </div>
      )}

      {/* ── Task Content (List for Mobile, List/Kanban for Big Screens) ── */}
      {tasks.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center rounded-[24px]" hover={false}>
          <EmptyState
            icon={CheckSquare}
            title="No tasks yet"
            description="Type a task in the quick add bar above to get started."
            actionLabel="Detailed task"
            onAction={openNew}
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center rounded-[24px]" hover={false}>
          <EmptyState
            icon={CheckSquare}
            title="No matching tasks"
            description={`No tasks match "${query}".`}
            actionLabel="Reset filters"
            onAction={resetAllFilters}
          />
        </Card>
      ) : view === 'kanban' ? (
        <>
          {/* Mobile Devices: Always clean List View */}
          <div className={`md:hidden space-y-2${isNotebook ? ' nb-margin nb-ruled' : ''}`}>
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={openEdit}
                onDelete={deleteTask}
                isNotebook={isNotebook}
              />
            ))}
          </div>

          {/* Big Screen Devices Only: Interactive 3-Column Kanban Board */}
          <div className="hidden md:grid gap-4 md:grid-cols-3">
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
                  className="min-h-[220px] rounded-[24px] border p-3.5 flex flex-col glass-card"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  <div className="mb-2.5 flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background:
                            col === 'Completed' ? '#34d399' : col === 'In Progress' ? '#38bdf8' : 'var(--accent-color)',
                        }}
                      />
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {col}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div
                        className="h-24 rounded-2xl border border-dashed flex items-center justify-center text-[11px]"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        Empty
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          draggable
                          onDragStart={() => setDragId(task.id)}
                          onToggleComplete={toggleComplete}
                          onEdit={openEdit}
                          onDelete={deleteTask}
                          isNotebook={isNotebook}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Standard Clean List View */
        <div className={`space-y-2${isNotebook ? ' nb-margin nb-ruled' : ''}`}>
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onEdit={openEdit}
              onDelete={deleteTask}
              isNotebook={isNotebook}
            />
          ))}
        </div>
      )}

      {/* ── Detailed Task Modal (Desktop & Mobile) ─────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit task' : 'New task'}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              Task title
            </label>
            <input
              required
              autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done…"
              className="w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              Description / Notes
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Extra context, links, or sub-items…"
              className="w-full rounded-2xl p-3 text-xs outline-none border transition-all resize-none leading-relaxed"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Priority
              </label>
              <CustomSelect
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target ? e.target.value : e }))}
                options={['High', 'Medium', 'Low']}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Status
              </label>
              <CustomSelect
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target ? e.target.value : e }))}
                options={columns}
              />
            </div>
          </div>

          {/* Due Date & Category */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Due date
              </label>
              <CustomDatePicker
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target ? e.target.value : e }))}
                placeholder="Select date"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Work, Personal"
                className="w-full rounded-2xl px-3 py-2 text-xs outline-none border transition-all"
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
            className="flex items-center justify-end gap-2 pt-2.5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-glass rounded-full px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glass-primary rounded-full px-5 py-2 text-xs font-bold shadow-md"
            >
              {editing ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Mobile-Friendly Filter & Sort Bottom Sheet ─────────── */}
      {filterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setFilterSheetOpen(false)}
          />

          <div
            className="relative w-full max-w-md rounded-t-[32px] border-t border-[var(--border-card)] p-5 pt-3 animate-sheet-bounce z-10 max-h-[80vh] overflow-y-auto"
            style={{
              background: 'var(--bg-card-solid)',
              backdropFilter: 'blur(30px) saturate(190%)',
              WebkitBackdropFilter: 'blur(30px) saturate(190%)',
              boxShadow: '0 -20px 48px var(--accent-glow), inset 0 1.5px 1px rgba(255,255,255,0.3)',
            }}
          >
            {/* Drag Handle */}
            <div className="h-1.5 w-12 rounded-full mx-auto mb-3.5 bg-white/20" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} style={{ color: 'var(--accent-color)' }} />
                <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Filter &amp; Sort Tasks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFilterSheetOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center border transition-all active:scale-90"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sort By */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  Order By
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'default', label: 'Default' },
                    { id: 'dueDate', label: 'Due Date' },
                    { id: 'priority', label: 'Priority' },
                    { id: 'title', label: 'Alphabetical' },
                  ].map((s) => {
                    const active = sortBy === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (playChime) playChime('pop');
                          setSortBy(s.id);
                        }}
                        className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all active:scale-95 ${
                          active ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          background: active ? 'var(--bg-card)' : 'var(--bg-surface)',
                          borderColor: active ? 'var(--accent-color)' : 'var(--border-subtle)',
                          color: active ? 'var(--accent-color)' : 'var(--text-muted)',
                          boxShadow: active ? '0 0 8px var(--accent-glow)' : 'none',
                        }}
                      >
                        <span>{s.label}</span>
                        {active && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  Priority
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'All', label: 'All', color: 'var(--text-muted)' },
                    { id: 'High', label: 'High Priority', color: '#fb7185' },
                    { id: 'Medium', label: 'Medium Priority', color: '#fbbf24' },
                    { id: 'Low', label: 'Low Priority', color: '#34d399' },
                  ].map((p) => {
                    const active = priorityFilter === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (playChime) playChime('pop');
                          setPriorityFilter(p.id);
                        }}
                        className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all active:scale-95 ${
                          active ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          background: active ? 'var(--bg-card)' : 'var(--bg-surface)',
                          borderColor: active ? p.color : 'var(--border-subtle)',
                          color: active ? p.color : 'var(--text-muted)',
                          boxShadow: active ? `0 0 8px ${p.color}40` : 'none',
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                          <span>{p.label}</span>
                        </div>
                        {active && <Check size={12} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Category
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', ...availableCategories].map((cat) => {
                      const active = categoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (playChime) playChime('pop');
                            setCategoryFilter(cat);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
                            active ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            background: active ? 'var(--bg-card)' : 'var(--bg-surface)',
                            borderColor: active ? 'var(--accent-color)' : 'var(--border-subtle)',
                            color: active ? 'var(--accent-color)' : 'var(--text-muted)',
                            boxShadow: active ? '0 0 8px var(--accent-glow)' : 'none',
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Sheet Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn-glass flex-1 py-2.5 text-xs font-bold rounded-full inline-flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="btn-glass-primary flex-[2] py-2.5 text-xs font-bold rounded-full shadow-md"
                >
                  Show {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
