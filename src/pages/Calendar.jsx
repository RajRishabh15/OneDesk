import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, CalendarDays, Clock } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { LabeledInput } from './Notes';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const emptyForm = { title: '', date: '', time: '09:00', description: '', reminder: false };

// ── KEY FIX: use local date, not UTC ─────────────────────────────────────────
// toISOString() converts to UTC which shifts the date for +5:30 timezone.
// localISO() uses local year/month/day so "today" is always correct.
function localISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfWeek(d) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

// Friendly relative label for upcoming dates
function relativeDay(iso) {
  const today = localISO(new Date());
  const tomorrow = localISO(new Date(Date.now() + 86400000));
  if (iso === today) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  const d = new Date(iso + 'T00:00:00'); // force local parse
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

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

  // Upcoming deadlines: tasks+events sorted by date, future only
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
  function openEdit(event) {
    setEditing(event);
    setForm(event);
    setModalOpen(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (editing) updateEvent(editing.id, form);
    else addEvent(form);
    setModalOpen(false);
  }

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
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Schedule</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Events and task deadlines unified •{' '}
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </p>
        </div>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-stone-100 px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus size={13} /> New event
        </button>
      </div>

      {/* ── Controls ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => shift(-1)}
            className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <p className="font-display min-w-[190px] text-center text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">{title}</p>
          <button
            onClick={() => shift(1)}
            className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="ml-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-0.5">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${view === v ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Calendar views ─────────────────────────────────── */}
      {view === 'month' && <MonthView cursor={cursor} today={today} itemsOn={itemsOn} onDayClick={openNew} onItemClick={openEdit} />}
      {view === 'week' && <WeekView cursor={cursor} today={today} itemsOn={itemsOn} onDayClick={openNew} onItemClick={openEdit} />}
      {view === 'day' && <DayView cursor={cursor} today={today} itemsOn={itemsOn} onItemClick={openEdit} />}

      {/* ── Upcoming Deadlines Widget ──────────────────────── */}
      <DeadlineWidget deadlines={upcomingDeadlines} today={today} onItemClick={openEdit} />

      {/* ── Modal ──────────────────────────────────────────── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit event' : 'New event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput label="Event title" required value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="Meeting, deadline, reminder..." />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Date" type="date" required value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
            <LabeledInput label="Time" type="time" required value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Event details..."
              className="w-full rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-2.5 text-xs outline-none transition-all placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-stone-400"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 cursor-pointer">
            <input type="checkbox" checked={form.reminder} onChange={(e) => setForm((f) => ({ ...f, reminder: e.target.checked }))} className="rounded text-stone-900 focus:ring-stone-400" />
            <Bell size={13} className="text-stone-500" /> Remind me
          </label>
          <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-800">
            {editing ? (
              <button
                type="button"
                onClick={() => { deleteEvent(editing.id); setModalOpen(false); }}
                className="rounded-lg border border-rose-200 dark:border-rose-900/40 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Delete
              </button>
            ) : <div />}
            <div className="flex gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-stone-200 dark:border-stone-800 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-stone-100 px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors">
                {editing ? 'Save changes' : 'Add event'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ── Deadline Widget ──────────────────────────────────────────────────────────
function DeadlineWidget({ deadlines, today, onItemClick }) {
  return (
    <Card className="p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20">
          <Clock size={14} className="text-amber-500 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Upcoming Deadlines</h3>
          <p className="text-[10px] text-stone-400">Next {deadlines.length} events &amp; task due dates</p>
        </div>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No upcoming deadlines" description="You're all clear — no events or tasks due soon." />
      ) : (
        <div className="space-y-2">
          {deadlines.map((item) => {
            const isToday = item.date === today;
            const isTomorrow = item.date === localISO(new Date(Date.now() + 86400000));
            const urgency = isToday
              ? 'border-rose-400/40 bg-rose-500/5 dark:bg-rose-500/10'
              : isTomorrow
                ? 'border-amber-400/40 bg-amber-500/5 dark:bg-amber-500/10'
                : 'border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-900/30';

            return (
              <button
                key={item.id}
                onClick={() => !item.isTask && onItemClick(item)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:brightness-110 ${urgency}`}
              >
                {/* Date badge */}
                <div className={`shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-lg border text-center
                  ${isToday ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400'
                  : isTomorrow ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'}`}>
                  <span className="text-[10px] font-bold leading-none uppercase">
                    {new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })}
                  </span>
                  <span className="text-base font-black leading-tight">
                    {new Date(item.date + 'T00:00:00').getDate()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                    {item.isTask ? '☑ ' : '📅 '}{item.title}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
                    {relativeDay(item.date)}{item.time ? ` · ${item.time}` : ''}
                  </p>
                </div>

                {/* Urgency label */}
                <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                  ${isToday ? 'text-rose-500 border-rose-500/30 bg-rose-500/10'
                  : isTomorrow ? 'text-amber-600 border-amber-500/30 bg-amber-500/10'
                  : 'text-stone-400 border-stone-300 dark:border-stone-700 bg-transparent'}`}>
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : relativeDay(item.date)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Month View ───────────────────────────────────────────────────────────────
function MonthView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = startOfWeek(firstDay);
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <Card className="p-3 overflow-hidden" hover={false}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
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
              className={[
                'min-h-[86px] rounded-xl border p-1.5 text-left transition-all flex flex-col',
                inMonth
                  ? 'border-stone-200/60 dark:border-stone-800/80 bg-white dark:bg-[#1a1a18]'
                  : 'border-transparent opacity-30 bg-stone-50/50 dark:bg-transparent',
                isToday
                  ? '!border-indigo-400 dark:!border-indigo-500 ring-2 ring-indigo-400/30 dark:ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                  : '',
                'hover:bg-stone-50 dark:hover:bg-stone-800/50',
              ].join(' ')}
            >
              {/* Day number */}
              <span className={[
                'text-xs inline-flex h-5 w-5 items-center justify-center rounded-full font-semibold leading-none mb-1',
                isToday
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40 font-bold'
                  : inMonth
                    ? 'text-stone-700 dark:text-stone-300'
                    : 'text-stone-400',
              ].join(' ')}>
                {d.getDate()}
              </span>

              <div className="space-y-0.5 w-full flex-1">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); if (!item.isTask) onItemClick(item); }}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight ${
                      item.isTask
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60'
                        : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                    }`}
                  >
                    {item.isTask ? '✓ ' : ''}{item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <p className="text-[9px] text-stone-400 font-mono px-1">+{dayItems.length - 2} more</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── Week View ────────────────────────────────────────────────────────────────
function WeekView({ cursor, today, itemsOn, onDayClick, onItemClick }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-7">
      {days.map((d) => {
        const iso = localISO(d);
        const dayItems = itemsOn(iso);
        const isToday = iso === today;
        return (
          <Card key={iso} className={`p-3 min-h-[160px] transition-all ${isToday ? '!border-indigo-400 dark:!border-indigo-500 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/10' : ''}`}>
            <div className="mb-2 flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isToday ? 'text-indigo-500 dark:text-indigo-400' : 'text-stone-700 dark:text-stone-300'}`}>
                  {d.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-black ${isToday ? 'bg-indigo-500 text-white' : 'text-stone-500'}`}>
                  {d.getDate()}
                </span>
              </div>
              <button onClick={() => onDayClick(iso)} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 rounded">
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-1">
              {dayItems.length === 0 && <p className="text-[10px] text-stone-400 py-2 text-center font-mono">—</p>}
              {dayItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isTask && onItemClick(item)}
                  className={`cursor-pointer rounded-md p-1.5 text-xs font-medium transition-colors ${
                    item.isTask
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60'
                      : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                  }`}
                >
                  {item.time && <span className="font-mono text-[10px] block opacity-60">{item.time}</span>}
                  <span className="truncate block">{item.title}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── Day View ─────────────────────────────────────────────────────────────────
function DayView({ cursor, today, itemsOn, onItemClick }) {
  const iso = localISO(cursor);
  const dayItems = itemsOn(iso);
  const isToday = iso === today;

  return (
    <Card className={`p-4 ${isToday ? '!border-indigo-400 dark:!border-indigo-500' : ''}`} hover={false}>
      {isToday && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-indigo-100 dark:border-indigo-900/40">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">Today</span>
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
              className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                item.isTask
                  ? 'border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  : 'border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
              }`}
            >
              <span className="w-16 shrink-0 font-mono text-xs font-semibold text-stone-600 dark:text-stone-300 pt-0.5">
                {item.time || 'All day'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                  {item.isTask ? '[Task Due] ' : ''}{item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">{item.description}</p>
                )}
              </div>
              {item.isTask && (
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60">
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
