const db = require('../DataBase/Database');

// offer এখন চালু আছে কি না (o = offers table alias)
// valid_until-এর দিনটা পুরো দিনই চালু ধরা হয়
const ACTIVE_OFFER_CONDITION = `
  (o.valid_from IS NULL OR o.valid_from <= NOW())
  AND (o.valid_until IS NULL OR DATE(o.valid_until) >= CURDATE())
`;

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

// একটা offer প্রয়োগ করলে চূড়ান্ত দাম কত
function priceWithOffer(basePrice, offer) {
  const base = roundMoney(Number(basePrice));
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

// একাধিক offer থাকলে customer-এর জন্য সবচেয়ে কম দাম
function bestPrice(basePrice, offers) {
  let best = roundMoney(Number(basePrice));
  for (const offer of offers || []) {
    const p = priceWithOffer(basePrice, offer);
    if (p < best) best = p;
  }
  return best;
}

// product_id -> [চালু offer, ...]
async function getActiveOffersByProduct(productIds, conn = db) {
  const map = new Map();
  if (!productIds || productIds.length === 0) return map;

  const [rows] = await conn.query(
    `SELECT po.product_id, o.id, o.discount_type, o.discount_value
     FROM product_offers po
     JOIN offers o ON o.id = po.offer_id
     WHERE po.product_id IN (?) AND ${ACTIVE_OFFER_CONDITION}`,
    [productIds]
  );

  for (const row of rows) {
    if (!map.has(row.product_id)) map.set(row.product_id, []);
    map.get(row.product_id).push(row);
  }
  return map;
}

module.exports = {
  ACTIVE_OFFER_CONDITION,
  roundMoney,
  priceWithOffer,
  bestPrice,
  getActiveOffersByProduct,
};