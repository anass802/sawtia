import { useState, useEffect } from "react";

const floatingOrbs = [
  { size: 320, x: -80, y: -60, color: "#3b82f6", opacity: 0.15, duration: 8 },
  { size: 200, x: "70%", y: "10%", color: "#6366f1", opacity: 0.12, duration: 11 },
  { size: 150, x: "20%", y: "60%", color: "#0ea5e9", opacity: 0.1, duration: 9 },
  { size: 250, x: "80%", y: "70%", color: "#3b82f6", opacity: 0.08, duration: 13 },
];

const reactions = ["🚀", "⚡", "🔥", "✨", "💡", "🛠️", "🎯", "💪"];

export default function ComingSoon() {
  const [counts, setCounts] = useState({});
  const [popped, setPopped] = useState({});
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReaction = (emoji, index) => {
    setCounts((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
    setPopped((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => setPopped((prev) => ({ ...prev, [index]: false })), 300);

    // spawn floating particles
    const id = Date.now();
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: id + i,
      emoji,
      x: Math.random() * 60 - 30,
      y: -(40 + Math.random() * 60),
      index,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((n) => n.id === p.id)));
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faff",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFloat {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0.5); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15px, -10px); }
          66% { transform: translate(-10px, 15px); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }
        .reaction-btn:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 12px 32px rgba(59,130,246,0.18);
        }
        .reaction-btn {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Orbs */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            opacity: orb.opacity,
            left: orb.x,
            top: orb.y,
            filter: "blur(60px)",
            animation: `orbFloat ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Main card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 680,
          width: "100%",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          border: "1px solid rgba(59,130,246,0.15)",
          boxShadow: "0 32px 80px rgba(59,130,246,0.1), 0 2px 0 rgba(255,255,255,0.8) inset",
          padding: "56px 52px",
          textAlign: "center",
          animation: mounted ? "fadeUp 0.8s ease both" : "none",
        }}
      >
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          border: "1px solid #bfdbfe",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          animation: "badgePulse 2.5s ease infinite",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            En cours de développement
          </span>
        </div>

        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: "0 16px 40px rgba(59,130,246,0.35)",
          animation: "float 4s ease-in-out infinite",
          fontSize: 36,
        }}>
          🛠️
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.1,
          marginBottom: 16,
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>
          Cette page est en<br />construction
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 17, color: "#64748b", lineHeight: 1.7,
          marginBottom: 12, maxWidth: 460, margin: "0 auto 12px",
        }}>
          We're working hard to bring you something great.
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, color: "#94a3b8", lineHeight: 1.6,
          marginBottom: 40, maxWidth: 420, margin: "0 auto 40px",
        }}>
          This feature is currently being built. Check back soon — it'll be worth the wait.
        </p>

        {/* Divider */}
        <div style={{
          width: 48, height: 3, borderRadius: 10,
          background: "linear-gradient(90deg, #3b82f6, #6366f1)",
          margin: "0 auto 32px",
        }} />

        {/* Reactions label */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: "#94a3b8", letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: 16,
        }}>
          Show your excitement
        </p>

        {/* Reactions grid */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 10, justifyContent: "center",
          marginBottom: 8,
        }}>
          {reactions.map((emoji, i) => (
            <div key={i} style={{ position: "relative" }}>
              {/* Floating particles */}
              {particles.filter((p) => p.index === i).map((p) => (
                <span
                  key={p.id}
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    pointerEvents: "none",
                    fontSize: 16, zIndex: 20,
                    "--px": `${p.x}px`,
                    "--py": `${p.y}px`,
                    animation: "particleFloat 1.1s ease forwards",
                  }}
                >
                  {p.emoji}
                </span>
              ))}

              <button
                className="reaction-btn"
                onClick={() => handleReaction(emoji, i)}
                style={{
                  background: popped[i]
                    ? "linear-gradient(135deg, #eff6ff, #dbeafe)"
                    : "white",
                  border: popped[i] ? "1.5px solid #93c5fd" : "1.5px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "10px 16px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  fontSize: 20,
                  animation: popped[i] ? "pop 0.3s ease" : "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <span>{emoji}</span>
                {counts[i] > 0 && (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 600,
                    color: "#3b82f6",
                    minWidth: 16,
                  }}>
                    {counts[i]}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Total reactions */}
        {Object.values(counts).reduce((a, b) => a + b, 0) > 0 && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: "#94a3b8", marginTop: 16,
            animation: "fadeUp 0.4s ease both",
          }}>
            {Object.values(counts).reduce((a, b) => a + b, 0)} people are excited about this feature
          </p>
        )}
      </div>

      {/* Bottom note */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: "#cbd5e1", marginTop: 28,
        zIndex: 10, position: "relative",
        animation: mounted ? "fadeUp 1s 0.4s ease both" : "none",
        opacity: 0,
      }}>
        Alkhadim AI · Built with ❤️ in Morocco
      </p>
    </div>
  );
}