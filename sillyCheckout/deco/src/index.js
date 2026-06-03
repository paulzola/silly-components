import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHttpClient } from './services/httpClient';
import { createBrowserTokenStorage } from './services/tokenStorage';
import { createCheckoutService } from './services/checkoutService';
import { configureStore } from './store/configureStore';
import { browserRouter } from './router';
import { App } from './App';

const tokenStorage = createBrowserTokenStorage();
const httpClient = createHttpClient({
  baseUrl: '/api',
  getAuthToken: () => tokenStorage.get(),
});
const checkoutService = createCheckoutService({ httpClient });

const store = configureStore({
  services: { checkoutService, tokenStorage },
  router: browserRouter,
  preloadedState: window.__PRELOADED_STATE__,
});

ReactDOM.hydrate(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
