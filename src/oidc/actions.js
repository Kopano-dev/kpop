import { KPOP_RECEIVE_USER } from './constants';
import { settings } from './settings';
import { isSigninCallbackRequest, isPostSignoutCallbackRequest, resetHash } from './utils';
import { newUserManager, getUserManager, setUserManagerMetadata } from './usermanager';

export function receiveUser(user, userManager) {
  return {
    type: KPOP_RECEIVE_USER,
    user,
    userManager,
  };
}

export function signinRedirect() {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    await userManager.signinRedirect({/* TODO(longsleep): Add state */});
  };
}

export function signoutRedirect() {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    await userManager.signoutRedirect({/* TODO(longsleep): Add state */});
  };
}

export function fetchUser() {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    return userManager.getUser().then(user => {
      if (user !== null) {
        return user;
      }

      if (isSigninCallbackRequest()) {
        return userManager.signinRedirectCallback().then(user => {
          console.info('oidc completed authentication', user); // eslint-disable-line no-console
          return user;
        }).catch((err) => {
          console.error('oidc failed to complete authentication', err); // eslint-disable-line no-console
          return null;
        }).then(user => {
          // FIXME(longsleep): This relies on exclusive hash access.
          resetHash();
          return user;
        });
      } else if (isPostSignoutCallbackRequest()) {
        return userManager.signoutRedirectCallback().then(resp => {
          console.info('oidc complete signout', resp); // eslint-disable-line no-console
          return null;
        }).catch((err) => {
          console.error('oidc failed to complete signout', err); // eslint-disable-line no-console
          return null;
        }).then(user => {
          // FIXME(longsleep): This relies on exclusive hash access.
          resetHash();
          setTimeout(() => {
            // NOTE(longsleep): For now redirect ot sigin page after logout.
            userManager.signinRedirect({/* TODO(longsleep): Add state */});
          }, 0);
          return user;
        });
      } else {
        // Not a callback, so redirect to sign in.
        userManager.signinRedirect({/* TODO(longsleep): Add state */});
        return null;
      }
    }).then(async user => {
      await dispatch(receiveUser(user, userManager));

      return user;
    });
  };
}

export function getOrCreateUserManager() {
  return async (dispatch) => {
    let userManager = getUserManager();
    if (userManager) {
      return userManager;
    }

    return dispatch(createUserManager());
  };
}

export function createUserManager() {
  return (dispatch, getState) => {
    const { config } = getState().common;

    let iss = config.oidc.iss;
    if (iss === '') {
      // Auto generate issuer with current host.
      iss = 'https://' + window.location.host;
    }

    const mgr = newUserManager({
      authority: iss,
      client_id: config.oidc.clientID, // eslint-disable-line camelcase
      redirect_uri: settings.redirectURL, // eslint-disable-line camelcase
      post_logout_redirect_uri: settings.postLogoutRedirectURL, // eslint-disable-line camelcase
      silent_redirect_uri: settings.silentRedirectURL,  // eslint-disable-line camelcase
      response_type: 'id_token token', // eslint-disable-line camelcase
      scope: 'openid profile email konnect/uuid',
      loadUserInfo: true,
      accessTokenExpiringNotificationTime: 120,
      automaticSilentRenew: true,
      includeIdTokenInSilentRenew: true,
    });
    mgr.events.addAccessTokenExpiring(() => {
      console.debug('oidc token expiring'); // eslint-disable-line no-console
    });
    mgr.events.addAccessTokenExpired(() => {
      console.warn('oidc access token expired'); // eslint-disable-line no-console
      mgr.removeUser();
      setTimeout(() => {
        // Try to fetch new user. This will redirect to login if unsuccessful.
        dispatch(fetchUser());
      }, 0);
    });
    mgr.events.addUserLoaded(async user => {
      console.debug('oidc user loaded', user); // eslint-disable-line no-console
      await dispatch(receiveUser(user, mgr));
    });
    mgr.events.addUserUnloaded(async () => {
      console.debug('oidc user unloaded'); // eslint-disable-line no-console
      await dispatch(receiveUser(null, mgr));
    });
    mgr.events.addSilentRenewError(err => {
      console.warn('oidc user silent renew error', err.error); // eslint-disable-line no-console
      if (err) {
        // Handle the hopeless.
        switch (err.error) {
          case 'interaction_required':
          case 'login_required':
            mgr.removeUser();
            setTimeout(() => {
              // Try to fetch new user. This will redirect to login if unsuccessful.
              dispatch(fetchUser());
            }, 0);
            return;
          default:
        }
      }

      setTimeout(() => {
        console.debug('oidc retrying silent renew'); // eslint-disable-line no-console
        mgr.getUser().then(user => {
          console.debug('oidc retrying silent renew of user', user); // eslint-disable-line no-console
          if (user && !user.expired) {
            mgr.startSilentRenew();
          } else {
            console.warn('oidc remove user as silent renew has failed to renew in time'); // eslint-disable-line no-console
            mgr.removeUser();
          }
        });
      }, 5000);
    });
    mgr.events.addUserSignedOut(() => {
      console.info('oidc user signed out at OP'); // eslint-disable-line no-console
    });

    // Always clear up stale state stuff, when a new manager is created.
    setTimeout(() => {
      mgr.clearStaleState();
    }, 0);

    return mgr.metadataService.getMetadata().then(metadata => {
      setUserManagerMetadata(metadata);
      return mgr;
    });
  };
}
