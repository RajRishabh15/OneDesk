import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  StickyNote,
  X,
  Pin,
  Sparkles,
  Tag,
  Filter,
  Layers,
  FileText
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
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg hover:brightness-110 active:scale-95"
          style={{
            background: 'var(--accent-gradient)',
            boxShadow: '0 4px 18px var(--accent-glow)',
          }}
        >
          <Plus size={15} /> New note
        </button>
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
            className="w-full rounded-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm outline-none border transition-all glass-card"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-card)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all hover:bg-[var(--bg-surface)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((c) => {
            const count = c === 'All' ? notes.length : notes.filter((n) => n.category === c).length;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border shrink-0"
                style={{
                  background: active ? 'var(--accent-gradient)' : 'var(--bg-surface)',
                  borderColor: active ? 'transparent' : 'var(--border-subtle)',
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: active ? '0 2px 10px var(--accent-glow)' : 'none',
                }}
              >
                <span>{c}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded-full"
                  style={{
                    background: active ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
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
              Note title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Give your note a title…"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Content
              </label>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {form.description.length} chars
              </span>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={8}
              placeholder="Write your notes, lists, references, or markdown here…"
              className="w-full rounded-xl p-3.5 text-xs sm:text-sm outline-none border transition-all resize-none leading-relaxed"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Category & Tags */}
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
                placeholder="e.g., College, Work, Personal, Ideas"
                className="w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
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
                placeholder="e.g., AI, roadmap, exam"
                className="w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Color Swatches */}
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Card accent color
            </label>
            <div className="flex items-center gap-2.5">
              {NOTE_COLORS.map((c) => {
                const active = form.color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c.id }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all"
                    style={{
                      background: active ? `${c.hex}22` : 'var(--bg-surface)',
                      borderColor: active ? c.hex : 'var(--border-subtle)',
                      boxShadow: active ? `0 0 12px ${c.hex}44` : 'none',
                    }}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
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
              className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
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
