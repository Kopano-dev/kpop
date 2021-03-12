import { networkFetch, userRequiredError, setBaseReady } from '../common/actions';
import { fetchUserWithRetryOrFromStorage, receiveUser, ensureRequiredScopes } from '../oidc/actions';
import { isCallbackRequest } from '../oidc/utils';
import { KPOP_OIDC_DEFAULT_SCOPE } from '../oidc/constants';
import { sleep } from '../utils/sleep';

import { getHeadersFromConfig } from './utils';
import { KPOP_RECEIVE_CONFIG, KPOP_CONFIG_READY, KPOP_RESET_CONFIG, KPOP_HISTORY_STATE_UPDATE_REQUESTED } from './constants';
import { setHistory, getHistory } from './history';

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

export function configReady(ready=true) {
  return {
    type: KPOP_CONFIG_READY,
    ready,
  };
}

export function resetConfig() {
  return {
    type: KPOP_RESET_CONFIG,
  };
}

export function fetchConfigFromServer(id=defaultID, scope=defaultScope, retry=false) {
  return (dispatch) => {
    const f = () => {
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

    return new Promise(async (resolve, reject) => {
      let delay = 200;
      while(true) { /* eslint-disable-line no-constant-condition */
        try {
          const config = await f();
          resolve(config);
          break;
        } catch(err) {
          if (!retry) {
            reject(err);
            break;
          }
          delay = delay >= 3200 ? 5000 : delay * 2;
          console.warn('failed to fetch config: ' + // eslint-disable-line no-console
            err + ', retrying in ' + delay + 'ms');
          await sleep(delay);
        }
      }
    });
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

    return dispatch(fetchConfigFromServer(id, scope, true)).then(async config => {
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

      // Callback support with lazy user logon trigger.
      const action = (opts) => dispatch(initializeUserWithConfig(config, opts)).then(async (user) => {
        await dispatch(configReady(true));
        return user;
      });
      if (withUserLazy) {
        // TODO(longsleep): This modifies the config in state by reference, find better way. The whole functionality
        // here relies on the fact that the config stored in the state, remains the same reference as the config
        // used in the local scope config. This works as of now, as the receive config reducer does take in the config
        // as is, and its only recreated by reference when the config ready action is triggered (which comes after).
        config.continue = async (opts={}) => {
          config.continue = null;
          try {
            const user = await action(opts);
            return {
              config,
              user,
            };
          } catch(err) {
            if (opts.dispatchError || opts.dispatchError === undefined) {
              // Dispatch by default, when continue actions fails.
              console.error('failed to continue config initialization', err); // eslint-disable-line no-console
              await dispatch(userRequiredError());
              return {
                config,
                user: undefined,
              };
            } else {
              throw err;
            }
          }
        };
        if (!isCallbackRequest()) {
          // Fast path, lazy user outside of callbacl.
          return {
            config,
            user: undefined,
          };
        }
      }
      // Either not lazy or in callback.
      return action({
        dispatchError,
      }).then(user => {
        if (user && withUserLazy) {
          // Done already, remove callback.
          delete config.continue;
        }
        return {
          config,
          user,
        };
      }).catch(reason => {
        if (withUserLazy && config.continue) {
          // Ignore error when lazy and with continue callback trigger.
          console.debug('failed to initialize user (but lazy): ' + reason); // eslint-disable-line no-console
          return {
            config,
            user: undefined,
          };
        }
        throw new Error('failed to initialize user: ' + reason);
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
    let fetchUserArgs = args;

    if (config.user) {
      user = await dispatch(receiveUser(config.user)).then(() => {
        return config.user;
      });
    } else {
      if (typeof fetchUserArgs === 'function') {
        // Allow app to define args with config.
        fetchUserArgs = await args(config, other);
      }
      // Fetch user from OIDC with retry support.
      user = await dispatch(fetchUserWithRetryOrFromStorage(fetchUserArgs));
    }

    if (!user || user.expired) {
      const { dispatchError: reallyDispatchError } = {
        // NOTE(longsleep): This is complicated shit, since fetchUserArgs can
        // contain additional options when coming from an OIDC callbacl request,
        // this are applied here as well.
        dispatchError,
        ...fetchUserArgs,
      };
      if (reallyDispatchError) {
        // TODO(longsleep): Add hook for a custom error dispatcher handler.
        await dispatch(userRequiredError());
        return user;
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
    return user;
  };
}

export function reloadWithState(state) {
  return () => {
    if (state !== undefined) {
      const history = getHistory();
      history.replaceState(state, '');
    }
    window.location.reload();

    return new Promise(() => {}, () => {});
  };
}

export function reloadAfterUpdate() {
  return (dispatch) => {
    return dispatch(reloadWithState(KPOP_HISTORY_STATE_UPDATE_REQUESTED));
  };
}
