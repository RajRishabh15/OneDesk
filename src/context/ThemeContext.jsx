import { createContext, useContext, useEffect, useState } from 'react';
import { loadData, saveData, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext(null);

// Available themes — each defines CSS custom properties applied to :root
export const THEMES = [
  {
    id: 'dark',
    name: 'Midnight',
    description: 'Deep indigo dark mode',
    preview: ['#090715', '#1e1b4b', '#4f46e5'],
    color: '#6366f1',
  },
  {
    id: 'peacock',
    name: 'Peacock',
    description: 'Teal blue-green blend',
    preview: ['#021616', '#04322e', '#14b8a6'],
    color: '#2dd4bf',
    comingSoon: true,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Ethereal violet & lilac',
    preview: ['#0e0719', '#24103c', '#c084fc'],
    color: '#c084fc',
    comingSoon: true,
  },
  {
    id: 'light',
    name: 'Daylight',
    description: 'Warm stone light mode',
    preview: ['#f5f5f4', '#e7e5e4', '#ffffff'],
    color: '#ffffff',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights green',
    preview: ['#030d0a', '#052e16', '#34d399'],
    color: '#34d399',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea cyan blue',
    preview: ['#030d18', '#0c2340', '#38bdf8'],
    color: '#38bdf8',
  },
  {
    id: 'rose',
    name: 'Rosé',
    description: 'Soft pink & warm cream',
    preview: ['#1a0a0f', '#4c0519', '#fb7185'],
    color: '#fb7185',
  },
  {
    id: 'amber',
    name: 'Ember',
    description: 'Warm amber & gold',
    preview: ['#1a0f00', '#451a03', '#fbbf24'],
    color: '#fbbf24',
  },
  {
    id: 'babypink',
    name: 'Baby Pink',
    description: 'Pastel cotton candy & sakura',
    preview: ['#150610', '#36102a', '#f472b6'],
    color: '#f472b6',
    comingSoon: true,
  },
];

function applyTheme(themeId) {
  const root = document.documentElement;
  // Remove all theme classes
  THEMES.forEach((t) => root.classList.remove(`theme-${t.id}`));
  root.classList.add(`theme-${themeId}`);
  // Also toggle dark class for Tailwind dark: variants
  const isDark = themeId !== 'light';
  root.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => loadData(STORAGE_KEYS.THEME, 'dark'));

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setTheme(id) {
    setThemeState(id);
    saveData(STORAGE_KEYS.THEME, id);
  }

  // Legacy toggle kept for any components still using it
  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
