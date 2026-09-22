import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthShell, Field } from './Login';

export default function Signup() {
  const { signup, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const ok = await signup(form);
    setIsLoading(false);
    if (ok) navigate('/');
  }

  return (
    <AuthShell activeTab="signup">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Field
          label="Your Name"
          icon={User}
          type="text"
          placeholder="e.g., Rishabh"
          required
          autoComplete="name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <Field
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <Field
          label="Choose Password"
          icon={Lock}
          type="password"
          placeholder="Minimum 6 characters"
          required
          minLength={6}
          autoComplete="new-password"
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
        />

        {authError && (
          <div
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-xs font-medium animate-fade-in flex items-start gap-2"
            style={{
              background: 'rgba(244,63,94,0.1)',
              borderColor: 'rgba(244,63,94,0.25)',
              color: '#fb7185',
            }}
          >
            <span>{authError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl text-white py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold transition-all shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
          style={{
            background: 'var(--accent-gradient)',
            boxShadow: '0 6px 20px var(--accent-glow)',
          }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          <span>{isLoading ? 'Creating your workspace…' : 'Create workspace'}</span>
          {!isLoading && <ArrowRight size={14} />}
        </button>
      </form>
    </AuthShell>
  );
}
