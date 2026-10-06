import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import hero1 from "../../../public/perfume_home_hero1.webp";
import hero2 from "../../../public/perfume_home_hero2.webp";
import hero3 from "../../../public/perfume_home_hero3.webp";
import hero4 from "../../../public/perfume_home_hero4.webp";
import hero5 from "../../../public/perfume_home_hero5.webp";
import homeLandingRightSide from "../../../public/home_landing_right_side.png";

const HERO_IMAGES = [hero1, hero2, hero3, hero4, hero5];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-[#0A0A0A] overflow-hidden">

      {/* ── 1. FULLSCREEN HERO ── */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Background crossfade */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 will-change-opacity"
            >
              <img
                src={HERO_IMAGES[activeSlide]}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

          {/* Ambient gold glow - reduced on mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-[#C9A864]/5 blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
          >
            {/* Top gold rule */}
            <div className="flex justify-center mb-6">
              <div className="w-10 h-[1.5px] bg-[#C9A864]" />
            </div>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-heading text-[#C9A864] text-[9px] sm:text-[10px] tracking-[0.45em] uppercase mb-5"
            >
              Since 2016
            </motion.p>

            {/* Main headline */}
            <h1 className="font-heading text-[#F5F1E6] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.08] mb-7 sm:mb-9">
              Your impression
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 italic text-[#C9A864]">begins</span>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A864]/25" />
              </span>{" "}
              with fragrance.
            </h1>

            {/* Sub-copy */}
         
            {/* CTAs */}
        
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-500 rounded-full ${
                i === activeSlide
                  ? "w-6 h-1.5 bg-[#C9A864]"
                  : "w-1.5 h-1.5 bg-[#C9A864]/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 right-8 sm:right-12 flex flex-col items-center gap-2 z-10">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#C9A864] to-transparent"
          />
          <span className="font-heading text-[#C9A864] text-[8px] tracking-[0.35em] uppercase opacity-50">
            Scroll
          </span>
        </div>
      </div>

      <div className="w-full h-[8vh]"/>

      {/* ── 2. INTRO / BRAND STATEMENT ── */}
      <div className="relative w-full bg-[#0A0A0A] py-20 sm:py-24 md:py-28 lg:py-36 flex flex-row justify-center items-center">

        {/* Soft background glows - reduced on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-[#C9A864]/4 blur-[60px] sm:blur-[90px] md:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-[#011863]/8 blur-[60px] sm:blur-[90px] md:blur-[120px] rounded-full -translate-x-1/3 translate-y-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-14 sm:gap-16 lg:gap-24">

            {/* Image */}
            <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[440px]"
              >
                {/* Decorative glows behind image */}
                <div className="absolute -top-16 -left-16 w-56 h-56 bg-black blur-[70px] rounded-full" />
                <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#011863]/15 blur-[70px] rounded-full" />

            




<motion.img
  src={homeLandingRightSide}
  alt="Premium Collection"
  className="relative z-10 w-full h-auto object-contain rounded-[2rem]"
  animate={{
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 10,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  }}
  style={{
    filter: "drop-shadow(0 24px 64px rgba(0,0,0,0.85))",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
    maskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    transformOrigin: "center",
  }}
/>


                {/* Corner accents */}
                <div className="absolute -top-px -left-px w-7 h-7 border-t-2 border-l-2 border-[#C9A864]/45" />
                <div className="absolute -bottom-px -right-px w-7 h-7 border-b-2 border-r-2 border-[#C9A864]/45" />
              </motion.div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                className="max-w-lg mx-auto lg:mx-0"
              >
                {/* Section label */}
                <div className="flex justify-center lg:justify-start items-center gap-3 mb-5">
                  <div className="w-7 h-[1.5px] bg-[#C9A864]" />
                  <span className="font-heading text-[#C9A864] text-[12px] sm:text-[10px] tracking-[0.45em] uppercase">
                    Welcome
                  </span>
                  <div className="flex-1 h-px bg-[#C9A864]/18" />
                </div>

                <h2 className="font-heading text-[#F5F1E6] text-3xl sm:text-4xl md:text-[2.6rem] lg:text-5xl leading-[1.12] mb-5 sm:mb-6">
                  Crafted with{" "}
                  <span className="text-[#C9A864]">intention</span>,
                  <br />
                  made to last.
                </h2>

                <div className="w-10 h-[1.5px] bg-[#C9A864] mx-auto lg:mx-0 mb-6 sm:mb-7" />

                <p className="font-body text-[#F5F1E6]/65 text-sm sm:text-base md:text-[1.05rem] leading-relaxed mb-7 sm:mb-8">
                  Every bottle at Rafifa Mart begins with rare ingredients
                  sourced the old way, and finishes by hand. We make few things,
                  slowly, and let each one speak for itself.
                </p>

                {/* Feature grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4 mb-9 sm:mb-10">
                  {[
                    { label: "Small Batches", icon: "✦" },
                    { label: "Handcrafted",   icon: "✧" },
                    { label: "Rare Ingredients", icon: "✦" },
                    { label: "Timeless Design",  icon: "✧" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-[#C9A864] text-xs">{item.icon}</span>
                      <span className="font-body text-[#F5F1E6]/55 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

            
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}