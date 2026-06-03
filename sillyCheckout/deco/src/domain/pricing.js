const BULK_DISCOUNT_THRESHOLD = 10;
const BULK_DISCOUNT_RATE = 0.1;
const VIP_DISCOUNT_RATE = 0.05;

export function calculateItemPrice(item) {
  const base = item.price * item.qty;
  const discount = item.qty >= BULK_DISCOUNT_THRESHOLD
    ? base * BULK_DISCOUNT_RATE
    : 0;
  return base - discount;
}

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
}

export function applyDiscounts(subtotal, { promo, isVip }) {
  let total = subtotal;
  if (promo?.discount) total *= (1 - promo.discount);
  if (isVip) total *= (1 - VIP_DISCOUNT_RATE);
  return total;
}

export function calculateOrderTotal({ items, promo, isVip }) {
  return applyDiscounts(calculateSubtotal(items), { promo, isVip });
}