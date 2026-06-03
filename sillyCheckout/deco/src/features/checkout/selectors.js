import { createSelector } from 'reselect';
import { calculateOrderTotal } from '../../domain/pricing';

export const selectCartItems = (state) => state.cart.items;
export const selectUser = (state) => state.user;
export const selectPromo = (state) => state.checkout.promo;
export const selectPromoInput = (state) => state.checkout.promoInput;

export const selectCheckoutStatus = (state) => ({
  loading: state.checkout.loading,
  error: state.checkout.error,
});

export const selectOrderTotal = createSelector(
  [selectCartItems, selectPromo, selectUser],
  (items, promo, user) => calculateOrderTotal({
    items,
    promo,
    isVip: user.isVip,
  })
);
