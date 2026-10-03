import { Calendar, Trash2, Pencil, Check, Clock } from 'lucide-react';
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
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete, draggable, onDragStart, isNotebook }) {
  const priority = PRIORITY_THEMES[task.priority] || PRIORITY_THEMES.Medium;
  const due = formatDue(task.dueDate);
  const overdue = task.status !== 'Completed' && due?.includes('overdue');
  const isCompleted = task.status === 'Completed';

  // Notebook washi tape class per priority
  const washiClass = isNotebook
    ? task.priority === 'High' ? 'nb-washi nb-washi-rose'
    : task.priority === 'Low'  ? 'nb-washi nb-washi-green'
    : 'nb-washi'
    : '';

  return (
    <Card
      className={`p-3.5 group transition-all duration-200 ${
        isCompleted
          ? 'opacity-60'
          : 'hover:scale-[1.01]'
      }${isNotebook ? ` nb-dog-ear mt-6 ${washiClass}` : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="flex items-start gap-3">
        {/* Tactile Circular Checkbox */}
        <button
          onClick={() => onToggleComplete(task)}
          aria-label={isCompleted ? 'Mark as not complete' : 'Mark as complete'}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition-all cursor-pointer"
          style={{
            background: isCompleted ? 'var(--accent-gradient)' : 'var(--bg-surface)',
            borderColor: isCompleted ? 'transparent' : isNotebook ? 'var(--nb-stitch-color)' : 'var(--border-card)',
            boxShadow: isCompleted ? '0 0 10px var(--accent-glow)' : 'none',
          }}
        >
          {isCompleted && <Check size={10} strokeWidth={3} className="text-white" />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-xs sm:text-sm font-semibold tracking-tight transition-all ${
              isCompleted && !isNotebook ? 'line-through opacity-50' : ''
            }`}
            style={{ color: 'var(--text-primary)' }}
          >
            {/* Notebook ink strikethrough for completed tasks */}
            {isCompleted && isNotebook
              ? <span className="nb-strikethrough">{task.title}</span>
              : task.title
            }
          </p>

          {task.description && (
            <p
              className="mt-1 text-xs line-clamp-2 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {/* Priority Badge — ink stamp in notebook mode */}
            {isNotebook ? (
              <span
                className={`nb-stamp ${
                  task.priority === 'High' ? 'nb-stamp-high' : ''
                }`}
              >
                {priority.label}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold border"
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
            {due && (
              <span
                className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono font-semibold border"
                style={{
                  background: overdue ? 'rgba(251, 113, 133, 0.12)' : 'var(--bg-surface)',
                  borderColor: overdue ? 'rgba(251, 113, 133, 0.3)' : 'var(--border-subtle)',
                  color: overdue ? '#fb7185' : 'var(--text-muted)',
                }}
              >
                <Calendar size={10} /> {due}
              </span>
            )}

            {/* Category */}
            {task.category && (
              <span
                className="rounded-lg px-2 py-0.5 text-[10px] font-medium border"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                {task.category}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex shrink-0 gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="p-1 rounded-lg transition-all hover:bg-[var(--bg-surface)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="p-1 rounded-lg transition-all hover:bg-rose-500/10 hover:text-rose-400"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </Card>
  );
}
