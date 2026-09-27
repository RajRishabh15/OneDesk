import { useState, useEffect } from "react";
import { Gamepad2, Trophy, Zap, Puzzle, Dice5, Clock } from "lucide-react";

export default function FunZone() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 550);
    return () => clearInterval(id);
  }, []);

  const features = [
    { icon: Trophy, label: "Leaderboards", desc: "See where you rank among friends",  color: "#fbbf24" },
    { icon: Puzzle, label: "Mini Games",   desc: "Quick brain workouts between tasks", color: "#f472b6" },
    { icon: Zap,    label: "Daily Quests", desc: "Earn streaks and little rewards",    color: "#34d399" },
    { icon: Dice5,  label: "Challenges",   desc: "Weekly community picks",             color: "#60a5fa" },
  ];

  return (
    <>
      <div
        className="relative w-full flex flex-col items-center justify-center text-center px-5 sm:px-8"
        style={{
          minHeight: "calc(100vh - 120px)",
          color: "var(--text-primary)",
          paddingTop: "clamp(2rem, 8vw, 5rem)",
          paddingBottom: "clamp(6rem, 10vw, 5rem)",
        }}
      >
        <div
          className="mb-7 flex items-center justify-center"
          style={{
            width: 72, height: 72,
            borderRadius: "20px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-card)",
            boxShadow: "0 0 0 6px rgba(99,102,241,0.07), 0 8px 28px rgba(99,102,241,0.15)",
            flexShrink: 0,
          }}
        >
          <Gamepad2
            size={34}
            strokeWidth={1.6}
            style={{ color: "var(--accent-color)", animation: "fz-rock 4s ease-in-out infinite" }}
          />
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--accent-color)", opacity: 0.65 }}
        >
          Fun Zone
        </p>

        <h1
          className="font-extrabold tracking-tight leading-tight mb-4"
          style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", color: "var(--text-primary)", maxWidth: "18ch" }}
        >
          Something crazzy is{" "}
          <span style={{ color: "var(--accent-color)" }}>on its way</span>
          <span style={{ opacity: tick % 2 === 0 ? 1 : 0, transition: "opacity 0.08s", marginLeft: 2 }}>_</span>
        </h1>

        <p
          className="leading-relaxed mb-10"
          style={{ fontSize: "clamp(0.875rem, 2.2vw, 1rem)", color: "var(--text-muted)", maxWidth: "36ch" }}
        >
          We're carving out a spot inside OneDesk just for fun —
          games, little challenges, and rewards for staying on top of your day.
          Not ready yet, but coming.
        </p>

        <div
          className="inline-flex items-center gap-2.5 mb-12 rounded-full font-medium"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            padding: "9px 20px",
            fontSize: 13,
          }}
        >
          <Clock size={13} style={{ color: "var(--accent-color)" }} />
          Coming soon &middot; Stay tuned
          <span
            style={{
              display: "inline-block",
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px #34d399",
              animation: "fz-blink 1.8s ease-in-out infinite",
            }}
          />
        </div>

        <div
          className="w-full text-left"
          style={{ maxWidth: 360, borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-muted)" }}>
            Planned features
          </p>
          <div className="space-y-5">
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="flex items-center gap-3.5">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 38, height: 38,
                    borderRadius: "11px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fz-rock {
          0%, 100% { transform: rotate(-5deg) scale(1);    }
          50%       { transform: rotate(5deg)  scale(1.06); }
        }
        @keyframes fz-blink {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </>
  );
}