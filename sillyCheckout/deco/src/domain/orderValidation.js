const HIGH_VALUE_THRESHOLD = 10000;

export const ValidationError = {
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  EMPTY_CART: 'EMPTY_CART',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  COUNTRY_RESTRICTED: 'COUNTRY_RESTRICTED',
};

export function validateOrder({ items, total, user }) {
  if (!user.email) {
    return { ok: false, error: ValidationError.EMAIL_REQUIRED };
  }
  if (items.length === 0) {
    return { ok: false, error: ValidationError.EMPTY_CART };
  }
  if (total > HIGH_VALUE_THRESHOLD && !user.verified) {
    return { ok: false, error: ValidationError.VERIFICATION_REQUIRED };
  }
  const restricted = items.find(
    i => i.restrictedCountries?.includes(user.country)
  );
  if (restricted) {
    return {
      ok: false,
      error: ValidationError.COUNTRY_RESTRICTED,
      item: restricted,
    };
  }
  return { ok: true };
}
