import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const FUNNY_MESSAGES = [
  "This scent has evaporated...",
  "You've wandered into the void...",
  "404 — This bottle is empty",
  "Even our best perfumer can't find this page",
  "Oops! This page went up in smoke",
];

function VerticalOrnament({ flip = false }) {
  return (
    <motion.svg
      width="60"
      height="480"
      viewBox="0 0 60 480"
      className="opacity-80"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <g fill="none" stroke="#C9A864" strokeWidth="1.2">
        <motion.line
          x1="30" y1="0" x2="30" y2="170"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M30 170 C 10 175, 8 190, 20 198 C 32 206, 32 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.path
          d="M30 170 C 50 175, 52 190, 40 198 C 28 206, 28 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.circle
          cx="30" cy="240" r="6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2.5, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.circle
          cx="30" cy="240" r="2"
          fill="#C9A864" stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop', repeatDelay: 3.3, ease: 'easeInOut', delay: 1.1 }}
        />
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.line
            key={deg}
            x1="30" y1="228" x2="30" y2="216"
            transform={`rotate(${deg} 30 240)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: 'loop', repeatDelay: 3, ease: 'easeInOut', delay: 1 + i * 0.1 }}
          />
        ))}
        <motion.path
          d="M30 310 C 10 305, 8 290, 20 282 C 32 274, 32 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.4 }}
        />
        <motion.path
          d="M30 310 C 50 305, 52 290, 40 282 C 28 274, 28 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.6 }}
        />
        <motion.line
          x1="30" y1="310" x2="30" y2="480"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut', delay: 1.9 }}
        />
      </g>
    </motion.svg>
  );
}

function TippingBottle() {
  return (
    <motion.svg
      width="120"
      height="160"
      viewBox="0 0 120 160"
      className="mx-auto"
    >
      {/* Bottle body */}
      <motion.g
        initial={{ rotate: 0, originX: '60px', originY: '150px' }}
        animate={{ rotate: [0, 0, -25, -25, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 150px' }}
      >
        {/* Cap */}
        <rect x="48" y="10" width="24" height="15" rx="3" fill="none" stroke="#C9A864" strokeWidth="1.5" />
        <line x1="52" y1="17" x2="68" y2="17" stroke="#C9A864" strokeWidth="0.8" opacity="0.5" />

        {/* Neck */}
        <path d="M52 25 L52 45 C52 50 40 55 40 60 L40 60" fill="none" stroke="#C9A864" strokeWidth="1.5" />
        <path d="M68 25 L68 45 C68 50 80 55 80 60 L80 60" fill="none" stroke="#C9A864" strokeWidth="1.5" />

        {/* Body */}
        <rect x="35" y="55" width="50" height="80" rx="5" fill="none" stroke="#C9A864" strokeWidth="1.5" />

        {/* Liquid level */}
        <motion.rect
          x="37"
          y="80"
          width="46"
          rx="3"
          fill="#C9A864"
          opacity="0.15"
          initial={{ height: 0 }}
          animate={{ height: 53 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Label */}
        <rect x="42" y="90" width="36" height="20" rx="2" fill="none" stroke="#C9A864" strokeWidth="0.8" opacity="0.4" />
        <line x1="47" y1="97" x2="73" y2="97" stroke="#C9A864" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="102" x2="70" y2="102" stroke="#C9A864" strokeWidth="0.5" opacity="0.3" />
      </motion.g>

      {/* Spilled drops when tipping */}
      <motion.circle
        cx="25"
        cy="145"
        r="3"
        fill="#C9A864"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, delay: 1.5 }}
      />
      <motion.circle
        cx="18"
        cy="150"
        r="2"
        fill="#C9A864"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, delay: 1.8 }}
      />
      <motion.circle
        cx="30"
        cy="152"
        r="2.5"
        fill="#C9A864"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.35, 0], scale: [0, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, delay: 2.1 }}
      />
    </motion.svg>
  );
}

export default function NotFound() {
  const { dark } = useTheme();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div className="w-full h-[7vh] bg-[#0a0f0c]" />

      <motion.div className="w-full min-h-[95vh] flex flex-row justify-center items-stretch relative overflow-hidden">

        {/* Left panel — maroon */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#011863] left-0 flex justify-start items-center pr-4 lg:pr-10">
          <VerticalOrnament />
        </motion.div>

        {/* Right panel — forest green */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#13201A] right-0 flex justify-end items-center pl-4 lg:pl-10">
          <VerticalOrnament flip />
        </motion.div>

        {/* Central card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[92%] sm:w-[70%] lg:w-[50%] xl:w-[40%] my-6 z-10 bg-[#0a0f0c] rounded-[2rem] border-2 border-[#C9A864]/40 overflow-hidden flex flex-col items-center justify-center"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full px-8 sm:px-12 py-14 flex flex-col items-center gap-8 text-center">

            {/* 404 number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            >
              <span
                className="font-heading text-8xl sm:text-9xl font-bold bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #F0EAD8 0%, #C9A864 25%, #F0EAD8 50%, #C9A864 75%, #F0EAD8 100%)',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                404
              </span>
            </motion.div>

            {/* Tipping bottle animation */}
            <TippingBottle />

            {/* Cycling funny message */}
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="font-body text-[#F0EAD8]/60 text-sm italic"
                >
                  {FUNNY_MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Divider */}
            <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60">
              <line x1="0" y1="8" x2="45" y2="8" stroke="#C9A864" strokeWidth="1" />
              <circle cx="60" cy="8" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
              <line x1="75" y1="8" x2="120" y2="8" stroke="#C9A864" strokeWidth="1" />
            </svg>

            {/* Button */}
            <Link
              to="/login"
              className="w-full text-center font-heading text-xs uppercase tracking-widest py-3.5 rounded-xl border border-[#C9A864]/50 text-[#C9A864] hover:bg-[#C9A864]/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
