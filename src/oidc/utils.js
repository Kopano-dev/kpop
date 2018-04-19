import settings from './settings';

export function isSilentRefreshRequest() {
  return window.location.href.indexOf(settings.silentRedirectURL) === 0;
}

export function isCallbackRequest() {
  return window.location.href.indexOf(settings.callbackURL) === 0;
}
