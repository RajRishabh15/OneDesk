import { useMemo, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Layers,
  ListTodo,
  Tag,
  AlertCircle,
  X
} from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Toggle from '../components/Toggle';
import { useData } from '../context/DataContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
  { id: 'personal', label: 'Personal', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { id: 'meeting', label: 'Meeting', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  { id: 'urgent', label: 'Urgent', color: '#fb7185', bg: 'rgba(251,113,133,0.12)' },
];

const emptyForm = {
  title: '',
  date: '',
  time: '09:00',
  category: 'work',
  description: '',
  reminder: false,
};

function localISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfWeek(d) {
  const c = new Date(d);
  c.setDate(c.getDate() - c.getDay());
  return c;
}

function relativeDay(iso) {
  const today = localISO(new Date());
  const tomorrow = localISO(new Date(Date.now() + 86400000));
  if (iso === today) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/* ── Themed form field ──────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-all';
const inputStyle = {
  background: 'var(--bg-surface)',
  borderColor: 'var(--border-card)',
  color: 'var(--text-primary)',
};

/* ── Main Schedule Page ─────────────────────────────────── */
export default function CalendarPage() {
  const { events, tasks, addEvent, updateEvent, deleteEvent } = useData();
  const [view, setView] = useState('planner'); // 'planner' | 'agenda' | 'week' | 'month'
  const [cursor, setCursor] = useState(new Date());
  const [filterType, setFilterType] = useState('all'); // 'all' | 'events' | 'tasks'
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const today = localISO(new Date());

  // Task deadlined items
  const taskEvents = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && t.status !== 'Completed')
        .map((t) => ({
          id: `task-${t.id}`,
          title: t.title,
          date: t.dueDate,
          time: '',
          isTask: true,
          priority: t.priority,
          description: t.description || '',
          category: 'urgent',
        })),
    [tasks]
  );

  const allItems = useMemo(() => {
    return [
      ...events.map((e) => ({ ...e, isTask: false })),
      ...taskEvents,
    ];
  }, [events, taskEvents]);

  // Filtered items based on filterType
  const filteredItems = useMemo(() => {
    if (filterType === 'events') return allItems.filter((i) => !i.isTask);
    if (filterType === 'tasks') return allItems.filter((i) => i.isTask);
    return allItems;
  }, [allItems, filterType]);

  function itemsOn(dateStr) {
    return filteredItems
      .filter((e) => e.date === dateStr)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  const upcomingDeadlines = useMemo(() => {
    return [...allItems]
      .filter((i) => i.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5);
  }, [allItems, today]);

  function openNew(dateStr, timeStr = '09:00') {
    setEditing(null);
    setForm({
      ...emptyForm,
      date: dateStr || localISO(cursor),
      time: timeStr,
    });
    setModalOpen(true);
  }

  function openEdit(event) {
    setEditing(event);
    setForm({
      title: event.title || '',
      date: event.date || localISO(cursor),
      time: event.time || '09:00',
      category: event.category || 'work',
      description: event.description || '',
      reminder: !!event.reminder,
    });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) updateEvent(editing.id, form);
    else addEvent(form);
    setModalOpen(false);
  }

  function handleDelete() {
    if (editing && !editing.isTask) {
      deleteEvent(editing.id);
    }
    setModalOpen(false);
  }

  function shift(amount) {
    const next = new Date(cursor);
    if (view === 'month') next.setMonth(next.getMonth() + amount);
    else if (view === 'week') next.setDate(next.getDate() + amount * 7);
    else next.setDate(next.getDate() + amount);
    setCursor(next);
  }

  const title =
    view === 'month'
      ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
      : view === 'week'
      ? `Week of ${startOfWeek(cursor).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
      : cursor.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

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
              Schedule &amp; Planner
            </h1>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-card)',
                background: 'var(--bg-surface)',
              }}
            >
              <Sparkles size={11} /> Unified View
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Seamlessly plan events, manage time blocks, and monitor task deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openNew()}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg hover:brightness-110 active:scale-95"
            style={{
              background: 'var(--accent-gradient)',
              boxShadow: '0 4px 18px var(--accent-glow)',
            }}
          >
            <Plus size={15} /> New event
          </button>
        </div>
      </div>

      {/* ── Main Dual-Rail Architecture ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT RAIL: Mini Calendar, Filters & Deadlines (col 4) ── */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Mini Calendar Widget */}
          <Card className="p-4 overflow-hidden" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const prev = new Date(cursor);
                    prev.setMonth(prev.getMonth() - 1);
                    setCursor(prev);
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  onClick={() => {
                    const next = new Date(cursor);
                    next.setMonth(next.getMonth() + 1);
                    setCursor(next);
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                  aria-label="Next month"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Mini Weekday Row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="py-0.5">{d}</div>
              ))}
            </div>

            {/* Mini Days Matrix */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const firstDay = new Date(year, month, 1);
                const startDay = startOfWeek(firstDay);
                const days = Array.from({ length: 35 }, (_, i) => {
                  const d = new Date(startDay);
                  d.setDate(d.getDate() + i);
                  return d;
                });

                return days.map((d) => {
                  const iso = localISO(d);
                  const inCurrentMonth = d.getMonth() === month;
                  const isSelected = iso === localISO(cursor);
                  const isToday = iso === today;
                  const dayHasItems = filteredItems.some((item) => item.date === iso);

                  return (
                    <button
                      key={iso}
                      onClick={() => setCursor(new Date(d))}
                      className="relative h-7 w-full flex flex-col items-center justify-center rounded-lg text-[10px] font-semibold transition-all"
                      style={{
                        background: isSelected
                          ? 'var(--accent-gradient)'
                          : isToday
                          ? 'var(--bg-surface)'
                          : 'transparent',
                        color: isSelected
                          ? '#ffffff'
                          : isToday
                          ? 'var(--accent-color)'
                          : inCurrentMonth
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                        opacity: inCurrentMonth ? 1 : 0.35,
                        border: isToday && !isSelected ? '1px solid var(--border-card)' : '1px solid transparent',
                        boxShadow: isSelected ? '0 2px 8px var(--accent-glow)' : 'none',
                      }}
                    >
                      <span>{d.getDate()}</span>
                      {dayHasItems && (
                        <span
                          className="absolute bottom-0.5 h-1 w-1 rounded-full"
                          style={{
                            background: isSelected ? '#ffffff' : 'var(--accent-color)',
                          }}
                        />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setCursor(new Date())}
                className="text-[11px] font-bold transition-all hover:underline"
                style={{ color: 'var(--accent-color)' }}
              >
                Jump to today
              </button>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {localISO(cursor)}
              </span>
            </div>
          </Card>

          {/* Quick Filters */}
          <Card className="p-3.5 space-y-2" hover={false}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              Filter Views
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'all', label: 'All', count: allItems.length },
                { id: 'events', label: 'Events', count: events.length },
                { id: 'tasks', label: 'Tasks', count: taskEvents.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className="rounded-xl py-1.5 px-2 text-[11px] font-bold transition-all flex flex-col items-center"
                  style={{
                    background: filterType === tab.id ? 'var(--bg-surface)' : 'transparent',
                    border: `1px solid ${filterType === tab.id ? 'var(--border-card)' : 'transparent'}`,
                    color: filterType === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  <span>{tab.label}</span>
                  <span className="text-[9px] font-mono opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Upcoming Deadlines Widget */}
          <DeadlineWidget deadlines={upcomingDeadlines} today={today} onItemClick={openEdit} />
        </div>

        {/* ── RIGHT RAIL: Schedule Workspace Canvas (col 8/9) ───── */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Controls Bar: Navigation & View Switcher */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border glass-card"
            style={{ borderColor: 'var(--border-card)' }}
          >
            {/* Prev / Title / Next */}
            <div className="flex items-center gap-2">
              <NavBtn onClick={() => shift(-1)}>
                <ChevronLeft size={15} />
              </NavBtn>
              <div className="px-2 text-center min-w-[160px] sm:min-w-[220px]">
                <p className="text-sm sm:text-base font-bold font-display truncate" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </p>
                {localISO(cursor) === today && (
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    ● Today
                  </span>
                )}
              </div>
              <NavBtn onClick={() => shift(1)}>
                <ChevronRight size={15} />
              </NavBtn>
              <button
                onClick={() => setCursor(new Date())}
                className="hidden sm:inline-block ml-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#818cf8',
                }}
              >
                Today
              </button>
            </div>

            {/* Segmented View Switcher */}
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)' }}
            >
              {[
                { id: 'planner', label: 'Planner', icon: Clock },
                { id: 'agenda', label: 'Agenda', icon: ListTodo },
                { id: 'week', label: 'Week', icon: Layers },
                { id: 'month', label: 'Month', icon: CalendarDays },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = view === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setView(mode.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all"
                    style={
                      active
                        ? {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            border: '1px solid var(--border-card)',
                          }
                        : { color: 'var(--text-muted)' }
                    }
                  >
                    <Icon size={12} />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Active View Rendering ─────────────────────────── */}
          {view === 'planner' && (
            <PlannerView
              cursor={cursor}
              today={today}
              itemsOn={itemsOn}
              onSlotClick={(time) => openNew(localISO(cursor), time)}
              onItemClick={openEdit}
            />
          )}

          {view === 'agenda' && (
            <AgendaView
              allItems={filteredItems}
              today={today}
              onItemClick={openEdit}
              onNewClick={openNew}
            />
          )}

          {view === 'week' && (
            <WeekView
              cursor={cursor}
              today={today}
              itemsOn={itemsOn}
              onDayClick={(iso) => openNew(iso)}
              onItemClick={openEdit}
            />
          )}

          {view === 'month' && (
            <MonthView
              cursor={cursor}
              today={today}
              itemsOn={itemsOn}
              onDayClick={(iso) => openNew(iso)}
              onItemClick={openEdit}
            />
          )}
        </div>
      </div>

      {/* ── Event Modal ────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? (editing.isTask ? 'View task deadline' : 'Edit event') : 'New event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <Field label="Title">
            <input
              required
              value={form.title}
              disabled={editing?.isTask}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Team Standup, Product Launch, Doctor Appt…"
              className={inputCls}
              style={inputStyle}
            />
          </Field>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                required
                disabled={editing?.isTask}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                required
                disabled={editing?.isTask}
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Category / Tag Accent */}
          {!editing?.isTask && (
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                    className="flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold border transition-all"
                    style={{
                      background: form.category === cat.id ? cat.bg : 'var(--bg-surface)',
                      borderColor: form.category === cat.id ? cat.color : 'var(--border-subtle)',
                      color: form.category === cat.id ? cat.color : 'var(--text-muted)',
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: cat.color }}
                    />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <Field label="Description / Agenda">
            <textarea
              value={form.description}
              disabled={editing?.isTask}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Add details, Zoom link, or location…"
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          </Field>

          {/* Reminder Toggle (Using new robust Toggle) */}
          {!editing?.isTask && (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Set event reminder
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Notify me ahead of time
                </p>
              </div>
              <Toggle
                on={form.reminder}
                onToggle={() => setForm((f) => ({ ...f, reminder: !f.reminder }))}
                label="Toggle event reminder"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div
            className="flex items-center justify-between pt-2"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            {editing && !editing.isTask ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all hover:brightness-125"
                style={{
                  background: 'rgba(251,113,133,0.1)',
                  border: '1px solid rgba(251,113,133,0.3)',
                  color: '#fb7185',
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-muted)',
                }}
              >
                Cancel
              </button>
              {!editing?.isTask && (
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
                  style={{
                    background: 'var(--accent-gradient)',
                    boxShadow: '0 4px 16px var(--accent-glow)',
                  }}
                >
                  {editing ? 'Save changes' : 'Add event'}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ── VIEW 1: Hourly Planner / Timeline View ──────────────── */
function PlannerView({ cursor, today, itemsOn, onSlotClick, onItemClick }) {
  const iso = localISO(cursor);
  const dayItems = itemsOn(iso);
  const isToday = iso === today;

  // Split into timed vs all-day/tasks
  const timedItems = dayItems.filter((i) => i.time);
  const allDayItems = dayItems.filter((i) => !i.time);

  // 16 hours from 07:00 to 22:00
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  // Live indicator for current hour/minute
  const [currentMinutePercent, setCurrentMinutePercent] = useState(null);

  useEffect(() => {
    if (!isToday) {
      setCurrentMinutePercent(null);
      return;
    }
    function updateTime() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h >= 7 && h <= 22) {
        const totalMinutes = (h - 7) * 60 + m;
        const totalDayMinutes = 16 * 60;
        setCurrentMinutePercent((totalMinutes / totalDayMinutes) * 100);
      } else {
        setCurrentMinutePercent(null);
      }
    }
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [isToday]);

  return (
    <div className="space-y-4">
      {/* Top Banner for All-day / Unscheduled items */}
      {allDayItems.length > 0 && (
        <Card className="p-3.5" hover={false}>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={12} style={{ color: '#818cf8' }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              All-Day &amp; Due Deadlines ({allDayItems.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allDayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick(item)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all hover:brightness-125"
                style={{
                  background: item.isTask ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.12)',
                  borderColor: item.isTask ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.3)',
                  color: item.isTask ? '#fbbf24' : '#818cf8',
                }}
              >
                <span>{item.isTask ? '☑' : '📅'}</span>
                <span className="font-semibold">{item.title}</span>
                {item.priority && (
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full border opacity-80">
                    {item.priority}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hourly Timeline Grid */}
      <Card className="p-4 sm:p-5 relative overflow-hidden" hover={false}>
        {/* Current Time Bar Indicator */}
        {currentMinutePercent !== null && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{
              top: `${50 + (currentMinutePercent / 100) * 880}px`,
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] -ml-1 animate-pulse" />
            <div className="h-[2px] w-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e]" />
            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-l shadow mr-2">
              NOW
            </span>
          </div>
        )}

        <div className="space-y-0 divide-y divide-[var(--border-subtle)]">
          {hours.map((hour) => {
            const timePrefix = String(hour).padStart(2, '0');
            const hourSlot = `${timePrefix}:00`;
            const slotItems = timedItems.filter((i) => i.time && i.time.startsWith(timePrefix));

            return (
              <div
                key={hour}
                className="group relative flex min-h-[58px] py-1.5 transition-colors hover:bg-[var(--bg-surface)]"
              >
                {/* Time label */}
                <div className="w-14 sm:w-16 shrink-0 pt-0.5 text-right pr-3 sm:pr-4">
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                    {hourSlot}
                  </span>
                </div>

                {/* Event track */}
                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2 pl-2">
                  {slotItems.length > 0 ? (
                    slotItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="group/item flex items-center justify-between gap-3 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all hover:scale-[1.01] hover:brightness-110 shadow-sm"
                        style={{
                          background: item.isTask ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.14)',
                          borderColor: item.isTask ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.3)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                            style={{
                              background: item.isTask ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)',
                              color: item.isTask ? '#fbbf24' : '#818cf8',
                            }}
                          >
                            {item.time}
                          </span>
                          <span className="truncate">{item.title}</span>
                        </div>
                        {item.description && (
                          <span className="hidden md:inline text-[11px] truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                            · {item.description}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSlotClick(hourSlot)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded-lg border transition-all hover:border-indigo-400"
                      style={{
                        color: 'var(--text-muted)',
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <Plus size={11} /> Schedule at {hourSlot}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ── VIEW 2: Chronological Agenda Stream ──────────────────── */
function AgendaView({ allItems, today, onItemClick, onNewClick }) {
  const tomorrow = localISO(new Date(Date.now() + 86400000));
  const weekLater = localISO(new Date(Date.now() + 7 * 86400000));

  // Sections
  const todayItems = allItems.filter((i) => i.date === today);
  const tomorrowItems = allItems.filter((i) => i.date === tomorrow);
  const thisWeekItems = allItems.filter((i) => i.date > tomorrow && i.date <= weekLater);
  const upcomingItems = allItems.filter((i) => i.date > weekLater);

  const sections = [
    { id: 'today', title: 'Today', subtitle: 'Immediate focus', items: todayItems, accent: '#818cf8' },
    { id: 'tomorrow', title: 'Tomorrow', subtitle: 'Next on the docket', items: tomorrowItems, accent: '#38bdf8' },
    { id: 'thisWeek', title: 'Later this week', subtitle: 'Upcoming days', items: thisWeekItems, accent: '#fbbf24' },
    { id: 'upcoming', title: 'Upcoming horizon', subtitle: 'Further ahead', items: upcomingItems, accent: 'var(--text-muted)' },
  ];

  const totalActive = todayItems.length + tomorrowItems.length + thisWeekItems.length + upcomingItems.length;

  if (totalActive === 0) {
    return (
      <Card className="p-8 text-center" hover={false}>
        <EmptyState
          icon={CalendarDays}
          title="No upcoming events or deadlines"
          description="Your schedule is completely clear! Click below to create your next event."
          actionLabel="Add new event"
          onAction={() => onNewClick()}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((sec) => {
        if (sec.items.length === 0) return null;
        return (
          <div key={sec.id} className="space-y-3">
            <div className="flex items-center justify-between pb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: sec.accent }} />
                <h3 className="text-sm font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {sec.title}
                </h3>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  ({sec.items.length})
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                {sec.subtitle}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {sec.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all hover:brightness-110 glass-card"
                  style={{
                    borderColor: 'var(--border-card)',
                  }}
                >
                  {/* Date badge */}
                  <div
                    className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border shrink-0 text-center"
                    style={{
                      background: item.isTask ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)',
                      borderColor: item.isTask ? 'rgba(251,191,36,0.25)' : 'rgba(99,102,241,0.25)',
                      color: item.isTask ? '#fbbf24' : '#818cf8',
                    }}
                  >
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-base font-black leading-tight">
                      {new Date(item.date + 'T00:00:00').getDate()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </p>
                      {item.isTask && (
                        <span
                          className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            background: 'rgba(251,191,36,0.15)',
                            borderColor: 'rgba(251,191,36,0.3)',
                            color: '#fbbf24',
                          }}
                        >
                          Task Deadline
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-mono">{item.time ? item.time : 'All Day'}</span>
                      {item.description && <span>· {item.description}</span>}
                    </div>
                  </div>

                  {/* Status chip */}
                  <span
                    className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-xl border"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {relativeDay(item.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── VIEW 3: 7-Day Horizon Week View ─────────────────────── */
function WeekView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
      {days.map((d) => {
        const iso = localISO(d);
        const dayItems = itemsOn(iso);
        const isToday = iso === today;

        return (
          <div
            key={iso}
            className="rounded-2xl p-3 min-h-[220px] flex flex-col border glass-card transition-all"
            style={{
              borderColor: isToday ? 'rgba(99,102,241,0.5)' : 'var(--border-card)',
              boxShadow: isToday ? '0 0 16px rgba(99,102,241,0.15)' : 'none',
            }}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: isToday ? '#818cf8' : 'var(--text-muted)' }}>
                  {d.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black mt-0.5"
                  style={{
                    background: isToday ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                    color: isToday ? '#ffffff' : 'var(--text-primary)',
                    boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  {d.getDate()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDayClick(iso)}
                className="h-6 w-6 flex items-center justify-center rounded-lg transition-all hover:brightness-125"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                aria-label="Add event on this day"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Items Column */}
            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {dayItems.length === 0 ? (
                <p className="text-[10px] text-center py-4 font-mono opacity-40" style={{ color: 'var(--text-muted)' }}>
                  —
                </p>
              ) : (
                dayItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02] border"
                    style={{
                      background: item.isTask ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.12)',
                      borderColor: item.isTask ? 'rgba(251,191,36,0.25)' : 'rgba(99,102,241,0.25)',
                      color: item.isTask ? '#fbbf24' : '#818cf8',
                    }}
                  >
                    {item.time && (
                      <span className="block text-[9px] font-mono opacity-70 mb-0.5">
                        {item.time}
                      </span>
                    )}
                    <span className="block truncate text-[11px]" style={{ color: 'var(--text-primary)' }}>
                      {item.isTask ? '☑ ' : ''}{item.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── VIEW 4: Panoramic Month Matrix ──────────────────────── */
function MonthView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const gridStart = startOfWeek(new Date(year, month, 1));
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <Card className="p-4 overflow-hidden" hover={false}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* 42-day calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const iso = localISO(d);
          const inMonth = d.getMonth() === month;
          const dayItems = itemsOn(iso);
          const isToday = iso === today;

          return (
            <button
              key={iso}
              onClick={() => onDayClick(iso)}
              className="min-h-[86px] rounded-xl p-2 text-left flex flex-col transition-all duration-150 relative group"
              style={{
                background: isToday
                  ? 'rgba(99,102,241,0.1)'
                  : inMonth
                  ? 'var(--bg-surface)'
                  : 'transparent',
                border: `1px solid ${
                  isToday
                    ? 'rgba(99,102,241,0.5)'
                    : inMonth
                    ? 'var(--border-subtle)'
                    : 'transparent'
                }`,
                opacity: inMonth ? 1 : 0.3,
              }}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className="text-[11px] font-bold inline-flex h-5 w-5 items-center justify-center rounded-full leading-none"
                  style={{
                    background: isToday ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-primary)',
                    boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.5)' : 'none',
                  }}
                >
                  {d.getDate()}
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  +
                </span>
              </div>

              <div className="space-y-1 w-full flex-1 overflow-hidden">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(item);
                    }}
                    className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold transition-all hover:brightness-125"
                    style={{
                      background: item.isTask ? 'rgba(251,191,36,0.14)' : 'rgba(99,102,241,0.15)',
                      border: `1px solid ${item.isTask ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.3)'}`,
                      color: item.isTask ? '#fbbf24' : '#818cf8',
                    }}
                  >
                    {item.isTask ? '✓ ' : ''}
                    {item.time ? `${item.time} ` : ''}
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <p className="text-[9px] font-mono px-1" style={{ color: 'var(--text-muted)' }}>
                    +{dayItems.length - 2} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Upcoming Deadlines Widget ───────────────────────────── */
function DeadlineWidget({ deadlines, today, onItemClick }) {
  const tomorrow = localISO(new Date(Date.now() + 86400000));

  return (
    <Card className="p-4 overflow-hidden" hover={false}>
      <div className="flex items-center gap-2.5 mb-3 pb-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <Clock size={13} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            Upcoming Deadlines
          </h3>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Next {deadlines.length} key milestones
          </p>
        </div>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-[11px] text-center py-3 font-mono" style={{ color: 'var(--text-muted)' }}>
          No upcoming deadlines. You're all clear!
        </p>
      ) : (
        <div className="space-y-2">
          {deadlines.map((item) => {
            const isToday = item.date === today;
            const isTmrw = item.date === tomorrow;
            const accentColor = isToday ? '#fb7185' : isTmrw ? '#fbbf24' : 'var(--text-muted)';
            const bgColor = isToday
              ? 'rgba(251,113,133,0.08)'
              : isTmrw
              ? 'rgba(251,191,36,0.08)'
              : 'var(--bg-surface)';
            const borderColor = isToday
              ? 'rgba(251,113,133,0.25)'
              : isTmrw
              ? 'rgba(251,191,36,0.25)'
              : 'var(--border-subtle)';

            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all hover:brightness-110"
                style={{ background: bgColor, borderColor }}
              >
                {/* Date badge */}
                <div
                  className="shrink-0 flex flex-col items-center justify-center w-9 h-9 rounded-lg border text-center"
                  style={{ background: bgColor, borderColor, color: accentColor }}
                >
                  <span className="text-[8px] font-bold uppercase leading-none">
                    {new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })}
                  </span>
                  <span className="text-sm font-black leading-tight">
                    {new Date(item.date + 'T00:00:00').getDate()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.isTask ? '☑ ' : '📅 '}
                    {item.title}
                  </p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {relativeDay(item.date)}
                    {item.time ? ` · ${item.time}` : ''}
                  </p>
                </div>

                <span
                  className="shrink-0 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                  style={{ color: accentColor, borderColor, background: bgColor }}
                >
                  {isToday ? 'Today' : isTmrw ? 'Tmrw' : relativeDay(item.date)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── Nav button helper ───────────────────────────────────── */
function NavBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:brightness-110"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </button>
  );
}
