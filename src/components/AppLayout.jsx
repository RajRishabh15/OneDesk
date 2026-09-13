import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const SHORTCUT_MAP = { d: '/', n: '/notes', t: '/tasks', c: '/calendar', a: '/analytics', s: '/settings' };

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const pendingG = useRef(false);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

      if (e.key === 'g') {
        pendingG.current = true;
        setTimeout(() => { pendingG.current = false; }, 800);
        return;
      }
      if (pendingG.current && SHORTCUT_MAP[e.key]) {
        navigate(SHORTCUT_MAP[e.key]);
        pendingG.current = false;
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
