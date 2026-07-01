"use client"

/**
 * Full-page ambient background for the landing page.
 * Sits behind all sections; the hero's space-bg and the CTA's
 * legends.webp naturally overlay it in their own sections.
 */
export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ── Nebula orbs ── */}

      {/* Top-center — indigo pulse */}
      <div
        className="absolute left-1/2 -top-40 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(96,106,247,0.28) 0%, rgba(96,106,247,0.06) 60%, transparent 100%)",
          animation: "orbPulse 8s ease-in-out infinite",
        }}
      />

      {/* Top-right — violet */}
      <div
        className="absolute -right-32 top-[5%] h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(155,106,247,0.18) 0%, rgba(155,106,247,0.04) 65%, transparent 100%)",
          animation: "orbDrift 12s ease-in-out 1.5s infinite",
        }}
      />

      {/* Mid-left — sapphire */}
      <div
        className="absolute -left-40 top-[38%] h-[520px] w-[520px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(64,96,247,0.16) 0%, rgba(64,96,247,0.04) 65%, transparent 100%)",
          animation: "orbDrift 14s ease-in-out 0.8s infinite reverse",
        }}
      />

      {/* Mid-right — magenta */}
      <div
        className="absolute -right-20 top-[55%] h-[460px] w-[460px] rounded-full blur-[115px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(192,80,240,0.13) 0%, rgba(192,80,240,0.03) 65%, transparent 100%)",
          animation: "orbPulse 10s ease-in-out 2s infinite reverse",
        }}
      />

      {/* Bottom-left — violet */}
      <div
        className="absolute -left-20 bottom-[8%] h-[560px] w-[560px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(130,60,247,0.18) 0%, rgba(130,60,247,0.04) 65%, transparent 100%)",
          animation: "orbPulse 11s ease-in-out 3s infinite",
        }}
      />

      {/* Bottom-right — indigo */}
      <div
        className="absolute -right-32 bottom-[12%] h-[480px] w-[480px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(96,106,247,0.16) 0%, rgba(96,106,247,0.04) 65%, transparent 100%)",
          animation: "orbDrift 13s ease-in-out 0.4s infinite",
        }}
      />

      {/* Subtle centre accent at 65% scroll height */}
      <div
        className="absolute left-1/2 top-[65%] h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(96,106,247,0.11) 0%, transparent 70%)",
          animation: "orbPulse 9s ease-in-out 1s infinite reverse",
        }}
      />

      {/* ── Diagonal dot-grid ── */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(rgba(180,190,255,1) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          transform: "rotate(-8deg) scale(1.15)",
          transformOrigin: "center center",
        }}
      />

      {/* ── Thin diagonal lines (very subtle) ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -55deg,
            rgba(150,160,255,1) 0px,
            rgba(150,160,255,1) 1px,
            transparent 1px,
            transparent 80px
          )`,
        }}
      />

      {/* ── Film grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
        }}
      />

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1) translateY(0px); opacity: 1; }
          50%       { transform: scale(1.12) translateY(-18px); opacity: 0.8; }
        }
        @keyframes orbDrift {
          0%, 100% { transform: translate(0px, 0px); }
          33%       { transform: translate(18px, -22px); }
          66%       { transform: translate(-14px, 12px); }
        }
      `}</style>
    </div>
  )
}
