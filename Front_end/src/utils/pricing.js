// Server (Back_end/services/pricing.js) এর সাথে হুবহু একই নিয়ম।
// এই হিসাব বদলালে দুই জায়গাতেই বদলাতে হবে।

export function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

// ৳100.00 নয়, ৳100; দশমিক থাকলে ২ ঘর
export function formatMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '0';
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

// একটা offer প্রয়োগ করলে চূড়ান্ত দাম
export function priceWithOffer(basePrice, offer) {
  const base = roundMoney(basePrice);
  if (!offer) return base;

  const value = Number(offer.discount_value);
  if (!Number.isFinite(value) || value <= 0) return base;

  let discounted;
  if (offer.discount_type === 'percentage') {
    discounted = Math.round(base * (1 - Math.min(value, 100) / 100));
  } else if (offer.discount_type === 'flat') {
    discounted = Math.max(0, Math.round(base - value));
  } else {
    return base;
  }

  // discount কখনো দাম বাড়াতে পারবে না
  return Math.min(discounted, base);
}

// একাধিক offer থাকলে যেটা সবচেয়ে কম দাম দেয় সেই offer (না থাকলে null)
export function bestOffer(basePrice, offers) {
  let best = null;
  let bestP = roundMoney(basePrice);
  for (const offer of offers || []) {
    const p = priceWithOffer(basePrice, offer);
    if (p < bestP) {
      bestP = p;
      best = offer;
    }
  }
  return best;
}

// একাধিক offer থাকলে সবচেয়ে কম দাম
export function bestPrice(basePrice, offers) {
  return priceWithOffer(basePrice, bestOffer(basePrice, offers));
}

// কার্ডের ব্যাজ: −10% অথবা −৳50
export function offerLabel(offer) {
  if (!offer) return null;
  return offer.discount_type === 'percentage'
    ? `−${formatMoney(offer.discount_value)}%`
    : `−৳${formatMoney(offer.discount_value)}`;
}

// Collection কার্ডের "From" দাম: সবচেয়ে কম চূড়ান্ত দামের variant, শুধু চালু (is_active) offer ধরে
export function getProductPriceInfo(productVariants, offers, productOffers, productId) {
  const variants = (productVariants || []).filter(v => v.product_id === productId);
  if (variants.length === 0) {
    return { price: null, original: null, volumeMl: null, label: null };
  }

  const activeOffers = (productOffers || [])
    .filter(po => po.product_id === productId)
    .map(po => (offers || []).find(o => o.id === po.offer_id))
    .filter(o => o && Number(o.is_active) === 1);

  let best = null;
  for (const v of variants) {
    const base = roundMoney(v.price);
    const offer = bestOffer(v.price, activeOffers);
    const price = priceWithOffer(v.price, offer);
    if (!best || price < best.price || (price === best.price && base < best.base)) {
      best = { variant: v, base, offer, price };
    }
  }

  const discounted = best.price < best.base;
  return {
    price: best.price,
    original: discounted ? best.base : null,
    volumeMl: best.variant.volume_ml,
    label: discounted ? offerLabel(best.offer) : null,
  };
}