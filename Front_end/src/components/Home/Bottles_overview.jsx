import { motion, useInView } from 'framer-motion';
import { Get_bottles } from '../Server/bottle';
import { useEffect, useState, useRef } from 'react';
import { TypingAnimation } from "../ui/typing-animation"

const CARD_BG = ['#13201A', '#021047'];
const CARD_W = 220;
const CARD_GAP = 26;
const VISIBLE = 4;
const CONTAINER_W = CARD_W * VISIBLE + CARD_GAP * (VISIBLE - 1) * 3.06;

function OrnamentalDivider({ width = 500 }) {
  const cx = width / 2;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.svg
      ref={ref}
      viewBox={`0 0 ${width} 48`}
      style={{ width: Math.min(width, 560), height: 48, display: 'block' }}
      fill="none"
      aria-hidden="true"
    >
      {/* Left arm */}
      <motion.line
        x1={cx} y1="24" x2={cx - 180} y2="24"
        stroke="#C9A864" strokeWidth="0.9" opacity="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
      <motion.path
        d={`M${cx - 180} 24 Q${cx - 120} 14,${cx - 38} 24`}
        stroke="#C9A864" strokeWidth="0.7" opacity="0.5"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      />
      <motion.path
        d={`M${cx - 180} 24 Q${cx - 120} 34,${cx - 38} 24`}
        stroke="#C9A864" strokeWidth="0.7" opacity="0.5"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <motion.circle
        cx={cx - 50} cy="24" r="1.5" fill="#C9A864" opacity="0.7"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
      <motion.path
        d={`M${cx - 180} 24 C${cx - 196} 24,${cx - 200} 18,${cx - 194} 16 C${cx - 188} 14,${cx - 183} 18,${cx - 185} 22`}
        stroke="#C9A864" strokeWidth="0.9" strokeLinecap="round" opacity="0.8"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />

      {/* Right arm */}
      <motion.line
        x1={cx} y1="24" x2={cx + 180} y2="24"
        stroke="#C9A864" strokeWidth="0.9" opacity="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
      <motion.path
        d={`M${cx + 180} 24 Q${cx + 120} 14,${cx + 38} 24`}
        stroke="#C9A864" strokeWidth="0.7" opacity="0.5"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      />
      <motion.path
        d={`M${cx + 180} 24 Q${cx + 120} 34,${cx + 38} 24`}
        stroke="#C9A864" strokeWidth="0.7" opacity="0.5"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <motion.circle
        cx={cx + 50} cy="24" r="1.5" fill="#C9A864" opacity="0.7"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
      <motion.path
        d={`M${cx + 180} 24 C${cx + 196} 24,${cx + 200} 18,${cx + 194} 16 C${cx + 188} 14,${cx + 183} 18,${cx + 185} 22`}
        stroke="#C9A864" strokeWidth="0.9" strokeLinecap="round" opacity="0.8"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />

      {/* Centre cross */}
      <motion.line
        x1={cx} y1="4" x2={cx} y2="44"
        stroke="#C9A864" strokeWidth="1.1"
        initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        style={{ transformOrigin: `${cx}px 24px` }}
        transition={{ duration: 0.5, delay: 0.75 }}
      />
      <motion.line
        x1={cx - 20} y1="24" x2={cx + 20} y2="24"
        stroke="#C9A864" strokeWidth="1.1"
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        style={{ transformOrigin: `${cx}px 24px` }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.line x1={cx - 13} y1="11" x2={cx + 13} y2="37" stroke="#C9A864" strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.95 }}
      />
      <motion.line x1={cx + 13} y1="11" x2={cx - 13} y2="37" stroke="#C9A864" strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.95 }}
      />
      <motion.path d={`M${cx} 4 L${cx - 3} 10 M${cx} 4 L${cx + 3} 10`} stroke="#C9A864" strokeWidth="0.8" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      />
      <motion.path d={`M${cx} 44 L${cx - 3} 38 M${cx} 44 L${cx + 3} 38`} stroke="#C9A864" strokeWidth="0.8" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      />
      <motion.path d={`M${cx - 20} 24 L${cx - 14} 21 M${cx - 20} 24 L${cx - 14} 27`} stroke="#C9A864" strokeWidth="0.8" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      />
      <motion.path d={`M${cx + 20} 24 L${cx + 14} 21 M${cx + 20} 24 L${cx + 14} 27`} stroke="#C9A864" strokeWidth="0.8" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      />
      {/* Centre jewel */}
      <motion.circle cx={cx} cy="24" r="3" fill="#C9A864"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
        style={{ transformOrigin: `${cx}px 24px` }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 1.1 }}
      />
      <motion.circle cx={cx} cy="24" r="5.5" stroke="#C9A864" strokeWidth="0.6" opacity="0.5"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
        style={{ transformOrigin: `${cx}px 24px` }}
        transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 1.18 }}
      />
      <motion.circle cx={cx} cy="24" r="8" stroke="#C9A864" strokeWidth="0.4" opacity="0.3"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
        style={{ transformOrigin: `${cx}px 24px` }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 1.24 }}
      />
    </motion.svg>
  );
}

function BottleCard({ bottle, index }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="relative flex-shrink-0 group cursor-pointer overflow-hidden"
      style={{ width: `${CARD_W}px`, height: '240px', background: CARD_BG[index % 2] }}
    >
      <div className="absolute inset-0 border border-[#C9A864]/25 pointer-events-none z-10" />
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C9A864]/70 z-20" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C9A864]/70 z-20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C9A864]/70 z-20" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C9A864]/70 z-20" />
      {bottle.photo_url ? (
        <img
          src={bottle.photo_url}
          alt={bottle.name || 'Perfume bottle'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#C9A864]/20 text-4xl">◈</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </motion.div>
  );
}

export default function Bottles_overview() {
  const [bottle_data, setBottle_data] = useState([]);

  useEffect(() => {
    async function fetchBottles() {
      try {
        const data = await Get_bottles();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        if (list.length > 0) setBottle_data(list.slice(0, 5));
      } catch {
        // ignore
      }
    }
    fetchBottles();
  }, []);

  const display = bottle_data;
  const marqueeItems = [...display, ...display, ...display, ...display];
  const travelPx = (CARD_W + CARD_GAP) * display.length;
  const fadeZone = CARD_W + CARD_GAP;
  const maskImage = `linear-gradient(to right, transparent 0px, black ${fadeZone}px, black calc(100% - ${fadeZone}px), transparent 100%)`;

  return (
    <section className="w-full bg-[#0A0A0A] overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center text-center pt-24 pb-6 px-6">

        {/* "Choose Your" — falls from above */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <h3 className="font-heading text-[#F5F1E6] text-2xl sm:text-3xl md:text-4xl tracking-wide leading-none">
            Choose Your
          </h3>
        </motion.div>

        {/* Divider 1 */}
        <div className="mb-6">
          <OrnamentalDivider width={480} />
        </div>

        {/* "Perfum Bottles" — two halves slide from opposite sides */}
        <div className="flex items-center gap-4 flex-wrap justify-center mb-5">
          <h2
            className="font-heading leading-none"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            <motion.span
              className="inline-block text-[#F5F1E6]"
              initial={{ x: -60, opacity: 0, filter: 'blur(6px)' }}
              whileInView={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Perfume{' '}
            </motion.span>
            <motion.span
              className="inline-block italic text-[#C9A864]"
              initial={{ x: 60, opacity: 0, filter: 'blur(6px)' }}
              whileInView={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
            >
              Bottles
            </motion.span>
          </h2>

          {/* Bottle icon — springs in with slight rotate */}
          <motion.div
            className="flex items-center justify-center rounded-sm px-2 py-1"
            style={{ background: '#13201A', border: '1px solid rgba(201,168,100,0.3)' }}
            initial={{ scale: 0, rotate: -15, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 }}
          >
            <svg viewBox="0 0 50 80" fill="none" style={{ width: 'clamp(1.2rem, 2.5vw, 2.2rem)', height: 'auto', opacity: 0.85 }}>
              <path d="M25 3 C22 3,20 6,20 10 L20 18 C15 20,12 25,12 31 L12 62 C12 68,16 72,22 72 L28 72 C34 72,38 68,38 62 L38 31 C38 25,35 20,30 18 L30 10 C30 6,28 3,25 3Z" stroke="#C9A864" strokeWidth="1.3" />
              <rect x="20" y="0" width="10" height="5" rx="1.5" stroke="#C9A864" strokeWidth="1" />
              <line x1="15" y1="42" x2="35" y2="42" stroke="#C9A864" strokeWidth="0.7" opacity="0.5" />
              <line x1="17" y1="48" x2="33" y2="48" stroke="#C9A864" strokeWidth="0.5" opacity="0.35" />
            </svg>
          </motion.div>
        </div>

        {/* Divider 2 */}
        <div className="mb-14">
          <OrnamentalDivider width={560} />
        </div>

        {/* Quote */}
        <motion.p
          className="font-body text-[#F5F1E6]/65 text-base sm:text-lg leading-relaxed tracking-wide max-w-2xl"
          initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <TypingAnimation>
            "A remarkable fragrance deserves an equally remarkable vessel.
          </TypingAnimation>
        </motion.p>
      </div>

      <div className="w-full h-[4vh]" />

      {/* ── CARD MARQUEE ── */}
      {display.length > 0 && (
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div
            style={{
              width: `${CONTAINER_W}px`,
              maxWidth: '125vw',
              overflow: 'hidden',
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
            }}
          >
            <motion.div
              className="flex will-change-transform"
              style={{ gap: `${CARD_GAP}px` }}
              animate={{ x: [`0px`, `-${travelPx}px`] }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              {marqueeItems.map((bottle, idx) => (
                <BottleCard key={`${bottle.id}-${idx}`} bottle={bottle} index={idx} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ── CTA ── */}
      <motion.div className="w-full h-[2vh]" />
      <motion.div
        className="w-full h-[5vh] flex flex-row justify-center items-center"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="relative group font-heading text-[#C9A864] text-[11px] tracking-[0.5em] uppercase px-12 py-8 border border-[#C9A864] overflow-hidden transition-colors duration-300 hover:text-[#0A0A0A] scale-y-115"
        >
          <span className="absolute inset-0 bg-[#C9A864] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-3">
            See Our Collection
            <svg viewBox="0 0 20 10" fill="none" style={{ width: 20, height: 10 }}>
              <line x1="0" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M13 1 L18 5 L13 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.button>
      </motion.div>

    </section>
  );
}