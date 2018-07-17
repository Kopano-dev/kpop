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
