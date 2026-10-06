import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ROTATE_MS = 5000;

function getTopProductIds(ratings, products) {
    if (!ratings || ratings.length === 0) {
        return products.slice(0, 5).map(p => p.id);
    }

    const grouped = {};
    ratings.forEach(r => {
        if (!grouped[r.product_id]) grouped[r.product_id] = [];
        grouped[r.product_id].push(r.rating);
    });

    const rated = Object.entries(grouped)
        .map(([productId, list]) => ({
            productId: Number(productId),
            avg: list.reduce((sum, n) => sum + n, 0) / list.length,
        }))
        .sort((a, b) => b.avg - a.avg || a.productId - b.productId)
        .slice(0, 5)
        .map(entry => entry.productId);

    if (rated.length === 0) {
        return products.slice(0, 5).map(p => p.id);
    }

    return rated;
}

function getImage(productImages, productId) {
    const images = productImages.filter(img => img.product_id === productId);
    const primary = images.find(img => img.is_primary) || images[0];
    return primary?.image_url || '';
}

function getAverageRating(ratings, productId) {
    const list = ratings.filter(r => r.product_id === productId).map(r => r.rating);
    if (list.length === 0) return null;
    return list.reduce((sum, n) => sum + n, 0) / list.length;
}

function getPriceInfo(productVariants, offers, productOffers, productId) {
    const variants = productVariants.filter(v => v.product_id === productId);
    const base = variants.sort((a, b) => a.price - b.price)[0];

    const linkedOffer = productOffers.find(po => po.product_id === productId);
    const offer = linkedOffer ? offers.find(o => o.id === linkedOffer.offer_id) : null;

    if (!base) return { price: null, original: null, volumeMl: null, label: null };

    if (offer) {
        const discounted = offer.discount_type === 'percentage'
            ? Math.round(base.price * (1 - offer.discount_value / 100))
            : Math.max(0, Math.round(base.price - offer.discount_value));

        const label = offer.discount_type === 'percentage'
            ? `−${offer.discount_value}%`
            : `−৳${offer.discount_value}`;

        return { price: discounted, original: base.price, volumeMl: base.volume_ml, label };
    }
    return { price: base.price, original: null, volumeMl: base.volume_ml, label: null };
}

export default function TopCollection({ products, productImages, ratings, productVariants, offers, productOffers, bottles }) {
    const topIds = useMemo(() => getTopProductIds(ratings, products), [ratings, products]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (topIds.length <= 1) return;
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % topIds.length);
        }, ROTATE_MS);
        return () => clearInterval(timer);
    }, [topIds.length]);

    if (topIds.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center min-h-[40vh] sm:min-h-[50vh]">
                <span className="font-body text-[#F0EAD8]/40 text-xs sm:text-sm">No top-rated products yet.</span>
            </div>
        );
    }

    const currentId = topIds[index];
    const product = products.find(p => p.id === currentId);
    const image = getImage(productImages, currentId);
    const avgRating = getAverageRating(ratings, currentId);
    const { price, original, volumeMl, label } = getPriceInfo(productVariants, offers, productOffers, currentId);

    if (!product) return null;

    function handleViewDetails() {
        navigate(`/product-details/${currentId}`, {
            state: {
                productId: currentId,
                products,
                productImages,
                ratings,
                productVariants,
                offers,
                productOffers,
            },
        });
    }

    return (
        <div className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] relative flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentId}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-10"
                >
                    {/* image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="w-full md:w-1/2 aspect-[3/4] max-h-[40vh] sm:max-h-[50vh] md:max-h-none relative"
                    >
                        <div className="w-full h-full flex items-center justify-center bg-[#0a0f0c] overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c]/50 to-transparent pointer-events-none z-10" />
                            {image ? (
                                <img src={image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-body text-[#F0EAD8]/30 text-xs">No image</span>
                            )}

                            {label && (
                                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-[#011863] text-[#F0EAD8] text-[9px] sm:text-[10px] tracking-widest uppercase px-2 sm:px-3 py-1 rounded-sm">
                                    {label}
                                </span>
                            )}
                        </div>

                        <svg className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 pointer-events-none" viewBox="0 0 32 32">
                            <path d="M2 14 V2 H14" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                        </svg>
                        <svg className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 pointer-events-none" viewBox="0 0 32 32">
                            <path d="M18 2 H30 V14" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                        </svg>
                        <svg className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 pointer-events-none" viewBox="0 0 32 32">
                            <path d="M2 18 V30 H14" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                        </svg>
                        <svg className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 pointer-events-none" viewBox="0 0 32 32">
                            <path d="M18 30 H30 V18" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                        </svg>

                        <div className="absolute inset-0 border border-[#C9A864]/15 pointer-events-none" />
                    </motion.div>

                    {/* details */}
                    <div className="w-full md:w-1/2 flex flex-col relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                        <div className="absolute inset-0 -z-10 overflow-hidden rounded-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b20] via-[#13201A] to-[#0a0f0c]" />
                            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#C9A864]/20 rounded-full blur-[50px] sm:blur-[60px] lg:blur-[80px] translate-x-1/3 -translate-y-1/3" />
                            <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-[#011863]/25 rounded-full blur-[40px] sm:blur-[55px] lg:blur-[70px] -translate-x-1/4 translate-y-1/4" />
                            <div className="absolute inset-0 border border-[#C9A864]/10" />
                        </div>

                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C9A864] font-body mb-2 sm:mb-3">
                            {product.available_categories || 'Perfume'} · {product.perfume_for}
                        </span>

                        <h3 className="font-heading text-[#F0EAD8] text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 leading-snug capitalize">
                            {product.name}
                        </h3>

                        {avgRating && (
                            <div className="flex items-center gap-1 mb-3 sm:mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                                        fill={i < Math.round(avgRating) ? '#C9A864' : 'none'}
                                        stroke="#C9A864" strokeWidth="1">
                                        <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 17.5 5.5 21.5 7 14.5 2 9.5 9 9" />
                                    </svg>
                                ))}
                                <span className="text-[#F0EAD8]/50 text-[10px] sm:text-xs font-body ml-1 sm:ml-2">{avgRating.toFixed(1)}</span>
                            </div>
                        )}

                        {product.description && (
                            <p className="font-body text-[#F0EAD8]/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                                {product.description}
                            </p>
                        )}

                        <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                            {price != null && (
                                <span className="font-heading text-[#C9A864] text-xl sm:text-2xl">৳{price}</span>
                            )}
                            {original != null && (
                                <span className="font-body text-[#F0EAD8]/30 text-xs sm:text-sm line-through">৳{original}</span>
                            )}
                        </div>

                        {volumeMl && (
                            <span className="font-body text-[#F0EAD8]/40 text-[10px] sm:text-xs uppercase tracking-wider mb-4 sm:mb-6">
                                {volumeMl}ml · {product.perfume_type}
                            </span>
                        )}

                        <motion.button
                            onClick={handleViewDetails}
                            whileHover={{ letterSpacing: '0.15em' }}
                            transition={{ duration: 0.3 }}
                            className="self-start border border-[#C9A864] text-[#C9A864] font-body text-[10px] sm:text-xs uppercase tracking-widest px-5 sm:px-8 py-2.5 sm:py-3 mt-2"
                        >
                            View Details
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {topIds.map((id, i) => (
                    <button
                        key={id}
                        onClick={() => setIndex(i)}
                        className="relative h-[2px] w-6 sm:w-8 bg-[#F0EAD8]/20 overflow-hidden"
                    >
                        {i === index && (
                            <motion.div
                                key={`${id}-${index}`}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                                className="absolute inset-0 bg-[#C9A864] origin-left"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
