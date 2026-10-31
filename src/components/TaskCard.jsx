import { Calendar, Trash2, Pencil, Check, Clock, AlertCircle } from 'lucide-react';
import Card from './Card';

const PRIORITY_THEMES = {
  High: {
    label: 'High',
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.12)',
    border: 'rgba(251, 113, 133, 0.3)',
  },
  Medium: {
    label: 'Medium',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.3)',
  },
  Low: {
    label: 'Low',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.3)',
  },
};

function formatDue(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);
  if (diffDays === 0) return { label: 'Today', isToday: true, isOverdue: false };
  if (diffDays === 1) return { label: 'Tomorrow', isToday: false, isOverdue: false };
  if (diffDays === -1) return { label: 'Yesterday', isToday: false, isOverdue: true };
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, isToday: false, isOverdue: true };
  return {
    label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    isToday: false,
    isOverdue: false,
  };
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  isNotebook,
}) {
  const priority = PRIORITY_THEMES[task.priority] || PRIORITY_THEMES.Medium;
  const dueInfo = formatDue(task.dueDate);
  const isCompleted = task.status === 'Completed';
  const overdue = !isCompleted && dueInfo?.isOverdue;
  const dueToday = !isCompleted && dueInfo?.isToday;

  // Notebook washi tape class per priority
  const washiClass = isNotebook
    ? task.priority === 'High'
      ? 'nb-washi nb-washi-rose'
      : task.priority === 'Low'
      ? 'nb-washi nb-washi-green'
      : 'nb-washi'
    : '';

  return (
    <Card
      className={`p-3 sm:p-3.5 rounded-[20px] group transition-all duration-200 border relative ${
        isCompleted ? 'opacity-65' : 'hover:scale-[1.008]'
      }${isNotebook ? ` nb-dog-ear mt-5 ${washiClass}` : ''}`}
      style={{
        borderColor: 'var(--border-card)',
        background: isCompleted ? 'var(--bg-surface)' : undefined,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Generous Touch Target Checkbox for Mobile Thumbs */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
          }}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          className="p-1.5 -m-1.5 shrink-0 flex items-center justify-center cursor-pointer select-none active:scale-85 transition-transform touch-manipulation focus:outline-none"
        >
          <div
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-xs"
            style={{
              background: isCompleted ? 'var(--accent-gradient)' : 'var(--bg-surface)',
              borderColor: isCompleted
                ? 'transparent'
                : isNotebook
                ? 'var(--nb-stitch-color)'
                : priority.border,
              boxShadow: isCompleted ? '0 0 10px var(--accent-glow)' : 'none',
            }}
          >
            {isCompleted && <Check size={11} strokeWidth={3.2} className="text-white drop-shadow-sm" />}
          </div>
        </button>

        {/* Task Content: Title, Badges, and optional description (Tappable to Edit) */}
        <div
          className="min-w-0 flex-1 cursor-pointer select-none py-0.5"
          onClick={() => onEdit(task)}
        >
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-xs sm:text-sm font-semibold tracking-tight transition-all truncate ${
                isCompleted && !isNotebook ? 'line-through opacity-50' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              {isCompleted && isNotebook ? (
                <span className="nb-strikethrough">{task.title}</span>
              ) : (
                task.title
              )}
            </p>
          </div>

          {task.description && (
            <p
              className="mt-0.5 text-[11px] line-clamp-1 leading-relaxed opacity-75"
              style={{ color: 'var(--text-muted)' }}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Badges (Priority, Due Date, Category) */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {/* Priority Badge */}
            {isNotebook ? (
              <span className={`nb-stamp ${task.priority === 'High' ? 'nb-stamp-high' : ''}`}>
                {priority.label}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold border"
                style={{
                  background: priority.bg,
                  borderColor: priority.border,
                  color: priority.color,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: priority.color }} />
                {priority.label}
              </span>
            )}

            {/* Due Date Badge */}
            {dueInfo && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-mono font-semibold border transition-colors ${
                  overdue
                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                    : dueToday
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                }`}
              >
                {overdue ? <AlertCircle size={9.5} /> : <Calendar size={9.5} />}
                <span>{dueInfo.label}</span>
              </span>
            )}

            {/* Category Badge */}
            {task.category && task.category !== 'General' && (
              <span
                className="rounded-full px-2 py-0.5 text-[9.5px] font-medium border"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                {task.category}
              </span>
            )}

            {/* Status indicator on Kanban or list if in progress */}
            {task.status === 'In Progress' && (
              <span
                className="rounded-full px-2 py-0.5 text-[9.5px] font-bold border"
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                }}
              >
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Touch Buttons (Edit & Delete) */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Edit task"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:bg-[var(--bg-surface)] active:scale-90"
            style={{ color: 'var(--text-muted)' }}
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label="Delete task"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:bg-rose-500/15 hover:text-rose-400 active:scale-90"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </Card>
  );
}
