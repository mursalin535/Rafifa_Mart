const { canTransition } = require('../services/orderStatus');

describe('canTransition (order status rules)', () => {
  test('pending থেকে confirmed-এ যাওয়া যায়', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true);
  });

  test('confirmed থেকে shipped-এ যাওয়া যায়', () => {
    expect(canTransition('confirmed', 'shipped')).toBe(true);
  });

  test('shipped থেকে delivered-এ যাওয়া যায়', () => {
    expect(canTransition('shipped', 'delivered')).toBe(true);
  });

  test('delivered থেকে pending-এ ফেরা যায় না', () => {
    expect(canTransition('delivered', 'pending')).toBe(false);
  });

  test('ধাপ টপকানো যায় না (pending থেকে shipped)', () => {
    expect(canTransition('pending', 'shipped')).toBe(false);
  });

  test('অচেনা status দিলে false', () => {
    expect(canTransition('pending', 'abc')).toBe(false);
  });
});