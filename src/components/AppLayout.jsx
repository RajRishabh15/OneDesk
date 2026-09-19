import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavPill from './TopNavPill';
import GhostFibers from './GhostFibers';
import { useTheme } from '../context/ThemeContext';

const SHORTCUT_MAP = { d: '/', n: '/notes', t: '/tasks', c: '/calendar', a: '/analytics', s: '/settings' };

export default function AppLayout() {
  const navigate = useNavigate();
  const pendingG = useRef(false);
  const { glowLine, glowColor, fiberOpacity } = useThemeColors();

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
    <div
      className="relative min-h-screen overflow-x-hidden selection:bg-indigo-500/30 selection:text-white"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Animated background fibers — opacity controlled per theme via CSS var */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden fiber-canvas">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <GhostFibers
            lineColor={glowLine}
            glowColor={glowColor}
            speed={0.2}
            scale={2}
            rotation={0}
            rotationSpeed={0.25}
            layers={4}
            waveAmplitude={0.015}
            waveFrequency={3}
            waveSpeed={0.15}
            layerSpeed={0.08}
            twist={0.1}
            twistFrequency={5}
            twistSpeed={1.2}
            lineFrequency={5}
            lineSpacing={2}
            lineSharpness={16}
            glowFalloff={10}
            glowIntensity={1.6}
            brightness={2}
            blueBoost={1.25}
            vignette={0.8}
            grain={0.05}
            dpr={1}
            lightMode={false}
            fps={60}
            paused={false}
          />
        </div>
        {/* Overlay darkens fibers so cards stay readable */}
        <div className="absolute inset-0 page-overlay backdrop-blur-[0.5px]" />
      </div>

      <TopNavPill />

      <main className="relative z-10 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Read CSS custom properties from :root for GhostFibers props
function useThemeColors() {
  const { theme } = useTheme();
  // Map theme → fiber colors (CSS vars can't be read by JS easily, so we map directly)
  const map = {
    dark:   { glowLine: '#140E35', glowColor: '#3437A0' },
    light:  { glowLine: '#c7d2fe', glowColor: '#818cf8' },
    aurora: { glowLine: '#042a18', glowColor: '#059669' },
    rose:   { glowLine: '#3b0a1e', glowColor: '#e11d48' },
    ocean:  { glowLine: '#042040', glowColor: '#0284c7' },
    amber:  { glowLine: '#3a1c00', glowColor: '#d97706' },
  };
  return map[theme] || map.dark;
}
