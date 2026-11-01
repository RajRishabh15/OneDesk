import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  CheckSquare,
  LayoutGrid,
  Rows3,
  Search,
  X,
  Check,
  Calendar,
  Sparkles,
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
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [dragId, setDragId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.createTask) {
      window.history.replaceState({}, '');
      setEditing(null);
      setForm(emptyForm);
      setTimeout(() => setModalOpen(true), 60);
    }
  }, [location.state]);

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

  function resetAllFilters() {
    if (playChime) playChime('pop');
    setStatusFilter('All');
    setQuery('');
  }

  const filtered = useMemo(() => {
    let list = tasks;
    if (statusFilter !== 'All') {
      list = list.filter((t) => t.status === statusFilter);
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
  }, [tasks, statusFilter, query]);

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
                  active ? 'font-bold' : 'font-medium opacity-80 hover:opacity-100'
                }`}
                style={{
                  background: active ? 'var(--bg-card)' : 'var(--bg-surface)',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: active ? '1px solid var(--border-card)' : '1px solid var(--border-subtle)',
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
                ? { background: 'var(--bg-card)', color: 'var(--text-primary)' }
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
                ? { background: 'var(--bg-card)', color: 'var(--text-primary)' }
                : { color: 'var(--text-muted)' }
            }
          >
            <LayoutGrid size={13} />
          </button>
        </div>
      </div>

      {/* ── Search Bar ─────────────── */}
      <div className="relative w-full">
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
    </div>
  );
}
