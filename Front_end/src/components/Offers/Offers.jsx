import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Get_offers_with_products } from '../Server/offer';
import rollbar from '../../rollbar';

const API_BASE = 'http://localhost:5007';

/* ---------------------------------------------------------- */
/*  Ornamental divider — same compass-star motif used sitewide */
/* ---------------------------------------------------------- */
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
        <line x1="58" y1="60" x2="235" y2="60" strokeWidth="1.2" />
        <path d="M58 70 C 120 50, 170 50, 235 70" strokeWidth="1.1" />
        <path d="M58 50 C 120 70, 170 70, 235 50" strokeWidth="1.1" />
        <circle cx="235" cy="60" r="2.4" fill={color} />

        <g strokeWidth="1.2">
          <path d="M622 60 C 622 53, 629 51, 633 55 C 637 59, 633 64, 628 62 C 624 60, 625 55, 630 56" />
        </g>
        <line x1="622" y1="60" x2="445" y2="60" strokeWidth="1.2" />
        <path d="M622 70 C 560 50, 510 50, 445 70" strokeWidth="1.1" />
        <path d="M622 50 C 560 70, 510 70, 445 50" strokeWidth="1.1" />
        <circle cx="445" cy="60" r="2.4" fill={color} />

        <g strokeWidth="1.4">
          <line x1="340" y1="20" x2="340" y2="100" />
          <line x1="300" y1="60" x2="380" y2="60" />
          <line x1="312" y1="32" x2="368" y2="88" />
          <line x1="312" y1="88" x2="368" y2="32" />
        </g>
        <circle cx="340" cy="60" r="3.6" fill={color} stroke="none" />
        <circle cx="340" cy="60" r="6.5" strokeWidth="0.8" />
        <circle cx="340" cy="60" r="9.5" strokeWidth="0.5" opacity="0.6" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------- */
/*  Helpers                                                    */
/* ---------------------------------------------------------- */
function isExpired(offer) {
  if (!offer.valid_until) return false;
  return new Date(offer.valid_until) < new Date();
}

function getProductImage(p) {
  return p.image_url || p.primary_image || p.thumbnail || '';
}

/* ---------------------------------------------------------- */
/*  Breakpoint hook — drives carousel spacing/scale             */
/* ---------------------------------------------------------- */
function useBreakpoint() {
  const [bp, setBp] = useState('desktop');
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setBp('mobile');
      else if (w < 1024) setBp('tablet');
      else setBp('desktop');
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
}

/* ---------------------------------------------------------- */
/*  Offer banner carousel — continuous horizontal scroll        */
/* ---------------------------------------------------------- */
function OfferBannerCarousel({ offers, onScrollToOffer }) {
  const [paused, setPaused] = useState(false);
  const duplicated = [...offers, ...offers];

  const discountLabel = (o) => {
    if (o.discount_type === 'flat') return `৳${o.discount_value} OFF`;
    return `${o.discount_value}% OFF`;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '26vh', minHeight: 220 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10"
        style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 100%)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10"
        style={{ background: 'linear-gradient(to left, #0A0A0A 0%, transparent 100%)' }} />

      {/* Track */}
      <div
        className="flex items-center gap-5 sm:gap-6 h-full"
        style={{
          width: `calc((49vw + 24px) * ${duplicated.length})`,
          animation: `bannerScroll ${offers.length * 5}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {duplicated.map((offer, i) => (
          <div
            key={`${offer.id}-${i}`}
            className="relative flex-shrink-0 h-full rounded-2xl overflow-hidden group border border-[#C9A864]/20"
            style={{ width: '49vw', minWidth: 340 }}
          >
            {/* Background image */}
            {offer.thumbnail ? (
              <img
                src={`${API_BASE}${offer.thumbnail}`}
                alt={offer.offer_name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-[#13201A]" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Discount sticker */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <div className="bg-[#021047] border border-[#C9A864]/40 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="font-heading text-sm sm:text-lg text-[#C9A864] tracking-wide whitespace-nowrap">
                  {discountLabel(offer)}
                </span>
              </div>
            </div>

            {/* Content — visible on hover */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14 z-10 max-w-[65%] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl text-[#F0EAD8] tracking-wide leading-snug mb-2">
                {offer.offer_name}
              </h3>
              {offer.punchline && (
                <p className="font-body text-xs sm:text-sm text-[#F0EAD8]/60 leading-relaxed mb-5 line-clamp-2">
                  {offer.punchline}
                </p>
              )}
              <button
                onClick={() => onScrollToOffer(offer.id)}
                className="self-start px-5 py-2 sm:px-6 sm:py-2.5 bg-[#C9A864] text-[#0A0A0A] font-heading text-[10px] sm:text-[11px] uppercase tracking-[0.15em] rounded-sm hover:bg-[#dbb975] transition-colors"
              >
                Show Items
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bannerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes goldenGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .goldenShimmer {
          position: relative;
          background: #0A0A0A;
        }
        .goldenShimmer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 40%, rgba(201,168,100,0.18) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 60%, rgba(201,168,100,0.14) 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 80%, rgba(201,168,100,0.12) 0%, transparent 40%);
          animation: goldenGlow 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .sticker-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 64px 64px;
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  Product carousel card                                       */
/* ---------------------------------------------------------- */
function ProductCarouselCard({ product, active, onNavigate, onRecenter, discountLabel }) {
  const [imgError, setImgError] = useState(false);
  const img = getProductImage(product);

  return (
    <div
      onClick={!active ? onRecenter : undefined}
      className={`group relative flex flex-col items-center flex-shrink-0 ${active ? 'cursor-default' : 'cursor-pointer'} ${
        active ? 'w-32 sm:w-44 md:w-52' : 'w-24 sm:w-32 md:w-36'
      } transition-[width] duration-500`}
    >
      <div
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#13201A',
          border: `1px solid ${active ? 'rgba(201,168,100,0.35)' : 'rgba(201,168,100,0.12)'}`,
          boxShadow: active ? '0 12px 30px rgba(0,0,0,0.35)' : 'none',
        }}
      >
        {img && !imgError ? (
          <img
            src={`${API_BASE}${img}`}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-2xl text-[#C9A864]/60">{product.name?.[0]}</span>
          </div>
        )}

        {/* Discount sticker */}
        {discountLabel && (
          <div
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center real-sticker"
            style={{
              background: 'linear-gradient(135deg, #e2c56b 0%, #c9a864 25%, #a88a42 55%, #c9a864 75%, #e2c56b 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.15)',
              border: '1.5px solid rgba(120,90,30,0.5)',
              transform: 'rotate(-8deg)',
            }}
          >
            <span
              className="font-heading text-[9px] sm:text-[10px] font-bold leading-none relative z-10"
              style={{
                color: '#1a1200',
                textShadow: '0 1px 0 rgba(255,255,255,0.25), 0 -1px 0 rgba(0,0,0,0.15)',
              }}
            >
              {discountLabel}
            </span>
            <span
              className="font-heading text-[6px] sm:text-[7px] font-bold leading-none uppercase relative z-10"
              style={{
                color: '#1a1200',
                textShadow: '0 1px 0 rgba(255,255,255,0.25), 0 -1px 0 rgba(0,0,0,0.15)',
              }}
            >
              off
            </span>
            {/* Glossy sheen overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 35%, transparent 50%, rgba(0,0,0,0.08) 80%, rgba(0,0,0,0.15) 100%)',
              }}
            />
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none sticker-noise"
              style={{ opacity: 0.08 }}
            />
          </div>
        )}

        {active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={onNavigate}
              className="px-4 py-2 rounded-sm bg-[#C9A864] text-[#0A0A0A] font-heading text-[10px] sm:text-[11px] uppercase tracking-[0.15em] hover:bg-[#dbb975] transition-colors"
            >
              View Product
            </button>
          </div>
        )}
      </div>

      <p
        className={`font-heading text-center mt-3 truncate max-w-full px-1 transition-all duration-500 ${
          active ? 'text-[#F0EAD8] text-sm sm:text-base' : 'text-[#F0EAD8]/50 text-[10px] sm:text-xs'
        }`}
      >
        {product.name}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  Product carousel (coverflow style)                          */
/* ---------------------------------------------------------- */
function ProductCarousel({ products, discountLabel }) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const bp = useBreakpoint();

  const spacing = { mobile: 96, tablet: 150, desktop: 210 }[bp];
  const visibleRange = bp === 'mobile' ? 1 : 2;

  useEffect(() => {
    if (paused || products.length <= 1) return;
    const t = setInterval(() => {
      setCenterIndex((i) => (i + 1) % products.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, products.length]);

  function prev() {
    setCenterIndex((i) => (i - 1 + products.length) % products.length);
  }
  function next() {
    setCenterIndex((i) => (i + 1) % products.length);
  }

  if (products.length === 0) return null;

  return (
    <div
      className="relative w-full flex items-center justify-center h-[220px] sm:h-[270px] md:h-[310px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {products.length > 1 && (
        <button
          onClick={prev}
          aria-label="Previous product"
          className="absolute left-0 sm:left-2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#13201A] border border-[#C9A864]/25 hover:border-[#C9A864]/60 hover:bg-[#1a2b22] transition-colors"
        >
          <ChevronLeft size={16} className="text-[#C9A864]" />
        </button>
      )}

      <div className="relative w-full h-full overflow-hidden">
        {products.map((p, i) => {
          let distance = i - centerIndex;
          const half = products.length / 2;
          if (distance > half) distance -= products.length;
          if (distance < -half) distance += products.length;
          if (Math.abs(distance) > visibleRange) return null;

          const scale = distance === 0 ? 1 : Math.abs(distance) === 1 ? 0.75 : 0.55;
          const opacity = distance === 0 ? 1 : Math.abs(distance) === 1 ? 0.55 : 0.25;
          const zIndex = 20 - Math.abs(distance);

          return (
            <div
              key={p.id ?? i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex,
              }}
            >
              <motion.div
                animate={{ x: distance * spacing, scale, opacity }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCarouselCard
                  product={p}
                  active={distance === 0}
                  onNavigate={() => navigate(`/product-details/${p.id}`)}
                  onRecenter={() => setCenterIndex(i)}
                  discountLabel={discountLabel}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {products.length > 1 && (
        <button
          onClick={next}
          aria-label="Next product"
          className="absolute right-0 sm:right-2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#13201A] border border-[#C9A864]/25 hover:border-[#C9A864]/60 hover:bg-[#1a2b22] transition-colors"
        >
          <ChevronRight size={16} className="text-[#C9A864]" />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  Offered products section — grouped by offer                  */
/* ---------------------------------------------------------- */
function OfferedProductsSection({ offers }) {
  const discountLabel = (o) => {
    if (o.discount_type === 'flat') return `৳${o.discount_value}`;
    return `${o.discount_value}%`;
  };

  return (
    <div className="w-full">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14"
      >
        <span className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C9A864]/70">
          Browse by Offer
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#F0EAD8] tracking-wide">
          Offered Products
        </h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="w-[45%] max-w-[300px]"
        >
          <OrnamentalDivider />
        </motion.div>
      </motion.div>
      <motion.div className='w-full h-[7vh]'/>

      {/* Per-offer product groups */}
      {offers.map((offer, idx) => {
        const bgColors = ['bg-[#021047]', 'goldenShimmer'];
        const headingBgColors = ['bg-black', 'bg-[#021047]'];
        const bg = bgColors[idx % 2];
        const headingBg = headingBgColors[idx % 2];
        return (
        <motion.section
          key={offer.id}
          data-offer-id={offer.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full py-14 sm:py-20 md:py-28 border-b border-[#C9A864]/10 last:border-0 relative overflow-hidden ${bg}`}
          style={{ opacity: isExpired(offer) ? 0.6 : 1 }}
        >
          <motion.div className='w-full h-[15vh]'/>
          <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
            {/* Offer sub-heading with sticker */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <h3 className={`font-heading text-lg sm:text-xl md:text-2xl text-[#F0EAD8] tracking-wide flex flex-col justify-center items-center ${headingBg} rounded-3xl px-6 py-3`}>
                {offer.offer_name}
              </h3>
              <motion.span
                animate={{ y: [2, -4, 2] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative inline-flex items-center gap-1 bg-amber-400 border-2 border-amber-500 rounded-lg px-3 py-1.5 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]" />
                <Tag size={11} className="text-[#150f02] relative z-10" />
                <span className="font-heading text-[11px] sm:text-xs text-[#150f02] tracking-wide font-bold relative z-10">
                  {discountLabel(offer)} OFF
                </span>
              </motion.span>
            </div>
            <motion.div className='w-full h-[10vh]'/>
            {/* Reuse existing coverflow carousel */}
            <ProductCarousel products={offer.products || []} discountLabel={discountLabel(offer)} />
          </div>
        </motion.section>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  Page                                                        */
/* ---------------------------------------------------------- */
export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await Get_offers_with_products();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setOffers(data);
      } catch (err) {
        rollbar.error(err);
        console.log('error loading offers:', err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortedOffers = useMemo(() => {
    return offers
      .filter((o) => (o.products?.length || 0) > 0)
      .sort((a, b) => {
        const aExp = isExpired(a) ? 1 : 0;
        const bExp = isExpired(b) ? 1 : 0;
        if (aExp !== bExp) return aExp - bExp;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
  }, [offers]);

  const activeCount = useMemo(() => sortedOffers.filter((o) => !isExpired(o)).length, [sortedOffers]);

  const scrollToOffer = useCallback((offerId) => {
    const el = document.querySelector(`[data-offer-id="${offerId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const targetId = location.state?.scrollToOffer;
    if (targetId && !loading) {
      const t = setTimeout(() => scrollToOffer(targetId), 200);
      return () => clearTimeout(t);
    }
  }, [location.state, loading, scrollToOffer]);

  return (
    <>
      <motion.div className='w-full h-[10vh]'/>
    <motion.div className='w-full h-[15vh]'/>
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Hero — unchanged */}
      <div className="px-4 sm:px-8 lg:px-16 pt-16 sm:pt-24 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-4"
        >
          <span className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C9A864]/70">
            Rafifa Mart Exclusive
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F0EAD8] tracking-wide">
            Curated Offers
          </h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-[55%] max-w-[380px]"
          >
            <OrnamentalDivider />
          </motion.div>

          <p className="font-body text-[13px] sm:text-sm text-[#F0EAD8]/55 max-w-md leading-relaxed">
            Handpicked savings across our fragrance collection — refreshed each season, worn every day.
          </p>

          {!loading && sortedOffers.length > 0 && (
            <span className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-[#C9A864]/60 px-3 py-1 rounded-full border border-[#C9A864]/20">
              {activeCount} active {activeCount === 1 ? 'offer' : 'offers'}
            </span>
          )}
        </motion.div>
      </div>
      <motion.div className='w-full h-[10vh]'/>

      {/* Content */}
      {loading ? (
        <div className="w-full py-24 flex flex-col items-center gap-4">
          <div className="w-[49vw] h-[26vh] min-h-[220px] bg-[#13201A] rounded-2xl animate-pulse" />
          <div className="w-[45%] max-w-[300px] h-4 bg-[#13201A] rounded animate-pulse mt-8" />
        </div>
      ) : sortedOffers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <Tag size={36} strokeWidth={1} className="text-[#C9A864]/25" />
          <p className="font-heading text-lg text-[#F0EAD8]/60">No offers at the moment</p>
          <p className="font-body text-xs text-[#F0EAD8]/35">Check back soon — new offers arrive every season.</p>
        </motion.div>
      ) : (
        <>
          {/* Banner carousel */}
          <OfferBannerCarousel offers={sortedOffers} onScrollToOffer={scrollToOffer} />

          {/* Offered products grouped by offer */}
          <div className="mt-8">
              <motion.div className='w-full h-[10vh]'/>
            <OfferedProductsSection offers={sortedOffers} />
          </div>
        </>
      )}
    </div>
    </>
  );
}
