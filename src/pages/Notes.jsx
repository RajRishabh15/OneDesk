import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  StickyNote,
  X,
  Pin,
  FileText,
  Sparkles,
  Check,
  Bold,
  Italic,
  List,
  CheckSquare,
} from 'lucide-react';
import Modal from '../components/Modal';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import { useData } from '../context/DataContext';

const NOTE_COLORS = [
  { id: 'violet', label: 'Violet', hex: '#8b5cf6' },
  { id: 'cyan',   label: 'Cyan',   hex: '#38bdf8' },
  { id: 'green',  label: 'Emerald',hex: '#34d399' },
  { id: 'amber',  label: 'Amber',  hex: '#fbbf24' },
  { id: 'rose',   label: 'Rose',   hex: '#fb7185' },
];

const CATEGORY_SUGGESTIONS = ['Personal', 'Work', 'Ideas', 'Study', 'Projects', 'Journal'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Personal',
  tags: '',
  color: 'violet',
};

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Quick Inline Note State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickCategory, setQuickCategory] = useState('Personal');
  const [quickColor, setQuickColor] = useState('violet');
  const [quickExpanded, setQuickExpanded] = useState(false);

  function handleQuickSubmit(e) {
    e.preventDefault();
    if (!quickTitle.trim() && !quickDesc.trim()) return;
    addNote({
      title: quickTitle.trim() || 'Quick Note',
      description: quickDesc,
      category: quickCategory,
      tags: [],
      color: quickColor,
    });
    setQuickTitle('');
    setQuickDesc('');
    setQuickExpanded(false);
  }

  function insertFormatting(prefix, suffix = '') {
    const textarea = document.getElementById('note-modal-description');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.description;
    const selected = text.substring(start, end);
    const replacement = prefix + selected + suffix;
    const updated = text.substring(0, start) + replacement + text.substring(end);
    setForm((f) => ({ ...f, description: updated }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  }

  const categories = useMemo(() => {
    return ['All', ...new Set(notes.map((n) => n.category).filter(Boolean))];
  }, [notes]);

  const filtered = useMemo(() => {
    let list = notes;
    if (category !== 'All') {
      list = list.filter((n) => n.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [notes, query, category]);

  const pinnedCount = notes.filter((n) => n.pinned).length;

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(note) {
    setEditing(note);
    setForm({
      title: note.title || '',
      description: note.description || '',
      category: note.category || 'General',
      tags: note.tags?.join(', ') || '',
      color: note.color || 'violet',
    });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description,
      category: form.category.trim() || 'General',
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      color: form.color,
    };
    if (editing) updateNote(editing.id, payload);
    else addNote(payload);
    setModalOpen(false);
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Notes &amp; Ideas
            </h1>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-card)',
                background: 'var(--bg-surface)',
              }}
            >
              <FileText size={11} /> {notes.length} saved
            </span>
            {pinnedCount > 0 && (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border text-amber-400"
                style={{
                  background: 'rgba(251,191,36,0.1)',
                  borderColor: 'rgba(251,191,36,0.25)',
                }}
              >
                <Pin size={10} fill="currentColor" /> {pinnedCount} pinned
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Capture thoughts, documentation, quick links, and study notes in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="btn-glass-primary rounded-full px-5 py-2.5 text-xs font-bold shrink-0 shadow-md"
        >
          <Plus size={15} /> <span>New note</span>
        </button>
      </div>

      {/* ── Enhanced Inline Quick Note Creator ─────────────────── */}
      <div
        className="rounded-[24px] border p-3.5 sm:p-5 transition-all duration-300 relative overflow-hidden"
        style={{
          background: 'var(--bg-card-solid)',
          borderColor: quickExpanded ? 'var(--accent-color)' : 'var(--border-card)',
          boxShadow: quickExpanded ? '0 10px 30px -10px var(--accent-glow)' : 'var(--card-shadow, none)',
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: 'var(--accent-gradient)', color: '#fff' }}
          >
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Quick Note
          </span>
          <span className="text-[11px] ml-auto hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            Jot down ideas instantly
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onFocus={() => setQuickExpanded(true)}
            placeholder={quickExpanded ? "Note Title..." : "Take a quick note or brainstorm an idea..."}
            className="w-full bg-transparent text-sm sm:text-base font-semibold outline-none px-1"
            style={{ color: 'var(--text-primary)' }}
          />

          {quickExpanded && (
            <div className="space-y-3 pt-2 animate-fade-in border-t border-[var(--border-subtle)]">
              <textarea
                value={quickDesc}
                onChange={(e) => setQuickDesc(e.target.value)}
                placeholder="Write your thoughts, checklist, or details here..."
                rows={3}
                className="w-full rounded-2xl p-3 text-xs sm:text-sm outline-none border transition-all resize-none leading-relaxed"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />

              {/* Category Suggestion Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>
                  Category:
                </span>
                {CATEGORY_SUGGESTIONS.map((cat) => {
                  const active = quickCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setQuickCategory(cat)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all border"
                      style={{
                        background: active ? 'var(--accent-color)' : 'var(--bg-surface)',
                        color: active ? '#fff' : 'var(--text-muted)',
                        borderColor: active ? 'var(--accent-color)' : 'var(--border-card)',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Bottom bar: Color dots & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden xs:inline" style={{ color: 'var(--text-muted)' }}>
                    Color:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {NOTE_COLORS.map((c) => {
                      const active = quickColor === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setQuickColor(c.id)}
                          className="w-6 h-6 rounded-full transition-transform flex items-center justify-center"
                          style={{
                            backgroundColor: c.hex,
                            transform: active ? 'scale(1.2)' : 'scale(1)',
                            boxShadow: active ? `0 0 10px ${c.hex}` : 'none',
                          }}
                          title={c.label}
                        >
                          {active && <Check size={12} className="text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickExpanded(false);
                      setQuickTitle('');
                      setQuickDesc('');
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:bg-[var(--bg-surface)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={!quickTitle.trim() && !quickDesc.trim()}
                    className="btn-glass-primary rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-40 shadow-sm"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ── Search & Filter Bar ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, tags, or content…"
            className="w-full rounded-full py-2.5 pl-10 pr-9 text-xs sm:text-sm outline-none border transition-all glass-card"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-card)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all hover:bg-[var(--bg-surface)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Pills Track */}
        <div
          className="flex items-center p-1 gap-1 rounded-full border overflow-x-auto scrollbar-none shrink-0"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {categories.map((c) => {
            const count = c === 'All' ? notes.length : notes.filter((n) => n.category === c).length;
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 select-none ${
                  active ? 'shadow-sm font-bold' : 'hover:bg-white/[0.04]'
                }`}
                style={
                  active
                    ? {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-card)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      }
                    : {
                        color: 'var(--text-muted)',
                        border: '1px solid transparent',
                      }
                }
              >
                <span>{c}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded-full"
                  style={{
                    background: active ? 'var(--bg-surface)' : 'transparent',
                    color: active ? 'var(--accent-color)' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notes Grid ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center" hover={false}>
          <EmptyState
            icon={StickyNote}
            title={notes.length === 0 ? 'No notes captured yet' : 'No matching notes found'}
            description={
              notes.length === 0
                ? 'Capture your thoughts, plans, and ideas in one place.'
                : `No notes matched "${query}". Try a different keyword or category.`
            }
            actionLabel={notes.length === 0 ? 'Create first note' : 'Clear search'}
            onAction={notes.length === 0 ? openNew : () => { setQuery(''); setCategory('All'); }}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEdit}
              onDelete={deleteNote}
              onTogglePin={togglePinNote}
            />
          ))}
        </div>
      )}

      {/* ── Enhanced Note Creation / Edit Modal ────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit note' : 'New note'}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Title */}
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Note Title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Give your note a title…"
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Description Textarea with Quick Formatting Toolbar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Content & Notes
              </label>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded-lg border text-xs font-bold transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  title="Bold (**text**)"
                >
                  <Bold size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1 rounded-lg border text-xs transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  title="Italic (*text*)"
                >
                  <Italic size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n- ')}
                  className="p-1 rounded-lg border text-xs transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  title="Bullet List (- item)"
                >
                  <List size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n- [ ] ')}
                  className="p-1 rounded-lg border text-xs transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  title="Checklist (- [ ] item)"
                >
                  <CheckSquare size={12} />
                </button>
                <span className="text-[10px] font-mono ml-1" style={{ color: 'var(--text-muted)' }}>
                  {form.description.length} chars
                </span>
              </div>
            </div>

            <textarea
              id="note-modal-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Write your notes, thoughts, references, markdown, or lists here…"
              className="w-full rounded-2xl p-3.5 text-xs sm:text-sm outline-none border transition-all resize-y min-h-[105px] max-h-[260px] custom-scrollbar leading-relaxed"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Category & Tags with Quick Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g., Personal, Work, Ideas..."
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all mb-1.5"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all shrink-0"
                    style={{
                      background: form.category === cat ? 'var(--accent-color)' : 'var(--bg-surface)',
                      borderColor: form.category === cat ? 'var(--accent-color)' : 'var(--border-subtle)',
                      color: form.category === cat ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Tags (comma-separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="e.g., AI, study, urgent"
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Separate tags with commas to make searching instant
              </p>
            </div>
          </div>

          {/* Color Swatches */}
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Card Accent Theme
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {NOTE_COLORS.map((c) => {
                const active = form.color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c.id }))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      background: active ? `${c.hex}25` : 'var(--bg-surface)',
                      borderColor: active ? c.hex : 'var(--border-subtle)',
                      boxShadow: active ? `0 0 14px ${c.hex}55` : 'none',
                    }}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full shadow-sm"
                      style={{ background: c.hex }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      {c.label}
                    </span>
                  </button>
                );
              })}
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
              className="rounded-full px-5 py-2.5 text-xs font-semibold transition-all hover:bg-[var(--bg-surface)]"
              style={{
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
              style={{
                background: 'var(--accent-gradient)',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
            >
              {editing ? 'Save changes' : 'Add note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function LabeledInput({ label, value, onChange, placeholder = '', type = 'text', required = false, ...rest }) {
  return (
    <div>
      {label && (
        <label
          className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition-all"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-card)',
          color: 'var(--text-primary)',
        }}
        {...rest}
      />
    </div>
  );
}
