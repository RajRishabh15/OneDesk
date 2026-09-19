import { useState } from 'react';
import { Pin, Pencil, Trash2, Download, Copy, Check, Clock, Tag } from 'lucide-react';
import Card from './Card';

const COLOR_ACCENTS = {
  violet: {
    border: 'rgba(139, 92, 246, 0.4)',
    glow: 'rgba(139, 92, 246, 0.15)',
    bar: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
    badgeBg: 'rgba(139, 92, 246, 0.12)',
    badgeText: '#a78bfa',
  },
  cyan: {
    border: 'rgba(56, 189, 248, 0.4)',
    glow: 'rgba(56, 189, 248, 0.15)',
    bar: 'linear-gradient(90deg, #0284c7, #38bdf8)',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    badgeText: '#38bdf8',
  },
  green: {
    border: 'rgba(52, 211, 153, 0.4)',
    glow: 'rgba(52, 211, 153, 0.15)',
    bar: 'linear-gradient(90deg, #059669, #34d399)',
    badgeBg: 'rgba(52, 211, 153, 0.12)',
    badgeText: '#34d399',
  },
  amber: {
    border: 'rgba(251, 191, 36, 0.4)',
    glow: 'rgba(251, 191, 36, 0.15)',
    bar: 'linear-gradient(90deg, #d97706, #fbbf24)',
    badgeBg: 'rgba(251, 191, 36, 0.12)',
    badgeText: '#fbbf24',
  },
  rose: {
    border: 'rgba(251, 113, 133, 0.4)',
    glow: 'rgba(251, 113, 133, 0.15)',
    bar: 'linear-gradient(90deg, #e11d48, #fb7185)',
    badgeBg: 'rgba(251, 113, 133, 0.12)',
    badgeText: '#fb7185',
  },
};

function relativeDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - new Date(date).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 0) return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${diffDays}d ago`;
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const [copied, setCopied] = useState(false);
  const accent = COLOR_ACCENTS[note.color] || COLOR_ACCENTS.violet;

  function handleCopy(e) {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.description || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleExport(e) {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.description || ''}\n\nCategory: ${note.category || 'General'}\nTags: ${note.tags?.join(', ') || 'None'}\nCreated: ${note.createdAt || new Date().toISOString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `${note.title.replace(/\s+/g, '_') || 'note'}.txt`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card
      className="relative flex flex-col justify-between overflow-hidden p-4 sm:p-5 transition-all duration-200 group hover:scale-[1.01]"
      style={{
        borderColor: note.pinned ? accent.border : 'var(--border-card)',
        boxShadow: note.pinned ? `0 4px 24px ${accent.glow}` : undefined,
      }}
    >
      {/* Accent strip */}
      <div
        className="absolute top-0 inset-x-0 h-1 transition-opacity"
        style={{
          background: accent.bar,
          opacity: note.pinned ? 1 : 0.65,
        }}
      />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-2">
          <div className="min-w-0 flex-1">
            {note.category && (
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 border"
                style={{
                  background: accent.badgeBg,
                  color: accent.badgeText,
                  borderColor: accent.border,
                }}
              >
                {note.category}
              </span>
            )}
            <h3
              className="font-display text-sm sm:text-base font-bold tracking-tight leading-snug truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {note.title}
            </h3>
          </div>

          {/* Pin Button */}
          <button
            onClick={() => onTogglePin(note.id)}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            title={note.pinned ? 'Unpin note' : 'Pin to top'}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: note.pinned ? accent.badgeBg : 'var(--bg-surface)',
              color: note.pinned ? accent.badgeText : 'var(--text-muted)',
              border: `1px solid ${note.pinned ? accent.border : 'var(--border-subtle)'}`,
            }}
          >
            <Pin size={13} fill={note.pinned ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Note Body */}
        <p
          className="whitespace-pre-line text-xs sm:text-sm line-clamp-4 leading-relaxed font-sans mt-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {note.description || <span className="italic opacity-50">Empty note…</span>}
        </p>
      </div>

      {/* Footer Area */}
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium border"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Clock size={11} className="opacity-70" />
            {relativeDate(note.createdAt)}
          </span>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              aria-label="Copy note content"
              title={copied ? 'Copied!' : 'Copy note'}
              className="p-1.5 rounded-lg transition-all hover:bg-[var(--bg-surface)]"
              style={{ color: copied ? '#34d399' : 'var(--text-muted)' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
            <button
              onClick={handleExport}
              aria-label="Export note as text file"
              title="Download as .txt"
              className="p-1.5 rounded-lg transition-all hover:bg-[var(--bg-surface)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Download size={12} />
            </button>
            <button
              onClick={() => onEdit(note)}
              aria-label="Edit note"
              title="Edit note"
              className="p-1.5 rounded-lg transition-all hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              aria-label="Delete note"
              title="Delete note"
              className="p-1.5 rounded-lg transition-all hover:bg-rose-500/10 hover:text-rose-400"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
