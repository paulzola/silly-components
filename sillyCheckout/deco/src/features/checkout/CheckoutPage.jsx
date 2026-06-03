import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectOrderTotal,
  selectPromo,
  selectPromoInput,
  selectCheckoutStatus,
} from './selectors';
import { promoChanged, submitCheckout } from './actions';
import { CartItemsList } from './components/CartItemsList';
import { PromoInput } from './components/PromoInput';
import { DiscountLine } from './components/DiscountLine';
import { TotalLine } from './components/TotalLine';
import { ErrorMessage } from './components/ErrorMessage';
import { SubmitButton } from './components/SubmitButton';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectOrderTotal);
  const promo = useSelector(selectPromo);
  const promoInput = useSelector(selectPromoInput);
  const { loading, error } = useSelector(selectCheckoutStatus);

  return (
    <div>
      <h1>Оформление заказа</h1>
      <CartItemsList items={items} />
      <PromoInput
        value={promoInput}
        onChange={(code) => dispatch(promoChanged(code))}
      />
      {promo && <DiscountLine discount={promo.discount} />}
      <TotalLine total={total} />
      {error && <ErrorMessage code={error} />}
      <SubmitButton
        loading={loading}
        onClick={() => dispatch(submitCheckout())}
      />
    </div>
  );
}
