import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

import '../styles/index.css';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(new URL(`${window.location.origin}/sw.js`), {
        type: 'module',
      });
      if (process.env.NODE_ENV === 'development') {
        if (registration.installing) {
          console.log('Service Worker Installing');
        } else if (registration.waiting) {
          console.log('Service Worker Installed');
        } else if (registration.active) {
          console.log('Service Worker Active');
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Registration Failed with ${err}`);
      }
    }
  }
};

registerServiceWorker();
