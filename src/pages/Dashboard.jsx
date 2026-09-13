import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowUpRight, Plus, Clock, FileText } from 'lucide-react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const priorityPill = {
  High: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/30',
  Medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/30',
  Low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/30',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, notes, events, setTaskStatus, addTask } = useData();

  const [inlineTaskTitle, setInlineTaskTitle] = useState('');

  const completed = tasks.filter((t) => t.status === 'Completed');
  const pending = tasks.filter((t) => t.status !== 'Completed');
  const today = new Date().toISOString().slice(0, 10);
  const todaysEvents = events.filter((e) => e.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const pct = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  function handleQuickTaskAdd(e) {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;
    addTask({
      title: inlineTaskTitle.trim(),
      priority: 'Medium',
      dueDate: today,
      status: 'Todo',
      category: 'General',
    });
    setInlineTaskTitle('');
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-6xl mx-auto pb-8">
      {/* Editorial Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-1">
              {todayFormatted}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Welcome back, {user?.name?.split(' ')[0] || 'friend'}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span>
              <strong className="font-semibold text-stone-900 dark:text-stone-100">{pending.length}</strong> tasks pending
            </span>
            <span>·</span>
            <span>
              <strong className="font-semibold text-stone-900 dark:text-stone-100">{todaysEvents.length}</strong> events today
            </span>
            <span>·</span>
            <span>
              <strong className="font-semibold text-stone-900 dark:text-stone-100">{pct}%</strong> completed
            </span>
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="mt-4 h-1 w-full bg-stone-200/70 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-900 dark:bg-stone-200 transition-all duration-500 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Focus Checklist & Inline Quick Add (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
              Today's Priorities
            </h2>
            <Link
              to="/tasks"
              className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-0.5"
            >
              All tasks <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Things 3 Style Inline Task Input */}
          <form
            onSubmit={handleQuickTaskAdd}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#1a1a18] shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-stone-400 dark:focus-within:border-stone-600 transition-all"
          >
            <div className="h-4 w-4 rounded-full border border-dashed border-stone-300 dark:border-stone-600 flex items-center justify-center shrink-0">
              <Plus size={10} className="text-stone-400" />
            </div>
            <input
              type="text"
              value={inlineTaskTitle}
              onChange={(e) => setInlineTaskTitle(e.target.value)}
              placeholder="Add a task for today... (Press Enter to save)"
              className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-stone-400 text-stone-900 dark:text-stone-100"
            />
            {inlineTaskTitle.trim() && (
              <button
                type="submit"
                className="shrink-0 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-2.5 py-1 rounded-md"
              >
                Add
              </button>
            )}
          </form>

          {/* Task List */}
          <Card className="divide-y divide-stone-100 dark:divide-stone-800/80 p-0 overflow-hidden" hover={false}>
            {pending.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 mb-2">
                  <Check size={16} />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">All tasks completed</p>
                <p className="text-xs text-stone-400 mt-0.5">You are clear for the rest of today.</p>
              </div>
            ) : (
              pending.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 px-3.5 py-3 hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => setTaskStatus(task.id, 'Completed')}
                      className="h-4.5 w-4.5 rounded-full border border-stone-300 dark:border-stone-600 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center justify-center transition-colors shrink-0"
                      title="Mark as done"
                    >
                      <Check size={11} className="text-transparent group-hover:text-stone-400 hover:text-emerald-600" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                          Due {task.dueDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityPill[task.priority] || priorityPill.Medium}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Right Column: Timeline & Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Schedule / Timeline */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
                Today's Schedule
              </h2>
              <Link
                to="/calendar"
                className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-0.5"
              >
                Calendar <ArrowUpRight size={13} />
              </Link>
            </div>

            <Card className="p-3.5 space-y-2.5" hover={false}>
              {todaysEvents.length === 0 ? (
                <div className="py-4 text-center">
                  <Clock size={16} className="mx-auto text-stone-300 dark:text-stone-600 mb-1" />
                  <p className="text-xs text-stone-500">No scheduled events for today.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaysEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60"
                    >
                      <span className="shrink-0 font-mono text-[11px] font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-stone-200/80 dark:border-stone-700">
                        {evt.time}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{evt.title}</p>
                        {evt.description && (
                          <p className="text-[11px] text-stone-500 truncate">{evt.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Scratchpad / Recent Notes */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
                Recent Notes
              </h2>
              <Link
                to="/notes"
                className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-0.5"
              >
                All notes <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-2">
              {recentNotes.length === 0 ? (
                <Card className="p-4 text-center" hover={false}>
                  <FileText size={16} className="mx-auto text-stone-300 dark:text-stone-600 mb-1" />
                  <p className="text-xs text-stone-500">No notes written yet.</p>
                </Card>
              ) : (
                recentNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="p-3 transition-colors hover:border-stone-300 dark:hover:border-stone-700"
                    hover={false}
                  >
                    <Link to="/notes" className="block">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {note.title}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                        {note.description || 'Empty note...'}
                      </p>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
