import { getHeadersFromConfig } from './utils';
import { networkFetch, userRequiredError } from '../common/actions';
import { fetchUser, receiveUser, ensureRequiredScopes } from '../oidc/actions';
import { KPOP_RECEIVE_CONFIG, KPOP_RESET_CONFIG } from './constants';
import { KPOP_OIDC_DEFAULT_SCOPE } from '../oidc/constants';

const basePrefix = '';
const defaultID = 'general';
const defaultScope = 'kopano';

export function receiveConfig(config) {
  return {
    type: KPOP_RECEIVE_CONFIG,
    config,
  };
}

export function resetConfig() {
  return {
    type: KPOP_RESET_CONFIG,
  };
}

export function fetchConfigFromServer(id=defaultID, scope=defaultScope) {
  return (dispatch) => {
    return dispatch(networkFetch(
      `${basePrefix}/api/config/v1/${scope}/${id}/config.json`, {
        method: 'GET',
        headers: getHeadersFromConfig(),
      },
      200,
      true,
      false,
    ));
  };
}

export function fetchConfigAndInitializeUser(options) {
  return (dispatch) => {
    const {id, scope, defaults, requiredScopes, dispatchError, args, withUserLazy} = Object.assign({}, {
      id: defaultID,
      scope: defaultScope,
      defaults: null,
      dispatchError: true,
      args: {},
    }, options);
    return dispatch(fetchConfigFromServer(id, scope)).then(async config => {
      // Allow override of config by app.
      if (defaults) {
        if (typeof defaults === 'function') {
          config = await defaults(config);
        } else {
          config = Object.assign({}, defaults, config);
        }
      }
      // Inject OIDC always.
      config.oidc = Object.assign({}, {
        iss: '', // If empty, current host is used.
        scope: KPOP_OIDC_DEFAULT_SCOPE,
      }, config.oidc);
      return config;
    }).then(async config => {
      await dispatch(receiveConfig(config));
      return config;
    }).then(config => {
      const action = () => dispatch(initializeUserWithConfig(config, {
        requiredScopes,
        dispatchError,
        args,
      }));
      if (withUserLazy) {
        config.continue = async () => {
          delete config.continue;
          try {
            await action();
          } catch(err) {
            // Always dispatch when continue actions fails.
            console.error('failed to continue config initialization', err); // eslint-disable-line no-console
            await dispatch(userRequiredError());
          }
        };
        return {
          config,
          user: undefined,
        };
      }
      return action();
    });
  };
}

export function initializeUserWithConfig(config, { args, dispatchError, requiredScopes }) {
  return async (dispatch) => {
    let user = null;

    if (config.user) {
      user = await dispatch(receiveUser(config.user)).then(() => {
        return config.user;
      });
    } else {
      let fetchUserArgs = args;
      if (typeof fetchUserArgs === 'function') {
        // Allow app to define args with config.
        fetchUserArgs = await args(config);
      }
      user = await dispatch(fetchUser(fetchUserArgs));
    }

    if (!user || user.expired) {
      if (dispatchError) {
        await dispatch(userRequiredError());
        return {user, config};
      } else{
        throw new Error('no user or user expired');
      }
    }
    let ensuredScopes = requiredScopes;
    if (ensuredScopes === undefined) {
      // If not set, all requested scopes are required.
      ensuredScopes = config.oidc.scope.split(' ');
    } else {
      if (typeof ensuredScopes === 'function') {
        // Allow app to define required scopes with config and user.
        ensuredScopes = await ensuredScopes(config, user);
      }
    }
    if (ensuredScopes) {
      await dispatch(ensureRequiredScopes(user, ensuredScopes, dispatchError));
    }
    return {user, config};
  }
}
