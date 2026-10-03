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

  // Show once per session, slightly before or alongside FunZone toast
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 10 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), 10000);
    return () => clearTimeout(t);
  }, [visible]);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => setVisible(false), 350);
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
          borderRadius: "18px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          opacity: leaving ? 0 : 1,
        }}
      >
        {/* Close Button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 22,
            height: 22,
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

        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingRight: 18 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(217, 119, 6, 0.35)",
            }}
          >
            <BookOpen size={17} strokeWidth={2} style={{ color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25 }}>
              Notebook Light Theme ✦
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              New · Handcrafted Stationery Mode
            </p>
          </div>
        </div>

        {/* Body Text */}
        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)", marginBottom: 12 }}>
          Experience authentic warm parchment, continuous ruled notebook lines, dog-ear cards, and fountain pen ink aesthetics.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={applyNotebookTheme}
            className="nb-toast-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #b45309, #d97706)",
              border: "1px solid rgba(251, 191, 36, 0.4)",
              borderRadius: 999,
              padding: "6px 14px",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(217, 119, 6, 0.3)",
              transition: "transform 0.16s ease, filter 0.16s ease",
            }}
          >
            {applied || isCurrentNotebook ? (
              <>
                <Check size={12} strokeWidth={3} />
                <span>Applied!</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>Try Notebook</span>
              </>
            )}
          </button>

          <button
            onClick={goToAppearance}
            className="nb-toast-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
              transition: "color 0.14s, border-color 0.14s",
            }}
          >
            <span>Palettes</span>
            <ArrowRight size={11} strokeWidth={2} />
          </button>
        </div>

        {/* Countdown Progress Bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #b45309, #f59e0b)",
              animation: "nb-bar 10s linear forwards",
              transformOrigin: "left",
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      <style>{`
        /* Desktop: positioned directly ABOVE the FunZone toast (bottom: 24px + ~184px = 208px) */
        .nb-toast {
          position: fixed;
          z-index: 1201;
          right: 20px;
          bottom: 212px;
          width: min(330px, calc(100vw - 40px));
          padding: 15px 16px 18px;
          box-sizing: border-box;
          overflow: hidden;
          animation: nb-enter-right 0.44s cubic-bezier(0.34,1.45,0.64,1) forwards;
        }

        /* Mobile + small tablet: positioned above mobile FunZone toast (bottom: 82px + ~176px = 258px) */
        @media (max-width: 900px) {
          .nb-toast {
            left: 12px;
            right: 12px;
            bottom: 262px;
            width: auto;
            max-width: 100%;
            animation: nb-enter-up 0.44s cubic-bezier(0.34,1.45,0.64,1) forwards;
          }
        }

        .nb-toast-btn-primary:hover {
          filter: brightness(1.12);
          transform: translateY(-1px);
        }
        .nb-toast-btn-primary:active {
          transform: scale(0.96);
        }

        .nb-toast-btn:hover {
          color: var(--text-primary) !important;
          border-color: var(--border-card) !important;
        }

        @keyframes nb-enter-right {
          from { transform: translateX(28px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes nb-enter-up {
          from { transform: translateY(20px); opacity: 0; }
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
