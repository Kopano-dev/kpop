import { networkFetch, userRequiredError } from '../common/actions';
import { fetchUser, receiveUser, ensureRequiredScopes } from '../oidc/actions';
import { isCallbackRequest } from '../oidc/utils';
import { KPOP_OIDC_DEFAULT_SCOPE } from '../oidc/constants';

import { getHeadersFromConfig } from './utils';
import { KPOP_RECEIVE_CONFIG, KPOP_RESET_CONFIG } from './constants';
import { setHistory } from './history';

const basePrefix = '';
const defaultID = 'general';
const defaultScope = 'kopano';

const statefulOptions = {};

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
    const {id, scope, defaults, requiredScopes, dispatchError, args, withUserLazy, history} = Object.assign({}, {
      id: defaultID,
      scope: defaultScope,
      defaults: null,
      dispatchError: true,
      args: {},
    }, options);

    if (history) {
      setHistory(history);
    }

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
      Object.assign(statefulOptions, {
        requiredScopes,
        args,
      });
      const action = (opts) => dispatch(initializeUserWithConfig(config, opts));
      if (withUserLazy && !isCallbackRequest()) {
        config.continue = async (opts={}) => {
          delete config.continue;
          try {
            return await action(opts);
          } catch(err) {
            if (opts.dispatchError || opts.dispatchError === undefined) {
              // Dispatch by default, when continue actions fails.
              console.error('failed to continue config initialization', err); // eslint-disable-line no-console
              await dispatch(userRequiredError());
              return {
                config,
                user: undefined,
              }
            } else {
              throw err;
            }
          }
        };
        return {
          config,
          user: undefined,
        };
      }
      return action({
        dispatchError,
      });
    });
  };
}

export function initializeUserWithConfig(config, options={}) {
  return async (dispatch) => {
    const {args, dispatchError, requiredScopes, ...other} = Object.assign({}, {
      args: {},
      dispatchError: true,
    }, statefulOptions, options);

    let user = null;

    if (config.user) {
      user = await dispatch(receiveUser(config.user)).then(() => {
        return config.user;
      });
    } else {
      let fetchUserArgs = args;
      if (typeof fetchUserArgs === 'function') {
        // Allow app to define args with config.
        fetchUserArgs = await args(config, other);
      }
      user = await dispatch(fetchUser(fetchUserArgs));
    }

    if (!user || user.expired) {
      if (dispatchError) {
        // TODO(longsleep): Add hook for a custom error dispatcher handler.
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
