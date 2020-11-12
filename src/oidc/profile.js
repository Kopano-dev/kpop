import settings from './settings';
import { getUserManagerMetadata } from './usermanager';
import { openPopupInAuthorityContext } from './utils';
import { makeOIDCState } from './state';

/**
 * Converts OIDC profile object to match the requirements to work as userShape.
 */
export function profileAsUserShape(profile, userManager, idToken=null) {
  const metadata = getUserManagerMetadata(userManager);
  let issuer = null;
  if (metadata) {
    issuer = metadata.issuer;
  } else {
    if (idToken) {
      // Parse issuer from IDToken value.
      issuer = userManager._parseJwt(idToken).payload.iss;
    } else {
      throw new Error('oidc has no meta data');
    }
  }

  const r = {
    displayName: profile.name,
    givenName: profile.given_name,
    surname: profile.family_name,
    mail: profile.email,

    guid: profile.email ? profile.email : `${issuer}/${profile.sub}`,
  };

  // NOTE(longsleep): Sign out support is optional. Check if the issuer has
  // support and register handler if so. Otherwise the handler is undefined.
  if (metadata && metadata.end_session_endpoint) {
    r.signoutHandler = async () => {
      console.info('oidc user sign-out handler called'); // eslint-disable-line no-console
      const args = {
        state: makeOIDCState(),
      };
      if (settings.popup) {
        // Open popup in correct context, and wait for origin to change.
        const popup = openPopupInAuthorityContext(userManager);
        const checker = (force=false) => {
          let ok = false;
          try {
            ok = popup.window.origin && false;
          } catch(e) {
            // Navigation has happend if origin cannot be accessed. This means
            // the popup is ready to handle the sign-out request.
            ok = true;
          }
          if (ok || force) {
            return userManager.signoutPopup(args).catch(err => {
              console.warn('oidc user sign-out failed', err); // eslint-disable-line no-console
            });
          }
          return false;
        };
        // Run checker, wait for popup.
        if (!checker()) {
          let c = 0;
          const i = setInterval(() => {
            c++;
            if (checker(c === 10)) {
              clearInterval(i);
            }
          }, 50);
        }
      } else {
        return userManager.signoutRedirect(args);
      }
    };
  } else {
    // Local sign out.
    r.signoutHandler = async () => {
      console.info('oidc local sign-out handler called'); // eslint-disable-line no-console
      await userManager.removeUser();
      return;
    }
  }

  return r;
}
