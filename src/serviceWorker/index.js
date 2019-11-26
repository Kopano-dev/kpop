// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

/*eslint-disable no-console*/

import {
  registerBeforeinstallPrompt,
} from '../pwa';

import {
  newContent,
  readyForOfflineUse,
  registrationError,
  registrationSuccess,
  isOfflineMode,
} from './actions';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// The following options need to be provided to successfully register the
// service worker. Useful values come from process.env.NODE_ENV and process.env
// process.env.PUBLIC_URL.
const defaultOptions = {
  env: undefined,
  publicUrl: undefined,
};

export default function register(store, options=defaultOptions) {
  return new Promise(resolve => {
    if (options.env === undefined || options.publicUrl === undefined) {
      throw new Error('invalid service worker invocation, missing env and publicUrl options');
    }

    if (!options.noInstallPrompt) {
      registerBeforeinstallPrompt(store);
    }

    if ('serviceWorker' in navigator) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(options.publicUrl, window.location);
      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on.
        console.warn('This web app has a service worker, but it is disabled as the origin is different.');
        resolve(null);
        return;
      }

      window.addEventListener('load', () => {
        const swUrl = `${options.publicUrl}/service-worker.js`;

        if (isLocalhost) {
          // This is running on localhost. Lets check if a service worker still exists or not.
          resolve(checkValidServiceWorker(swUrl, store));

          // Add some additional logging to localhost,
          navigator.serviceWorker.ready.then(() => {
            console.info('This web app is being served cache-first by a service worker.');
          });
        } else {
          // Is not local host. Just register service worker
          resolve(registerValidSW(swUrl, store));
        }
      });
    }
  });
}

function registerValidSW(swUrl, store) {
  return navigator.serviceWorker
    .register(swUrl)
    .then(async registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              console.debug('New content is available; please refresh.');
              store.dispatch(newContent());
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.debug('Content is cached for offline use.');
              store.dispatch(readyForOfflineUse());
            }
          }
        };
      };
      await store.dispatch(registrationSuccess(registration));
      return registration;
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
      store.dispatch(registrationError(error));
    });
}

function checkValidServiceWorker(swUrl, store) {
  // Check if the service worker can be found. If it can't reload the page.
  return fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        return registerValidSW(swUrl, store);
      }
    })
    .catch(() => {
      console.debug('No internet connection found. App is running in offline mode.');
      store.dispatch(isOfflineMode());
    });
}

export async function unregister() {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
