import settings from './settings';

export function isSilentRefreshRequest() {
  return window.location.href.indexOf(settings.silentRedirectURL) === 0;
}

export function isSigninCallbackRequest() {
  return window.location.href.indexOf(settings.redirectURL) === 0;
}

export function isSigninPopupCallbackRequest() {
  return window.location.href.indexOf(settings.popupRedirectURL) === 0;
}

export function isPostSignoutCallbackRequest() {
  return window.location.href.indexOf(settings.postLogoutRedirectURL) === 0;
}

export function isPostSignoutPopupCallbackRequest() {
  return window.location.href.indexOf(settings.popupPostLogoutRedirectURL) === 0;
}

export async function resetHash() {
  const { location } = window;
  history.replaceState('', document.title, location.pathname + location.search);
}

export function blockAsyncProgress() {
  // Return a promise this gets neither resolved nor rejected. Any async code
  // which returns this promise is effectively blocked and will nether yield
  // any results.
  return new Promise(() => {}, () => {});
}

/* hasScope returns true if the provided user has any of the provided
 * scope, false otherwise.
 */
export function hasScope(user, ...scopes) {
  return _hasScopes(user, 'any', scopes);
}
/* hasScopes returns true if the provided user has all of the provided
 * scopes, false otherwise.
 */
export function hasScopes(user, ...scopes) {
  return _hasScopes(user, 'all', scopes);
}
function _hasScopes(user, mode='all', scopes=[]) {
  if (!user || !scopes) {
    return false;
  }

  const userScopes = user.scope.split(' ');
  for (const scope of scopes) {
    if (userScopes.indexOf(scope) >= 0) {
      if (mode === 'any') {
        return true;
      }
    } else {
      if (mode === 'all') {
        return false;
      }
    }
  }
  if (mode === 'all') {
    return true;
  }
  return false;
}

export function openPopupInAuthorityContext(userManager) {
  // NOTE(longsleep): To ensure that the openend popup is in the same browsing
  // context like the URL used for sign-in, this pre-opens the popup so it
  // avoids the get a blank browsing context created by oidc-client-js. This
  // fixes popup blocker issues when running as a PWA.
  const url = userManager.settings.authority + '/favicon.ico';
  return openPopupCentered(url, settings.popupWindowTarget, settings.popupWindowFeatures);
}

export function openPopupCentered(url, windowName, featuresString='width=600,height=600') {
  // Helper to open popup windows centered on the current screen.
  let targetWidth;
  let targetHeight;

  // Parse features.
  const features = featuresString.split(',');
  features.forEach(feature => {
    const [name, value] = feature.split('=', 2);
    switch (name) {
      case 'width':
        targetWidth = parseInt(value, 10);
        break;
      case 'height':
        targetHeight = parseInt(value, 10);
        break;
    }
  });
  if (!targetWidth || !targetHeight) {
    throw new Error('no width or height in features');
  }

  // Compute shit.
  let screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
  let screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
  let outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.documentElement.clientWidth;
  let outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : document.documentElement.clientHeight - 22;
  let left = parseInt(screenX + (outerWidth - targetWidth) / 2, 10);
  let right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10);
  features.push('left=' + left);
  features.push('top=' + right);

  // Open window.
  const popup = window.open(url, windowName, features.join(','));
  if (window.focus) {
    popup.focus();
  }

  return popup;
}
