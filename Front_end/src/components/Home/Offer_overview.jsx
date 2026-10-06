import { motion, AnimatePresence } from 'framer-motion';
import { Get_offers, Get_offers_with_products } from '../Server/offer';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import rollbar from '../../rollbar';

const API_BASE = 'http://localhost:5007';

function OrnamentalDivider({ color = '#C9A864', className = '' }) {
  return (
    <svg
      viewBox="0 0 680 130"
      className={className}
      style={{ width: '100%', height: 'auto' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round">

        <g strokeWidth="1.2">
          <path d="M58 60 C 58 53, 51 51, 47 55 C 43 59, 47 64, 52 62 C 56 60, 55 55, 50 56" />
        </g>
        <g strokeWidth="1.2">
          <line x1="58" y1="60" x2="235" y2="60" />
        </g>
        <g strokeWidth="1.1">
          <path d="M58 70 C 120 50, 170 50, 235 70" />
        </g>
        <g strokeWidth="1.1">
          <path d="M58 50 C 120 70, 170 70, 235 50" />
        </g>
        <circle cx="235" cy="60" r="2.4" fill={color} />

        <g strokeWidth="1.2">
          <path d="M622 60 C 622 53, 629 51, 633 55 C 637 59, 633 64, 628 62 C 624 60, 625 55, 630 56" />
        </g>
        <g strokeWidth="1.2">
          <line x1="622" y1="60" x2="445" y2="60" />
        </g>
        <g strokeWidth="1.1">
          <path d="M622 70 C 560 50, 510 50, 445 70" />
        </g>
        <g strokeWidth="1.1">
          <path d="M622 50 C 560 70, 510 70, 445 50" />
        </g>
        <circle cx="445" cy="60" r="2.4" fill={color} />

        <g strokeWidth="1.4">
          <line x1="340" y1="20" x2="340" y2="100" />
          <line x1="300" y1="60" x2="380" y2="60" />
          <line x1="312" y1="32" x2="368" y2="88" />
          <line x1="312" y1="88" x2="368" y2="32" />
        </g>
        <g strokeWidth="0.9">
          <line x1="340" y1="34" x2="340" y2="86" />
          <line x1="318" y1="60" x2="362" y2="60" />
          <line x1="324" y1="44" x2="356" y2="76" />
          <line x1="324" y1="76" x2="356" y2="44" />
        </g>
        <path
          d="M340 20 L335 32 M340 20 L345 32 M340 100 L335 88 M340 100 L345 88 M300 60 L312 55 M300 60 L312 65 M380 60 L368 55 M380 60 L368 65"
          strokeWidth="1.1"
        />
        <circle cx="340" cy="60" r="3.6" fill={color} stroke="none" />
        <circle cx="340" cy="60" r="6.5" strokeWidth="0.8" />
        <circle cx="340" cy="60" r="9.5" strokeWidth="0.5" opacity="0.6" />

      </g>
    </svg>
  );
}

function OfferCard({ offer, base, pitch, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="w-[24%] h-[99%] bg-[#13201A] rounded-2xl flex flex-col justify-center items-center gap-3 px-3 relative overflow-hidden"
    >
      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#C9A864]/40" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#C9A864]/40" />

      <div className="w-[78%] h-[55%] bg-[#011863] rounded-2xl border border-[#C9A864]/30 flex flex-col justify-center items-center gap-1">
        <span className="font-heading text-[#F0EAD8] text-2xl sm:text-3xl tracking-wide">
          {offer}
        </span>
        <span className="font-heading text-[#C9A864] text-[9px] tracking-[0.25em] uppercase">
          off
        </span>
      </div>

      <div className="text-center px-2">
        <h3 className="font-heading text-[#F0EAD8] text-xs sm:text-sm tracking-wide mb-1">
          {base}
        </h3>
        <p className="font-body text-[#F0EAD8]/60 text-[10px] sm:text-[11px] leading-snug">
          {pitch}
        </p>
      </div>
    </motion.div>
  );
}

function OngoingOffersBanner() {
  const text = "Ongoing offers";
  const letters = text.split('');

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.045, delayChildren: 0.6 }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className="w-full flex flex-col items-center justify-center gap-4 px-4"
    >
      <motion.div
        className="flex items-center gap-4 sm:gap-6 w-full max-w-2xl"
        variants={{
          hidden: { opacity: 0, scaleX: 0.6 },
          visible: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 1, delay: 0.4, ease: 'easeOut' }
          }
        }}
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A864]/60 to-[#C9A864]" />
        <motion.span
          className="w-1.5 h-1.5 rotate-45 bg-[#C9A864]"
          variants={{
            hidden: { rotate: 0, scale: 0 },
            visible: {
              rotate: 45,
              scale: 1,
              transition: { duration: 0.7, delay: 0.9, ease: 'easeOut' }
            }
          }}
        />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C9A864]/60 to-[#C9A864]" />
      </motion.div>

      <motion.div
        variants={container}
        className="overflow-hidden relative"
      >
        <h2 className="font-heading text-[#C9A864] text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] uppercase flex">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              className="inline-block font-medium tracking-wide"
              style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <motion.div
          className="absolute top-0 left-0 h-full w-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 0%, rgba(245,241,230,0.35) 50%, transparent 100%)'
          }}
          variants={{
            hidden: { x: '-120%' },
            visible: {
              x: '320%',
              transition: { duration: 1.8, delay: 2, ease: 'easeInOut' }
            }
          }}
        />
      </motion.div>

      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 2.2, ease: 'easeOut' }
          }
        }}
        className="font-body text-[#F0EAD8]/55 text-xs sm:text-sm tracking-[0.15em] uppercase text-center"
      >
        Limited time, refreshed every season
      </motion.p>
    </motion.div>
  );
}

function OfferSlideshow({ offers, navigate }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [productIdx, setProductIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const bannerOffers = offers.filter(o => o.thumbnail);
  const allProducts = [];
  offers.forEach(o => {
    (o.products || []).forEach(p => {
      allProducts.push({ product: p, offer: o });
    });
  });

  useEffect(() => {
    if (paused || bannerOffers.length <= 1) return;
    const t = setInterval(() => {
      setBannerIdx(i => (i + 1) % bannerOffers.length);
    }, 2500);
    return () => clearInterval(t);
  }, [paused, bannerOffers.length]);

  useEffect(() => {
    if (paused || allProducts.length <= 1) return;
    const t = setInterval(() => {
      setProductIdx(i => (i + 1) % allProducts.length);
    }, 2500);
    return () => clearInterval(t);
  }, [paused, allProducts.length]);

  if (bannerOffers.length === 0 && allProducts.length === 0) return null;

  const currentBanner = bannerOffers[bannerIdx] || bannerOffers[0];
  const currentProd = allProducts[productIdx] || allProducts[0];

  function discountLabel(o) {
    if (o.discount_type === 'flat') return `৳${o.discount_value}`;
    return `${o.discount_value}%`;
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-[#C9A864]/20"
      style={{ background: 'linear-gradient(135deg, rgba(19,32,26,0.9) 0%, rgba(10,15,12,0.95) 100%)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col sm:flex-row items-stretch min-h-[220px] sm:min-h-[280px]">

        {/* Left — Banner (independent rotation) */}
        <div className="relative w-full sm:w-[55%] h-52 sm:h-auto overflow-hidden flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`banner-${currentBanner.id ?? bannerIdx}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {currentBanner.thumbnail ? (
                <img
                  src={`${API_BASE}${currentBanner.thumbnail}`}
                  alt={currentBanner.offer_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#13201A]">
                  <span className="font-heading text-3xl text-[#C9A864]/30">{currentBanner.offer_name}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0f0c]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c]/70 to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentBanner.id ?? bannerIdx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="absolute top-3 left-3 px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10"
              style={{
                background: 'linear-gradient(135deg, #e2c56b 0%, #c9a864 50%, #a88a42 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              <span className="font-heading text-sm text-[#0A0A0A] font-bold">
                {discountLabel(currentBanner)}
              </span>
              <span className="font-heading text-[8px] text-[#0A0A0A] font-bold uppercase">off</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${currentBanner.id ?? bannerIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="absolute bottom-3 left-4 z-10"
            >
              <h3 className="font-heading text-lg sm:text-xl text-[#F0EAD8] tracking-wide">
                {currentBanner.offer_name}
              </h3>
              {currentBanner.punchline && (
                <p className="font-body text-[10px] text-[#F0EAD8]/50 mt-0.5">{currentBanner.punchline}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center — Ornamental divider */}
        <div className="hidden sm:flex items-center justify-center w-[60px] flex-shrink-0">
          <div className="h-[70%] w-px bg-gradient-to-b from-transparent via-[#C9A864]/40 to-transparent" />
        </div>
        <div className="flex sm:hidden items-center justify-center h-[40px] w-full">
          <div className="w-[70%] h-px bg-gradient-to-r from-transparent via-[#C9A864]/40 to-transparent" />
        </div>

        {/* Right — Product (independent rotation) */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`prod-${currentProd.product.id ?? productIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="relative w-32 h-40 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer group"
                style={{
                  backgroundColor: '#13201A',
                  border: '1px solid rgba(201,168,100,0.2)',
                }}
                onClick={() => navigate(`/product-details/${currentProd.product.id}`)}
              >
                {(currentProd.product.image_url || currentProd.product.primary_image || currentProd.product.thumbnail) ? (
                  <img
                    src={`${API_BASE}${currentProd.product.image_url || currentProd.product.primary_image || currentProd.product.thumbnail}`}
                    alt={currentProd.product.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="font-heading text-xl text-[#C9A864]/40">{currentProd.product.name?.[0]}</span>
                )}
              </div>

              <div className="text-center">
                <h4 className="font-heading text-[#F0EAD8] text-sm tracking-wide">{currentProd.product.name}</h4>
                <span className="font-body text-[#C9A864]/60 text-[10px] uppercase tracking-wider">
                  {currentProd.offer.offer_name}
                </span>
              </div>

              <motion.button
                onClick={() => navigate('/offers', { state: { scrollToOffer: currentProd.offer.id } })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 bg-[#C9A864] text-[#0A0A0A] font-heading text-[10px] uppercase tracking-[0.15em] rounded-sm hover:bg-[#dbb975] transition-colors"
              >
                View More
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators — banners */}
      {bannerOffers.length > 1 && (
        <div className="flex justify-center gap-2 pb-4">
          {bannerOffers.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === bannerIdx ? 'bg-[#C9A864] w-5' : 'bg-[#C9A864]/25 hover:bg-[#C9A864]/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Offer_overview() {

  const [offers, setOffers] = useState([]);
  const [offersWithProducts, setOffersWithProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    async function fetch_offer() {
      try {
        const data = await Get_offers();
        const raw = Array.isArray(data) ? data : data?.data ?? [];
        const now = new Date();
        const active = raw.filter(o => !o.valid_until || new Date(o.valid_until) >= now);
        setOffers(active);
      }
      catch (err) {
        rollbar.error(err);
        console.log("error in front end:", err);
        setOffers([]);
      }
    };
    fetch_offer();

    async function fetch_offer_products() {
      try {
        const data = await Get_offers_with_products();
        const raw = Array.isArray(data) ? data : data?.data ?? [];
        const now = new Date();
        const active = raw.filter(o => !o.valid_until || new Date(o.valid_until) >= now);
        setOffersWithProducts(active);
      }
      catch (err) {
        rollbar.error(err);
        console.log("error fetching offer products:", err);
        setOffersWithProducts([]);
      }
    };
    fetch_offer_products();

  }, [])

  function discountLabel(o) {
    if (o.discount_type === 'flat') return `৳${o.discount_value}`;
    return `${o.discount_value}%`;
  }

  const displayOffers = offers.slice(0, 4);

  if (displayOffers.length === 0) return null;

  return (
    <motion.div className='w-full flex flex-col justify-center items-center gap-5'>

      {/* Offers section */}
      <motion.div className='w-full flex flex-col justify-center items-center gap-2'>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className='w-[60%] max-w-[420px]'
        >
          <OrnamentalDivider color="#C9A864" />
        </motion.div>

        <motion.div
          className='w-[95%] h-[0.5vh] bg-amber-200 rounded-4xl'
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.4, duration: 1.3, ease: 'easeOut' }}
        />

        <motion.div
          className='w-full flex flex-row justify-center items-center gap-3 px-4'
          style={{ height: '35vh' }}
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {displayOffers.map((item, index) => (
            <OfferCard
              key={item.id ?? index}
              offer={discountLabel(item)}
              base={item.offer_name}
              pitch={item.punchline || ''}
              index={index}
            />
          ))}
        </motion.div>

        <motion.button
          onClick={() => navigate('/offers')}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-1 px-6 py-2.5 bg-[#C9A864] text-[#0A0A0A] font-heading text-[11px] uppercase tracking-[0.15em] rounded-sm hover:bg-[#dbb975] transition-colors"
        >
          View All Offers
        </motion.button>

      </motion.div>

      {/* Ongoing Offers banner */}
      <motion.div className='w-full flex flex-col justify-center items-center'>
        <OngoingOffersBanner />
      </motion.div>

      {/* Offered Products — animated slideshow */}
      {offersWithProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10"
        >
          <div className="flex flex-col items-center gap-2 mb-8">
            <span className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C9A864]/70">
              Don&apos;t miss out
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#F0EAD8] tracking-wide">
              Offered Products
            </h2>
          </div>
          <motion.div className="w-full h-[2vh]"/>

          <OfferSlideshow offers={offersWithProducts} navigate={navigate} />
        </motion.div>
      )}

    </motion.div>
  );
}