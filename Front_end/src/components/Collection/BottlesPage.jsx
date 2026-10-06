import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Get_bottles } from '../Server/bottle';
import { X } from 'lucide-react';

const GOLD = '#C9A864';
const CREAM = '#F0EAD8';
const PINE = '#13201A';
const MAROON = '#5C1A1A';
const INK = '#0A0F0C';

/* ═══════════ ORNAMENTAL DIVIDER (from Collection.jsx) ═══════════ */
function OrnamentalDivider() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-[20vh] sm:min-h-[30vh] lg:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-20"
        >
            <div className="w-full max-w-5xl flex items-center gap-4 sm:gap-6 lg:gap-12">
                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 origin-right"
                    viewBox="0 0 300 40" preserveAspectRatio="none"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        <path d="M2 20 C10 8, 20 8, 28 20 C20 32, 10 32, 2 20 Z" />
                        <circle cx="2" cy="20" r="2" fill="#C9A864" />
                        <path d="M28 20 C 120 4, 220 4, 296 20" />
                        <path d="M28 20 C 120 36, 220 36, 296 20" />
                    </g>
                </motion.svg>

                <motion.svg
                    initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    width="56" height="56" viewBox="0 0 56 56"
                    className="flex-shrink-0 hidden sm:block"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        <line x1="28" y1="2" x2="28" y2="54" />
                        <line x1="2" y1="28" x2="54" y2="28" />
                        <line x1="12" y1="12" x2="44" y2="44" strokeWidth="0.6" />
                        <line x1="44" y1="12" x2="12" y2="44" strokeWidth="0.6" />
                        <path d="M28 2 L24 10 L32 10 Z" fill="#C9A864" stroke="none" />
                        <path d="M28 54 L24 46 L32 46 Z" fill="#C9A864" stroke="none" />
                        <path d="M2 28 L10 24 L10 32 Z" fill="#C9A864" stroke="none" />
                        <path d="M54 28 L46 24 L46 32 Z" fill="#C9A864" stroke="none" />
                        <circle cx="28" cy="28" r="4" fill="none" />
                        <circle cx="28" cy="28" r="1.5" fill="#C9A864" />
                    </g>
                </motion.svg>

                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 origin-left"
                    viewBox="0 0 300 40" preserveAspectRatio="none"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        <path d="M298 20 C 290 8, 280 8, 272 20 C 280 32, 290 32, 298 20 Z" />
                        <circle cx="298" cy="20" r="2" fill="#C9A864" />
                        <path d="M272 20 C 180 4, 80 4, 4 20" />
                        <path d="M272 20 C 180 36, 80 36, 4 20" />
                    </g>
                </motion.svg>
            </div>
        </motion.div>
    );
}

/* ═══════════ BOTTLE SVG ═══════════ */
function BottleSVG({ className = '' }) {
    return (
        <svg viewBox="0 0 50 80" fill="none" className={className}>
            <path d="M25 3 C22 3,20 6,20 10 L20 18 C15 20,12 25,12 31 L12 62 C12 68,16 72,22 72 L28 72 C34 72,38 68,38 62 L38 31 C38 25,35 20,30 18 L30 10 C30 6,28 3,25 3Z"
                stroke={GOLD} strokeWidth="1.3" />
            <rect x="20" y="0" width="10" height="5" rx="1.5" stroke={GOLD} strokeWidth="1" />
        </svg>
    );
}

/* ═══════════ TOP SECTION — Newest Arrivals Marquee ═══════════ */
const CARD_BG = [PINE, MAROON];
const MARQUEE_CARD_W = 170;
const MARQUEE_CARD_GAP = 32;

function MarqueeCard({ bottle, index, onNavigate }) {
    return (
        <motion.div
            whileHover={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={() => onNavigate(bottle)}
            className="relative flex-shrink-0 group cursor-pointer overflow-hidden rounded-lg"
            style={{ width: MARQUEE_CARD_W, height: 190, background: CARD_BG[index % 2] }}
        >
            {/* Gold border + corners */}
            <div className="absolute inset-0 border border-[#C9A864]/25 pointer-events-none z-10 rounded-lg" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C9A864]/10 rounded-tl-lg z-20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C9A864]/70 rounded-tr-lg z-20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C9A864]/70 rounded-bl-lg z-20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C9A864]/70 rounded-br-lg z-20" />

            {bottle.photo_url ? (
                <img src={bottle.photo_url} alt={bottle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <BottleSVG className="w-10 h-16 opacity-25" />
                </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Info — always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 z-20">
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#C9A864]/70 font-body block mb-0.5">
                    {bottle.volume}
                </span>
                <h4 className="font-heading text-[#F0EAD8] text-xs leading-snug truncate mb-0.5">
                    {bottle.name}
                </h4>
                <span className="font-heading text-[#C9A864] text-sm font-semibold">
                    ৳{Number(bottle.price_per_piece).toFixed(0)}
                </span>
            </div>

            {/* Purchase button — hover */}
            <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
                <button className="pointer-events-auto px-5 py-2 rounded-sm bg-[#C9A864]/90 text-[#0D1410] text-[10px] uppercase tracking-[0.2em] font-body font-semibold translate-y-3 group-hover:translate-y-0 transition-all duration-400 hover:bg-[#C9A864]">
                    Purchase
                </button>
            </div>

            {/* "New" badge */}
            <motion.div className='w-full h-[5vh]'/>
            <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-sm text-[7px] font-body uppercase tracking-widest"
                style={{ background: `${MAROON}CC`, color: CREAM }}>
                New
            </div>
        </motion.div>
    );
}

function TopSection({ bottles, onNavigate }) {
    const heading = "Newest Arrivals";

    const newest = useMemo(
        () => [...bottles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
        [bottles]
    );

    /* marquee duplication */
    const marqueeItems = [...newest, ...newest, ...newest, ...newest];
    const travelPx = (MARQUEE_CARD_W + MARQUEE_CARD_GAP) * newest.length;
    const fadeZone = MARQUEE_CARD_W + MARQUEE_CARD_GAP;
    const maskImage = `linear-gradient(to right, transparent 0px, black ${fadeZone}px, black calc(100% - ${fadeZone}px), transparent 100%)`;

    return (
        <section className="w-full bg-[#0a0f0c] relative overflow-hidden flex flex-col items-center">
            {/* ambient glow */}
            <div className="pointer-events-none absolute -top-40 left-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#C9A864]/10 blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#011863]/10 blur-[60px] sm:blur-[80px] md:blur-[100px] lg:blur-[120px]" />

            {/* Heading block — centered */}
            <div className="w-full flex flex-col items-center text-center px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-20 pb-10 relative z-10">
                <motion.span
                    initial={{ opacity: 0, letterSpacing: '0.1em' }}
                    whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-[10px] sm:text-xs uppercase text-[#C9A864] font-body mb-5"
                >
                    Freshly Added
                </motion.span>

                <h2 className="font-heading text-[#F0EAD8] text-2xl sm:text-3xl lg:text-5xl leading-tight mb-5 flex flex-wrap justify-center">
                    {heading.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.03 }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </h2>

                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    width="120" height="20" viewBox="0 0 120 20" className="mb-5"
                >
                    <line x1="0" y1="10" x2="45" y2="10" stroke="#C9A864" strokeWidth="1" />
                    <circle cx="60" cy="10" r="4" fill="none" stroke="#C9A864" strokeWidth="1" />
                    <line x1="75" y1="10" x2="120" y2="10" stroke="#C9A864" strokeWidth="1" />
                </motion.svg>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="font-body text-[#F0EAD8]/60 text-sm leading-relaxed max-w-md"
                >
                    The latest additions to our collection — scroll through fresh arrivals before they're gone.
                </motion.p>
            </div>

            {/* Marquee — full width below */}
            <div className="w-full relative z-10 py-10 px-6 overflow-hidden">
                {/* Label */}
                <div className="w-full max-w-6xl mx-auto flex items-center gap-3 mb-6 flex justify-center items-center">
                    <span className="text-[12px] uppercase tracking-[0.3em] text-[#C9A864] font-body">
                        Recently Added
                    </span>
                    <span className="flex-1 h-px bg-[#C9A864]/20" />
                    <span className="font-body text-[#F0EAD8]/30 text-[11px] uppercase tracking-wider">
                        {newest.length} new
                    </span>
                </div>
                <motion.div className='w-full h-[2vh]'/>

                {newest.length === 0 ? (
                    <div className="w-full h-[220px] flex items-center justify-center">
                        <span className="font-body text-[#F0EAD8]/40 text-sm">No bottles yet.</span>
                    </div>
                ) : (
                    <div className="w-full"
                        style={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            WebkitMaskImage: maskImage,
                            maskImage: maskImage,
                        }}>
                        <motion.div className="flex" style={{ gap: `${MARQUEE_CARD_GAP}px` }}
                            animate={{ x: [`0px`, `-${travelPx}px`] }}
                            transition={{ duration: newest.length * 6, ease: 'linear', repeat: Infinity }}>
                            {marqueeItems.map((bottle, idx) => (
                                <MarqueeCard key={`${bottle.id}-${idx}`} bottle={bottle} index={idx} onNavigate={onNavigate} />
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Bottom accent */}
                <motion.div className='w-full h-[3vh]'/>
                <div className="w-full max-w-6xl mx-auto mt-6 flex items-center gap-3">
                    <span className="flex-1 h-px bg-[#C9A864]/15" />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2 h-2 rounded-full bg-[#C9A864]"
                    />
                    <span className="flex-1 h-px bg-[#C9A864]/15" />
                </div>
            </div>
        </section>
    );
}

/* ═══════════ COLLECTION NAV — Volume Filter ═══════════ */
function CollectionNav({ filters, setFilter }) {
    const hasActive = filters.volume !== 'all';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full border border-[#C9A864]/15 bg-[#0d1410] px-4 sm:px-5 lg:px-7 py-6 sm:py-8 lg:py-10 rounded-sm"
        >
            <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
                <h4 className="font-heading text-[#F0EAD8] text-xl">Refine</h4>
                {hasActive && (
                    <button
                        onClick={() => setFilter('volume', 'all')}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#F0EAD8]/40 hover:text-[#C9A864] transition-colors"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            <svg width="100%" height="12" viewBox="0 0 200 12" className="mb-8 opacity-40">
                <line x1="0" y1="6" x2="80" y2="6" stroke="#C9A864" strokeWidth="1" />
                <circle cx="100" cy="6" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                <line x1="120" y1="6" x2="200" y2="6" stroke="#C9A864" strokeWidth="1" />
            </svg>

            <div className="mb-10">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A864]/70 font-body block mb-5">
                    Bottle Size
                </span>
                <div className="flex flex-row flex-wrap lg:flex-col gap-2.5">
                    {filters.volumeOptions.map((vol) => {
                        const active = filters.volume === vol;
                        return (
                            <button
                                key={vol}
                                onClick={() => setFilter('volume', active ? 'all' : vol)}
                                style={active ? { borderColor: `${GOLD}66`, backgroundColor: `${GOLD}14` } : {}}
                                className="group flex items-center gap-4 px-3 sm:px-4 py-2 sm:py-3 text-sm font-body rounded-sm transition-all duration-300 text-left border border-transparent hover:bg-[#F0EAD8]/5"
                            >
                                <span
                                    style={{ color: active ? GOLD : undefined }}
                                    className={`tracking-wide transition-colors ${active ? '' : 'text-[#F0EAD8]/50 group-hover:text-[#F0EAD8]/80'}`}
                                >
                                    {vol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════ BOTTLE CARD ═══════════ */
function BottleCard({ bottle, index, onNavigate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
            onClick={() => onNavigate(bottle)}
            className="group relative flex flex-col bg-[#0d1410] border border-[#C9A864]/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-[#C9A864]/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(201,168,100,0.15)] cursor-pointer"
        >
            {/* image */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0a0f0c]">
                {bottle.photo_url ? (
                    <img src={bottle.photo_url} alt={bottle.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BottleSVG className="w-12 h-20 opacity-20" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-70" />

                {/* shine sweep on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-[#F0EAD8]/15 to-transparent -skew-x-12 transition-all duration-700 ease-out group-hover:left-[150%]" />
                </div>

                <span className="absolute top-2 right-2 z-10 text-[9px] uppercase tracking-widest text-[#F0EAD8]/70 bg-[#0a0f0c]/60 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-[#F0EAD8]/10">
                    {bottle.volume}
                </span>
            </div>

            {/* details */}
            <div className="flex flex-col px-3 sm:px-4 py-3 sm:py-4">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#C9A864]/70 font-body mb-1.5">
                    Perfume Bottle
                </span>

                <h4 className="font-heading text-[#F0EAD8] text-sm sm:text-base mb-1.5 leading-snug capitalize truncate">
                    {bottle.name}
                </h4>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F0EAD8]/5">
                    <span className="font-heading text-[#C9A864] text-lg sm:text-xl font-semibold">
                        ৳{Number(bottle.price_per_piece).toFixed(0)}
                    </span>
                    <span className="font-body text-[#F0EAD8]/30 text-[10px] uppercase">
                        {bottle.total_piece} pcs
                    </span>
                </div>

                {/* Purchase button — hover */}
                <button className="mt-3 w-full py-2 rounded-sm border border-[#C9A864]/30 text-[#C9A864] text-[11px] uppercase tracking-[0.2em] font-body opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 hover:bg-[#C9A864]/10 hover:border-[#C9A864]/60">
                    Purchase
                </button>
            </div>
        </motion.div>
    );
}

/* ═══════════ TOTAL COLLECTION — Grid ═══════════ */
function TotalCollection({ bottles, filters, onNavigate }) {
    const filtered = useMemo(() => {
        if (filters.volume === 'all') return bottles;
        return bottles.filter(b => b.volume === filters.volume);
    }, [bottles, filters.volume]);

    return (
        <div className="w-full">
           <motion.div className='w-full h-[1vh]'/>
            {/* heading */}
            <div className="mb-12 relative">
                <span className="text-xs uppercase tracking-[0.3em] text-[#C9A864] font-body mb-3 block">
                    Explore
                </span>
                

                <div className="flex items-end justify-between flex-wrap gap-4">
                    <h3 className="font-heading text-[#F0EAD8] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight relative">
                        Every Bottle We Carry
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute -bottom-2 left-0 h-[2px] w-24 bg-gradient-to-r from-[#C9A864] to-transparent origin-left"
                        />
                    </h3>

                    <span className="font-body text-[#F0EAD8]/40 text-xs uppercase tracking-wider pb-1">
                        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                    </span>
                </div>
                 <motion.div className='w-full h-[3vh]'/>

                <p className="font-body text-[#F0EAD8]/50 text-sm mt-4 max-w-md">
                    Every vessel we carry, gathered in one place — refine by size to find your own.
                </p>
            </div>
             <motion.div className='w-full h-[3vh]'/>

            {filtered.length === 0 ? (
                <div className="w-full py-24 flex items-center justify-center">
                    <span className="font-body text-[#F0EAD8]/30 text-sm">No bottles match this filter.</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {filtered.map((bottle, index) => (
                        <BottleCard key={bottle.id} bottle={bottle} index={index} onNavigate={onNavigate} />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function BottlesPage() {
    const navigate = useNavigate();
    const [bottles, setBottles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        volume: 'all',
        volumeOptions: [],
    });

    function navigateToBottle(bottle) {
        navigate(`/bottles/${bottle.id}`, { state: { bottle } });
    }

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                setLoading(true);
                const data = await Get_bottles();
                const list = Array.isArray(data) ? data : data?.data ?? [];
                if (!isMounted) return;
                setBottles(list);

                const uniqueVols = Array.from(new Set(list.map(b => b.volume))).sort();
                setFilters(prev => ({ ...prev, volumeOptions: uniqueVols }));
            } catch {
                // ignore
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

    function setFilter(field, value) {
        setFilters(prev => ({ ...prev, [field]: value }));
    }

    return (
        <>
        <motion.div className='w-full h-[15vh]'/>
            <motion.div className="w-full flex flex-col justify-center items-center gap-4 sm:gap-5 lg:gap-6">
                {/* Top Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex justify-center items-center"
                >
                    <TopSection bottles={bottles} onNavigate={navigateToBottle} />
                </motion.div>

                {/* Ornamental Divider */}
                <OrnamentalDivider />

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex justify-center items-center"
                >
                    <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 lg:px-12 py-16 bg-[#0a0f0c]">
                        <motion.div className="w-full lg:w-[22%] lg:sticky lg:top-24">
                            <CollectionNav filters={filters} setFilter={setFilter} />
                        </motion.div>

                        <motion.div className="w-full lg:w-[78%]">
                            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="rounded-sm h-80 animate-pulse border border-[#C9A864]/10 bg-[#0d1410]" />
                                    ))}
                                </div>
                            ) : (
                                <TotalCollection bottles={bottles} filters={filters} onNavigate={navigateToBottle} />
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
