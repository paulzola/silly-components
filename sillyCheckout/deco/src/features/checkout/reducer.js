import { ActionType } from './actions';

const initialState = {
  promoInput: '',
  promo: null,
  loading: false,
  error: null,
};

const handlers = {
  [ActionType.PROMO_INPUT_CHANGED]: (state, { code }) => ({
    ...state,
    promoInput: code,
  }),
  [ActionType.PROMO_RESOLVED]: (state, { data }) => ({
    ...state,
    promo: data,
  }),
  [ActionType.SUBMIT_STARTED]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [ActionType.SUBMIT_FAILED]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [ActionType.VALIDATION_FAILED]: (state, { error }) => ({
    ...state,
    error,
  }),
  [ActionType.ORDER_CREATED]: (state) => ({
    ...state,
    loading: false,
    error: null,
    promoInput: '',
    promo: null,
  }),
};

export function checkoutReducer(state = initialState, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
