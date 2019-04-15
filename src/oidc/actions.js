import { setError } from '../common/actions';

import {
  KPOP_RECEIVE_USER,
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
  KPOP_OIDC_DEFAULT_SCOPE,
  KPOP_OIDC_TOKEN_EXPIRATION_NOTIFICATION_TIME,
} from './constants';
import { settings } from './settings';
import { isSigninCallbackRequest, isPostSignoutCallbackRequest, resetHash,
  blockAsyncProgress, openPopupInAuthorityContext } from './utils';
import { newUserManager, getUserManager, setUserManagerMetadata, onBeforeSignin, onBeforeSignout } from './usermanager';
import { makeOIDCState, restoreOIDCState, updateOIDCState } from './state';

export function receiveUser(user, userManager) {
  return {
    type: KPOP_RECEIVE_USER,
    user,
    userManager,
  };
}

export function signinRedirect(params={}) {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    const args = Object.assign({}, params, {
      state: makeOIDCState(),
    });
    await userManager.signinRedirect(args);
  };
}

export function signinRedirectWhenNotPopup(params={}) {
  return async (dispatch) => {
    if (!settings.popup) {
      setTimeout(() => dispatch(signinRedirect(params)), 0);
      await blockAsyncProgress(); // Block resolve since redirect is coming.
    }
  };
}

export function signinPopup(params={}) {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    const args = Object.assign({}, params, {
      state: makeOIDCState(),
    });

    // Open popup in correct context.
    openPopupInAuthorityContext(userManager);

    return userManager.signinPopup(args);
  };
}

export function startSignin(params={}) {
  return (dispatch) => {
    if (settings.popup) {
      return dispatch(signinPopup(params));
    } else {
      setTimeout(() => dispatch(signinRedirect(params)), 0);
      return blockAsyncProgress(); // Block resolve since redirect is coming.
    }
  };
}

export function signoutRedirect(params={}) {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    const args = Object.assign({}, params, {
      state: makeOIDCState(),
    });
    await userManager.signoutRedirect(args);
  };
}

export function signoutPopup(params={}) {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    const args = Object.assign({}, params, {
      state: makeOIDCState(),
    });

    // Open popup in correct context.
    openPopupInAuthorityContext(userManager);

    return userManager.signoutPopup(args);
  };
}

export function startSignout(params={}) {
  return (dispatch) => {
    if (settings.popup) {
      return dispatch(signoutPopup(params));
    } else {
      setTimeout(() => dispatch(signoutRedirect(params)), 0);
      return blockAsyncProgress(); // Block resolve since redirect is coming.
    }
  };
}

export function ensureRequiredScopes(user, requiredScopes, dispatchError=true) {
  return (dispatch) => {
    if (!requiredScopes) {
      return;
    }

    const scopes = user.scope.split(' ');
    let missing = null;
    for (let required of requiredScopes) {
      if (!scopes.includes(required)) {
        missing = required;
        break;
      }
    }

    if (missing) {
      const err = new Error('missing scope ' + missing);
      if (dispatchError) {
        err.handled = true;
        dispatch(insufficientScopeError());
      }
      throw err;
    }
  };
}

export function fetchUser(options={}) {
  return async (dispatch) => {
    const { removeUser } = options;

    // Register hooks from options.
    onBeforeSignin(options.onBeforeSignin);
    onBeforeSignout(options.onBeforeSignout);

    const userManager = await dispatch(getOrCreateUserManager());
    if (removeUser) {
      await userManager.removeUser();
    }

    return userManager.getUser().then(async user => {
      if (user !== null) {
        return user;
      }

      if (isSigninCallbackRequest()) {
        return userManager.signinRedirectCallback().then(user => {
          // This is a redirect - restore options from state.
          if (user && user.state && user.state.options) {
            Object.assign(options, user.state.options);
          }
          console.info('oidc completed authentication', user); // eslint-disable-line no-console
          return user;
        }).catch(async (err) => {
          // FIXME(longsleep): Crap we have to check for error messages .. maybe
          // just always try when typeof err is Error?
          if (err && err.message && err.message === 'No matching state found in storage') {
            // Try to recover silently. This state can happen when the device
            // comes back after it was off/suspended.
            console.debug('oidc silently retrying after no matching state was found'); // eslint-disable-line no-console
            const args = {
              state: makeOIDCState(),
            };
            return userManager.signinSilent(args).catch((err) => {
              console.debug('oidc failed to silently recover after no matching state was found', err); // eslint-disable-line no-console, max-len
              return null;
            });
          }
          console.error('oidc failed to complete authentication', err); // eslint-disable-line no-console
          return null;
        }).then(user => {
          // FIXME(longsleep): This relies on exclusive hash access. Ensure that
          // this reset happens before the state is restored.
          resetHash();
          return user;
        });
      } else if (isPostSignoutCallbackRequest()) {
        return userManager.signoutRedirectCallback().then(resp => {
          console.info('oidc complete signout', resp); // eslint-disable-line no-console
          return resp;
        }).catch((err) => {
          console.error('oidc failed to complete signout', err); // eslint-disable-line no-console
          return null;
        }).then(resp => {
          // FIXME(longsleep): This relies on exclusive hash access. Ensure that
          // this reset happens before the state is restored.
          resetHash();
          // This is a redirect - restore options from state together with state.
          if (resp && resp.state) {
            if (resp.state.options) {
              Object.assign(options, resp.state.options);
            }
            restoreOIDCState(resp.state);
          }
          // NOTE(longsleep): For now redirect ot sigin page after logout.
          return dispatch(signinRedirectWhenRequired(options));
        });
      } else {
        // Not a callback -> new request and we need auth.
        // Store options in state, so they can be restored after a redirect.
        updateOIDCState({options});

        const args = {
          state: makeOIDCState(),
        };
        try {
          // Try to retrieve user silently. This will fail with error when
          // not signed in but avoids a top level redirect when signed in.
          user = await userManager.signinSilent({...args});
          if (user) {
            return user;
          }
        } catch (err) {
          console.debug('oidc silent sign-in failed', err); // eslint-disable-line no-console
        }

        // Having ended up here means that interactive sign in is required.
        return dispatch(signinRedirectWhenRequired(options));
      }
    }).then(async user => {
      await dispatch(receiveUser(user, userManager));
      if (user && user.state !== undefined) {
        restoreOIDCState(user.state);
      }

      return user;
    });
  };
}

function signinRedirectWhenRequired(options={}, params={}) {
  return async (dispatch) => {
    const { noRedirect } = options;

    if (noRedirect) {
      return;
    }

    await dispatch(signinRedirectWhenNotPopup(params));
  };
}

export function fetchUserSilent() {
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    return userManager.getUser().then(async user => {
      if (user !== null) {
        return user;
      }

      const args = {
        state: makeOIDCState(),
      };
      try {
        // Try to retrieve user silently. This will fail with error when
        // not signed in.
        user = await userManager.signinSilent(args);
      } catch (err) {
        console.debug('oidc silent sign-in failed', err); // eslint-disable-line no-console
        user = null;
      }
      return user;
    }).then(async user => {
      await dispatch(receiveUser(user, userManager));
      if (user && user.state !== undefined) {
        restoreOIDCState(user.state);
      }

      return user;
    });
  };
}

export function getOrCreateUserManager() {
  return (dispatch) => {
    let userManager = getUserManager();
    if (userManager) {
      return userManager;
    }

    return dispatch(createUserManager()).then(async mgr => {
      // Always clear up stale state stuff, when a new manager is created.
      setTimeout(() => {
        mgr._clearStaleState();
      }, 0);

      const metadata = await mgr._getMetadata();
      setUserManagerMetadata(mgr, metadata);

      return mgr;
    });
  };
}

export function createUserManager() {
  return async (dispatch, getState) => {
    const { config } = getState().common;

    let iss = config.oidc.iss;
    if (iss === '') {
      // Auto generate issuer with current host.
      iss = 'https://' + window.location.host;
    }
    let scope = config.oidc.scope;
    if (scope === '' || scope === undefined) {
      scope = KPOP_OIDC_DEFAULT_SCOPE;
    }

    const mgr = newUserManager({
      authority: iss,
      client_id: config.oidc.clientID || 'kpop-' + encodeURI(settings.appBaseURL), // eslint-disable-line camelcase
      redirect_uri: settings.redirectURL, // eslint-disable-line camelcase
      popup_redirect_uri: settings.popupRedirectURL, // eslint-disable-line camelcase
      post_logout_redirect_uri: settings.postLogoutRedirectURL, // eslint-disable-line camelcase
      popup_post_logout_redirect_uri: settings.popupPostLogoutRedirectURL, // eslint-disable-line camelcase
      silent_redirect_uri: settings.silentRedirectURL,  // eslint-disable-line camelcase
      response_type: 'id_token token', // eslint-disable-line camelcase
      scope,
      loadUserInfo: true,
      accessTokenExpiringNotificationTime: KPOP_OIDC_TOKEN_EXPIRATION_NOTIFICATION_TIME,
      automaticSilentRenew: true,
      includeIdTokenInSilentRenew: true,
      popupWindowFeatures: settings.popupWindowFeatures,
      popupWindowTarget: settings.popupWindowTarget,
      extraQueryParams: config.oidc.eqp || undefined,
      metadataUrl: config.oidc.metadataURL || undefined,
    });
    mgr.events.addAccessTokenExpiring(() => {
      console.debug('oidc token expiring'); // eslint-disable-line no-console
    });
    mgr.events.addAccessTokenExpired(() => {
      console.warn('oidc access token expired'); // eslint-disable-line no-console
      mgr.removeUser();
      setTimeout(() => {
        // Try to fetch new user silently. This for example helps when the device
        // comes back after it was suspended or lost connection which led it to
        // miss the opportunity to renew tokens in time.
        dispatch(fetchUserSilent());
      }, 0);
    });
    mgr.events.addUserLoaded(async user => {
      console.debug('oidc user loaded', user); // eslint-disable-line no-console
      const { user: oldUser } = getState().common;
      if (oldUser && oldUser.profile.sub !== user.profile.sub) {
        // Huh we received another user, this should not happen so lets clear
        // our local stuff and pretend nothing happened.
        console.warn('oidc remove user as the user has changed'); // eslint-disable-line no-console
        await mgr.removeUser();
        return;
      }

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
            console.warn('oidc remove user as silent renew has failed to renew in time'); // eslint-disable-line no-console, max-len
            mgr.removeUser();
          }
        });
      }, 5000);
    });
    mgr.events.addUserSignedOut(() => {
      console.debug('oidc user signed out at OP'); // eslint-disable-line no-console
      mgr.removeUser();
    });

    return mgr;
  };
}

export function insufficientScopeError(fatal=true, raisedError=null) {
  return (dispatch) => {
    const error = {
      fatal,
      resolution: KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
      raisedError,
      message: 'No access to this app',
      detail: 'You do not have permission to access this app. ' +
        'Please switch to another user or ask your administrator to grant you access.',
      withoutFatalSuffix: true,
      reloadButtonText: 'Switch user',
    };

    return dispatch(setError(error));
  };
}
