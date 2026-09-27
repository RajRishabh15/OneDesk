import { useState, useEffect } from "react";
import { Gamepad2, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SESSION_KEY = "onedesk_funzone_announced";

export default function FunZoneAnnouncement() {
  const [visible, setVisible]   = useState(false);
  const [leaving, setLeaving]   = useState(false);
  const navigate = useNavigate();

  // Show once per session, after a short delay
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 9 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), 9000);
    return () => clearTimeout(t);
  }, [visible]);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => setVisible(false), 350);
  }

  function goToFunZone() {
    dismiss();
    setTimeout(() => navigate("/fun-zone"), 200);
  }

  if (!visible) return null;

  return (
    <>
      {/* Responsive positioning via CSS class */}
      <div
        role="alertdialog"
        aria-live="polite"
        aria-label="Fun Zone coming soon"
        className="fz-toast"
        style={{
          background: "var(--bg-card-solid)",
          border: "1px solid var(--border-card)",
          borderRadius: "18px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          transition: "opacity 0.28s ease",
          opacity: leaving ? 0 : 1,
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 10, right: 10,
            width: 22, height: 22,
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
          <X size={11} />
        </button>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingRight: 18 }}>
          <div
            style={{
              width: 34, height: 34,
              borderRadius: 9,
              background: "var(--accent-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px var(--accent-glow)",
            }}
          >
            <Gamepad2 size={17} strokeWidth={2} style={{ color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25 }}>
              Fun Zone is coming!
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              New &middot; Inside OneDesk
            </p>
          </div>
        </div>

        {/* Body */}
        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)", marginBottom: 12 }}>
          Need a break from todos and tasks?{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Fun Zone</span>{" "}
          — mini games, daily quests and challenges — is on its way to help you recharge without leaving the app.
        </p>

        {/* CTA */}
        <button
          onClick={goToFunZone}
          className="fz-toast-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--accent-color)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "background 0.14s, border-color 0.14s",
          }}
        >
          Take a peek
          <ArrowRight size={12} strokeWidth={2.4} />
        </button>

        {/* Countdown bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--accent-gradient)",
              animation: "fz-bar 9s linear forwards",
              transformOrigin: "left",
              opacity: 0.45,
            }}
          />
        </div>
      </div>

      <style>{`
        /* All positioning in CSS — no inline overrides */
        .fz-toast {
          position: fixed;
          z-index: 1200;
          right: 20px;
          bottom: 24px;
          width: min(330px, calc(100vw - 40px));
          padding: 15px 16px 18px;
          box-sizing: border-box;
          overflow: hidden;
          animation: fz-enter-right 0.44s cubic-bezier(0.34,1.45,0.64,1) forwards;
        }

        /* Mobile + small tablet: full-width above dock */
        @media (max-width: 900px) {
          .fz-toast {
            left: 12px;
            right: 12px;
            bottom: 82px;
            width: auto;
            max-width: 100%;
            animation: fz-enter-up 0.44s cubic-bezier(0.34,1.45,0.64,1) forwards;
          }
        }

        .fz-toast-btn:hover {
          background: rgba(99,102,241,0.12) !important;
          border-color: var(--accent-color) !important;
        }

        @keyframes fz-enter-right {
          from { transform: translateX(28px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fz-enter-up {
          from { transform: translateY(20px); opacity: 0; }
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