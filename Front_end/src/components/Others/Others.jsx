import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const EASE = [0.22, 1, 0.36, 1];
const GOLD = "#C9A864";

function OrnamentalRule({ color }) {
  return (
    <svg width="220" height="18" viewBox="0 0 220 18" fill="none" aria-hidden="true">
      <line x1="0" y1="9" x2="92" y2="9" stroke={color} strokeWidth="1" opacity="0.55" />
      <path d="M104 9 L110 3 L116 9 L110 15 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.9" />
      <circle cx="110" cy="9" r="1.6" fill={color} />
      <path d="M104 9 L98 3 M104 9 L98 15 M116 9 L122 3 M116 9 L122 15" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="128" y1="9" x2="220" y2="9" stroke={color} strokeWidth="1" opacity="0.55" />
    </svg>
  );
}

function CornerOrnament({ style, flipX = false, flipY = false }) {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      style={{
        position: "absolute",
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        ...style,
      }}
    >
      <path d="M2 70 L2 26 C2 12 12 2 26 2 L70 2" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      <path d="M12 70 L12 30 C12 20 20 12 30 12 L70 12" stroke={GOLD} strokeWidth="0.8" opacity="0.35" />
      <circle cx="12" cy="60" r="2" fill={GOLD} opacity="0.8" />
      <circle cx="60" cy="12" r="2" fill={GOLD} opacity="0.8" />
      <path d="M12 44 C 22 44, 22 34, 30 34" stroke={GOLD} strokeWidth="0.8" opacity="0.4" />
      <path d="M44 12 C 44 22, 34 22, 34 30" stroke={GOLD} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export default function Others() {
  const { dark } = useTheme();

  const headingColor = dark ? "#F5F1E6" : "#1A2620";
  const bodyColor = dark ? "rgba(237,231,218,0.6)" : "rgba(26,38,32,0.6)";
  const panelBg = dark ? "rgba(19,32,26,0.55)" : "rgba(240,234,216,0.7)";

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${(i * 41) % 100}%`,
        top: `${(i * 67) % 100}%`,
        size: 2 + ((i * 3) % 4),
        delay: (i % 7) * 0.9,
        duration: 7 + ((i * 5) % 6),
      })),
    []
  );

  return (
    <>
    <div className="w-full h-[15vh] "/>
    <section
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
      style={{ backgroundColor: dark ? "#0A0A0A" : "#FAF7F0" }}
    >
      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 50% at 50% 45%, ${GOLD}14 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${GOLD}12` }}
      />
      <div
        className="pointer-events-none absolute -top-28 -right-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: dark ? "#1C4D3A33" : "#C9B99A44" }}
      />

      {/* Drifting motes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              backgroundColor: GOLD,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.55, 0], y: [-14, 14] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute inset-6 sm:inset-10" aria-hidden="true">
        <CornerOrnament style={{ top: 0, left: 0 }} />
        <CornerOrnament style={{ top: 0, right: 0 }} flipX />
        <CornerOrnament style={{ bottom: 0, left: 0 }} flipY />
        <CornerOrnament style={{ bottom: 0, right: 0 }} flipX flipY />
      </div>

      {/* Center card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        whileHover={{ y: -4, scale: 1.005 }}
        className="relative z-10 mx-auto w-full max-w-[42rem] overflow-hidden rounded-[2rem] border px-6 py-12 text-center sm:px-14 sm:py-16 lg:px-16 lg:py-20"
        style={{
          backgroundColor: panelBg,
          borderColor: dark ? "rgba(201,168,100,0.35)" : "rgba(201,168,100,0.55)",
          backdropFilter: "blur(10px)",
          boxShadow: dark
            ? "0 40px 90px -40px rgba(0,0,0,0.85)"
            : "0 40px 90px -45px rgba(26,38,32,0.45)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(135deg, rgba(201,168,100,0.12), transparent 38%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(135deg, rgba(201,168,100,0.12), transparent 35%, rgba(255,255,255,0.18) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-3 rounded-[1.6rem] border"
          style={{
            borderColor: dark ? "rgba(201,168,100,0.22)" : "rgba(201,168,100,0.32)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Monogram seal */}
        
        

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mt-5 bg-clip-text text-5xl font-medium leading-[1.05] text-transparent sm:text-6xl lg:text-7xl"
            style={{
              backgroundImage: `linear-gradient(90deg, ${headingColor} 0%, ${GOLD} 25%, ${headingColor} 50%, ${GOLD} 75%, ${headingColor} 100%)`,
              backgroundSize: "200% 100%",
              animation: "othersShimmer 6s linear infinite",
              textShadow: dark ? "0 0 18px rgba(201,168,100,0.18)" : "none",
            }}
          >
            Coming Soon
          </motion.h1>

          {/* Rule */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-7 flex justify-center"
          >
            <OrnamentalRule color={GOLD} />
          </motion.div>

          {/* Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mx-auto mt-7 max-w-xl font-body text-sm leading-loose sm:text-base"
            style={{ color: bodyColor }}
          >
            New Products,Collections are be lanuched soon !!!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
            className="mt-4 font-heading text-[10px] uppercase tracking-[0.35em]"
            style={{ color: dark ? "rgba(237,231,218,0.4)" : "rgba(26,38,32,0.4)" }}
          >
            Stay tuned for updates
          </motion.p>
<div className="w-full h-[5vh] "/>
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/products"
              className="group relative w-full overflow-hidden rounded-xl px-9 py-3.5 text-[11px] font-heading uppercase tracking-[0.3em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(201,168,100,0.8)] sm:w-auto"
              style={{
                backgroundColor: `${GOLD}1A`,
                border: `1px solid ${GOLD}`,
                color: GOLD,
              }}
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(120deg, transparent 0%, ${GOLD}22 50%, transparent 100%)`,
                }}
              />
              <span className="relative z-10">Explore Collections</span>
            </Link>
            <Link
              to="/"
              className="group w-full rounded-xl border px-9 py-3.5 text-[11px] font-heading uppercase tracking-[0.3em] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A864] hover:bg-[#C9A864]/10 sm:w-auto"
              style={{
                borderColor: `${GOLD}55`,
                color: dark ? "rgba(237,231,218,0.75)" : "rgba(26,38,32,0.75)",
                backgroundColor: dark ? "rgba(201,168,100,0.02)" : "rgba(255,255,255,0.18)",
              }}
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes othersShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes othersFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
    </>
  );
}
