import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Upload, Trash2, LogOut,
  Palette, Check, Sparkles, Lock, AlertTriangle, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';

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
      className={`rounded-[26px] border p-5 sm:p-6 transition-all duration-300 shadow-[0_6px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl ${className}`}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }} />;
}

function Row({ label, sub, children, danger, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-4 ${onClick ? 'cursor-pointer select-none' : ''}`}
    >
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
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-md hover:brightness-110 active:scale-95"
      style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}
    >
      {children}
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
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const { notes, tasks, events, clearAll, addNote, addTask, addEvent } = useData();
  const {
    settings,
    updateSetting,
    toggleSetting,
    playChime,
    sendPushNotification,
    requestNotificationPermission,
  } = useSettings();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || user?.displayName || '');
  const [testSent, setTestSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  // Delete Account States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);

  async function handleDeleteAccount(e) {
    if (e) e.preventDefault();
    setDeleting(true);
    setDeleteError('');

    try {
      // 1. Wipe all user data from collections & user document
      try {
        await clearAll();
      } catch (clearErr) {
        console.warn('Workspace cleanup note:', clearErr);
      }

      // 2. Delete Firebase Auth account
      const res = await deleteAccount(deletePassword);
      if (!res.success) {
        if (res.requiresPassword) {
          setRequirePassword(true);
        }
        setDeleteError(res.error || 'Failed to delete account. Please try again.');
        setDeleting(false);
        return;
      }

      // 3. Clear local storage traces
      localStorage.removeItem('lifeos_dashboard_scratchpad');
      localStorage.removeItem('onedesk_settings');

      if (playChime) playChime('pop');
      setDeleteModalOpen(false);
      navigate('/login');
    } catch (err) {
      setDeleteError(err.message || 'An unexpected error occurred while deleting account.');
      setDeleting(false);
    }
  }

  const initials = (name || user?.email || 'U').trim()[0]?.toUpperCase() || 'U';

  const [mobileToast, setMobileToast] = useState(null);
  const mobileToastTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mobileToastTimeoutRef.current) clearTimeout(mobileToastTimeoutRef.current);
    };
  }, []);

  function handleThemeSelect(t) {
    setTheme(t.id);
    if (playChime) playChime('pop');
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const isWhite = t.id === 'light';
      const circleColor = isWhite ? '#ffffff' : (t.color || t.preview?.[2] || '#818cf8');
      setMobileToast({
        id: Date.now(),
        type: 'theme',
        text: `${t.name} theme applied`,
        color: circleColor,
        isWhite,
      });
      if (mobileToastTimeoutRef.current) clearTimeout(mobileToastTimeoutRef.current);
      mobileToastTimeoutRef.current = setTimeout(() => {
        setMobileToast(null);
      }, 2200);
    }
  }

  function handleToggleFibers() {
    const isCurrentlyOn = settings?.ghostFibers !== false;
    const willBeEnabled = !isCurrentlyOn;
    toggleSetting('ghostFibers');
    if (playChime) playChime('pop');
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setMobileToast({
        id: Date.now(),
        type: 'bg',
        text: `Background animation ${willBeEnabled ? 'enabled' : 'disabled'}`,
        enabled: willBeEnabled,
      });
      if (mobileToastTimeoutRef.current) clearTimeout(mobileToastTimeoutRef.current);
      mobileToastTimeoutRef.current = setTimeout(() => {
        setMobileToast(null);
      }, 2200);
    }
  }

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
              style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}
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
            <div className="space-y-3">
              <Row label="Sign out" sub="End your current session on this device.">
                <GhostBtn danger onClick={handleLogout}>
                  <LogOut size={13} /> Log out
                </GhostBtn>
              </Row>
              <Divider />
              <Row
                label="Delete Account"
                sub="Permanently delete your account and wipe all workspace data."
                danger
              >
                <GhostBtn
                  danger
                  onClick={() => {
                    setDeleteError('');
                    setDeletePassword('');
                    setRequirePassword(false);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={13} /> Delete Account
                </GhostBtn>
              </Row>
            </div>
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
            <ThemeSwatch key={t.id} t={t} active={theme === t.id} onClick={() => handleThemeSelect(t)} />
          ))}
        </div>
      </Panel>

      {/* ── BOTTOM ROW: Notifications + Data ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Preferences & System */}
        <Panel>
          <SectionLabel>Preferences &amp; System</SectionLabel>
          <div className="space-y-4">
            <Row
              label="Due Task Badges"
              sub="Show red alert badge & count in navbar for tasks due today."
              onClick={() => toggleSetting('dueTaskBadges')}
            >
              <Toggle
                on={settings.dueTaskBadges}
                onToggle={() => toggleSetting('dueTaskBadges')}
                label="Toggle due task badges"
              />
            </Row>

            <Divider />

            <Row
              label="Reminder Alerts"
              sub="Desktop browser notifications for approaching deadlines."
              onClick={async () => {
                if (!settings.reminderAlerts) {
                  await requestNotificationPermission();
                } else {
                  updateSetting('reminderAlerts', false);
                }
              }}
            >
              <Toggle
                on={settings.reminderAlerts}
                onToggle={async () => {
                  if (!settings.reminderAlerts) {
                    await requestNotificationPermission();
                  } else {
                    updateSetting('reminderAlerts', false);
                  }
                }}
                label="Toggle reminder alerts"
              />
            </Row>

            {settings.reminderAlerts && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-white/[0.02]" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live alerts active
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const ok = sendPushNotification('OneDesk: Push Alert Test', {
                      body: 'Your browser desktop alerts are active and working smoothly!',
                    });
                    if (ok) {
                      setTestSent(true);
                      setTimeout(() => setTestSent(false), 2500);
                    }
                  }}
                  className="btn-glass px-3 py-1 text-[10px] font-bold rounded-full text-indigo-300 hover:text-white"
                >
                  {testSent ? '✓ Alert Dispatched' : 'Send Test Alert'}
                </button>
              </div>
            )}

            <Divider />

            <Row
              label="Interactive Chimes"
              sub="Synthesized audio feedback when completing tasks."
              onClick={() => {
                toggleSetting('soundEffects');
                if (!settings.soundEffects) {
                  setTimeout(() => playChime('success'), 60);
                }
              }}
            >
              <Toggle
                on={settings.soundEffects}
                onToggle={() => {
                  toggleSetting('soundEffects');
                  if (!settings.soundEffects) {
                    setTimeout(() => playChime('success'), 60);
                  }
                }}
                label="Toggle interactive chimes"
              />
            </Row>

            <Divider />

            <Row
              label="Bouncy Physics"
              sub="Tactile spring & bounce micro-animations on controls."
              onClick={() => toggleSetting('bouncyAnimations')}
            >
              <Toggle
                on={settings.bouncyAnimations}
                onToggle={() => toggleSetting('bouncyAnimations')}
                label="Toggle bouncy animations"
              />
            </Row>

            <Divider />

            <Row
              label="Ambient Fibers"
              sub="Glowing dynamic background wave canvas."
              onClick={handleToggleFibers}
            >
              <Toggle
                on={settings.ghostFibers}
                onToggle={handleToggleFibers}
                label="Toggle background fibers"
              />
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

      {/* ── Delete Account Confirmation Modal ─────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border bg-rose-500/10 border-rose-500/20 text-rose-300">
            <AlertTriangle size={20} className="shrink-0 text-rose-400 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-rose-200">Warning: This action is permanent and irreversible</p>
              <p className="text-rose-300/80 leading-relaxed">
                Deleting your account will permanently wipe your credentials, tasks, notes, calendar events, and custom preferences. You will be logged out completely.
              </p>
            </div>
          </div>

          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Confirm with your password {requirePassword && <span className="text-rose-400 font-bold">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError('');
                  }}
                  placeholder="Enter your account password"
                  required={requirePassword}
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none border transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: deleteError ? '#f43f5e' : 'var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showDeletePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Deleting account for <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/25 text-xs text-rose-400 font-medium animate-fade-in">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-900/30 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting account…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Mobile Pop-up Notification (Only for Mobile) */}
      {mobileToast && (
        <div
          key={mobileToast.id}
          className="sm:hidden fixed bottom-20 inset-x-0 mx-auto w-fit z-50 pointer-events-none animate-fade-in"
        >
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl text-xs font-semibold whitespace-nowrap"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor:
                mobileToast.type === 'theme'
                  ? (mobileToast.isWhite ? 'var(--border-card)' : mobileToast.color)
                  : mobileToast.enabled
                  ? 'var(--accent-color)'
                  : 'var(--border-card)',
              color: 'var(--text-primary)',
              boxShadow:
                mobileToast.type === 'theme'
                  ? (mobileToast.isWhite
                      ? '0 10px 28px -4px rgba(79,70,229,0.25), 0 2px 8px rgba(0,0,0,0.06)'
                      : `0 8px 24px -4px ${mobileToast.color}66`)
                  : mobileToast.enabled
                  ? '0 8px 24px -4px var(--accent-glow)'
                  : '0 8px 24px -4px rgba(0,0,0,0.6)',
            }}
          >
            {mobileToast.type === 'theme' ? (
              <Palette
                size={13}
                style={{ color: mobileToast.isWhite ? 'var(--accent-color)' : mobileToast.color }}
              />
            ) : (
              <Sparkles
                size={13}
                style={{ color: mobileToast.enabled ? 'var(--accent-color)' : 'var(--text-muted)' }}
              />
            )}
            <span>{mobileToast.text}</span>
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background:
                  mobileToast.type === 'theme'
                    ? (mobileToast.isWhite ? 'var(--accent-color)' : mobileToast.color)
                    : mobileToast.enabled
                    ? '#34d399'
                    : '#f43f5e',
                boxShadow:
                  mobileToast.type === 'theme'
                    ? (mobileToast.isWhite ? '0 0 8px var(--accent-glow)' : `0 0 8px ${mobileToast.color}bb`)
                    : mobileToast.enabled
                    ? '0 0 6px #34d399'
                    : 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
