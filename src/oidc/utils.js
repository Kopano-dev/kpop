import settings from './settings';
import { getUserManagerMetadata } from './usermanager';

export function isSilentRefreshRequest() {
  return window.location.href.indexOf(settings.silentRedirectURL) === 0;
}

export function isSigninCallbackRequest() {
  return window.location.href.indexOf(settings.redirectURL) === 0;
}

export function isPostSignoutCallbackRequest() {
  return window.location.href.indexOf(settings.postLogoutRedirectURL) === 0;
}

/**
 * Converts OIDC profile object to match the requirements to work as userShape.
 */
export function profileAsUserShape(profile, userManager) {
  const metadata = getUserManagerMetadata(userManager);
  if (!metadata) {
    throw new Error('oidc has no meta data');
  }

  const r = {
    displayName: profile.name,
    givenName: profile.given_name,
    surname: profile.family_name,
    mail: profile.email,

    guid: `${metadata.issuer}/${profile.sub}`,
  };

  // NOTE(longsleep): Sign out support is optional. Check if the issuer has
  // support and register handler if so. Otherwise the handler is undefined.
  if (metadata.end_session_endpoint) {
    r.signoutHandler = async () => {
      console.info('oidc sign-out handler called'); // eslint-disable-line no-console
      return userManager.signoutRedirect({/* TODO(longsleep): Add state */});
    };
  }

  return r;
}
