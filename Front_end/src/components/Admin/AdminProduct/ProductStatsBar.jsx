import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Gem, Boxes, PackageX } from 'lucide-react';

function AnimatedCounter({ value, duration = 1.2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) { setCount(0); return; }

    const incrementTime = (duration * 1000) / end;
    const step = Math.max(1, Math.floor(end / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime * step);

    return () => clearInterval(timer);
  }, [value, duration, inView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function ProductStatsBar({ stats, dark }) {
  const cards = [
    {
      label: 'Total Products',
      value: stats.total,
      icon: Gem,
      gradient: 'linear-gradient(135deg, rgba(201,168,100,0.08) 0%, rgba(201,168,100,0.02) 100%)',
      iconBg: 'rgba(201,168,100,0.14)',
      iconColor: '#C9A864',
    },
    {
      label: 'Units In Stock',
      value: stats.totalStock,
      icon: Boxes,
      gradient: 'linear-gradient(135deg, rgba(92,138,110,0.08) 0%, rgba(92,138,110,0.02) 100%)',
      iconBg: 'rgba(92,138,110,0.14)',
      iconColor: '#5C8A6E',
    },
    {
      label: 'Out Of Stock',
      value: stats.outOfStock,
      icon: PackageX,
      warn: stats.outOfStock > 0,
      gradient: stats.outOfStock > 0
        ? 'linear-gradient(135deg, rgba(181,80,79,0.08) 0%, rgba(181,80,79,0.02) 100%)'
        : 'linear-gradient(135deg, rgba(237,231,218,0.04) 0%, rgba(237,231,218,0.01) 100%)',
      iconBg: stats.outOfStock > 0 ? 'rgba(181,80,79,0.14)' : 'rgba(201,168,100,0.1)',
      iconColor: stats.outOfStock > 0 ? '#B5504F' : '#C9A864',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
              y: -3,
              transition: { duration: 0.25 },
            }}
            className="relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5 overflow-hidden"
            style={{
              backgroundColor: dark ? '#0D1410' : '#FAF7F0',
              border: `1px solid ${dark ? 'rgba(28,77,58,0.4)' : 'rgba(201,185,154,0.4)'}`,
              backgroundImage: c.gradient,
            }}
          >
            {/* Decorative corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 opacity-[0.03]"
              style={{
                background: `radial-gradient(circle at top right, ${c.iconColor}, transparent 70%)`,
              }}
            />

            <motion.div
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: c.iconBg,
                color: c.iconColor,
              }}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <Icon size={16} strokeWidth={1.5} />
            </motion.div>

            <div>
              <p
                className="font-heading text-lg sm:text-xl lg:text-2xl leading-none"
                style={{ color: c.warn ? '#B5504F' : dark ? '#F0EAD8' : '#1A2620' }}
              >
                <AnimatedCounter value={c.value} />
              </p>
              <p
                className="font-body text-[9px] sm:text-[10px] uppercase tracking-wider mt-1 sm:mt-1.5"
                style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
              >
                {c.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
