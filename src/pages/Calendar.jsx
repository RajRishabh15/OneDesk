import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, CalendarDays, Clock, Trash2, X } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { useData } from '../context/DataContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const emptyForm = { title: '', date: '', time: '09:00', description: '', reminder: false };

function localISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function startOfWeek(d) {
  const c = new Date(d); c.setDate(c.getDate() - c.getDay()); return c;
}
function relativeDay(iso) {
  const today = localISO(new Date());
  const tomorrow = localISO(new Date(Date.now() + 86400000));
  if (iso === today) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ── Themed form field ──────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-all';
const inputStyle = { background: 'var(--bg-surface)', borderColor: 'var(--border-card)', color: 'var(--text-primary)' };

/* ── Improved Toggle ────────────────────────────────────── */
function Toggle({ on, onToggle, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 group"
      aria-label={label}
    >
      {/* Track */}
      <div
        className="relative h-6 w-11 rounded-full transition-all duration-300 flex-shrink-0"
        style={{
          background: on
            ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
            : 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          boxShadow: on ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
        }}
      >
        {/* Thumb */}
        <span
          className="absolute top-0.5 h-[18px] w-[18px] rounded-full shadow-md transition-all duration-300"
          style={{
            transform: on ? 'translateX(20px)' : 'translateX(2px)',
            background: on ? '#fff' : 'var(--text-muted)',
            boxShadow: on ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
          }}
        />
      </div>
      {/* Label */}
      {label && (
        <span className="text-sm font-medium transition-colors" style={{ color: on ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {Icon && <Icon size={12} className="inline mr-1 opacity-70" />}
          {label}
        </span>
      )}
    </button>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function CalendarPage() {
  const { events, tasks, addEvent, updateEvent, deleteEvent } = useData();
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const today = localISO(new Date());

  const taskEvents = useMemo(
    () => tasks
      .filter((t) => t.dueDate && t.status !== 'Completed')
      .map((t) => ({ id: `task-${t.id}`, title: t.title, date: t.dueDate, time: '', isTask: true, priority: t.priority })),
    [tasks]
  );
  const allItems = [...events.map((e) => ({ ...e, isTask: false })), ...taskEvents];

  function itemsOn(dateStr) {
    return allItems.filter((e) => e.date === dateStr).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  const upcomingDeadlines = useMemo(() => {
    return [...allItems]
      .filter((i) => i.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5);
  }, [allItems, today]);

  function openNew(dateStr) {
    setEditing(null);
    setForm({ ...emptyForm, date: dateStr || localISO(cursor) });
    setModalOpen(true);
  }
  function openEdit(event) { setEditing(event); setForm(event); setModalOpen(true); }
  function handleSubmit(e) {
    e.preventDefault();
    if (editing) updateEvent(editing.id, form);
    else addEvent(form);
    setModalOpen(false);
  }
  function handleDelete() { deleteEvent(editing.id); setModalOpen(false); }

  function shift(amount) {
    const next = new Date(cursor);
    if (view === 'month') next.setMonth(next.getMonth() + amount);
    else if (view === 'week') next.setDate(next.getDate() + amount * 7);
    else next.setDate(next.getDate() + amount);
    setCursor(next);
  }

  const title = view === 'day'
    ? cursor.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'week'
      ? `Week of ${startOfWeek(cursor).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;

  return (
    <div className="space-y-5 animate-fade-up max-w-6xl mx-auto pb-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-baseline justify-between gap-3 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Schedule
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Events and task deadlines unified ·{' '}
            <span style={{ color: '#818cf8', fontWeight: 600 }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </p>
        </div>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
        >
          <Plus size={13} /> New event
        </button>
      </div>

      {/* ── Controls ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <NavBtn onClick={() => shift(-1)}><ChevronLeft size={15} /></NavBtn>
          <p
            className="font-display min-w-[190px] text-center text-xs sm:text-sm font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </p>
          <NavBtn onClick={() => shift(1)}><ChevronRight size={15} /></NavBtn>
          <button
            onClick={() => setCursor(new Date())}
            className="ml-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}
          >
            Today
          </button>
        </div>

        {/* View switcher */}
        <div
          className="flex rounded-xl p-0.5 gap-0.5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)' }}
        >
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all"
              style={view === v
                ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', border: '1px solid var(--border-card)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Views ──────────────────────────────────────────── */}
      {view === 'month' && <MonthView cursor={cursor} today={today} itemsOn={itemsOn} onDayClick={openNew} onItemClick={openEdit} />}
      {view === 'week'  && <WeekView  cursor={cursor} today={today} itemsOn={itemsOn} onDayClick={openNew} onItemClick={openEdit} />}
      {view === 'day'   && <DayView   cursor={cursor} today={today} itemsOn={itemsOn} onItemClick={openEdit} />}

      {/* ── Upcoming Deadlines ─────────────────────────────── */}
      <DeadlineWidget deadlines={upcomingDeadlines} today={today} onItemClick={openEdit} />

      {/* ── Event Modal ────────────────────────────────────── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit event' : 'New event'}>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <Field label="Event title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Meeting, deadline, reminder…"
              className={inputCls}
              style={inputStyle}
            />
          </Field>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                required
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
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Event details…"
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          </Field>

          {/* Reminder toggle */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Set reminder</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Get notified before this event</p>
            </div>
            <Toggle on={form.reminder} onToggle={() => setForm((f) => ({ ...f, reminder: !f.reminder }))} />
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-between pt-1"
            style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}
          >
            {editing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)', color: '#fb7185' }}
              >
                <Trash2 size={13} /> Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
              >
                {editing ? 'Save changes' : 'Add event'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ── Nav button ─────────────────────────────────────────── */
function NavBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
    >
      {children}
    </button>
  );
}

/* ── Event chip ─────────────────────────────────────────── */
function EventChip({ item, onClick }) {
  const isTask = item.isTask;
  return (
    <div
      onClick={onClick}
      className="truncate rounded-lg px-1.5 py-0.5 text-[10px] font-semibold leading-tight cursor-pointer transition-all hover:brightness-125"
      style={{
        background: isTask ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.15)',
        border: `1px solid ${isTask ? 'rgba(251,191,36,0.25)' : 'rgba(99,102,241,0.25)'}`,
        color: isTask ? '#fbbf24' : '#818cf8',
      }}
    >
      {isTask ? '✓ ' : ''}{item.title}
    </div>
  );
}

/* ── Month View ─────────────────────────────────────────── */
function MonthView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const gridStart = startOfWeek(new Date(year, month, 1));
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart); d.setDate(d.getDate() + i); return d;
  });

  return (
    <Card className="p-3 overflow-hidden" hover={false}>
      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        {WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = localISO(d);
          const inMonth = d.getMonth() === month;
          const dayItems = itemsOn(iso);
          const isToday = iso === today;
          return (
            <button
              key={iso}
              onClick={() => onDayClick(iso)}
              className="min-h-[82px] rounded-xl p-1.5 text-left flex flex-col transition-all duration-150"
              style={{
                background: isToday ? 'rgba(99,102,241,0.08)' : inMonth ? 'var(--bg-surface)' : 'transparent',
                border: `1px solid ${isToday ? 'rgba(99,102,241,0.4)' : inMonth ? 'var(--border-subtle)' : 'transparent'}`,
                outline: isToday ? '2px solid rgba(99,102,241,0.3)' : 'none',
                outlineOffset: '1px',
                opacity: inMonth ? 1 : 0.3,
              }}
            >
              <span
                className="text-[11px] font-bold inline-flex h-5 w-5 items-center justify-center rounded-full leading-none mb-1 flex-shrink-0"
                style={{
                  background: isToday ? '#6366f1' : 'transparent',
                  color: isToday ? '#fff' : 'var(--text-primary)',
                  boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.5)' : 'none',
                }}
              >
                {d.getDate()}
              </span>
              <div className="space-y-0.5 w-full flex-1 overflow-hidden">
                {dayItems.slice(0, 2).map((item) => (
                  <EventChip
                    key={item.id}
                    item={item}
                    onClick={(e) => { e.stopPropagation(); if (!item.isTask) onItemClick(item); }}
                  />
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

/* ── Week View ──────────────────────────────────────────── */
function WeekView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i); return d;
  });

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
      {days.map((d) => {
        const iso = localISO(d);
        const dayItems = itemsOn(iso);
        const isToday = iso === today;
        return (
          <div
            key={iso}
            className="rounded-xl p-3 min-h-[140px] glass-card"
            style={isToday ? { outline: '2px solid rgba(99,102,241,0.35)', outlineOffset: '1px' } : {}}
          >
            <div className="flex items-center justify-between mb-2 pb-1.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold" style={{ color: isToday ? '#818cf8' : 'var(--text-muted)' }}>
                  {d.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black"
                  style={{
                    background: isToday ? '#6366f1' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  {d.getDate()}
                </span>
              </div>
              <button onClick={() => onDayClick(iso)} className="rounded-lg p-0.5 transition-all hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-1">
              {dayItems.length === 0 && (
                <p className="text-[10px] text-center py-2 font-mono" style={{ color: 'var(--text-muted)' }}>—</p>
              )}
              {dayItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isTask && onItemClick(item)}
                  className="cursor-pointer rounded-lg p-1.5 text-xs font-medium transition-all hover:brightness-125"
                  style={{
                    background: item.isTask ? 'rgba(251,191,36,0.10)' : 'rgba(99,102,241,0.12)',
                    border: `1px solid ${item.isTask ? 'rgba(251,191,36,0.22)' : 'rgba(99,102,241,0.22)'}`,
                    color: item.isTask ? '#fbbf24' : '#818cf8',
                  }}
                >
                  {item.time && <span className="block text-[9px] font-mono opacity-60">{item.time}</span>}
                  <span className="truncate block">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Day View ───────────────────────────────────────────── */
function DayView({ cursor, today, itemsOn, onItemClick }) {
  const iso = localISO(cursor);
  const dayItems = itemsOn(iso);
  const isToday = iso === today;

  return (
    <Card className="p-4" hover={false}>
      {isToday && (
        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-bold" style={{ color: '#818cf8' }}>Today</span>
        </div>
      )}
      {dayItems.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled" description="Enjoy the open day, or add something new." />
      ) : (
        <ul className="space-y-2">
          {dayItems.map((item) => (
            <li
              key={item.id}
              onClick={() => !item.isTask && onItemClick(item)}
              className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all hover:brightness-110"
              style={{
                background: item.isTask ? 'rgba(251,191,36,0.07)' : 'rgba(99,102,241,0.08)',
                border: `1px solid ${item.isTask ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)'}`,
              }}
            >
              <span
                className="w-14 shrink-0 font-mono text-xs font-bold pt-0.5"
                style={{ color: item.isTask ? '#fbbf24' : '#818cf8' }}
              >
                {item.time || 'All day'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {item.isTask ? '[Task] ' : ''}{item.title}
                </p>
                {item.description && (
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                )}
              </div>
              {item.isTask && (
                <span
                  className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
                >
                  Task
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Deadline Widget ────────────────────────────────────── */
function DeadlineWidget({ deadlines, today, onItemClick }) {
  const tomorrow = localISO(new Date(Date.now() + 86400000));

  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <Clock size={15} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</h3>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Next {deadlines.length} events &amp; task due dates</p>
        </div>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No upcoming deadlines" description="You're all clear!" />
      ) : (
        <div className="space-y-2">
          {deadlines.map((item) => {
            const isToday = item.date === today;
            const isTmrw = item.date === tomorrow;
            const accentColor = isToday ? '#fb7185' : isTmrw ? '#fbbf24' : 'var(--text-muted)';
            const bgColor = isToday ? 'rgba(251,113,133,0.07)' : isTmrw ? 'rgba(251,191,36,0.07)' : 'var(--bg-surface)';
            const borderColor = isToday ? 'rgba(251,113,133,0.2)' : isTmrw ? 'rgba(251,191,36,0.2)' : 'var(--border-subtle)';

            return (
              <button
                key={item.id}
                onClick={() => !item.isTask && onItemClick(item)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:brightness-110"
                style={{ background: bgColor, borderColor }}
              >
                {/* Date badge */}
                <div
                  className="shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-xl border text-center"
                  style={{ background: bgColor, borderColor, color: accentColor }}
                >
                  <span className="text-[9px] font-bold uppercase leading-none">
                    {new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })}
                  </span>
                  <span className="text-base font-black leading-tight">
                    {new Date(item.date + 'T00:00:00').getDate()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.isTask ? '☑ ' : '📅 '}{item.title}
                  </p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {relativeDay(item.date)}{item.time ? ` · ${item.time}` : ''}
                  </p>
                </div>

                <span
                  className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ color: accentColor, borderColor, background: bgColor }}
                >
                  {isToday ? 'Today' : isTmrw ? 'Tomorrow' : relativeDay(item.date)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
