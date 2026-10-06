import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Get_customer } from '../Server/customer';
import { Get_product_by_id, Get_variants } from '../Server/product';
import { Get_product_images } from '../Server/product_image';
import { Get_ratings } from '../Server/rating';
import { Get_all_product_offers, Get_offers } from '../Server/offer';

const TAG_COLORS = {
  atar: '#C9A864',
  spray: '#8FB3D9',
  amber: '#D98E3A',
  woody: '#8A6A3C',
  floral: '#D98FB0',
  citrusy: '#B7C95A',
  gourmand: '#C77B4E',
  fresh: '#5FB3B0',
  male: '#6E9BC9',
  female: '#D98FB0',
};

function getTagColor(tag) {
  return TAG_COLORS[tag?.toLowerCase()] || '#C9A864';
}

export default function ProductDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [reviewers, setReviewers] = useState({});
  const [reviewersLoading, setReviewersLoading] = useState(true);

  const [quantities, setQuantities] = useState({});

  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [localExtraReviews, setLocalExtraReviews] = useState([]);

  const [selectedPackagingType, setSelectedPackagingType] = useState('atar');

  const state = location.state;
  const productId = Number(id);

  const [fetchedData, setFetchedData] = useState(null);
  const [fetching, setFetching] = useState(false);

  const hasStateData = state?.products?.length > 0;

  const {
    products: stateProducts = [],
    productImages: stateProductImages = [],
    ratings: stateRatings = [],
    productVariants: stateProductVariants = [],
    offers: stateOffers = [],
    productOffers: stateProductOffers = [],
  } = state || {};

  const products = hasStateData ? stateProducts : (fetchedData?.products ?? []);
  const productImages = hasStateData ? stateProductImages : (fetchedData?.productImages ?? []);
  const ratings = hasStateData ? stateRatings : (fetchedData?.ratings ?? []);
  const productVariants = hasStateData ? stateProductVariants : (fetchedData?.productVariants ?? []);
  const offers = hasStateData ? stateOffers : (fetchedData?.offers ?? []);
  const productOffers = hasStateData ? stateProductOffers : (fetchedData?.productOffers ?? []);

  const product = products.find(p => p.id === productId);
  const product_images = productImages.filter(img => img.product_id === productId);
  const product_ratings = ratings.filter(r => r.product_id === productId);

  const raw_product_variants = productVariants.filter(v => v.product_id === productId);

  const availablePackagingTypes = [...new Set(raw_product_variants.map(v => v.packaging_type))].filter(Boolean);

  const activeTabVariants = raw_product_variants
    .filter(v => v.packaging_type === selectedPackagingType)
    .sort((a, b) => a.volume_ml - b.volume_ml);

  const linked_offer = productOffers.find(po => po.product_id === productId);
  const active_offer = linked_offer ? offers.find(o => o.id === linked_offer.offer_id) : null;

  const primary_image = product_images.find(img => img.is_primary) || product_images[0];

  const avgRating = product_ratings.length > 0
    ? product_ratings.reduce((sum, r) => sum + r.rating, 0) / product_ratings.length
    : null;

  useEffect(() => {
    if (hasStateData || fetchedData) return;
    let cancelled = false;
    async function fetchProductData() {
      setFetching(true);
      try {
        const [productRes, imagesRes, ratingsRes, variantsRes, productOffersRes, offersRes] = await Promise.all([
          Get_product_by_id(productId),
          Get_product_images(productId),
          Get_ratings(productId),
          Get_variants(productId),
          Get_all_product_offers(),
          Get_offers(),
        ]);
        if (cancelled) return;
        const productData = productRes?.data ? [productRes.data] : (Array.isArray(productRes) ? productRes : productRes?.data ?? []);
        setFetchedData({
          products: productData,
          productImages: imagesRes?.data ?? (Array.isArray(imagesRes) ? imagesRes : []),
          ratings: ratingsRes?.data ?? (Array.isArray(ratingsRes) ? ratingsRes : []),
          productVariants: variantsRes?.data ?? (Array.isArray(variantsRes) ? variantsRes : []),
          productOffers: productOffersRes?.data ?? (Array.isArray(productOffersRes) ? productOffersRes : []),
          offers: offersRes?.data ?? (Array.isArray(offersRes) ? offersRes : []),
        });
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      } finally {
        if (!cancelled) setFetching(false);
      }
    }
    fetchProductData();
    return () => { cancelled = true; };
  }, [productId, hasStateData, fetchedData]);

  useEffect(() => {
    async function fetchReviewers() {
      if (product_ratings.length === 0) {
        setReviewersLoading(false);
        return;
      }
      try {
        const uniqueCustomerIds = [...new Set(product_ratings.map(r => r.customer_id))];
        const results = await Promise.all(
          uniqueCustomerIds.map(async (customerId) => {
            const res = await Get_customer(customerId);
            const customerData = Array.isArray(res) ? res[0] : res?.data ?? res;
            return { customerId, customerData };
          })
        );
        const reviewersMap = {};
        results.forEach(({ customerId, customerData }) => {
          reviewersMap[customerId] = customerData;
        });
        setReviewers(reviewersMap);
      } catch (err) {
        console.error('Failed to fetch reviewers:', err);
      } finally {
        setReviewersLoading(false);
      }
    }
    fetchReviewers();
  }, [productId, product_ratings]);

  if (fetching && !product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/50 text-sm">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/50 text-sm">Product not found.</span>
      </div>
    );
  }

  function getVariantPrice(variant) {
    if (!variant) return { price: null, original: null };
    if (active_offer) {
      const discounted = active_offer.discount_type === 'percentage'
        ? Math.round(variant.price * (1 - active_offer.discount_value / 100))
        : Math.max(0, Math.round(variant.price - active_offer.discount_value));
      return { price: discounted, original: variant.price };
    }
    return { price: variant.price, original: null };
  }

  function updateQuantity(variantId, delta) {
    setQuantities(prev => {
      const current = prev[variantId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [variantId]: next };
    });
  }

  const orderItems = raw_product_variants
    .filter(v => (quantities[v.id] || 0) > 0)
    .map(v => {
      const { price } = getVariantPrice(v);
      const qty = quantities[v.id];
      return {
        variant_id: v.id,
        packaging_type: v.packaging_type,
        volume_ml: v.volume_ml,
        quantity: qty,
        unit_price: price,
        subtotal: price * qty,
      };
    });

  const variantsSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const atarCount = orderItems.filter(i => i.packaging_type === 'atar').reduce((s, i) => s + i.quantity, 0);
  const sprayCount = orderItems.filter(i => i.packaging_type === 'spray').reduce((s, i) => s + i.quantity, 0);

  function handleSubmitReview() {
    if (authLoading) return;

    if (!user) {
      navigate('/login', { state: { redirectTo: `/product-details/${productId}` } });
      return;
    }

    if (newRating === 0) return;

    const reviewInfo = {
      product_id: productId,
      customer_id: user.id,
      rating: newRating,
      comment: newComment,
    };

    console.log('New review:', reviewInfo);

    setLocalExtraReviews(prev => [
      ...prev,
      { id: `local-${Date.now()}`, customer_id: user.id, rating: newRating, comment: newComment },
    ]);
    setReviewers(prev => ({ ...prev, [user.id]: user }));
    setNewRating(0);
    setNewComment('');
  }

  function handleProceed() {
    if (authLoading) return;

    if (!user) {
      navigate('/login', { state: { redirectTo: `/product-details/${productId}` } });
      return;
    }

    if (orderItems.length === 0) return;

    navigate('/checkout', {
      state: {
        customer: { id: user.id, name: user.name, email: user.email },
        product: { id: product.id, name: product.name, description: product.description },
        order_items: orderItems,
        variants_subtotal: variantsSubtotal,
        grand_total: variantsSubtotal,
      },
    });
  }

  const allReviews = [...product_ratings, ...localExtraReviews];
  const marqueeReviews = allReviews.length > 0 ? [...allReviews, ...allReviews] : [];

  return (
    <>
    <div className='w-full h-[13vh]'/>
    <div className="w-full h-screen bg-[#0a0f0c] overflow-hidden flex flex-col">
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-8 pt-24 px-6 lg:px-10 pb-8 overflow-hidden min-h-0">

        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[35%] min-w-0 h-full overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 flex flex-col gap-6"
        >
          <div className="border border-[#C9A864]/10 bg-[#0d1410] p-7 rounded-sm mt-1">
            <h2
              className="font-heading text-3xl mt-4 mb-4 bg-clip-text text-transparent bg-[length:200%_100%]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              Description
            </h2>
            <p className="font-body text-[#F0EAD8]/70 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags + Dual Aura */}
          <div className="border border-[#C9A864]/10 bg-gradient-to-br from-[#1a2b20] via-[#13201A] to-[#0a0f0c] p-7 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A864]/15 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3" />
            <div className="relative z-10 flex flex-wrap gap-3">
              {[product.perfume_for, product.perfume_type].filter(Boolean).map((tag, i) => {
                const color = getTagColor(tag);
                return (
                  <motion.span
                    key={i}
                    animate={{
                      boxShadow: [
                        `0 0 6px ${color}4D, 0 0 0px ${color}00`,
                        `0 0 18px ${color}B3, 0 0 30px ${color}4D`,
                        `0 0 6px ${color}4D, 0 0 0px ${color}00`,
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                    className="text-sm uppercase tracking-widest px-4 py-2.5 rounded-sm bg-[#0a0f0c]/40 font-heading"
                    style={{ color, borderWidth: '1px', borderStyle: 'solid', borderColor: `${color}80` }}
                  >
                    {tag}
                  </motion.span>
                );
              })}
            </div>
            {/* Dual Aura — Atar + Spray */}
            <div className="absolute -bottom-6 -right-6 w-28 h-28 pointer-events-none">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(circle, #C9A864 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{ background: 'radial-gradient(circle, #8FB3D9 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
            </div>
          </div>

          <div className="border border-[#C9A864]/10 bg-[#0d1410] p-7 rounded-sm relative">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body mb-4 block">
              Reviews ({allReviews.length})
            </span>

            {reviewersLoading ? (
              <span className="font-body text-[#F0EAD8]/30 text-xs">Loading reviews...</span>
            ) : allReviews.length === 0 ? (
              <span className="font-body text-[#F0EAD8]/30 text-xs">No reviews yet. Be the first!</span>
            ) : (
              <div className="relative overflow-hidden h-[200px]">
                <motion.div
                  animate={{ y: ['0%', '-50%'] }}
                  transition={{ duration: allReviews.length * 4, repeat: Infinity, ease: 'linear' }}
                  className="flex flex-col gap-3"
                >
                  {marqueeReviews.map((rating, idx) => {
                    const reviewer = reviewers[rating.customer_id];
                    return (
                      <div key={`${rating.id}-${idx}`} className="border-b border-[#F0EAD8]/5 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          {reviewer?.profile_pic ? (
                            <img
                              src={reviewer.profile_pic}
                              alt={reviewer.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#C9A864]/40">
                              <span className="text-[#C9A864] text-[10px]">{reviewer?.name?.[0]?.toUpperCase() || '?'}</span>
                            </div>
                          )}
                          <span className="font-heading text-[#F0EAD8] text-sm">{reviewer?.name || 'Anonymous'}</span>
                          <span className="text-[#C9A864] text-xs ml-auto">{rating.rating} ★</span>
                        </div>
                        <p className="font-body text-[#F0EAD8]/50 text-xs">{rating.comment}</p>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </div>

          <div
            className="p-7 rounded-sm relative overflow-hidden border border-[#C9A864]/20 mb-1"
            style={{
              background: 'linear-gradient(135deg, rgba(92,26,26,0.35) 0%, rgba(13,20,16,0.9) 45%, rgba(28,77,58,0.35) 100%)',
            }}
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#011863]/30 rounded-full blur-[50px] -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1C4D3A]/40 rounded-full blur-[50px] translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.2em] text-[#F0EAD8] font-body mb-3 block">
                Leave a Review
              </span>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-xl transition-colors"
                    style={{ color: star <= (hoverRating || newRating) ? '#C9A864' : 'rgba(240,234,216,0.15)' }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this fragrance..."
                rows={3}
                className="w-full bg-[#0a0f0c]/60 border border-[#F0EAD8]/15 px-3 py-2 text-sm text-[#F0EAD8] font-body rounded-sm resize-none mb-3"
              />
              <button
                onClick={handleSubmitReview}
                disabled={newRating === 0}
                className="w-full font-body text-xs uppercase tracking-widest py-2.5 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{
                  background: 'linear-gradient(90deg, #5C1A1A, #1C4D3A)',
                  color: '#F0EAD8',
                  border: '1px solid rgba(240,234,216,0.2)',
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </motion.div>

        {/* Center Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full lg:w-[30%] min-w-0 h-full flex flex-col items-center justify-center gap-8"
        >
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body mb-2 block">
              {product.perfume_type || 'Perfume'}
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h1 className="font-heading text-[#F0EAD8] text-3xl lg:text-4xl capitalize leading-tight">
                {product.name}
              </h1>
              {avgRating != null && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24"
                      fill={i < Math.round(avgRating) ? '#C9A864' : 'none'}
                      stroke="#C9A864" strokeWidth="1">
                      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 17.5 5.5 21.5 7 14.5 2 9.5 9 9" />
                    </svg>
                  ))}
                  <span className="text-[#F0EAD8]/40 text-xs font-body ml-1">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative w-[260px] h-[260px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #C9A864, transparent 30%, transparent 70%, #C9A864, #F0EAD8)',
                padding: '3px',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#0a0f0c]" />
            </motion.div>

            <div className="absolute inset-[10px] rounded-full border border-[#C9A864]/25" />

            <div className="absolute inset-[16px] rounded-full overflow-hidden bg-[#0d1410] flex items-center justify-center">
              {primary_image ? (
                <img src={primary_image.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-body text-[#F0EAD8]/20 text-xs">No image</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-[35%] min-w-0 h-full overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 flex flex-col gap-6"
        >
          <motion.div className="w-full h-[2vh]" />

          {/* Marketing Heading */}
          <motion.div className='w-full h-[1vh]'/>
          <div className="px-1">
            <h2
              className="font-heading text-2xl leading-snug mb-3 bg-clip-text text-transparent bg-[length:200%_100%]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #C9A864 0%, #F0EAD8 30%, #C9A864 60%, #F0EAD8 100%)',
                animation: 'shimmer 5s linear infinite',
              }}
            >
              Atar or Spray? Choose your signature scent style
            </h2>
            <p className="font-body text-[12px] text-[#F0EAD8]/50 leading-relaxed">
              Drenched in{' '}
              <span className="font-heading text-[13px]" style={{ color: '#C9A864' }}>Atar</span>{' '}
              for that deep, unforgettable aura — or mist it on as{' '}
              <span className="font-heading text-[13px]" style={{ color: '#8FB3D9' }}>Spray</span>{' '}
              for effortless elegance on the go. Mix volumes. Stack forms. Build your collection exactly the way you want it.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3">
            {['atar', 'spray'].map((cat) => {
              const color = getTagColor(cat);
              const active = selectedPackagingType === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPackagingType(cat)}
                  className="flex-1 py-3 rounded-[12px] text-sm uppercase tracking-[0.15em] font-heading border transition-all duration-300"
                  style={{
                    borderColor: active ? color : 'rgba(240,234,216,0.12)',
                    backgroundColor: active ? `${color}15` : 'transparent',
                    color: active ? color : 'rgba(240,234,216,0.4)',
                    boxShadow: active ? `0 0 16px ${color}30` : 'none',
                  }}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>

          {/* Volume List */}
          <div className="min-w-0 relative border border-[#C9A864]/15 bg-[#0d1410] p-6 rounded-[16px] shadow-[0_0_25px_rgba(201,168,100,0.08)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A864]/10 rounded-full blur-[50px] pointer-events-none" />

            <div className="flex flex-col gap-3 relative z-10">
              {activeTabVariants.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-[#F0EAD8]/30 text-sm font-body">
                    No {selectedPackagingType} variants available for this product.
                  </span>
                </div>
              ) : (
                activeTabVariants.map((variant) => {
                  const { price, original } = getVariantPrice(variant);
                  const qty = quantities[variant.id] || 0;
                  return (
                    <div
                      key={variant.id}
                      className="min-w-0 flex items-center justify-between gap-3 rounded-[12px] border px-4 py-3 transition-all duration-300"
                      style={{
                        borderColor: qty > 0 ? getTagColor(selectedPackagingType) : 'rgba(240,234,216,0.12)',
                        backgroundColor: qty > 0 ? `${getTagColor(selectedPackagingType)}10` : 'rgba(255,255,255,0.02)',
                        boxShadow: qty > 0 ? `0 0 14px ${getTagColor(selectedPackagingType)}20` : 'none',
                      }}
                    >
                      <div className="min-w-0">
                        <span className="block font-heading text-sm text-[#F0EAD8]">{variant.volume_ml}ml</span>
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <span className="text-sm font-body" style={{ color: getTagColor(selectedPackagingType) }}>৳{price}</span>
                          {original != null && (
                            <span className="text-xs font-body text-[#F0EAD8]/25 line-through">৳{original}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQuantity(variant.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0EAD8]/15 text-[#F0EAD8]/60 transition-all duration-200 hover:border-[#C9A864] hover:text-[#C9A864]"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-body text-sm text-[#F0EAD8]">{qty}</span>
                        <button
                          onClick={() => updateQuantity(variant.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0EAD8]/15 text-[#F0EAD8]/60 transition-all duration-200 hover:border-[#C9A864] hover:text-[#C9A864]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary */}
          {orderItems.length > 0 && (
            <div
              className="min-w-0 border border-[#C9A864]/15 bg-[#0d1410] rounded-[16px] p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between text-xs font-body">
                {atarCount > 0 && (
                  <span style={{ color: '#C9A864' }}>Atar: {atarCount} item{atarCount !== 1 ? 's' : ''}</span>
                )}
                {sprayCount > 0 && (
                  <span style={{ color: '#8FB3D9' }}>Spray: {sprayCount} item{sprayCount !== 1 ? 's' : ''}</span>
                )}
                {atarCount > 0 && sprayCount === 0 && <span />}
                {sprayCount > 0 && atarCount === 0 && <span />}
              </div>

              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,100,0.3), transparent)' }} />

              <div className="flex items-center justify-between">
                <span className="font-body text-[#F0EAD8]/70 text-xs uppercase tracking-[0.2em]">
                  Total ({totalItems} item{totalItems !== 1 ? 's' : ''})
                </span>
                <span className="font-heading text-[#C9A864] text-2xl">৳{variantsSubtotal}</span>
              </div>
            </div>
          )}

          {/* Proceed button */}
          <motion.button
            onClick={handleProceed}
            disabled={orderItems.length === 0}
            whileHover={{ letterSpacing: '0.15em', scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="mb-1 w-full shrink-0 rounded-[14px] py-4 text-sm font-heading uppercase tracking-[0.2em] text-[#0a0f0c] shadow-[0_0_20px_rgba(201,168,100,0.12)] disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
          >
            Proceed
          </motion.button>
        </motion.div>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(201, 168, 100, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(201, 168, 100, 0.5);
        }
      `}</style>
    </div>
    </>
  );
}
