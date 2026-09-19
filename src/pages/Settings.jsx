import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon, Sun, Bell, Download, Upload, Trash2, User, LogOut,
  Palette, Shield, Database, Check, Sparkles,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

/* ── helpers ─────────────────────────────────────────────── */
function GlassSection({ icon: Icon, title, badge, children }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]">
          <Icon size={14} className="opacity-70" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-widest opacity-50">{title}</span>
        {badge && (
          <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
            {badge}
          </span>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children, danger }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className={`text-sm font-medium leading-tight ${danger ? 'text-rose-400' : 'opacity-90'}`}>{label}</p>
        {description && <p className="mt-0.5 text-[11px] leading-relaxed opacity-40">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function GlassInput({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-widest opacity-40">{label}</label>
      <input
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm outline-none transition-all
          placeholder:opacity-30 focus:border-white/20 focus:bg-white/[0.07] focus:ring-0
          disabled:opacity-30 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}

function GlassButton({ children, variant = 'default', size = 'sm', ...props }) {
  const base = 'inline-flex items-center gap-1.5 font-medium transition-all rounded-xl';
  const sizes = { sm: 'px-3.5 py-2 text-xs', md: 'px-5 py-2.5 text-sm' };
  const variants = {
    default: 'bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.18]',
    primary: 'bg-indigo-500/80 border border-indigo-400/30 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
    danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle"
      className={`relative h-6 w-11 rounded-full transition-all duration-300 ${on ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full shadow transition-all duration-300 ${on ? 'translate-x-5.5 bg-white' : 'translate-x-1 bg-white/50'}`}
      />
    </button>
  );
}

/* ── Theme palette card ──────────────────────────────────── */
function ThemeSwatch({ t, active, onClick }) {
  const [p1, p2, p3] = t.preview;
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col gap-2.5 rounded-xl p-3.5 border transition-all duration-200 text-left
        ${active
          ? 'border-white/30 bg-white/[0.1] shadow-lg'
          : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.07]'
        }`}
    >
      {/* Mini preview */}
      <div className="relative h-10 w-full rounded-lg overflow-hidden" style={{ backgroundColor: p1 }}>
        <div className="absolute inset-x-0 bottom-0 h-5 rounded-b-lg opacity-70" style={{ backgroundColor: p2 }} />
        <div className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: p3 }} />
        <div className="absolute left-2 top-2 h-1.5 w-5 rounded-full opacity-60" style={{ backgroundColor: p3 }} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold leading-none">{t.name}</p>
          <p className="mt-0.5 text-[10px] opacity-40">{t.description}</p>
        </div>
        {active && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
            <Check size={9} className="opacity-80" />
          </div>
        )}
      </div>
    </button>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { notes, tasks, events, clearAll, addNote, addTask, addEvent } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || user?.displayName || '');
  const [notifOn, setNotifOn] = useState(true);
  const [savedTick, setSavedTick] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name });
    setSaving(false);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 2000);
  }

  function handleExport() {
    const backup = { notes, tasks, events, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onedesk-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const backup = JSON.parse(reader.result);
        if (Array.isArray(backup.notes)) {
          for (const n of backup.notes) { const { id: _, createdAt: __, ...rest } = n; await addNote(rest); }
        }
        if (Array.isArray(backup.tasks)) {
          for (const t of backup.tasks) { const { id: _, createdAt: __, ...rest } = t; await addTask(rest); }
        }
        if (Array.isArray(backup.events)) {
          for (const ev of backup.events) { const { id: _, createdAt: __, ...rest } = ev; await addEvent(rest); }
        }
        alert('Backup imported successfully!');
      } catch {
        alert('That file could not be read as a OneDesk backup.');
      }
    };
    reader.readAsText(file);
  }

  function handleClearData() {
    if (confirm('This clears all notes, tasks, and events. This cannot be undone. Continue?')) {
      clearAll();
    }
  }

  // User initials avatar
  const initials = (name || user?.email || 'U')
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="max-w-2xl space-y-4 animate-fade-up">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="opacity-40" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Preferences</h1>
        </div>
        <p className="text-sm opacity-40 ml-5">Manage your identity, appearance, and data.</p>
      </div>

      {/* ── Profile ───────────────────────────────────────── */}
      <GlassSection icon={User} title="Profile" badge="Account">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.06]">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/80 to-violet-600/80 text-white text-lg font-bold shadow-lg shadow-indigo-500/20 border border-white/10">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#090715] shadow" />
          </div>
          <div>
            <p className="text-sm font-semibold">{name || 'User'}</p>
            <p className="text-xs opacity-40 mt-0.5">{user?.email}</p>
            <p className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
              ● Connected
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <GlassInput
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <GlassInput
            label="Email"
            value={user?.email || ''}
            disabled
            placeholder="email"
          />
          <div className="flex items-center gap-3 pt-1">
            <GlassButton type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? 'Saving…' : savedTick ? <><Check size={13} /> Saved</> : 'Save changes'}
            </GlassButton>
          </div>
        </form>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.06]">
          <div>
            <p className="text-sm font-medium opacity-80">Sign out</p>
            <p className="text-[11px] opacity-35 mt-0.5">End your current session on this device.</p>
          </div>
          <GlassButton variant="danger" onClick={handleLogout}>
            <LogOut size={13} /> Log out
          </GlassButton>
        </div>
      </GlassSection>

      {/* ── Appearance / Themes ───────────────────────────── */}
      <GlassSection icon={Palette} title="Appearance" badge="6 Themes">
        <div className="mb-4">
          <p className="text-sm font-medium opacity-80">Interface Theme</p>
          <p className="text-xs opacity-35 mt-0.5">Choose a visual theme for your workspace.</p>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {THEMES.map((t) => (
            <ThemeSwatch
              key={t.id}
              t={t}
              active={theme === t.id}
              onClick={() => setTheme(t.id)}
            />
          ))}
        </div>
      </GlassSection>

      {/* ── Notifications ─────────────────────────────────── */}
      <GlassSection icon={Bell} title="Notifications">
        <SettingRow
          label="Due Task Badges"
          description="Show badges in navigation for tasks due today."
        >
          <Toggle on={notifOn} onToggle={() => setNotifOn((v) => !v)} />
        </SettingRow>
        <div className="border-t border-white/[0.05] my-1" />
        <SettingRow
          label="Reminder Alerts"
          description="Desktop notifications for calendar reminders."
        >
          <Toggle on={false} onToggle={() => {}} />
        </SettingRow>
      </GlassSection>

      {/* ── Security ──────────────────────────────────────── */}
      <GlassSection icon={Shield} title="Security">
        <SettingRow
          label="Account Provider"
          description="Authentication managed via Firebase."
        >
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] opacity-60 font-mono">
            Firebase Auth
          </span>
        </SettingRow>
        <div className="border-t border-white/[0.05] my-1" />
        <SettingRow
          label="Data Encryption"
          description="All data encrypted in transit and at rest."
        >
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            ✓ Active
          </span>
        </SettingRow>
      </GlassSection>

      {/* ── Data Portability ──────────────────────────────── */}
      <GlassSection icon={Database} title="Data">
        <SettingRow
          label="Export Archive"
          description="Download notes, tasks & events as JSON."
        >
          <GlassButton onClick={handleExport}>
            <Download size={13} /> Export
          </GlassButton>
        </SettingRow>

        <div className="border-t border-white/[0.05] my-1" />

        <SettingRow
          label="Import Archive"
          description="Restore from a previously exported backup."
        >
          <GlassButton onClick={() => fileRef.current?.click()}>
            <Upload size={13} /> Import
          </GlassButton>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </SettingRow>

        <div className="border-t border-white/[0.05] my-1" />

        <SettingRow
          label="Clear Workspace"
          description="Permanently delete all notes, tasks, and events."
          danger
        >
          <GlassButton variant="danger" onClick={handleClearData}>
            <Trash2 size={13} /> Clear all
          </GlassButton>
        </SettingRow>
      </GlassSection>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="pt-2 pb-8 text-center">
        <p className="text-[10px] opacity-20 tracking-widest uppercase">OneDesk · Your personal workspace</p>
      </div>
    </div>
  );
}
