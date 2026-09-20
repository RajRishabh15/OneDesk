export default function OneDeskLogo({ size = 24, className = '' }) {
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
        <linearGradient id="od-screen-grad" x1="6.5" y1="5" x2="25.5" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Desk Surface Gradient */}
        <linearGradient id="od-desk-grad" x1="4" y1="21.5" x2="28" y2="24.3" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Soft shadow for light badge */}
        <filter id="od-light-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Light-Themed Crisp White Base */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="7.5"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
        filter="url(#od-light-shadow)"
      />

      {/* Desk Legs */}
      <rect x="6.5" y="24" width="2" height="3" rx="0.8" fill="#CBD5E1" />
      <rect x="23.5" y="24" width="2" height="3" rx="0.8" fill="#CBD5E1" />

      {/* Desk Surface (Clean capsule tabletop) */}
      <rect x="4" y="21.5" width="24" height="2.8" rx="1.4" fill="url(#od-desk-grad)" />

      {/* Screen Stand (Neck + Base foot) */}
      <rect x="14.5" y="17" width="3" height="3" fill="#94A3B8" />
      <rect x="12" y="19.5" width="8" height="1.4" rx="0.7" fill="#94A3B8" />

      {/* Modern Desktop Display Screen */}
      <rect x="6.5" y="5" width="19" height="12.5" rx="3" fill="url(#od-screen-grad)" />

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
