import { useState, useEffect } from "react";
import { Gamepad2, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const SESSION_KEY = "onedesk_funzone_announced";

export default function FunZoneAnnouncement() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { playChime } = useSettings();
  const navigate = useNavigate();

  // Show once per session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 8s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), 8000);
    return () => clearTimeout(t);
  }, [visible]);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  }

  function goToFunZone() {
    dismiss();
    if (playChime) playChime("pop");
    setTimeout(() => navigate("/fun-zone"), 200);
  }

  if (!visible) return null;

  return (
    <>
      <div
        role="alertdialog"
        aria-live="polite"
        aria-label="Fun Zone coming soon"
        className="fz-toast"
        style={{
          background: "var(--bg-card-solid)",
          border: "1px solid var(--border-card)",
          borderRadius: "16px",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateY(8px) scale(0.97)" : "translateY(0) scale(1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 9,
            right: 9,
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          <X size={10} />
        </button>

        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6, paddingRight: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <Gamepad2 size={14} strokeWidth={2.2} style={{ color: "#fff" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Fun Zone
            </p>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "1px 5px",
                borderRadius: 999,
                background: "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                color: "var(--accent-color)",
                border: "1px solid color-mix(in srgb, var(--accent-color) 30%, transparent)",
              }}
            >
              Soon
            </span>
          </div>
        </div>

        {/* Concise Description */}
        <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--text-muted)", marginBottom: 10 }}>
          Arcade mini-games &amp; focus micro-breaks built right inside OneDesk.
        </p>

        {/* Action Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={goToFunZone}
            className="fz-toast-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent-color)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999,
              padding: "5px 12px",
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s, transform 0.15s",
            }}
          >
            <span>Take a peek</span>
            <ArrowRight size={10} strokeWidth={2.4} />
          </button>
        </div>

        {/* Countdown Progress Bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2.5,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--accent-gradient)",
              animation: "fz-bar 8s linear forwards",
              transformOrigin: "left",
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      <style>{`
        /* Desktop: positioned cleanly at bottom right */
        .fz-toast {
          position: fixed;
          z-index: 1200;
          right: 20px;
          bottom: 20px;
          width: min(310px, calc(100vw - 28px));
          padding: 12px 14px 13px;
          box-sizing: border-box;
          overflow: hidden;
          animation: fz-enter-right 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Mobile + small tablet: compact centered banner cleanly above the bottom nav dock */
        @media (max-width: 900px) {
          .fz-toast {
            left: 14px;
            right: 14px;
            bottom: 86px;
            max-width: 360px;
            margin: 0 auto;
            width: auto;
            animation: fz-enter-up 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }

        .fz-toast-btn:hover {
          background: color-mix(in srgb, var(--accent-color) 12%, transparent) !important;
          border-color: var(--accent-color) !important;
          transform: translateY(-0.5px);
        }
        .fz-toast-btn:active {
          transform: scale(0.96);
        }

        @keyframes fz-enter-right {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fz-enter-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fz-bar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </>
  );
}
