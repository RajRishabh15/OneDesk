import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthShell, Field } from './Login';

export default function Signup() {
  const { signup, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleSubmit(e) {
    e.preventDefault();
    if (signup(form)) navigate('/');
  }

  return (
    <AuthShell>
      <p className="font-display text-2xl font-semibold">Create your account</p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Set up your workspace in a few seconds.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field icon={User} type="text" placeholder="Full name" required
          value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Field icon={Mail} type="email" placeholder="Email" required
          value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        <Field icon={Lock} type="password" placeholder="Password" required minLength={4}
          value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />

        {authError && <p className="text-sm text-[var(--color-high)]">{authError}</p>}

        <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01]">
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        Already have an account? <Link to="/login" className="font-medium text-[var(--color-accent)]">Log in</Link>
      </p>
    </AuthShell>
  );
}
