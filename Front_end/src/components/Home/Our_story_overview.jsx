import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BottleSVG = ({ id }) => (
  <svg viewBox="0 0 240 420" className="w-full h-auto" aria-hidden="true">
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
    <use href={`#${id}`} fill="#0A0A0A" />
    <use href={`#${id}`} fill="none" stroke="#C9A864" strokeWidth="1.6" opacity="0.95" />
    <line x1="82" y1="118" x2="158" y2="118" stroke="#C9A864" strokeWidth="0.6" opacity="0.4" />
    <line x1="68" y1="160" x2="172" y2="160" stroke="#C9A864" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export default function Our_story_overview() {

  const navigate = useNavigate();

  return (
    <motion.div className="w-full flex flex-col items-center py-16 sm:py-20 md:py-24 bg-[#0A0A0A]"
    initial={{opacity:0,y:100}}
    whileInView={{opacity:100,y:0}}
    viewport={{once:true,amount:0.1}}
    transition={{delay:0.2,duration:0.8}}
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-10"
      >
        <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl tracking-wide">
          Our Story
        </h2>
      </motion.div>

      {/* Ornamental divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.6 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="mb-12 sm:mb-14 md:mb-16"
      >
        <svg width="180" height="20" viewBox="0 0 180 20" aria-hidden="true">
          <line x1="0"   y1="10" x2="60"  y2="10" stroke="#C9A864" strokeWidth="1" opacity="0.5" />
          <path d="M70 10 L80 4 L90 16 L100 4 L110 10" fill="none" stroke="#C9A864" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="120" y1="10" x2="180" y2="10" stroke="#C9A864" strokeWidth="1" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Story panel */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative rounded-lg overflow-hidden shadow-2xl"
        >

          {/* ── DESKTOP (xl+) ── */}
          <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] min-h-[460px]">
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-1/2 bg-[#13201A]" />
              <div className="w-1/2 bg-[#011863]" />
            </div>

            {/* Left */}
            <div className="relative z-10 flex items-center justify-end px-12 xl:px-16 py-16">
              <div className="max-w-md text-right">
                <p className="font-heading text-[#C9A864] text-[10px] tracking-[0.28em] uppercase mb-3">
                  A philosophy
                </p>
                <h3 className="font-heading text-[#F0EAD8] text-lg xl:text-xl leading-snug mb-4">
                  A name is spoken once. A scent is remembered for a lifetime.
                </h3>
                <p className="font-body text-[#F0EAD8]/78 text-sm xl:text-base leading-relaxed">
                  Long before a word is exchanged, fragrance has already made its
                  introduction. It is the one mark a person leaves behind without
                  saying a thing — and it is why we began. Rafifa Mart was founded
                  on a simple conviction: that a scent is not worn for others, but
                  composed for the self, and only ever shared as a quiet consequence.
                </p>
              </div>
            </div>

            {/* Center bottle */}
            <div className="relative z-10 flex items-center justify-center px-8 py-12">
              <div className="w-[155px] xl:w-[170px]">
                <BottleSVG id="bottle-desktop" />
              </div>
            </div>

            {/* Right */}
            <div className="relative z-10 flex items-center justify-start px-12 xl:px-16 py-16">
              <div className="max-w-md text-left">
                <p className="font-heading text-[#F0EAD8]/80 text-[10px] tracking-[0.28em] uppercase mb-3">
                  Where it stands today
                </p>
                <h3 className="font-heading text-[#F0EAD8] text-lg xl:text-xl leading-snug mb-4">
                  Decades later, the conviction remains unchanged.
                </h3>
                <p className="font-body text-[#F0EAD8]/78 text-sm xl:text-base leading-relaxed">
                  Every bottle is still composed by hand, in small numbers, by
                  people who remember exactly why we started. No formula is rushed
                  to market, and no batch leaves before it is ready — because
                  patience, in the end, is what separates a fragrance from a memory.
                </p>
              </div>
            </div>
          </div>

          {/* ── TABLET (md–xl) ── */}
          <div className="hidden md:grid xl:hidden grid-cols-[1fr_auto_1fr] min-h-[360px]">
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-1/2 bg-[#13201A]" />
              <div className="w-1/2 bg-[#011863]" />
            </div>

            {/* Left */}
            <div className="relative z-10 flex items-center justify-center px-6 py-10">
              <div className="max-w-xs text-right">
                <p className="font-heading text-[#C9A864] text-[9px] tracking-[0.28em] uppercase mb-2">
                  A philosophy
                </p>
                <h3 className="font-heading text-[#F0EAD8] text-sm md:text-base leading-snug mb-2">
                  A name is spoken once. A scent is remembered for a lifetime.
                </h3>
                <p className="font-body text-[#F0EAD8]/78 text-xs leading-relaxed">
                  Long before a word is exchanged, fragrance has already made its
                  introduction. It is the one mark a person leaves behind without
                  saying a thing — and it is why we began.
                </p>
              </div>
            </div>

            {/* Center bottle */}
            <div className="relative z-10 flex items-center justify-center px-4 py-10">
              <div className="w-[90px] md:w-[110px]">
                <BottleSVG id="bottle-tablet" />
              </div>
            </div>

            {/* Right */}
            <div className="relative z-10 flex items-center justify-center px-6 py-10">
              <div className="max-w-xs text-left">
                <p className="font-heading text-[#F0EAD8]/80 text-[9px] tracking-[0.28em] uppercase mb-2">
                  Where it stands today
                </p>
                <h3 className="font-heading text-[#F0EAD8] text-sm md:text-base leading-snug mb-2">
                  Decades later, the conviction remains unchanged.
                </h3>
                <p className="font-body text-[#F0EAD8]/78 text-xs leading-relaxed">
                  Every bottle is still composed by hand, in small numbers, by
                  people who remember exactly why we started. No formula is rushed
                  to market, and no batch leaves before it is ready.
                </p>
              </div>
            </div>
          </div>

          {/* ── MOBILE (< md) ── */}
          <div className="md:hidden flex flex-col">
            <div className="bg-[#13201A] px-6 py-10 text-center">
              <p className="font-heading text-[#C9A864] text-[9px] tracking-[0.28em] uppercase mb-3">
                A philosophy
              </p>
              <h3 className="font-heading text-[#F0EAD8] text-base leading-snug mb-3">
                A name is spoken once. A scent is remembered for a lifetime.
              </h3>
              <p className="font-body text-[#F0EAD8]/78 text-xs leading-relaxed">
                Long before a word is exchanged, fragrance has already made its
                introduction. It is the one mark a person leaves behind without
                saying a thing — and it is why we began. Rafifa Mart was founded
                on a simple conviction: that a scent is not worn for others, but
                composed for the self, and only ever shared as a quiet consequence.
              </p>
            </div>

            <div className="bg-[#0F1A15] flex justify-center py-8">
              <div className="w-[120px]">
                <BottleSVG id="bottle-mobile" />
              </div>
            </div>

            <div className="bg-[#011863] px-6 py-10 text-center">
              <p className="font-heading text-[#F0EAD8]/80 text-[9px] tracking-[0.28em] uppercase mb-3">
                Where it stands today
              </p>
              <h3 className="font-heading text-[#F0EAD8] text-base leading-snug mb-3">
                Decades later, the conviction remains unchanged.
              </h3>
              <p className="font-body text-[#F0EAD8]/78 text-xs leading-relaxed">
                Every bottle is still composed by hand, in small numbers, by
                people who remember exactly why we started. No formula is rushed
                to market, and no batch leaves before it is ready — because
                patience, in the end, is what separates a fragrance from a memory.
              </p>
            </div>
          </div>

        </motion.div>

        {/* Read More */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center mt-10 sm:mt-12"
        >
          <button className="font-heading text-[#C9A864] text-[11px] sm:text-xs tracking-[0.18em] uppercase border border-[#C9A864]/40 px-8 sm:px-10 py-3 hover:bg-[#C9A864] hover:text-[#0A0A0A] hover:border-[#C9A864] transition-all duration-300 *"
          onClick={(e) => navigate('/ourstory')}
          >
            Read More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}