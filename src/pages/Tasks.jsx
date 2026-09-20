import { useMemo, useState } from 'react';
import {
  Plus,
  CheckSquare,
  LayoutGrid,
  Rows3,
  Search,
  X
} from 'lucide-react';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import { useData } from '../context/DataContext';

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
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [dragId, setDragId] = useState(null);

  // Quick inline add state
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState('Medium');
  const [inlineDue, setInlineDue] = useState(localToday());

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter !== 'All') {
      list = list.filter((t) => t.status === filter);
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
    return list;
  }, [tasks, filter, query]);

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
      dueDate: inlineDue || localToday(),
      status: filter === 'Completed' ? 'Completed' : filter === 'In Progress' ? 'In Progress' : 'Todo',
      category: 'General',
    });
    setInlineTitle('');
  }

  function toggleComplete(task) {
    setTaskStatus(task.id, task.status === 'Completed' ? 'Todo' : 'Completed');
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Tasks &amp; Execution
            </h1>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-card)',
                background: 'var(--bg-surface)',
              }}
            >
              <CheckSquare size={11} /> {completedCount}/{tasks.length} Done ({pct}%)
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Track your action items, sprints, and priorities with live progress tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="btn-glass-primary rounded-xl px-4 py-2 text-xs"
        >
          <Plus size={15} /> <span>Detailed task</span>
        </button>
      </div>

      {/* ── Enhanced Inline Quick-Add Bar ─────────────────────── */}
      <form
        onSubmit={handleInlineAdd}
        className="p-3 sm:p-3.5 rounded-2xl border transition-all glass-card flex flex-wrap items-center gap-2.5 sm:gap-3"
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
        <div className="flex items-center gap-1.5">
          {['Low', 'Medium', 'High'].map((p) => {
            const active = inlinePriority === p;
            const color = p === 'High' ? '#fb7185' : p === 'Medium' ? '#fbbf24' : '#34d399';
            return (
              <button
                key={p}
                type="button"
                onClick={() => setInlinePriority(p)}
                className={`chip-glass px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  active ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: active ? `${color}25` : 'var(--bg-surface)',
                  borderColor: active ? color : 'var(--border-subtle)',
                  color: active ? color : 'var(--text-muted)',
                  boxShadow: active ? `0 2px 8px ${color}30, inset 0 1px 0 rgba(255,255,255,0.15)` : 'none',
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
          className="btn-glass-primary rounded-xl px-4 py-1.5 text-xs disabled:opacity-30 disabled:pointer-events-none"
        >
          Add
        </button>
      </form>

      {/* ── Search & Filter Controls ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 max-w-sm">
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
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Pills & View Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {['All', ...columns].map((c) => {
              const active = filter === c;
              const count = c === 'All' ? tasks.length : tasks.filter((t) => t.status === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`chip-glass px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
                    active ? 'chip-glass-active' : ''
                  }`}
                >
                  <span>{c}</span>
                  <span className="text-[10px] font-mono opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          <div
            className="flex rounded-xl p-1 gap-1 border shrink-0"
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
              className="p-1.5 rounded-lg transition-all"
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
              className="p-1.5 rounded-lg transition-all"
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
                className="min-h-[260px] rounded-2xl border p-3.5 flex flex-col glass-card"
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
                    className="rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold border"
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
                      className="h-28 grid place-items-center border border-dashed rounded-xl text-xs font-mono"
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
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-all"
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
              className="w-full rounded-xl p-3 text-xs sm:text-sm outline-none border transition-all resize-none leading-relaxed"
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
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
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
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
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
                className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
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
              className="btn-glass rounded-xl px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glass-primary rounded-xl px-5 py-2 text-xs font-bold"
            >
              {editing ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
