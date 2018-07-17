import { getUserManagerMetadata } from './usermanager';

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
      console.info('oidc user sign-out handler called'); // eslint-disable-line no-console
      return userManager.signoutRedirect({/* TODO(longsleep): Add state */});
    };
  }

  return r;
}
