import { validateOrder, ValidationError } from './orderValidation';

describe('validateOrder', () => {
  const validUser = {
    email: 'a@b.com',
    verified: true,
    country: 'RU',
  };
  const validItem = { id: 1, price: 100, qty: 1, restrictedCountries: [] };

  test('passes valid order', () => {
    const result = validateOrder({
      items: [validItem],
      total: 100,
      user: validUser,
    });
    expect(result.ok).toBe(true);
  });

  test('fails without email', () => {
    const result = validateOrder({
      items: [validItem],
      total: 100,
      user: { ...validUser, email: '' },
    });
    expect(result.error).toBe(ValidationError.EMAIL_REQUIRED);
  });

  test('fails for empty cart', () => {
    const result = validateOrder({
      items: [],
      total: 0,
      user: validUser,
    });
    expect(result.error).toBe(ValidationError.EMPTY_CART);
  });

  test('requires verification for high-value orders', () => {
    const result = validateOrder({
      items: [validItem],
      total: 15000,
      user: { ...validUser, verified: false },
    });
    expect(result.error).toBe(ValidationError.VERIFICATION_REQUIRED);
  });

  test('blocks restricted countries', () => {
    const item = { ...validItem, restrictedCountries: ['RU'] };
    const result = validateOrder({
      items: [item],
      total: 100,
      user: validUser,
    });
    expect(result.error).toBe(ValidationError.COUNTRY_RESTRICTED);
    expect(result.item).toBe(item);
  });
});
