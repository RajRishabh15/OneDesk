import { useId } from 'react';

export default function OneDeskLogo({ size = 24, className = '' }) {
  const rawId = useId();
  const screenGradId = `od-screen-grad-${rawId.replace(/:/g, '')}`;
  const deskGradId = `od-desk-grad-${rawId.replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="OneDesk Logo"
    >
      <defs>
        {/* Screen Gradient: Vivid Brand Indigo to Violet */}
        <linearGradient id={screenGradId} x1="6.5" y1="5" x2="25.5" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Desk Surface Gradient */}
        <linearGradient id={deskGradId} x1="4" y1="21.5" x2="28" y2="24.3" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Light-Themed Crisp White Base Badge */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="7.5"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.2"
      />

      {/* Desk Legs */}
      <rect x="6.5" y="24" width="2" height="3" rx="0.8" fill="#94A3B8" />
      <rect x="23.5" y="24" width="2" height="3" rx="0.8" fill="#94A3B8" />

      {/* Desk Surface (Clean capsule tabletop) */}
      <rect
        x="4"
        y="21.5"
        width="24"
        height="2.8"
        rx="1.4"
        fill={`url(#${deskGradId})`}
        style={{ fill: `url(#${deskGradId}) #4f46e5` }}
      />

      {/* Screen Stand (Neck + Base foot) */}
      <rect x="14.5" y="17" width="3" height="3" fill="#64748B" />
      <rect x="12" y="19.5" width="8" height="1.4" rx="0.7" fill="#64748B" />

      {/* Modern Desktop Display Screen */}
      <rect
        x="6.5"
        y="5"
        width="19"
        height="12.5"
        rx="3"
        fill={`url(#${screenGradId})`}
        style={{ fill: `url(#${screenGradId}) #6366f1` }}
      />

      {/* Crisp White Workspace Checkmark on Screen */}
      <path
        d="M12 11.2L14.6 13.8L20 8.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glowing Cyan Live Status Indicator Dot */}
      <circle cx="22" cy="7.5" r="1.2" fill="#38BDF8" />
    </svg>
  );
}
