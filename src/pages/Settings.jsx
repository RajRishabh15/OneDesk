import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Download, Upload, Trash2, User, LogOut,
  Palette, Shield, Database, Check, Sparkles, Lock,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

/* ─── Small reusable pieces ──────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  );
}

function Panel({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }} />;
}

function Row({ label, sub, children, danger }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: danger ? '#fb7185' : 'var(--text-primary)' }}
        >
          {label}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>
            {sub}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function GhostBtn({ children, danger, onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: danger ? 'rgba(251,113,133,0.08)' : 'var(--bg-surface)',
        borderColor: danger ? 'rgba(251,113,133,0.25)' : 'var(--border-card)',
        color: danger ? '#fb7185' : 'var(--text-primary)',
      }}
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ children, type = 'button', onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-md"
      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
    >
      {children}
    </button>
  );
}

function Toggle({ on, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      aria-label={label}
      className="relative h-6 w-11 rounded-full flex-shrink-0 transition-all duration-300"
      style={{
        background: on ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        boxShadow: on ? '0 0 14px rgba(99,102,241,0.45)' : 'none',
      }}
    >
      <span
        className="absolute top-0.5 h-[18px] w-[18px] rounded-full shadow-md transition-all duration-300"
        style={{
          transform: on ? 'translateX(20px)' : 'translateX(2px)',
          background: on ? '#fff' : 'var(--text-muted)',
          boxShadow: on ? '0 2px 6px rgba(0,0,0,0.35)' : 'none',
        }}
      />
    </button>
  );
}

/* ─── Theme swatch card ──────────────────────────────────── */
function ThemeSwatch({ t, active, onClick }) {
  const [p1, p2, p3] = t.preview;
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-2 rounded-xl p-3 border text-left transition-all duration-200"
      style={{
        background: active ? 'var(--bg-surface)' : 'transparent',
        borderColor: active ? 'var(--border-card)' : 'var(--border-subtle)',
        outline: active ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
        outlineOffset: '2px',
      }}
    >
      {/* Mini preview pill */}
      <div className="relative h-9 w-full rounded-lg overflow-hidden flex-shrink-0" style={{ background: p1 }}>
        <div className="absolute bottom-0 left-0 right-0 h-4 opacity-60" style={{ background: p2 }} />
        <div className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: p3 }} />
        <div className="absolute left-2 top-2.5 h-1 w-5 rounded-full opacity-70" style={{ background: p3 }} />
      </div>
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-xs font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
        </div>
        {active && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/40">
            <Check size={9} className="text-indigo-400" />
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── Main Settings page ─────────────────────────────────── */
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { notes, tasks, events, clearAll, addNote, addTask, addEvent } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || user?.displayName || '');
  const [notifOn, setNotifOn] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const initials = (name || user?.email || 'U')
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify({ notes, tasks, events, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'onedesk-backup.json' });
    a.click(); URL.revokeObjectURL(a.href);
  }

  function handleImport(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b = JSON.parse(reader.result);
        if (Array.isArray(b.notes))  for (const n  of b.notes)  { const { id: _, createdAt: __, ...r } = n;  await addNote(r);  }
        if (Array.isArray(b.tasks))  for (const t  of b.tasks)  { const { id: _, createdAt: __, ...r } = t;  await addTask(r);  }
        if (Array.isArray(b.events)) for (const ev of b.events) { const { id: _, createdAt: __, ...r } = ev; await addEvent(r); }
        alert('Backup imported!');
      } catch { alert('Invalid backup file.'); }
    };
    reader.readAsText(file);
  }

  return (
    <div className="animate-fade-up max-w-3xl mx-auto space-y-7 pb-12">

      {/* ── Page title ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Sparkles size={16} style={{ color: 'var(--text-muted)' }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Preferences
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)', marginLeft: '26px' }}>
          Manage your account, appearance, and workspace data.
        </p>
      </div>

      {/* ── TOP ROW: Profile + Account side by side ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Profile */}
        <Panel>
          <SectionLabel>Profile</SectionLabel>

          {/* Avatar row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-base font-black shadow-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{name || 'User'}</p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.08)' }}>
                ● Connected
              </span>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-all"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border opacity-40 cursor-not-allowed"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <PrimaryBtn type="submit" disabled={saving}>
                {saving ? 'Saving…' : saved ? <><Check size={13} /> Saved</> : 'Save changes'}
              </PrimaryBtn>
            </div>
          </form>
        </Panel>

        {/* Account & Security */}
        <Panel className="flex flex-col gap-4">
          <div>
            <SectionLabel>Account</SectionLabel>
            <Row label="Sign out" sub="End your current session on this device.">
              <GhostBtn danger onClick={handleLogout}>
                <LogOut size={13} /> Log out
              </GhostBtn>
            </Row>
          </div>

          <Divider />

          <div>
            <SectionLabel>Security</SectionLabel>
            <div className="space-y-3">
              <Row label="Auth Provider" sub="Managed via Firebase Auth.">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  Firebase
                </span>
              </Row>
              <Row label="Encryption" sub="Data encrypted in transit and at rest.">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border"
                  style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.08)' }}>
                  ✓ Active
                </span>
              </Row>
              <Row label="Password" sub="Managed by Firebase.">
                <span className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-lg border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                  <Lock size={10} /> ••••••
                </span>
              </Row>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── FULL WIDTH: Appearance / Themes ─────────────────── */}
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Appearance</SectionLabel>
            <p className="text-sm font-semibold -mt-1" style={{ color: 'var(--text-primary)' }}>Interface Theme</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Active: <strong style={{ color: 'var(--text-primary)' }}>{THEMES.find(t => t.id === theme)?.name}</strong>
            </p>
          </div>
          <Palette size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {THEMES.map((t) => (
            <ThemeSwatch key={t.id} t={t} active={theme === t.id} onClick={() => setTheme(t.id)} />
          ))}
        </div>
      </Panel>

      {/* ── BOTTOM ROW: Notifications + Data ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Notifications */}
        <Panel>
          <SectionLabel>Notifications</SectionLabel>
          <div className="space-y-4">
            <Row label="Due Task Badges" sub="Badges in nav for tasks due today.">
              <Toggle on={notifOn} onToggle={() => setNotifOn(v => !v)} label="Toggle due task badges" />
            </Row>
            <Divider />
            <Row label="Reminder Alerts" sub="Desktop alerts for calendar reminders.">
              <Toggle on={false} onToggle={() => {}} label="Toggle reminder alerts" />
            </Row>
          </div>
        </Panel>

        {/* Data */}
        <Panel>
          <SectionLabel>Data Portability</SectionLabel>
          <div className="space-y-4">
            <Row label="Export Archive" sub="Download notes, tasks & events as JSON.">
              <GhostBtn onClick={handleExport}>
                <Download size={13} /> Export
              </GhostBtn>
            </Row>
            <Divider />
            <Row label="Import Archive" sub="Restore from a previously exported file.">
              <GhostBtn onClick={() => fileRef.current?.click()}>
                <Upload size={13} /> Import
              </GhostBtn>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </Row>
            <Divider />
            <Row label="Clear Workspace" sub="Permanently delete all notes, tasks, and events." danger>
              <GhostBtn danger onClick={() => confirm('Clear all data? This cannot be undone.') && clearAll()}>
                <Trash2 size={13} /> Clear
              </GhostBtn>
            </Row>
          </div>
        </Panel>

      </div>

      {/* Footer */}
      <p className="text-center text-[10px] pb-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
        OneDesk · Your personal workspace
      </p>
    </div>
  );
}
