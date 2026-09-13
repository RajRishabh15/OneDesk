import { NavLink } from 'react-router-dom';
import { LayoutGrid, StickyNote, CheckSquare, Calendar, BarChart2, Sliders, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/calendar', label: 'Schedule', icon: Calendar },
  { to: '/analytics', label: 'Insights', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Sliders },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={[
          'fixed z-50 md:z-0 md:static top-0 left-0 h-full md:h-screen w-56 shrink-0',
          'flex flex-col bg-[#fdfdfc] dark:bg-[#161615]',
          'border-r border-stone-200/80 dark:border-stone-800/80',
          'transition-transform duration-150 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-mono text-xs font-bold shadow-xs">
              L
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">LifeOS</span>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5">v1.2 · workspace</span>
            </div>
          </div>
          <button className="md:hidden text-stone-400 hover:text-stone-700 dark:hover:text-stone-200" onClick={onClose} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-0.5 px-2.5 py-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-stone-200/70 text-stone-900 dark:bg-stone-800 dark:text-stone-100 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50',
                ].join(' ')
              }
            >
              <Icon size={15} className="shrink-0 opacity-80" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer shortcuts */}
        <div className="px-3 py-2.5 border-t border-stone-200/60 dark:border-stone-800/60 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Jump to</span>
          <kbd className="font-mono text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            g + key
          </kbd>
        </div>
      </aside>
    </>
  );
}
