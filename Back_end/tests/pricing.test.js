// Database mock: test চলার সময় আসল MySQL-এ connect হবে না
jest.mock('../DataBase/Database', () => ({
  query: jest.fn(),
}));

const db = require('../DataBase/Database');
const {
  priceWithOffer,
  bestPrice,
  getActiveOffersByProduct,
} = require('../services/pricing');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('priceWithOffer', () => {
  test('percentage offer দাম কমায়', () => {
    const offer = { discount_type: 'percentage', discount_value: 10 };
    expect(priceWithOffer(1000, offer)).toBe(900);
  });

  test('flat offer দাম কমায়', () => {
    const offer = { discount_type: 'flat', discount_value: 100 };
    expect(priceWithOffer(1000, offer)).toBe(900);
  });

  test('offer না থাকলে আসল দামই থাকে', () => {
    expect(priceWithOffer(1000, null)).toBe(1000);
  });
});

describe('bestPrice', () => {
  test('একাধিক offer থাকলে সবচেয়ে কম দাম নেয়', () => {
    const offers = [
      { discount_type: 'percentage', discount_value: 10 }, // 900
      { discount_type: 'flat', discount_value: 200 },      // 800
    ];
    expect(bestPrice(1000, offers)).toBe(800);
  });
});

describe('getActiveOffersByProduct (DB mocked)', () => {
  test('DB-র rows product_id অনুযায়ী group করে', async () => {
    db.query.mockResolvedValue([[
      { product_id: 1, id: 5, discount_type: 'flat', discount_value: 100 },
    ]]);

    const map = await getActiveOffersByProduct([1]);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(map.get(1)).toHaveLength(1);
  });

  test('product list খালি হলে DB-তে query যায় না', async () => {
    const map = await getActiveOffersByProduct([]);

    expect(db.query).not.toHaveBeenCalled();
    expect(map.size).toBe(0);
  });
});
