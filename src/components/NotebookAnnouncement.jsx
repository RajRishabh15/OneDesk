import { useState, useEffect } from "react";
import { BookOpen, X, ArrowRight, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

const SESSION_KEY = "onedesk_notebook_theme_announced";

export default function NotebookAnnouncement() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const { theme, setTheme } = useTheme();
  const { playChime } = useSettings();
  const navigate = useNavigate();

  // Show once per session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1200);
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

  function applyNotebookTheme() {
    setTheme("notebook-light");
    if (playChime) playChime("success");
    setApplied(true);
    setTimeout(() => {
      dismiss();
    }, 1200);
  }

  function goToAppearance() {
    dismiss();
    if (playChime) playChime("pop");
    setTimeout(() => navigate("/appearance"), 200);
  }

  if (!visible) return null;

  const isCurrentNotebook = theme === "notebook-light";

  return (
    <>
      <div
        role="alertdialog"
        aria-live="polite"
        aria-label="Notebook Light Mode Theme available"
        className="nb-toast"
        style={{
          background: "var(--bg-card-solid)",
          border: "1.5px dashed var(--border-card)",
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
              background: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
            }}
          >
            <BookOpen size={14} strokeWidth={2.2} style={{ color: "#fff" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Notebook Mode
            </p>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "1px 5px",
                borderRadius: 999,
                background: "rgba(217, 119, 6, 0.15)",
                color: "#d97706",
                border: "1px solid rgba(217, 119, 6, 0.3)",
              }}
            >
              New
            </span>
          </div>
        </div>

        {/* Concise Description */}
        <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--text-muted)", marginBottom: 10 }}>
          Ruled notebook paper, warm parchment &amp; fountain pen styling.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={applyNotebookTheme}
            className="nb-toast-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #b45309, #d97706)",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              borderRadius: 999,
              padding: "5px 12px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.25)",
              transition: "transform 0.15s ease, filter 0.15s ease",
            }}
          >
            {applied || isCurrentNotebook ? (
              <>
                <Check size={11} strokeWidth={3} />
                <span>Applied!</span>
              </>
            ) : (
              <>
                <Sparkles size={11} />
                <span>Try Theme</span>
              </>
            )}
          </button>

          <button
            onClick={goToAppearance}
            className="nb-toast-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999,
              padding: "5px 10px",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            <span>Themes</span>
            <ArrowRight size={10} strokeWidth={2} />
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
              background: "linear-gradient(90deg, #b45309, #f59e0b)",
              animation: "nb-bar 8s linear forwards",
              transformOrigin: "left",
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      <style>{`
        /* Desktop: positioned above the FunZone toast with 12px gap */
        .nb-toast {
          position: fixed;
          z-index: 1201;
          right: 20px;
          bottom: 126px;
          width: min(310px, calc(100vw - 28px));
          padding: 12px 14px 13px;
          box-sizing: border-box;
          overflow: hidden;
          animation: nb-enter-right 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Mobile + small tablet: compact centered banner above mobile FunZone toast */
        @media (max-width: 900px) {
          .nb-toast {
            left: 14px;
            right: 14px;
            bottom: 188px;
            max-width: 360px;
            margin: 0 auto;
            width: auto;
            animation: nb-enter-up 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }

        .nb-toast-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-0.5px);
        }
        .nb-toast-btn-primary:active {
          transform: scale(0.96);
        }

        .nb-toast-btn:hover {
          color: var(--text-primary) !important;
          border-color: var(--border-card) !important;
        }

        @keyframes nb-enter-right {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes nb-enter-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes nb-bar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </>
  );
}
