import { useRef, useState, useEffect } from 'react';
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
  Volume2,
  Database,
  User,
  Mail,
  CheckCircle2,
  Zap,
  Sliders,
  Clock,
  Heart,
  Pencil,
  Camera,
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
      className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-7 backdrop-blur-2xl transition-all duration-200 relative overflow-hidden shadow-sm ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-card)',
      }}
    >
      {/* Top subtle hairline highlight */}
      <div
        className="absolute top-0 inset-x-8 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }}
      />
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--accent-color)',
          }}
        >
          <Icon size={17} strokeWidth={2.2} />
        </div>
      )}
      <div>
        <h2 className="text-base sm:text-lg font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {description && (
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, children, onClick, danger = false }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[var(--accent-color)] active:scale-[0.99] select-none' : ''
      }`}
      style={{
        background: danger ? 'rgba(251,113,133,0.04)' : 'var(--bg-surface)',
        borderColor: danger ? 'rgba(251,113,133,0.2)' : 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div
            className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
            style={{
              background: danger ? 'rgba(251,113,133,0.1)' : 'var(--bg-card-solid)',
              borderColor: danger ? 'rgba(251,113,133,0.3)' : 'var(--border-subtle)',
              color: danger ? '#fb7185' : 'var(--accent-color)',
            }}
          >
            <Icon size={15} />
          </div>
        )}
        <div className="min-w-0">
          <p
            className="text-xs sm:text-sm font-semibold leading-snug truncate"
            style={{ color: danger ? '#fb7185' : 'var(--text-primary)' }}
          >
            {label}
          </p>
          {description && (
            <p className="text-[11px] sm:text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ─── Clean Theme Card ─────────────────────────────────────── */

function ThemeOptionCard({ t, active, onClick }) {
  const [bg, surface, accent] = t.preview;
  const isWhite = t.id === 'light';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
        active ? 'ring-2 ring-[var(--accent-color)] shadow-md' : 'hover:border-[var(--border-card)]'
      }`}
      style={{
        background: active ? 'var(--bg-surface)' : 'var(--bg-card-solid)',
        borderColor: active ? 'var(--accent-color)' : 'var(--border-subtle)',
      }}
    >
      {/* Palette Preview */}
      <div
        className="w-full h-11 rounded-lg mb-2.5 relative overflow-hidden border shadow-inner flex items-end p-1.5"
        style={{
          background: bg,
          borderColor: isWhite ? '#e5e7eb' : 'rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="absolute inset-x-1.5 bottom-1.5 h-3.5 rounded-md shadow-xs opacity-80"
          style={{ background: surface }}
        />
        <div
          className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border border-white/20 shadow-xs"
          style={{ background: accent }}
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="min-w-0 pr-1.5">
          <p className="text-xs font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t.name}
          </p>
          <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t.description}
          </p>
        </div>

        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
            active ? 'border-transparent text-white' : 'border-[var(--border-subtle)] opacity-20'
          }`}
          style={{
            background: active ? 'var(--accent-gradient)' : 'transparent',
          }}
        >
          {active && <Check size={10} strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}

/* ─── Main Settings Component ─────────────────────────────── */

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, logout, deleteAccount, changePassword } = useAuth();
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

  // Mobile toast feedback
  const [mobileToast, setMobileToast] = useState(null);
  const mobileToastTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mobileToastTimeoutRef.current) clearTimeout(mobileToastTimeoutRef.current);
    };
  }, []);

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
      navigate('/login');
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

  function handleThemeSelect(t) {
    setTheme(t.id);
    if (playChime) playChime('pop');

    if (window.innerWidth < 640) {
      setMobileToast({
        id: Date.now(),
        type: 'theme',
        text: `Theme: ${t.name}`,
        color: t.preview[2],
        isWhite: t.id === 'light',
      });
      if (mobileToastTimeoutRef.current) clearTimeout(mobileToastTimeoutRef.current);
      mobileToastTimeoutRef.current = setTimeout(() => {
        setMobileToast(null);
      }, 2200);
    }
  }

  function handleToggleFibers() {
    const nextVal = settings?.ghostFibers === false;
    toggleSetting('ghostFibers');

    if (window.innerWidth < 640) {
      setMobileToast({
        id: Date.now(),
        type: 'fibers',
        text: nextVal ? 'Ambient waves enabled' : 'Ambient waves disabled',
        enabled: nextVal,
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
    <div className="animate-fade-up max-w-4xl mx-auto space-y-6 sm:space-y-7 pb-16">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your personal profile, workspace theme, notifications, and data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 active:scale-95 cursor-pointer shadow-xs"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div
                className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-md overflow-hidden border border-white/10"
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
                className="text-base sm:text-xl font-bold font-display tracking-tight truncate"
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
        <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Key size={13} />
            <span>Password &amp; Security</span>
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] active:scale-95 cursor-pointer shadow-xs"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-color)',
            }}
          >
            <Key size={12} />
            <span>Change password</span>
          </button>
        </div>
      </SettingCard>

      {/* ── 2. Appearance & Themes ─────────────────────────── */}
      <SettingCard>
        <SectionHeader
          icon={Palette}
          title="Appearance & Theme"
          description="Select your preferred workspace palette and background effects."
        />

        {/* Themes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {THEMES.map((t) => (
            <ThemeOptionCard
              key={t.id}
              t={t}
              active={theme === t.id}
              onClick={() => handleThemeSelect(t)}
            />
          ))}
        </div>

        {/* Ambient Canvas Switch */}
        <SettingRow
          icon={Sparkles}
          label="Ambient Background Waves"
          description="Dynamic floating wave fibers that render gently behind your workspace."
          onClick={handleToggleFibers}
        >
          <Toggle
            on={settings?.ghostFibers !== false}
            onToggle={handleToggleFibers}
            label="Toggle ambient background fibers"
          />
        </SettingRow>
      </SettingCard>

      {/* ── 3. Notifications & Sensory Feedback ────────────── */}
      <SettingCard>
        <SectionHeader
          icon={Bell}
          title="Notifications & Feedback"
          description="Control reminders, auditory cues, and interface micro-interactions."
        />

        <div className="space-y-3">
          {/* Due Task Badges */}
          <SettingRow
            icon={CheckCircle2}
            label="Due Task Badges"
            description="Display badge indicators on the navigation bar when tasks are due today."
            onClick={() => toggleSetting('dueTaskBadges')}
          >
            <Toggle
              on={settings?.dueTaskBadges}
              onToggle={() => toggleSetting('dueTaskBadges')}
              label="Toggle due task badges"
            />
          </SettingRow>

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

          {/* Interactive Sound Effects */}
          <SettingRow
            icon={Volume2}
            label="Interactive Audio Chimes"
            description="Gentle audio chimes on task completion and major workspace actions."
            onClick={() => {
              toggleSetting('soundEffects');
              if (!settings?.soundEffects) {
                setTimeout(() => playChime('success'), 60);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playChime('pop');
                }}
                title="Preview sound chime"
                className="p-1.5 rounded-lg border transition-all hover:text-[var(--text-primary)] active:scale-90 cursor-pointer"
                style={{
                  background: 'var(--bg-card-solid)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <Zap size={13} />
              </button>
              <Toggle
                on={settings?.soundEffects}
                onToggle={() => {
                  toggleSetting('soundEffects');
                  if (!settings?.soundEffects) {
                    setTimeout(() => playChime('success'), 60);
                  }
                }}
                label="Toggle interactive audio chimes"
              />
            </div>
          </SettingRow>

          {/* Bouncy Spring Micro-Animations */}
          <SettingRow
            icon={Zap}
            label="Tactile Spring Physics"
            description="Smooth spring physics on buttons and modal transitions."
            onClick={() => toggleSetting('bouncyAnimations')}
          >
            <Toggle
              on={settings?.bouncyAnimations}
              onToggle={() => toggleSetting('bouncyAnimations')}
              label="Toggle spring micro-animations"
            />
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

      {/* ── 5. Danger Zone ─────────────────────────────────── */}
      <div
        className="rounded-2xl sm:rounded-3xl border p-5 sm:p-7 backdrop-blur-2xl relative overflow-hidden"
        style={{
          background: 'rgba(244,63,94,0.03)',
          borderColor: 'rgba(244,63,94,0.18)',
        }}
      >
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
            style={{
              background: 'rgba(244,63,94,0.08)',
              borderColor: 'rgba(244,63,94,0.22)',
              color: '#fb7185',
            }}
          >
            <AlertTriangle size={17} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-rose-400">
              Danger Zone
            </h2>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Irreversible actions affecting your workspace contents and account authentication.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Clear Workspace Data */}
          <SettingRow
            icon={Trash2}
            label="Clear Workspace Items"
            description="Permanently deletes all tasks, notes, and calendar events while keeping your login account."
            danger
          >
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all workspace items (tasks, notes, events)? This action cannot be undone.')) {
                  clearAll();
                  if (playChime) playChime('pop');
                }
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all active:scale-95 cursor-pointer"
              style={{
                background: 'rgba(244,63,94,0.08)',
                borderColor: 'rgba(244,63,94,0.25)',
              }}
            >
              Clear Workspace
            </button>
          </SettingRow>

          {/* Delete Account */}
          <SettingRow
            icon={AlertTriangle}
            label="Delete Account Permanently"
            description="Completely erases your user profile, credentials, and data from the cloud database."
            danger
          >
            <button
              type="button"
              onClick={() => {
                setDeleteError('');
                setDeletePassword('');
                setRequirePassword(false);
                setDeleteModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 transition-all active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: 'rgba(244,63,94,0.12)',
                borderColor: 'rgba(244,63,94,0.3)',
              }}
            >
              Delete Account
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-medium tracking-wide flex items-center justify-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>Crafted with care for OneDesk</span>
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
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {PRESET_AVATARS.filter((a) => a.category === 'Nature').map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditPhoto(av.url)}
                      title={av.label}
                      className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-90 touch-manipulation ${
                        editPhoto === av.url
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
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
                  {PRESET_AVATARS.filter((a) => a.category === 'Cars').map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setEditPhoto(av.url)}
                      title={av.label}
                      className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-90 touch-manipulation ${
                        editPhoto === av.url
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
