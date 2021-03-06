import { defineMessages } from 'react-intl';

import { WebStorageStateStore } from 'oidc-client';

import { setError } from '../common/actions';
import { KPOP_ERRORID_USER_REQUIRED } from '../common/constants';
import { clearError } from '../errors/actions';
import { sleep } from '../utils/sleep';
import { isInStandaloneMode } from '../utils';

import {
  KPOP_RECEIVE_USER,
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
  KPOP_RESTART_SIGNIN_SILENT,
  KPOP_OIDC_DEFAULT_SCOPE,
  KPOP_OIDC_TOKEN_EXPIRATION_NOTIFICATION_TIME,
} from './constants';
import { settings } from './settings';
import { isSigninCallbackRequest, isPostSignoutCallbackRequest, completeCallbackRequest,
  blockAsyncProgress, openPopupInAuthorityContext } from './utils';
import { newUserManager, getUserManager, setUserManagerMetadata, getUserManagerMetadata,
  onBeforeSignin, onBeforeSignout } from './usermanager';
import { makeOIDCState, restoreOIDCState, updateOIDCState } from './state';
import { profileAsUserShape } from './profile';
import { scopeOfflineAccess } from './scopes';

const translations = defineMessages({
  insufficientScopeErrorMessage: {
    id: 'kpop.oidc.errorMessage.insufficientScopeError.message',
    defaultMessage: 'No access!',
  },
  insufficientScopeErrorDetail: {
    id: 'kpop.oidc.errorMessage.insufficientScopeError.detail',
    defaultMessage: 'You do not have permission to access this app. ' +
      'Please switch to another user or ask your administrator to grant you access.',
  },
  switchUserButtonText: {
    id: 'kpop.oidc.swichUserButton.label',
    defaultMessage: 'Switch user',
  },
  authExpiredErrorMessage: {
    id: 'kpop.oidc.errorMessage.authExpired.message',
    defaultMessage: 'Access token expired',
  },
  authExpiredErrorDetail: {
    id: 'kpop.oidc.errorMessage.authExpired.detail',
    defaultMessage: 'Failed to renew your session. Please check your network connection.',
  },
  retryButtonText: {
    id: 'kpop.oidc.retryButton.label',
    defaultMessage: 'Retry',
  },
});

export function receiveUser(user, userManager, fatal=false) {
  return async (dispatch) => {
    let profile = null;
    if (user) {
      try {
        profile = profileAsUserShape(user.profile, userManager, user.id_token);
      } catch(err) {
        console.error('oidc failed to set profile', err);  // eslint-disable-line no-console
        user = null;
      }
    }
    await dispatch({
      type: KPOP_RECEIVE_USER,
      user,
      profile,
      userManager,
    });
    if (user) {
      // Ensure to clear error, if the current error is a user required error.
      await dispatch(clearError({
        id: KPOP_ERRORID_USER_REQUIRED,
      }, 'id'));
      if (fatal || (!user.access_token && user.refresh_token)) {
        await dispatch(authExpiredError(fatal));
      }
    }
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

export function fetchUserWithRetryOrFromStorage(options={}) {
  return (dispatch) => {
    const { initializeEvenWhenOffline } = options;

    return new Promise(async (resolve, reject) => {
      let count = 1;
      let err;
      do {
        try {
          let u = await dispatch(fetchUser(options));
          if (u && u.refresh_token) {
            // Kill offline access, if not configured.
            const userManager = getUserManager();
            if (userManager.settings.scope.indexOf('offline_access') === -1) {
              console.debug('oidc clear existing user as offline_access is not in scope list'); // eslint-disable-line no-console, max-len
              await userManager.removeUser();
              u = null;
            }
          }
          resolve(u);
          err = null;
          break;
        } catch(e) {
          err = e;
        }
        count++;
        await sleep(500 * count * count);
      } while (count < 3);
      if (err !== null) {
        const userManager = getUserManager();
        if (userManager) {
          let u = await userManager._loadUser();
          if (u && u.refresh_token) {
            if (userManager.settings.scope.indexOf('offline_access') === -1) {
              console.debug('oidc clear existing local user as offline_access is not in scope list'); // eslint-disable-line no-console, max-len
              await userManager.removeUser();
              u = null;
            } else {
              userManager._clearAccessToken(u);
              await dispatch(receiveUser(u, userManager, !initializeEvenWhenOffline));
            }
            resolve(u);
            return;
          }
        }
        reject(err);
      }
    });
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
            const args = {};
            if (!user || !user.refresh_token) {
              args.state = makeOIDCState();
            }
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
          completeCallbackRequest();
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
          completeCallbackRequest();
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
        if (user && user.access_token && !user.expired) {
          // NOTE(longsleep): Only return user here when with access token and it is not expired.
          return user;
        }

        // Not a callback -> new request and we need auth.
        // Store options in state, so they can be restored after a redirect.
        updateOIDCState({options});

        const args = {};
        if (!user || !user.refresh_token) {
          args.state = makeOIDCState();
        }
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

export function removeUser() {
  return async () => {
    let userManager = getUserManager();
    if (userManager) {
      await userManager.removeUser();
    }
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
      if (user !== null && user.access_token) {
        return user;
      }

      const args = {};
      if (!user || !user.refresh_token) {
        args.state = makeOIDCState();
      }
      try {
        // Try to retrieve user silently. This will fail with error when
        // not signed in.
        user = await userManager.signinSilent(args);
      } catch (err) {
        console.debug('oidc silent sign-in failed', err); // eslint-disable-line no-console
        if (!user || !user.refresh_token) {
          user = null;
        }
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
  return async (dispatch) => {
    let userManager = getUserManager();
    if (userManager) {
      let metadata = getUserManagerMetadata(userManager);
      if (!metadata) {
        metadata = await userManager._getMetadata();
        setUserManagerMetadata(userManager, metadata);
      }
      return userManager;
    }

    return dispatch(createUserManager()).then(async userManager => {
      // Always clear up stale state stuff, when a new manager is created.
      setTimeout(() => {
        userManager._clearStaleState();
      }, 0);

      const metadata = await userManager._getMetadata();
      setUserManagerMetadata(userManager, metadata);

      return userManager;
    });
  };
}

export function createUserManager() {
  return async (dispatch, getState) => {
    const { config } = getState().common;

    const options = {
      monitorSession: true,
    };

    let iss = config.oidc.iss;
    if (iss === '') {
      // Auto generate issuer with current host.
      iss = 'https://' + window.location.host;
    }
    let scope = config.oidc.scope;
    if (scope === '' || scope === undefined) {
      scope = KPOP_OIDC_DEFAULT_SCOPE;
    }
    if (config.oidc.standaloneOfflineAccess && isInStandaloneMode()) {
      scope += ' ' + scopeOfflineAccess;
      options.userStore = new WebStorageStateStore({
        prefix: 'kpop-oidc.',
        store: window.localStorage,
      });
      options.monitorSession = false;
      console.debug('oidc standalone offline access support enabled'); // eslint-disable-line no-console
    }

    const userManager = newUserManager({
      authority: iss,
      client_id: config.oidc.clientID || 'kpop-' + encodeURI(settings.appBaseURL), // eslint-disable-line camelcase
      redirect_uri: settings.redirectURL, // eslint-disable-line camelcase
      popup_redirect_uri: settings.popupRedirectURL, // eslint-disable-line camelcase
      post_logout_redirect_uri: settings.postLogoutRedirectURL, // eslint-disable-line camelcase
      popup_post_logout_redirect_uri: settings.popupPostLogoutRedirectURL, // eslint-disable-line camelcase
      silent_redirect_uri: settings.silentRedirectURL,  // eslint-disable-line camelcase
      response_type: config.oidc.useImplicitFlow ? 'id_token token' : 'code', // eslint-disable-line camelcase
      response_mode: 'fragment', // eslint-disable-line camelcase
      scope,
      loadUserInfo: true,
      accessTokenExpiringNotificationTime: KPOP_OIDC_TOKEN_EXPIRATION_NOTIFICATION_TIME,
      automaticSilentRenew: true,
      includeIdTokenInSilentRenew: true,
      popupWindowFeatures: settings.popupWindowFeatures,
      popupWindowTarget: settings.popupWindowTarget,
      extraQueryParams: config.oidc.eqp || undefined,
      metadataUrl: config.oidc.metadataURL || undefined,
      ...options,
    });
    userManager.events.addAccessTokenExpiring(() => {
      console.debug('oidc token expiring'); // eslint-disable-line no-console
    });
    userManager.events.addAccessTokenExpired(() => {
      console.warn('oidc access token expired'); // eslint-disable-line no-console
      userManager._loadUser().then(async user => {
        if (user) {
          if (!user.refresh_token) {
            await userManager.removeUser();
            user = null;
          } else {
            await userManager.removeAccessToken();
            console.debug('oidc removed expired access token'); // eslint-disable-line no-console
          }
        }
      }).then(() => {
        setTimeout(() => {
          // Try to fetch new user silently. This for example helps when the device
          // comes back after it was suspended or lost connection which led it to
          // miss the opportunity to renew tokens in time.
          dispatch(fetchUserSilent());
        }, 0);
      });
    });
    userManager.events.addUserLoaded(async user => {
      console.debug('oidc user loaded', user); // eslint-disable-line no-console
      const { user: oldUser } = getState().common;
      if (oldUser && oldUser.profile.sub !== user.profile.sub) {
        // Huh we received another user, this should not happen so lets clear
        // our local stuff and pretend nothing happened.
        console.warn('oidc remove user as the user has changed'); // eslint-disable-line no-console
        await userManager.removeUser();
        return;
      }

      await dispatch(receiveUser(user, userManager));
    });
    userManager.events.addUserUnloaded(async () => {
      console.debug('oidc user unloaded'); // eslint-disable-line no-console
      await dispatch(receiveUser(null, userManager));
    });
    userManager.events.addSilentRenewError(err => {
      console.warn('oidc user silent renew error', err.error); // eslint-disable-line no-console
      if (err) {
        // Handle the hopeless.
        switch (err.error) {
          case 'interaction_required':
          case 'login_required':
            userManager.removeUser();
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
        userManager.getUser().then(user => {
          console.debug('oidc retrying silent renew of user', user); // eslint-disable-line no-console
          if (user && (!user.expired || user.refresh_token)) {
            userManager.stopSilentRenew();
            userManager.startSilentRenew();
          } else {
            console.warn('oidc remove user as silent renew has failed to renew in time'); // eslint-disable-line no-console, max-len
            userManager.removeUser();
          }
        });
      }, 5000);
    });
    userManager.events.addUserSignedOut(() => {
      console.debug('oidc user signed out at OP'); // eslint-disable-line no-console
      userManager.removeUser();
    });

    return userManager;
  };
}

export function insufficientScopeError(fatal=true, raisedError=null) {
  return (dispatch) => {
    const error = {
      fatal,
      resolution: KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
      raisedError,
      message: translations.insufficientScopeErrorMessage,
      detail: translations.insufficientScopeErrorDetail,
      withoutFatalSuffix: true,
      reloadButtonText: translations.switchUserButtonText,
    };

    return dispatch(setError(error));
  };
}

export function authExpiredError(fatal=false, raisedError=null) {
  return (dispatch) => {
    const error = {
      fatal,
      resolution: KPOP_RESTART_SIGNIN_SILENT,
      raisedError,
      message: translations.authExpiredErrorMessage,
      detail: translations.authExpiredErrorDetail,
      withoutFatalSuffix: true,
      withoutReloadAfterResolve: true,
      reloadButtonText: translations.retryButtonText,
    };
    if (!fatal) {
      error.message = error.detail;
      error.snack = {
        options: {
          key: KPOP_RESTART_SIGNIN_SILENT,
          persist: true,
        },
      };
    }

    return dispatch(setError(error));
  };
}
