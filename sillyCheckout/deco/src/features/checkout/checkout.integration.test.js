import { submitCheckout } from './actions';
import { configureStore } from '../../store/configureStore';

describe('checkout integration', () => {
  function setup({ submitOrder, items, user }) {
    const checkoutService = {
      fetchPromo: jest.fn(),
      submitOrder: jest.fn(submitOrder),
    };
    const router = { push: jest.fn() };
    const store = configureStore({
      services: { checkoutService },
      router,
      preloadedState: {
        cart: { items },
        user,
        checkout: { promoInput: '', promo: null, loading: false, error: null },
      },
    });
    return { store, checkoutService, router };
  }

  test('submits order and navigates on success', async () => {
    const { store, checkoutService, router } = setup({
      submitOrder: async () => ({ id: 'order-1' }),
      items: [{ id: 1, price: 100, qty: 1 }],
      user: { id: 'u1', email: 'a@b.com', verified: true, country: 'RU' },
    });

    await store.dispatch(submitCheckout());

    expect(checkoutService.submitOrder).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/orders/order-1');
    expect(store.getState().checkout.loading).toBe(false);
  });

  test('fails validation without submitting', async () => {
    const { store, checkoutService } = setup({
      submitOrder: jest.fn(),
      items: [],
      user: { id: 'u1', email: 'a@b.com', verified: true, country: 'RU' },
    });

    await store.dispatch(submitCheckout());

    expect(checkoutService.submitOrder).not.toHaveBeenCalled();
    expect(store.getState().checkout.error).toBe('EMPTY_CART');
  });
});
