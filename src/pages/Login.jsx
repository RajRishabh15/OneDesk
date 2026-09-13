import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  function handleSubmit(e) {
    e.preventDefault();
    if (login(form)) navigate('/');
  }

  return (
    <AuthShell>
      <p className="font-display text-2xl font-semibold">Welcome back</p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Log in to pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field icon={Mail} type="email" placeholder="Email" required
          value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        <Field icon={Lock} type="password" placeholder="Password" required
          value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />

        {authError && <p className="text-sm text-[var(--color-high)]">{authError}</p>}

        <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01]">
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        New to LifeOS? <Link to="/signup" className="font-medium text-[var(--color-accent)]">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-display text-xl font-semibold">LifeOS</span>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] dark:border-[var(--color-line-dark)] bg-white dark:bg-[var(--color-surface-dark)] p-8 shadow-xl animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, value, onChange, ...rest }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-[var(--color-line)] dark:border-[var(--color-line-dark)] bg-[var(--color-bg)] dark:bg-white/5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
        {...rest}
      />
    </div>
  );
}
