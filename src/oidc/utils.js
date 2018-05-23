import settings from './settings';

export function isSilentRefreshRequest() {
  return window.location.href.indexOf(settings.silentRedirectURL) === 0;
}

export function isCallbackRequest() {
  return window.location.href.indexOf(settings.callbackURL) === 0;
}

/**
 * Converts OIDC profile object to match the requirements to work as userShape
 */
export function profileAsUserShape(profile) {
  return {
    displayName: profile.name,
    givenName: profile.given_name,
    surname: profile.family_name,
    id: profile.sub,
  };
}
