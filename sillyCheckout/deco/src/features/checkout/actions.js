import { calculateOrderTotal } from '../../domain/pricing';
import { validateOrder } from '../../domain/orderValidation';
import { selectCartItems, selectUser } from './selectors';
import { selectPromo } from './selectors';

export const ActionType = {
  PROMO_INPUT_CHANGED: 'checkout/promoInputChanged',
  PROMO_RESOLVED: 'checkout/promoResolved',
  SUBMIT_STARTED: 'checkout/submitStarted',
  SUBMIT_FAILED: 'checkout/submitFailed',
  ORDER_CREATED: 'checkout/orderCreated',
  VALIDATION_FAILED: 'checkout/validationFailed',
};

let promoRequestId = 0;

export const promoChanged = (code) =>
  async (dispatch, getState, { checkoutService }) => {
    dispatch({ type: ActionType.PROMO_INPUT_CHANGED, code });
    if (code.length < 4) {
      dispatch({ type: ActionType.PROMO_RESOLVED, data: null });
      return;
    }
    const myId = ++promoRequestId;
    const data = await checkoutService.fetchPromo(code);
    if (myId !== promoRequestId) return; // устаревший ответ
    dispatch({ type: ActionType.PROMO_RESOLVED, data });
  };

export const submitCheckout = () =>
  async (dispatch, getState, { checkoutService, router }) => {
    const state = getState();
    const items = selectCartItems(state);
    const user = selectUser(state);
    const promo = selectPromo(state);

    const total = calculateOrderTotal({ items, promo, isVip: user.isVip });
    const validation = validateOrder({ items, total, user });

    if (!validation.ok) {
      dispatch({
        type: ActionType.VALIDATION_FAILED,
        error: validation.error,
      });
      return;
    }

    dispatch({ type: ActionType.SUBMIT_STARTED });
    try {
      const order = await checkoutService.submitOrder({
        items,
        total,
        promoCode: promo?.code,
        userId: user.id,
      });
      dispatch({ type: ActionType.ORDER_CREATED, payload: order });
      router.push(`/orders/${order.id}`);
    } catch {
      dispatch({ type: ActionType.SUBMIT_FAILED, error: 'NETWORK_ERROR' });
    }
  };
