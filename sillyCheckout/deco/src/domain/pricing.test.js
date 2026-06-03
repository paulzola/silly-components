import {
  calculateItemPrice,
  calculateSubtotal,
  calculateOrderTotal,
} from './pricing';

describe('pricing', () => {
  test('item without bulk discount', () => {
    expect(calculateItemPrice({ price: 100, qty: 5 })).toBe(500);
  });

  test('bulk discount applies from 10 items', () => {
    expect(calculateItemPrice({ price: 100, qty: 10 })).toBe(900);
  });

  test('subtotal sums all items', () => {
    const items = [
      { price: 100, qty: 2 },
      { price: 50, qty: 4 },
    ];
    expect(calculateSubtotal(items)).toBe(400);
  });

  test('promo discount applies to total', () => {
    const total = calculateOrderTotal({
      items: [{ price: 100, qty: 1 }],
      promo: { discount: 0.2 },
      isVip: false,
    });
    expect(total).toBe(80);
  });

  test('vip and promo stack multiplicatively', () => {
    const total = calculateOrderTotal({
      items: [{ price: 1000, qty: 1 }],
      promo: { discount: 0.1 },
      isVip: true,
    });
    // 1000 * 0.9 * 0.95
    expect(total).toBe(855);
  });
});
