import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

/* ─── Reusable Pieces ─── */

function GlowOrb({ className, color }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-[120px] ${className}`}
      style={{ backgroundColor: color }}
      animate={{ y: [0, -10, 0], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function OrnamentalLine() {
  return (
    <svg width="200" height="24" viewBox="0 0 200 24" className="mx-auto">
      <line x1="0" y1="12" x2="70" y2="12" stroke="#C9A864" strokeWidth="0.8" opacity="0.4" />
      <path d="M80 12 L90 5 L100 19 L110 5 L120 12" fill="none" stroke="#C9A864" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="130" y1="12" x2="200" y2="12" stroke="#C9A864" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function ScrollReveal({ children, className = "", delay = 0, direction = "up" }) {
  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };
  const { x, y } = dirMap[direction] || dirMap.up;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating Particles Background ─── */

function FloatingParticles({ count = 20 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: "#C9A864",
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Perfume Bottle SVG ─── */

function BottleSVG({ id, className = "", fill = "#0A0A0A", stroke = "#C9A864", strokeOpacity = 0.95 }) {
  return (
    <svg viewBox="0 0 240 420" className={`w-full h-auto ${className}`} aria-hidden="true">
      <defs>
        <path
          id={id}
          d="M 120 30
             C 108 30, 102 36, 102 46
             L 102 62
             C 90 64, 82 72, 82 84
             L 82 110
             C 50 116, 30 138, 30 168
             L 30 320
             C 30 338, 44 352, 62 352
             L 178 352
             C 196 352, 210 338, 210 320
             L 210 168
             C 210 138, 190 116, 158 110
             L 158 84
             C 158 72, 150 64, 138 62
             L 138 46
             C 138 36, 132 30, 120 30 Z"
        />
      </defs>
      <use href={`#${id}`} fill={fill} />
      <use href={`#${id}`} fill="none" stroke={stroke} strokeWidth="1.6" opacity={strokeOpacity} />
      <line x1="82" y1="118" x2="158" y2="118" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      <line x1="68" y1="160" x2="172" y2="160" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ─── Compact Bottle Silhouette (for background motifs inside cards) ─── */

function BottleGlyph({ id, className = "", color = "#C9A864" }) {
  return (
    <svg viewBox="0 0 240 420" className={className} aria-hidden="true">
      <defs>
        <path
          id={id}
          d="M 120 30
             C 108 30, 102 36, 102 46
             L 102 62
             C 90 64, 82 72, 82 84
             L 82 110
             C 50 116, 30 138, 30 168
             L 30 320
             C 30 338, 44 352, 62 352
             L 178 352
             C 196 352, 210 338, 210 320
             L 210 168
             C 210 138, 190 116, 158 110
             L 158 84
             C 158 72, 150 64, 138 62
             L 138 46
             C 138 36, 132 30, 120 30 Z"
        />
      </defs>
      <use href={`#${id}`} fill={color} />
    </svg>
  );
}

/* ─── Animated Counter ─── */

function AnimatedStat({ number, label, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative border border-[#C9A864]/15 bg-[#0a0f0c]/60 rounded-2xl p-7 sm:p-9 text-center overflow-hidden group hover:border-[#C9A864]/30 transition-colors duration-500"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(201,168,100,0.06), transparent 70%)" }}
      />
      <span className="font-heading text-[#C9A864] text-3xl sm:text-4xl block mb-3 relative z-10">{number}</span>
      <span className="font-body text-[#F0EAD8]/50 text-[11px] sm:text-xs uppercase tracking-wider relative z-10">{label}</span>
    </motion.div>
  );
}

/* ─── Parallax Section Wrapper ─── */

function ParallaxSection({ children, className = "", bg = "#0A0A0A", id }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
    >
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>
    </section>
  );
}

/* ─── Ornamental Divider — continuous line-drawing animation ─── */

const OrnamentalDivider = ({ className = "" }) => {
  const draw = {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.8,
  };

  return (
    <svg
      width="360"
      height="90"
      viewBox="0 0 620 140"
      className={className}
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left vine */}
      <motion.path
        d="M20 78 C 90 40, 150 100, 230 68 C 250 60, 260 66, 272 72"
        fill="none"
        stroke="#C9A864"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={draw}
      />

      {/* Right vine (mirrored) */}
      <motion.path
        d="M600 78 C 530 40, 470 100, 390 68 C 370 60, 360 66, 348 72"
        fill="none"
        stroke="#C9A864"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={draw}
      />

      {/* Lotus petals — stroke only, drawn like a sketch */}
      {[
        "M310 100 C 300 80 300 55 310 35 C 320 55 320 80 310 100",
        "M310 100 C 292 84 278 62 275 40 C 296 48 312 65 310 100",
        "M310 100 C 328 84 342 62 345 40 C 324 48 308 65 310 100",
        "M310 100 C 285 92 262 78 250 60 C 272 58 296 68 310 100",
        "M310 100 C 335 92 358 78 370 60 C 348 58 324 68 310 100",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#C9A864"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...draw, delay: 0.25 + i * 0.1 }}
        />
      ))}

      {/* Lotus center dot, pulses in after petals finish */}
      <motion.circle
        cx="310"
        cy="98"
        r="6"
        fill="#C9A864"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
        transition={{ ...draw, delay: 0.9 }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function OurStory() {

  const trustCards = [
    {
      title: "Diluted Concentrates",
      text: "Perfumes stretched thin with cheap carrier bases, sold at full concentration prices with no way for you to verify what's actually inside the bottle.",
      color: "#B5453F",
      glow: "rgba(181,69,63,0.16)",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B5453F" strokeWidth="1.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" opacity="0.4" />
        </svg>
      ),
    },
    {
      title: "Relabeled Knockoffs",
      text: "Generic imitations repackaged under convincing labels, priced like the originals but carrying none of the craftsmanship or ingredients.",
      color: "#C9A864",
      glow: "rgba(201,168,100,0.18)",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A864" strokeWidth="1.2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8l8 8M16 8l-8 8" opacity="0.5" />
        </svg>
      ),
    },
    {
      title: "Unknown Origins",
      text: "Sellers who can't tell you where their stock actually came from, leaving you to trust a supply chain you can't see or verify.",
      color: "#5FA88C",
      glow: "rgba(95,168,140,0.16)",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5FA88C" strokeWidth="1.2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" opacity="0.6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#0A0A0A] overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <FloatingParticles count={30} />
        <GlowOrb className="w-[600px] h-[600px] -top-60 -left-60" color="rgba(201,168,100,0.07)" />
        <GlowOrb className="w-[500px] h-[500px] -bottom-40 -right-40" color="rgba(92,26,26,0.1)" />
        <GlowOrb className="w-[300px] h-[300px] top-1/3 right-1/4" color="rgba(28,77,58,0.08)" />

        <div className="relative z-10 max-w-4xl text-center">
          {/* Eyebrow */}
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-[#C9A864]/40" />
              <span className="font-heading text-[#C9A864] text-[10px] tracking-[0.5em] uppercase">
                Est. 2016
              </span>
              <div className="w-12 h-px bg-[#C9A864]/40" />
            </div>
          </ScrollReveal>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{once:false,amount:0.5}}
            className="font-heading text-[#F0EAD8] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] mb-10"
          >
            The story behind{" "}
            <br className="hidden sm:block" />
            every{" "}
            <span className="relative inline-block">
              <span
                className="bg-clip-text text-transparent bg-[length:200%_100%] italic"
                style={{
                  backgroundImage: "linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)",
                  animation: "shimmer 5s linear infinite",
                }}
              >
                signature scent
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-[#C9A864]/30"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                   viewport={{once:false,amount:0.5}}
              />
            </span>
          </motion.h1>

          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: false, margin: '-120px' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10"
          >
            <OrnamentalLine />
          </motion.div>

          {/* Subtitle */}
          <ScrollReveal delay={0.3}>
            <p className="font-body text-[#F0EAD8]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              This is the story of why we exist, what we refuse to compromise on,
              and why thousands trust us with something as personal as their own signature scent.
            </p>
          </ScrollReveal>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             viewport={{once:false,amount:0.5}}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <svg width="20" height="32" viewBox="0 0 20 32">
            <rect x="1" y="1" width="18" height="30" rx="9" fill="none" stroke="#C9A864" strokeWidth="1" opacity="0.5" />
            <motion.circle
              cx="10" cy="10" r="3" fill="#C9A864" opacity="0.7"
              animate={{ cy: [10, 22, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 viewport={{once:false,amount:0.5}}
            />
          </svg>
          <span className="font-heading text-[#C9A864]/40 text-[8px] tracking-[0.3em] uppercase">Scroll</span>
        </motion.div>
      </section>


      {/* ─── SECTION 1: Fragrance & Personality ─── */}
      <motion.div className="w-full h-[1vh]"/>
      <ParallaxSection bg="#0F1A15" className="py-36 sm:py-48">
        <FloatingParticles count={12} />
        <GlowOrb className="w-[500px] h-[500px] -top-40 -right-40" color="rgba(201,168,100,0.06)" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-28">

            {/* Left: Text */}
            <ScrollReveal direction="left" className="w-full lg:w-1/2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C9A864]" />
                <span className="font-heading text-[#C9A864] text-[10px] tracking-[0.4em] uppercase">
                  The Invisible Signature
                </span>
              </div>

              <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.2] mb-10">
                Fragrance isn't an accessory.
                <br />
                <span className="text-[#C9A864]">It's a presence.</span>
              </h2>

              <div className="space-y-7">
                <p className="font-body text-[#F0EAD8]/65 text-sm sm:text-base leading-loose">
                  Long before someone reads your posture, your outfit, or your words,
                  they register your scent. It arrives first, and it lingers longest — in a room
                  after you've left it, on a scarf borrowed once, in a memory someone didn't
                  know they were keeping.
                </p>
                <p className="font-body text-[#F0EAD8]/65 text-sm sm:text-base leading-loose">
                  A well-chosen perfume doesn't just complement how you look — it shapes how
                  you're remembered. It carries confidence quietly, without needing to announce
                  itself. That's the kind of charm that can't be rehearsed, only worn.
                </p>
              </div>
              <motion.div className="w-full h-[2vh]"/>

              {/* Decorative quote */}
              <div className="mt-10 pl-5 border-l-2 border-[#C9A864]/30">
                <p className="font-heading text-[#C9A864]/70 text-lg italic leading-relaxed">
                  "Your impression begins with fragrance."
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Animated Bottle */}
            <ScrollReveal direction="right" className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <GlowOrb className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(201,168,100,0.1)" />
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                     viewport={{once:false,amount:0.5}}
                  className="w-[180px] sm:w-[220px] relative z-10"
                >
                  <BottleSVG id="bottle-personality" />
                </motion.div>

                {/* Orbiting ring */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#C9A864]/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C9A864]/40" />
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>


      {/* ─── SECTION 2: The Trust Problem — colorful bottle-shaped cards ─── */}
       <motion.div className="w-full h-[12vh]"/>
      <section className="relative w-full py-36 sm:py-48 overflow-hidden bg-[#0A0A0A]">
        <FloatingParticles count={14} />
        <GlowOrb className="w-[500px] h-[500px] -top-40 -left-40" color="rgba(201,168,100,0.1)" />
        <GlowOrb className="w-[450px] h-[450px] -bottom-40 -right-40" color="rgba(201,168,100,0.08)" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#C9A864]" />
              <span className="font-heading text-[#C9A864] text-[10px] tracking-[0.4em] uppercase">
                A Difficult Truth
              </span>
              <div className="w-8 h-px bg-[#C9A864]" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl lg:text-5xl leading-[1.2] mb-8">
              Finding{" "}
              <span
                className="bg-clip-text text-transparent bg-[length:200%_100%] italic"
                style={{
                  backgroundImage: "linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)",
                  animation: "shimmer 5s linear infinite",
                }}
              >
                Trustable Sellers?
              </span>
            </h2>
          </ScrollReveal>

<motion.div className="w-full flex justify-center items-center">

   <ScrollReveal delay={0.2}>
            <OrnamentalLine />
          </ScrollReveal>
</motion.div>

 <motion.div className="w-full h-[3vh]"/>
       

<motion.div className="w-full flex justify-center items-center">

   <ScrollReveal delay={0.3}>
            <p className="font-body text-[#F0EAD8]/60 text-sm sm:text-base leading-loose max-w-2xl mx-auto mt-10 mb-20">
              It's harder than it should be. The market is flooded with sellers who can't
              vouch for their own stock — and that uncertainty is exactly what pushed us
              to build something different.
            </p>
          </ScrollReveal>
</motion.div>
       

           <motion.div className="w-full h-[12vh]"/>

          {/* Card system — each card carries a colored bottle silhouette */}
          <div className="grid sm:grid-cols-3 gap-8 lg:gap-10 mb-20">
            {trustCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -10, borderColor: `${card.color}55` }}
                  transition={{ duration: 0.3 }}
                     viewport={{once:false,amount:0.5}}
                  className="h-full min-h-[340px] border border-[#F0EAD8]/10 bg-gradient-to-b from-[#12100d]/90 to-[#0A0A0A] rounded-2xl p-9 relative overflow-hidden group text-left flex flex-col"
                >
                  {/* Colored ambient glow */}
                  <div
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[60px] opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                    style={{ backgroundColor: card.glow }}
                  />

                  {/* Large bottle silhouette watermark, tinted to the card's color */}
                  <div className="absolute -bottom-8 -right-6 w-32 sm:w-36 opacity-[0.14] group-hover:opacity-25 transition-opacity duration-700 pointer-events-none">
                    <BottleGlyph id={`trust-glyph-${i}`} color={card.color} />
                  </div>

                  {/* Corner accents tinted per card */}
                  <div
                    className="absolute top-4 left-4 w-5 h-5 border-t border-l transition-colors duration-500"
                    style={{ borderColor: `${card.color}30` }}
                  />
                  <div
                    className="absolute bottom-4 right-4 w-5 h-5 border-b border-r transition-colors duration-500"
                    style={{ borderColor: `${card.color}30` }}
                  />

                  <div className="relative z-10 flex flex-col flex-1">
                    <div
                      className="w-14 h-14 rounded-xl border flex items-center justify-center mb-7"
                      style={{ borderColor: `${card.color}45`, backgroundColor: `${card.color}12` }}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-heading text-[#F0EAD8] text-lg mb-4">{card.title}</h3>
                    <p className="font-body text-[#F0EAD8]/55 text-sm leading-loose">{card.text}</p>

                    {/* small bottle outline accent beside the text, echoing the theme */}
                    <div className="mt-auto pt-6 flex items-center gap-2 opacity-70">
                      <div className="w-6" style={{ color: card.color }}>
                        <BottleSVG id={`trust-mini-${i}`} fill="none" stroke={card.color} strokeOpacity={0.6} />
                      </div>
                      <span
                        className="font-heading text-[9px] uppercase tracking-[0.3em]"
                        style={{ color: card.color }}
                      >
                        Watch for this
                      </span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

       
        </div>
      </section>

{/* ─── SECTION 3: Why We Stand Out ─── */}
<motion.div className="w-full h-[12vh]" />
<section className="relative w-full py-36 sm:py-48 bg-[#0A0A0A] overflow-hidden">
  <FloatingParticles count={15} />
  <GlowOrb className="w-[400px] h-[400px] top-20 right-10" color="rgba(201,168,100,0.06)" />
  <GlowOrb className="w-[350px] h-[350px] bottom-10 left-10" color="rgba(28,77,58,0.08)" />

  {/* Ambient drifting mesh — continuous, never settles */}
  <motion.div
    className="absolute inset-0 opacity-[0.06] pointer-events-none"
    style={{
      backgroundImage:
        "radial-gradient(circle at 20% 30%, #C9A864 0%, transparent 35%), radial-gradient(circle at 80% 70%, #5FB3B0 0%, transparent 35%), radial-gradient(circle at 50% 90%, #D98FB0 0%, transparent 30%)",
      backgroundSize: "200% 200%",
    }}
    animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
       viewport={{once:false,amount:0.5}}

  />

  <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    {/* Header */}
    <div className="text-center mb-24">
      <ScrollReveal>
        <div className="flex items-center justify-center gap-3 mb-8">
          <motion.div
            className="w-8 h-px bg-[#C9A864]"
            animate={{ scaleX: [1, 1.6, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               viewport={{once:false,amount:0.5}}
          />
          <span className="font-heading text-[#C9A864] text-[10px] tracking-[0.4em] uppercase">
            Why Rafifa Mart
          </span>
          <motion.div
            className="w-8 h-px bg-[#C9A864]"
            animate={{ scaleX: [1, 1.6, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
               viewport={{once:false,amount:0.5}}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl lg:text-5xl leading-[1.2] mb-8">
          This is where trust stops
          <br />
          <span
            className="bg-clip-text text-transparent bg-[length:200%_100%]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)",
              animation: "shimmerText 6s linear infinite",
            }}
          >
            being a leap of faith.
          </span>
        </h2>
      </ScrollReveal>

      <motion.div className="w-full flex justify-center items-center">
    <ScrollReveal delay={0.2}>
        <p className="font-body text-[#F0EAD8]/60 text-sm sm:text-base leading-loose max-w-2xl mx-auto">
          We didn't want to be another storefront guessing at what's real.
          So we built our entire sourcing philosophy around three things that
          most sellers can't claim honestly.
        </p>
      </ScrollReveal>

      </motion.div>

  
    </div>
    <motion.div className="w-full h-[6vh]" />

    {/* 3 Feature Cards — rotating gradient border + orbiting icon, all inline */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24">
      {[
        {
          title: "Direct from the Source",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A864" strokeWidth="1.3">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          ),
          color: "#C9A864",
          text: "Every fragrance we carry is imported directly from established dealers across the Middle East — the region long regarded as the heart of perfumery. No intermediaries, no uncertain stock.",
        },
        {
          title: "Purity Guaranteed",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5FB3B0" strokeWidth="1.3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ),
          color: "#5FB3B0",
          text: "We'd rather carry fewer bottles we can vouch for than flood our shelves with anything that moves. Every batch is checked before it ever reaches a customer's hands.",
        },
        {
          title: "Unmatched Variety",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D98FB0" strokeWidth="1.3">
              <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
            </svg>
          ),
          color: "#D98FB0",
          text: "From smoky oud to bright citrus, from bold atars to everyday sprays — our range is built to be genuinely explored. Whatever your personality, there's a scent waiting for it.",
        },
      ].map((card, i) => (
        <ScrollReveal key={card.title} delay={i * 0.15}>
          <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
               viewport={{once:false,amount:0.5}}
            className="relative h-full rounded-2xl p-[1.5px] group overflow-hidden"
          >
            {/* spinning gradient ring border — never stops, even at rest */}
            <div
              className="absolute inset-[-40%] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${card.color} 12%, transparent 28%, transparent 100%)`,
                animation: "spinBorder 6s linear infinite",
              }}
            />

            {/* solid inner panel */}
            <div className="relative z-10 h-full rounded-2xl bg-gradient-to-b from-[#0F1512] to-[#0A0A0A] p-9 overflow-hidden">

              {/* icon badge with orbiting dashed ring + pulsing glow + orbiting dot */}
              <div className="relative w-16 h-16 mb-7 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed"
                  style={{ borderColor: `${card.color}50` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                     viewport={{once:false,amount:0.5}}
                />
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{ background: `radial-gradient(circle, ${card.color}25, transparent 70%)` }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                     viewport={{once:false,amount:0.5}}
                />
                <div
                  className="relative z-10 w-12 h-12 rounded-full border flex items-center justify-center bg-[#0A0A0A]"
                  style={{ borderColor: `${card.color}55` }}
                >
                  {card.icon}
                </div>
                <motion.div
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: card.color, top: "50%", left: "50%" }}
                  animate={{
                    x: [0, 26, 0, -26, 0],
                    y: [-26, 0, 26, 0, -26],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                     viewport={{once:false,amount:0.5}}
                />
              </div>

              {/* shimmering underline */}
              <div
                className="relative h-[2px] w-10 mb-5 rounded-full overflow-hidden"
                style={{ backgroundColor: `${card.color}25` }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/2 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                     viewport={{once:false,amount:0.5}}
                />
              </div>

              <h3 className="font-heading text-[#F0EAD8] text-xl mb-5">{card.title}</h3>
              <p className="font-body text-[#F0EAD8]/55 text-sm leading-loose">{card.text}</p>
            </div>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  </div>

  <style>{`
    @keyframes spinBorder {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shimmerText {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `}</style>
</section>

    {/* ─── SECTION 4: Online Service — clean service highlights with soft glow ─── */}
{/* ─── SECTION 4: Online Service — clean service highlights with soft glow ─── */}
{/* ─── SECTION 4: Dispatch Manifest — vintage shipping-ticket concept ─── */}
<section className="relative w-full min-h-[100vh] flex justify-center items-center py-20 sm:py-24  overflow-hidden">
  <FloatingParticles count={8} />
  <GlowOrb className="w-[380px] h-[380px] top-0 left-1/4" color="rgba(201,168,100,0.06)" />
  <GlowOrb className="w-[280px] h-[280px] bottom-12 right-14" color="rgba(95,179,176,0.08)" />

  <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
    <div className="relative overflow-hidden rounded-[1.25rem] border border-[#C9A864]/15 bg-[#0A120D]/85 shadow-[0_40px_90px_-60px_rgba(0,0,0,0.65)]">

      {/* Tag hole + string loop */}
      <div className="hidden lg:block absolute left-8 top-8 z-20">
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="7" fill="#101915" stroke="#C9A864" strokeOpacity="0.5" strokeWidth="1.5" />
          <path
            d="M16 23 C 8 12, 8 -4, 23 -4 C 38 -4, 38 12, 30 23"
            stroke="#C9A864" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" fill="none"
          />
        </svg>
      </div>

      {/* Three vertical sections — explicit column ratios + min-w-0 so text wraps INSIDE its track */}
      <div className="relative grid lg:grid-cols-[1fr_1.3fr_0.95fr] divide-y lg:divide-y-0 divide-dashed divide-[#F0EAD8]/10">

        {/* COLUMN 1 — Intro */}
        <motion.div
          className="min-w-0 p-8 pt-20 sm:p-12 lg:p-14 lg:pt-16 flex flex-col justify-center gap-7 lg:border-r lg:border-dashed lg:border-[#F0EAD8]/10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-px bg-[#C9A864] shrink-0" />
            <span className="font-heading text-[#C9A864] text-[11px] tracking-[0.35em] uppercase">
              Dispatch Manifest
            </span>
          </div>

          <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl leading-tight break-words">
            Every bottle travels
            <br />
            <span className="text-[#C9A864]">with its own paper trail.</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-[#F0EAD8]/70">
            From the moment your order is sealed at the atelier to the knock on your door,
            it's logged, tracked, and accounted for — the same rigor we give the fragrance itself.
          </p>

          <div className="font-mono text-[10px] tracking-[0.3em] text-[#F0EAD8]/40 uppercase">
            No. RM–{new Date().getFullYear()}–0429
          </div>
        </motion.div>

        {/* COLUMN 2 — Route / stages (flex rows, no absolute-offset markers) */}
        <div className="min-w-0 p-8 sm:p-12 lg:p-14 flex flex-col justify-center lg:border-r lg:border-dashed lg:border-[#F0EAD8]/10">
          <div className="relative">
            {/* spine sits behind the markers, centered on the 26px circle */}
            <motion.div
              className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A864]/60 via-[#C9A864]/30 to-[#5FB3B0]/40"
              style={{ transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="space-y-9">
              {[
                { numeral: 'I', title: 'Sealed at the atelier', detail: 'Packed and wax-sealed within the hour — no origin compromises.', accent: '#C9A864' },
                { numeral: 'II', title: 'Verified twice', detail: '100% checked against the manifest before it leaves our hands.', accent: '#5FB3B0' },
                { numeral: 'III', title: 'En route', detail: 'Real-time tracking, door to door.', accent: '#C9A864' },
                { numeral: 'IV', title: 'Delivered', detail: '24–48 hours to major cities.', accent: '#5FB3B0' },
              ].map((stage, i) => {
                const fromLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={stage.numeral}
                    className="relative flex items-start gap-5"
                    initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
                  >
                    <span
                      className="relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full font-heading text-[11px]"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${stage.accent}33, #0A120D 70%)`,
                        border: `1px solid ${stage.accent}66`,
                        color: stage.accent,
                      }}
                    >
                      {stage.numeral}
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <h3 className="font-heading text-[#F0EAD8] text-lg">{stage.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#F0EAD8]/60">
                        {stage.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 3 — Seal */}
        <motion.div
          className="min-w-0 p-8 sm:p-12 lg:p-14 flex flex-col items-center justify-center gap-8 text-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg
            width="150" height="150" viewBox="0 0 150 150"
            initial={{ opacity: 0, scale: 0.75, rotate: -14 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.g
              style={{ transformOrigin: '75px 75px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                 viewport={{once:false,amount:0.5}}
            >
              <circle cx="75" cy="75" r="68" fill="none" stroke="#C9A864" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" />
              <circle cx="75" cy="75" r="57" fill="none" stroke="#5FB3B0" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="1 4" />
            </motion.g>

            <path id="stampArcTop" d="M 28,75 A 47,47 0 0 1 122,75" fill="none" />
            <text fill="#C9A864" fontSize="8" letterSpacing="2.5" className="font-heading uppercase">
              <textPath href="#stampArcTop" startOffset="50%" textAnchor="middle">
                Rafifa Mart
              </textPath>
            </text>

            <circle cx="75" cy="75" r="36" fill="#0A120D" stroke="#C9A864" strokeOpacity="0.5" strokeWidth="1" />
            <text x="75" y="70" textAnchor="middle" fill="#F0EAD8" fontSize="9" letterSpacing="2" className="font-heading uppercase">
              Global
            </text>
            <text x="75" y="83" textAnchor="middle" fill="#C9A864" fontSize="9" letterSpacing="2" className="font-heading uppercase">
              Dispatch
            </text>
          </motion.svg>

          <p className="max-w-[220px] text-sm leading-relaxed text-[#F0EAD8]/60">
            Every parcel stamped, logged, and accounted for — from atelier to doorstep.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
</section>
{/* ─── SECTION 5: CTA ─── */}
     <motion.div className="w-full h-[15vh]" />
<section className="relative w-full py-40 sm:py-52 px-6 bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
  {/* Enhanced background elements */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(201,168,100,0.03)_0%,transparent_70%)]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#C9A864]/5" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#C9A864]/10" />
  </div>

  <FloatingParticles count={35} />
  <GlowOrb className="w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(201,168,100,0.08)" />

  {/* Decorative corner accents */}
  <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#C9A864]/20" />
  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#C9A864]/20" />
  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#C9A864]/20" />
  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#C9A864]/20" />

  <div className="relative z-10 max-w-3xl text-center">
    {/* Premium badge */}
    <ScrollReveal delay={0.05}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[#C9A864]/20 bg-[#C9A864]/5 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A864] animate-pulse" />
        <span className="font-body text-[#C9A864] text-[10px] uppercase tracking-[0.3em]">
          Curated Collection
        </span>
      </div>
    </ScrollReveal>

    <ScrollReveal delay={0.1}>
      <h2
        className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1]"
      >
        <span className="bg-clip-text text-transparent bg-[length:200%_100%] bg-gradient-to-r from-[#F0EAD8] via-[#C9A864] to-[#F0EAD8] animate-[shimmer_5s_linear_infinite]">
          Your Signature
        </span>
        <br />
        <span className="text-[#F0EAD8]">Awaits Discovery</span>
      </h2>
    </ScrollReveal>

    <ScrollReveal delay={0.2}>
      <p className="font-body text-[#F0EAD8]/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
        Every piece tells a story of intention, crafted with integrity and delivered
        with the care that defines true luxury.
      </p>
    </ScrollReveal>

    <ScrollReveal delay={0.25}>
      <div className="flex justify-center mb-12">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A864] to-transparent" />
        <div className="mx-4 text-[#C9A864]">✦</div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A864] to-transparent" />
      </div>
    </ScrollReveal>

    <ScrollReveal delay={0.3}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
       <motion.a
  href="/products"
  whileHover={{ 
    scale: 1.05, 
    boxShadow: "0 0 60px rgba(201,168,100,0.3), 0 0 120px rgba(201,168,100,0.1)",
    y: -2 
  }}
  whileTap={{ scale: 0.95 }}
  className="relative group font-heading text-[#0A0A0A] text-sm uppercase tracking-[0.25em] px-10 py-4 rounded-sm overflow-hidden transition-all duration-300"
>
  {/* Base shimmer background */}
  <span className="absolute inset-0 bg-gradient-to-r from-[#C9A864] via-[#F0EAD8] to-[#C9A864] bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
  
  {/* Hover overlay - slides in from left */}
  <span className="absolute inset-0 bg-gradient-to-r from-[#F0EAD8] via-[#C9A864] to-[#F0EAD8] bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-all duration-500 animate-[shimmer_2s_linear_infinite]" />
  
  {/* Glow ring on hover */}
  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <span className="absolute inset-0 rounded-sm border-2 border-[#F0EAD8]/50 animate-pulse" />
  </span>
  
  {/* Sparkle effects */}
  <span className="absolute top-1 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
  <span className="absolute top-2 right-6 w-0.5 h-0.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-200 transition-all duration-500 delay-100" />
  <span className="absolute bottom-2 left-8 w-0.5 h-0.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-200 transition-all duration-500 delay-200" />
  <span className="absolute bottom-1 right-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-300" />
  
  {/* Text with glow effect */}
  <span className="relative z-10 mix-blend-differencet text-red-400 font-bold group-hover:text-[#0A0A0A]/90 transition-colors duration-300">
    Explore Collection
  </span>
  
  {/* Underline animation */}
  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#F0EAD8] group-hover:w-3/4 group-hover:left-[12.5%] transition-all duration-500 ease-out" />
</motion.a>
        
        <motion.a
          href="/about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-body text-[#F0EAD8]/50 text-xs uppercase tracking-[0.2em] px-6 py-4 border border-[#F0EAD8]/10 rounded-sm hover:border-[#F0EAD8]/30 hover:text-[#F0EAD8]/80 transition-all duration-300"
        >
          Our Story
        </motion.a>
      </div>
    </ScrollReveal>
    <motion.div className="w-full h-[1vh]"/>

    {/* Decorative bottom indicator */}
    <ScrollReveal delay={0.4}>
      <motion.div 
        className="mt-16 flex justify-center"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[#F0EAD8]/20 text-[10px] uppercase tracking-[0.2em]">
            Enrich Your Apperance
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#C9A864]/40 to-transparent" />
        </div>
      </motion.div>

    </ScrollReveal>
  </div>
</section>

<motion.div className="w-full h-[15vh]"/>


      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}