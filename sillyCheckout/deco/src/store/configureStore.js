import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { checkoutReducer } from '../features/checkout/reducer';
// ... другие редьюсеры

export function configureStore({ services, router, preloadedState }) {
  const rootReducer = combineReducers({
    checkout: checkoutReducer,
    // cart, user, ...
  });

  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk.withExtraArgument({ ...services, router }))
  );
}
