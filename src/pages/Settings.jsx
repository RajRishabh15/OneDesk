import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Upload,
  Trash2,
  LogOut,
  Palette,
  Check,
  Sparkles,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Key,
  Bell,
  Database,
  User,
  Mail,
  Camera,
  Info,
  ChevronRight,
  Pencil,
  Clock,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';

/* ─── Preset Avatars: Nature & Automotive Photography ──────── */
const PRESET_AVATARS = [
  // Nature & Landscapes
  { id: 'nat1', category: 'Nature', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&auto=format&fit=crop&q=80', label: 'Mountain Peak' },
  { id: 'nat2', category: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&auto=format&fit=crop&q=80', label: 'Misty Pine Forest' },
  { id: 'nat3', category: 'Nature', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&auto=format&fit=crop&q=80', label: 'Ocean Waves' },
  { id: 'nat4', category: 'Nature', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&auto=format&fit=crop&q=80', label: 'Aurora Night Sky' },
  { id: 'nat5', category: 'Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=80', label: 'Alpine Lake' },
  { id: 'nat6', category: 'Nature', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=200&auto=format&fit=crop&q=80', label: 'Desert Dunes' },

  // Cars & Automotive
  { id: 'car1', category: 'Cars', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&auto=format&fit=crop&q=80', label: 'Dark Porsche 911' },
  { id: 'car2', category: 'Cars', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200&auto=format&fit=crop&q=80', label: 'Matte Supercar' },
  { id: 'car3', category: 'Cars', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&auto=format&fit=crop&q=80', label: 'Exotic Sportscar' },
  { id: 'car4', category: 'Cars', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop&q=80', label: 'Classic Blue Coupe' },
  { id: 'car5', category: 'Cars', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=200&auto=format&fit=crop&q=80', label: 'Audi Performance' },
];

/* ─── Clean UI Card & Row Primitives ──────────────────────── */

function SettingCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 md:p-7 backdrop-blur-2xl transition-all duration-200 relative overflow-hidden shadow-sm ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-card)',
      }}
    >
      {/* Top subtle hairline highlight */}
      <div
        className="absolute top-0 inset-x-6 sm:inset-x-8 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }}
      />
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        {Icon && (
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {description && (
            <p className="text-[11px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, children, onClick, danger = false }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-150 ${onClick ? 'cursor-pointer hover:border-[var(--accent-color)] active:scale-[0.99] select-none' : ''
        }`}
      style={{
        background: danger ? 'rgba(251,113,133,0.04)' : 'var(--bg-surface)',
        borderColor: danger ? 'rgba(251,113,133,0.2)' : 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 pr-1">
        {Icon && (
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
            style={{
              background: danger ? 'rgba(251,113,133,0.1)' : 'var(--bg-card-solid)',
              borderColor: danger ? 'rgba(251,113,133,0.3)' : 'var(--border-subtle)',
              color: danger ? '#fb7185' : 'var(--accent-color)',
            }}
          >
            <Icon size={14} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className="text-xs sm:text-sm font-semibold leading-snug truncate"
            style={{ color: danger ? '#fb7185' : 'var(--text-primary)' }}
          >
            {label}
          </p>
          {description && (
            <p className="text-[10px] sm:text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">{children}</div>
    </div>
  );
}

/* ─── Main Settings Component ─────────────────────────────── */

export default function Settings() {
  const { theme } = useTheme();
  const { user, updateProfile, logout, deleteAccount, changePassword } = useAuth();
  const { notes, tasks, events, clearAll, addNote, addTask, addEvent } = useData();
  const {
    settings,
    updateSetting,
    playChime,
    sendPushNotification,
    requestNotificationPermission,
  } = useSettings();
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const photoFileRef = useRef(null);

  // Edit Profile States
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Test Alert state
  const [testSent, setTestSent] = useState(false);

  // Delete Account States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);

  // Change Password States
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Latest Updates Modal State
  const [changelogModalOpen, setChangelogModalOpen] = useState(false);

  function handleOpenEditProfile() {
    setEditName(user?.name || user?.displayName || '');
    setEditPhoto(user?.photoURL || '');
    setEditError('');
    setEditProfileOpen(true);
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setEditError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setEditError('Image is too large. Please select a photo under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize onto a crisp canvas (max 200x200) to keep profile photo lightweight & speedy
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditPhoto(dataUrl);
        setEditError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e) {
    if (e) e.preventDefault();
    if (!editName.trim()) {
      setEditError('Please enter a display name.');
      return;
    }
    setEditSaving(true);
    setEditError('');

    try {
      const success = await updateProfile({
        name: editName.trim(),
        photoURL: editPhoto,
      });

      if (success !== false) {
        if (playChime) playChime('success');
        setEditProfileOpen(false);
      } else {
        setEditError('Failed to save profile. Please try again.');
      }
    } catch {
      setEditError('An unexpected error occurred while saving.');
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDeleteAccount(e) {
    if (e) e.preventDefault();
    setDeleting(true);
    setDeleteError('');

    try {
      try {
        await clearAll();
      } catch (clearErr) {
        console.warn('Workspace cleanup note:', clearErr);
      }

      const res = await deleteAccount(deletePassword);
      if (!res.success) {
        if (res.requiresPassword) {
          setRequirePassword(true);
        }
        setDeleteError(res.error || 'Failed to delete account. Please try again.');
        setDeleting(false);
        return;
      }

      localStorage.removeItem('lifeos_dashboard_scratchpad');
      localStorage.removeItem('onedesk_settings');

      if (playChime) playChime('pop');
      setDeleteModalOpen(false);
      navigate('/');
    } catch (err) {
      setDeleteError(err.message || 'An unexpected error occurred while deleting account.');
      setDeleting(false);
    }
  }

  async function handleChangePassword(e) {
    if (e) e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword({ currentPassword, newPassword });
    setPasswordLoading(false);

    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password. Please check your current password.');
      return;
    }

    setPasswordSuccess(true);
    if (playChime) playChime('success');
    setTimeout(() => {
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(false);
    }, 1500);
  }

  const initials = (user?.name || user?.email || 'U').trim()[0]?.toUpperCase() || 'U';

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  function handleExport() {
    const blob = new Blob(
      [JSON.stringify({ notes, tasks, events, exportedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `onedesk-backup-${new Date().toISOString().slice(0, 10)}.json`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
    if (playChime) playChime('pop');
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b = JSON.parse(reader.result);
        if (Array.isArray(b.notes)) {
          for (const n of b.notes) {
            const { id: _, createdAt: __, ...r } = n;
            await addNote(r);
          }
        }
        if (Array.isArray(b.tasks)) {
          for (const t of b.tasks) {
            const { id: _, createdAt: __, ...r } = t;
            await addTask(r);
          }
        }
        if (Array.isArray(b.events)) {
          for (const ev of b.events) {
            const { id: _, createdAt: __, ...r } = ev;
            await addEvent(r);
          }
        }
        if (playChime) playChime('success');
        alert('Backup imported successfully!');
      } catch {
        alert('Invalid or corrupted backup file.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-28 sm:pb-20 px-0 sm:px-2">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 sm:pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your personal profile, workspace theme, notifications, and data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 active:scale-95 cursor-pointer shadow-xs"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ── 1. Profile Box (Non-changeable with Edit Icon) ─── */}
      <SettingCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center text-white text-base sm:text-xl md:text-2xl font-bold shadow-md overflow-hidden border border-white/10"
                style={{
                  background: 'var(--accent-gradient)',
                }}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </div>

            {/* Non-changeable Name & Email */}
            <div className="min-w-0 flex-1">
              <h2
                className="text-sm sm:text-lg md:text-xl font-bold font-display tracking-tight truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {user?.name || 'User'}
              </h2>
              <p
                className="text-xs sm:text-sm truncate mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {user?.email || 'No email associated'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Connected
                </span>
              </div>
            </div>
          </div>

          {/* Edit Icon / Button */}
          <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleOpenEditProfile}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              title="Edit profile name and picture"
            >
              <Pencil size={13} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Password & Security Quick Link */}
        <div className="mt-4 pt-3.5 sm:mt-5 sm:pt-4 border-t border-[var(--border-subtle)] flex flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0" style={{ color: 'var(--text-muted)' }}>
            <Key size={13} className="shrink-0" />
            <span className="truncate">Password &amp; Security</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPasswordError('');
              setPasswordSuccess(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold transition-all hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] active:scale-95 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <Key size={11} />
            <span>Change password</span>
          </button>
        </div>
      </SettingCard>

      {/* ── 2. Appearance & Interaction (Dedicated Page Link for all screens) ── */}
      <SettingCard>
        <div
          onClick={() => {
            if (playChime) playChime('pop');
            navigate('/settings/appearance');
          }}
          className="flex items-center justify-between gap-3 cursor-pointer select-none group active:scale-[0.99] transition-all p-0.5"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-color)',
              }}
            >
              <Palette size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Appearance &amp; Interaction
                </h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-color)',
                  }}
                >
                  {THEMES.find((t) => t.id === theme)?.name || theme}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Workspace themes, notebook styles, ambient canvas waves &amp; tactile sensory feedback
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/20 shadow-xs"
              style={{
                background: THEMES.find((t) => t.id === theme)?.preview?.[2] || 'var(--accent-color)',
              }}
            />
            <ChevronRight size={17} className="transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </SettingCard>

      {/* ── 3. Desktop Notifications & System Alerts ───────── */}
      <SettingCard>
        <SectionHeader
          icon={Bell}
          title="Notifications &amp; Alerts"
          description="Control desktop reminder alerts and deadlines for upcoming tasks."
        />

        <div className="space-y-3">
          {/* Desktop Deadline Reminders */}
          <SettingRow
            icon={Clock}
            label="Desktop Reminder Alerts"
            description="Browser desktop notifications for upcoming schedule events and task deadlines."
            onClick={async () => {
              if (!settings?.reminderAlerts) {
                await requestNotificationPermission();
              } else {
                updateSetting('reminderAlerts', false);
              }
            }}
          >
            <div className="flex items-center gap-2">
              {settings?.reminderAlerts && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const ok = sendPushNotification('OneDesk: Reminder Alert Test', {
                      body: 'Your desktop deadline notifications are active and working smoothly!',
                    });
                    if (ok) {
                      setTestSent(true);
                      setTimeout(() => setTestSent(false), 2500);
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-color)',
                  }}
                >
                  {testSent ? '✓ Alert Sent' : 'Test Alert'}
                </button>
              )}
              <Toggle
                on={settings?.reminderAlerts}
                onToggle={async () => {
                  if (!settings?.reminderAlerts) {
                    await requestNotificationPermission();
                  } else {
                    updateSetting('reminderAlerts', false);
                  }
                }}
                label="Toggle desktop reminder alerts"
              />
            </div>
          </SettingRow>

          {/* Interaction & Sensory Link */}
          <SettingRow
            icon={Sparkles}
            label="Sensory & Interaction Dynamics"
            description="Customize audio chimes, tactile spring physics, due badges, and ambient background waves."
            onClick={() => {
              if (playChime) playChime('pop');
              navigate('/settings/appearance');
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (playChime) playChime('pop');
                navigate('/settings/appearance');
              }}
              className="text-[11px] font-semibold flex items-center gap-1 hover:underline cursor-pointer py-1 px-2.5 rounded-lg border transition-all"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-color)',
              }}
            >
              <span>Customize</span>
              <ChevronRight size={13} />
            </button>
          </SettingRow>
        </div>
      </SettingCard>

      {/* ── 4. Workspace Data & Portability ────────────────── */}
      <SettingCard>
        <SectionHeader
          icon={Database}
          title="Data & Backups"
          description="Export an offline copy of your workspace data or restore from a previous JSON backup."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Export Tile */}
          <div
            className="p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between space-y-3"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Download size={15} style={{ color: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Export Workspace Data
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Download your notes, tasks, and schedule events into a portable JSON file.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:border-[var(--accent-color)] active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: 'var(--bg-card-solid)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            >
              <Download size={13} />
              <span>Export Archive (.json)</span>
            </button>
          </div>

          {/* Import Tile */}
          <div
            className="p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between space-y-3"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload size={15} style={{ color: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Restore from Backup
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Import notes, tasks, and schedule events from an exported OneDesk backup file.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:border-[var(--accent-color)] active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: 'var(--bg-card-solid)',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            >
              <Upload size={13} />
              <span>Import Archive (.json)</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>
      </SettingCard>

      {/* ── 5. App Info ────────────────────────────────────── */}
      <SettingCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-color)',
              }}
            >
              <Info size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  OneDesk
                </h2>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-color)',
                  }}
                >
                  v2.9.26
                </span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Build #OD-2.09
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Last updated: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>September 27, 2026</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (playChime) playChime('pop');
              setChangelogModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] active:scale-95 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--accent-color)' }} />
            <span>Latest Updates</span>
          </button>
        </div>
      </SettingCard>

      {/* ── 6. Danger Zone ─────────────────────────────────── */}
      <SettingCard
        icon={AlertTriangle}
        title="Danger Zone"
        description="Permanent and irreversible actions for your workspace."
      >
        <div className="space-y-2.5 sm:space-y-3">
          {/* Clear Workspace Data */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(244,63,94,0.08)',
                  borderColor: 'rgba(244,63,94,0.2)',
                  color: '#fb7185',
                }}
              >
                <Trash2 size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Clear Workspace Data
                </p>
                <p className="text-[11px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Permanently deletes all tasks, notes, and calendar events.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all workspace items (tasks, notes, events)? This action cannot be undone.')) {
                  clearAll();
                  if (playChime) playChime('pop');
                }
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all active:scale-95 cursor-pointer shrink-0 text-center"
              style={{
                background: 'rgba(244,63,94,0.08)',
                borderColor: 'rgba(244,63,94,0.22)',
              }}
            >
              Clear Workspace
            </button>
          </div>

          {/* Delete Account */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(244,63,94,0.08)',
                  borderColor: 'rgba(244,63,94,0.2)',
                  color: '#fb7185',
                }}
              >
                <AlertTriangle size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Delete Account Permanently
                </p>
                <p className="text-[11px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Completely removes your user profile, credentials, and cloud data.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeleteError('');
                setDeletePassword('');
                setRequirePassword(false);
                setDeleteModalOpen(true);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 transition-all active:scale-95 cursor-pointer shrink-0 text-center shadow-xs"
              style={{
                background: 'rgba(244,63,94,0.12)',
                borderColor: 'rgba(244,63,94,0.3)',
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Footer Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-semibold tracking-wider flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <span>ONEDESK | MADE BY{' '}
            <a
              href="https://www.linkedin.com/in/rishabhr15"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors duration-150 inline-block font-bold"
              style={{ color: 'var(--accent-color)' }}
            >
              RISHABH
            </a>
          </span>
        </p>
      </div>

      {/* ── Edit Profile Modal (Name + PFP) ───────────────────── */}
      <Modal
        open={editProfileOpen}
        onClose={() => !editSaving && setEditProfileOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-5">
          {/* Profile Picture (PFP) Editor */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Profile Picture
            </label>
            <div
              className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              {/* Avatar Preview */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md overflow-hidden border border-white/10 shrink-0"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {editPhoto ? (
                  <img src={editPhoto} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  (editName || user?.email || 'U').trim()[0]?.toUpperCase() || 'U'
                )}
              </div>

              {/* Upload & Clear Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full sm:w-auto">
                <div className="flex flex-row items-center justify-center sm:justify-start gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => photoFileRef.current?.click()}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold hover:border-[var(--accent-color)] transition-all cursor-pointer shadow-xs active:scale-95"
                    style={{
                      background: 'var(--bg-card-solid)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Camera size={13} />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    ref={photoFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />

                  {editPhoto && (
                    <button
                      type="button"
                      onClick={() => setEditPhoto('')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer active:scale-95"
                      style={{
                        background: 'transparent',
                        borderColor: 'rgba(244,63,94,0.2)',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  PNG, JPG, or WebP. Auto-scaled for crisp performance.
                </p>
              </div>
            </div>

            {/* Curated Presets: Nature & Cars */}
            <div className="mt-3.5 space-y-3">
              {/* Nature & Landscapes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Nature &amp; Landscapes
                  </span>
                  <span className="text-[10px] opacity-60" style={{ color: 'var(--text-muted)' }}>
                    6 presets
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_AVATARS.filter((a) => a.category === 'Nature').map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditPhoto(av.url)}
                      title={av.label}
                      className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-90 touch-manipulation ${editPhoto === av.url
                        ? 'ring-2 ring-[var(--accent-color)] border-[var(--accent-color)] scale-105 shadow-sm'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-102'
                        }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Cars & Automotive */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Cars &amp; Automotive
                  </span>
                  <span className="text-[10px] opacity-60" style={{ color: 'var(--text-muted)' }}>
                    5 presets
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_AVATARS.filter((a) => a.category === 'Cars').map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditPhoto(av.url)}
                      title={av.label}
                      className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-90 touch-manipulation ${editPhoto === av.url
                        ? 'ring-2 ring-[var(--accent-color)] border-[var(--accent-color)] scale-105 shadow-sm'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-102'
                        }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name Field (The Rename Box) */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Display Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditError('');
                }}
                placeholder="Your full name"
                required
                className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-base sm:text-sm outline-none border transition-all font-medium"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Account Email (Non-editable) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Account Email
              </label>
              <span className="text-[10px] text-stone-400 flex items-center gap-1">
                <Lock size={10} /> Read-only
              </span>
            </div>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-base sm:text-sm outline-none border opacity-60 cursor-not-allowed font-medium select-none"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Your login email is managed via authentication credentials.
            </p>
          </div>

          {/* Error Message */}
          {editError && (
            <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/25 text-xs text-rose-400 font-medium">
              {editError}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-2">
            <button
              type="button"
              disabled={editSaving}
              onClick={() => setEditProfileOpen(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-full border text-xs font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
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
              disabled={editSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{
                background: 'var(--accent-gradient)',
                boxShadow: '0 4px 14px var(--accent-glow)',
              }}
            >
              {editSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Account Confirmation Modal ─────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-5">
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
              <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/25 text-xs text-rose-400 font-medium">
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── Change Password Modal ─────────────────────────────── */}
      <Modal
        open={passwordModalOpen}
        onClose={() => !passwordLoading && setPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-5">
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Current Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Enter current password"
                  required
                  autoFocus
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none border transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle current password visibility"
                >
                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                New Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none border transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Confirm New Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none border transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/25 text-xs text-rose-400 font-medium animate-fade-in">
                {passwordError}
              </div>
            )}

            {/* Success Message */}
            {passwordSuccess && (
              <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/25 text-xs text-emerald-400 font-medium flex items-center gap-2 animate-fade-in">
                <Check size={14} className="shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={passwordLoading}
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2.5 rounded-full border text-xs font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
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
                disabled={passwordLoading || passwordSuccess}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{
                  background: 'var(--accent-gradient)',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Updating…</span>
                  </>
                ) : (
                  <>
                    <Key size={14} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── Latest Updates Modal ─────────────────────────────── */}
      <Modal
        open={changelogModalOpen}
        onClose={() => setChangelogModalOpen(false)}
        title="What's New in OneDesk"
        wide
      >
        <div className="space-y-4">
          {/* Header Banner */}
          <div
            className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Release v2.9.26
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    background: 'var(--bg-card-solid)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-color)',
                  }}
                >
                  Current
                </span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Released on September 27, 2026 • Build #OD-2.09
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
              style={{
                background: 'var(--bg-card-solid)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-color)',
              }}
            >
              <Sparkles size={15} />
            </div>
          </div>

          {/* Changelog Highlights */}
          <div className="space-y-2.5">
            <div
              className="p-3.5 rounded-xl sm:rounded-2xl border space-y-1"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  🎮 Fun Zone Preview &amp; Game Hub
                </h3>
              </div>
              <p className="text-xs pl-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Introduced the new Fun Zone teaser portal for quick relaxation, integrated seamless navigation switches, and added animated welcome alerts.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl sm:rounded-2xl border space-y-1"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  🎨 Dynamic Themes &amp; Ambient FX
                </h3>
              </div>
              <p className="text-xs pl-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                6 handcrafted theme palettes, customizable ambient wave fibers toggle, and interactive audio feedback chimes for task interactions.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl sm:rounded-2xl border space-y-1"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  🔒 Profile Customization &amp; Data Portability
                </h3>
              </div>
              <p className="text-xs pl-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Select from curated Unsplash avatars, upload custom profile pictures, update account passwords, and export or restore full JSON backups.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl sm:rounded-2xl border space-y-1"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-color)' }} />
                <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  📱 Mobile Dock &amp; Responsiveness
                </h3>
              </div>
              <p className="text-xs pl-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Redesigned bottom floating dock navigation, optimized toast notifications for mobile screens, and smooth tactile spring physics.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={() => setChangelogModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2 rounded-full border text-xs font-semibold transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-xs text-center"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
