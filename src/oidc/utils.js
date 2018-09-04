import settings from './settings';

export function isSilentRefreshRequest() {
  return window.location.href.indexOf(settings.silentRedirectURL) === 0;
}

export function isSigninCallbackRequest() {
  return window.location.href.indexOf(settings.redirectURL) === 0;
}

export function isPostSignoutCallbackRequest() {
  return window.location.href.indexOf(settings.postLogoutRedirectURL) === 0;
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
