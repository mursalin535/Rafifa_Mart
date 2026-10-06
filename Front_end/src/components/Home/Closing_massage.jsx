import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const pillars = [
  {
    icon: "◈",
    title: "Rare Ingredients",
    text: "We source only the finest raw materials — oud from the Arabian heartland, rose absolute from Grasse, and resins aged over decades.",
  },
  {
    icon: "◈",
    title: "Master Perfumers",
    text: "Each formula is composed by artisans with over twenty years of craft — never rushed, never compromised, never replicated.",
  },
  {
    icon: "◈",
    title: "Lasting Impression",
    text: "Our long-wear compositions stay true from morning to midnight, so your presence lingers long after you've left the room.",
  },
];

export default function Closing_massage() {
  return (
    <section className="relative w-full min-h-screen bg-[#0d0c0a] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">

      {/* Ambient gold glows — softly breathing */}
      <motion.div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px]"
        style={{ background: "radial-gradient(ellipse at center, rgba(197,160,80,0.10) 0%, transparent 70%)" }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[180px]"
        style={{ background: "radial-gradient(ellipse at center, rgba(197,160,80,0.07) 0%, transparent 70%)" }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.04, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Ornamental divider */}
      <motion.div
        className="flex items-center gap-4 mb-12"
        variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }}
      >
        <motion.div
          className="h-px bg-gradient-to-r from-transparent to-[#c5a050]"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c5a050]" />
        <motion.div
          className="w-2 h-2 bg-[#c5a050]"
          animate={{ rotate: [45, 90, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c5a050]" />
        <motion.div
          className="h-px bg-gradient-to-l from-transparent to-[#c5a050]"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </motion.div>

      {/* Eyebrow */}
      <motion.p
        className="text-[#c5a050] text-[11px] tracking-[0.35em] uppercase font-light mb-7"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        variants={fadeUp} custom={0.25} initial="hidden" whileInView="visible" viewport={{ once: true }}
      >
        Our Promise to You
      </motion.p>

      {/* Headline — each word drifts in */}
      <motion.h2
        className="text-center text-[#e8dcc8] leading-[1.2] max-w-2xl mb-3"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
          fontWeight: 400,
        }}
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        Every Drop Tells a{" "}
        <em className="italic text-[#c5a050]">Story Worth Wearing</em>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="italic font-light text-[rgba(232,220,200,0.6)] text-center mb-14"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        Crafted for those who refuse to be forgotten
      </motion.p>

      {/* Three Pillars */}
      <div className="flex flex-col md:flex-row max-w-3xl w-full mb-16">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            className="flex-1 flex flex-col items-center text-center px-7 py-9 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.75 + i * 0.18 }}
          >
            {i > 0 && (
              <div className="hidden md:block absolute left-0 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-[rgba(197,160,80,0.3)] to-transparent" />
            )}
            <motion.span
              className="text-[#c5a050] text-2xl mb-4 block"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              {p.icon}
            </motion.span>
            <h3
              className="text-[#c5a050] text-[0.7rem] tracking-[0.15em] uppercase mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {p.title}
            </h3>
            <p
              className="text-[rgba(232,220,200,0.7)] font-light leading-[1.75] text-[0.95rem]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {p.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pull Quote */}
      <motion.div
        className="max-w-[680px] text-center mb-14 px-6"
        initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
      >
        <span
          className="block leading-[0.4] mb-4 text-[rgba(197,160,80,0.2)]"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem" }}
        >
          "
        </span>
        <p
          className="italic font-light leading-[1.85] text-[rgba(232,220,200,0.88)]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)" }}
        >
          Perfume is the{" "}
          <strong className="not-italic font-normal text-[#e8dcc8]">invisible part of your identity</strong>
          {" "}— the memory you leave in every room, the emotion you stir without a word. At Rafifa, we do not sell fragrance.{" "}
          <strong className="not-italic font-normal text-[#e8dcc8]">We deliver permanence.</strong>
        </p>
      </motion.div>

      {/* Guarantee Strip */}
      <motion.div
        className="flex items-center gap-3 border border-[rgba(197,160,80,0.18)] bg-[rgba(197,160,80,0.05)] px-8 py-4 mb-14"
        initial={{ opacity: 0, scaleX: 0.88 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
      >
        <motion.span
          className="text-[#c5a050] text-lg"
          animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ✦
        </motion.span>
        <p
          className="text-[rgba(232,220,200,0.7)] text-[0.8rem] tracking-[0.12em] uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="text-[#c5a050] font-normal">Authenticity Guaranteed</span>
          {" "}— 100% genuine luxury fragrance, sealed & certified
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      >
        <motion.button
          className="group relative px-14 py-4 border border-[#c5a050] overflow-hidden text-[#c5a050]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", letterSpacing: "0.3em" }}
          whileHover="hover"
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="absolute inset-0 bg-[#c5a050] origin-left"
            initial={{ scaleX: 0 }}
            variants={{ hover: { scaleX: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
          />
          <motion.span
            className="relative z-10 uppercase tracking-widest"
            variants={{ hover: { color: "#0d0c0a", transition: { duration: 0.45 } } }}
          >
            Discover Your Scent
          </motion.span>
        </motion.button>

        <motion.p
          className="italic text-[rgba(232,220,200,0.35)] text-[0.8rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Free shipping on orders above ৳2,999 · 7-day returns
        </motion.p>
      </motion.div>

      {/* Bottom Seal */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 1.7 }}
      >
        <motion.div
          className="w-px bg-gradient-to-b from-[rgba(197,160,80,0.35)] to-transparent"
          initial={{ height: 0 }}
          whileInView={{ height: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
        />
        <p
          className="text-[rgba(197,160,80,0.4)] text-[0.65rem] tracking-[0.4em] uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Rafifa Mart · Maison de Parfum
        </p>
      </motion.div>
    </section>
  );
}