import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

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

function ProductCard({ product, productImages, ratings, productVariants, offers, productOffers, index, onViewDetails }) {
    const image = getImage(productImages, product.id);
    const avgRating = getAverageRating(ratings, product.id);
    const { price, original, volumeMl, label } = getPriceInfo(productVariants, offers, productOffers, product.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
            className="group relative flex flex-col bg-[#0d1410] border border-[#C9A864]/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-[#C9A864]/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(201,168,100,0.15)]"
        >
            {/* image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0a0f0c]">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-body text-[#F0EAD8]/20 text-[10px] sm:text-xs">No image</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-70" />

                {/* shine sweep on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-[#F0EAD8]/15 to-transparent -skew-x-12 transition-all duration-700 ease-out group-hover:left-[150%]" />
                </div>

                {label && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-[#011863] text-[#F0EAD8] text-[8px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm">
                        {label}
                    </span>
                )}

                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 text-[8px] sm:text-[10px] uppercase tracking-widest text-[#F0EAD8]/70 bg-[#0a0f0c]/60 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm border border-[#F0EAD8]/10">
                    {product.available_categories}
                </span>

                {/* view details, slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-10">
                    <button
                        onClick={() => onViewDetails(product.id)}
                        className="w-full bg-[#C9A864] text-[#0a0f0c] font-body text-[10px] sm:text-xs uppercase tracking-widest py-2.5 sm:py-3 hover:bg-[#F0EAD8] transition-colors"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* details */}
            <div className="flex flex-col px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#C9A864]/70 font-body mb-1.5 sm:mb-2">
                    {product.perfume_type} · {product.perfume_for}
                </span>

                <h4 className="font-heading text-[#F0EAD8] text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 leading-snug capitalize truncate">
                    {product.name}
                </h4>

                {avgRating && (
                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={10}
                                fill={i < Math.round(avgRating) ? '#C9A864' : 'none'}
                                stroke="#C9A864"
                                strokeWidth={1}
                            />
                        ))}
                        <span className="text-[#F0EAD8]/40 text-[10px] sm:text-[11px] font-body ml-0.5 sm:ml-1">{avgRating.toFixed(1)}</span>
                    </div>
                )}

                <div className="flex items-baseline justify-between mt-auto pt-1.5 sm:pt-2 border-t border-[#F0EAD8]/5">
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                        {price != null && (
                            <span className="font-heading text-[#C9A864] text-sm sm:text-base">৳{price}</span>
                        )}
                        {original != null && (
                            <span className="font-body text-[#F0EAD8]/25 text-[10px] sm:text-xs line-through">৳{original}</span>
                        )}
                    </div>
                    {volumeMl && (
                        <span className="font-body text-[#F0EAD8]/30 text-[9px] sm:text-[11px] uppercase">{volumeMl}ml</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function TotalCollection({ products, productImages, ratings, productVariants, offers, productOffers, bottles, filters }) {

    const navigate = useNavigate();

    function handleViewDetails(productId) {
        navigate(`/product-details/${productId}`, {
            state: {
                productId,
                products,
                productImages,
                ratings,
                productVariants,
                offers,
                productOffers,
            },
        });
    }

    const filtered = products.filter(p => {
        const typeMatch = filters.type === 'all' || p.perfume_type?.toLowerCase() === filters.type.toLowerCase();
        const genderMatch = filters.gender === 'all' || p.perfume_for?.toLowerCase() === filters.gender.toLowerCase();
        return typeMatch && genderMatch;
    });

    return (
        <div className="w-full">
            {/* heading */}
            <div className="mb-8 sm:mb-10 lg:mb-12 relative">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C9A864] font-body mb-2 sm:mb-3 block">
                    Explore
                </span>

                <div className="flex items-end justify-between flex-wrap gap-3 sm:gap-4">
                    <h3 className="font-heading text-[#F0EAD8] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight relative">
                        The Full Collection
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute -bottom-1.5 sm:-bottom-2 left-0 h-[2px] w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-[#C9A864] to-transparent origin-left"
                        />
                    </h3>

                    <span className="font-body text-[#F0EAD8]/40 text-[10px] sm:text-xs uppercase tracking-wider pb-0.5 sm:pb-1">
                        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                    </span>
                </div>

                <p className="font-body text-[#F0EAD8]/50 text-xs sm:text-sm mt-3 sm:mt-4 max-w-md">
                    Every scent we carry, gathered in one place — refine by family, gender, or form to find your own.
                </p>
            </div>

            {filtered.length === 0 ? (
                <div className="w-full py-16 sm:py-20 lg:py-24 flex items-center justify-center">
                    <span className="font-body text-[#F0EAD8]/30 text-xs sm:text-sm">No products match these filters.</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {filtered.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            productImages={productImages}
                            ratings={ratings}
                            productVariants={productVariants}
                            offers={offers}
                            productOffers={productOffers}
                            index={index}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
