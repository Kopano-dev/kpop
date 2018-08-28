import { getHeadersFromConfig } from './utils';
import { networkFetch, userRequiredError } from '../common/actions';
import { fetchUser, receiveUser, ensureRequiredScopes } from '../oidc/actions';
import { KPOP_RECEIVE_CONFIG, KPOP_RESET_CONFIG } from './constants';

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

export function fetchConfigAndInitializeUser({id, scope, defaults, requiredScopes, dispatchError} = {id: defaultID, scope: defaultScope, defaults: null, dispatchError: true}) {
  return (dispatch) => {
    return dispatch(fetchConfigFromServer(id, scope)).then(async config => {
      // Inject OIDC always.
      config.oidc = Object.assign({
        iss: '', // If empty, current host is used.
        clientID: `%{scope}-${id}-` + encodeURI([window.location.protocol, '//', window.location.host, window.location.pathname].join('')),
      }, config.oidc);
      // Allow override by app.
      if (defaults) {
        if (typeof defaults === 'function') {
          config = await defaults(config);
        } else {
          config = Object.assign({}, defaults, config);
        }
      }
      return config;
    }).then(async config => {
      await dispatch(receiveConfig(config));
      return config;
    }).then(async config => {
      // Check if user was provided in configuration.
      const result = {
        config,
      };
      if (config.user) {
        result.user = await dispatch(receiveUser(config.user)).then(() => {
          return config.user;
        });
      } else {
        result.user = await dispatch(fetchUser());
      }
      return result;
    }).then(async ({user, config}) => {
      if (!user || user.expired) {
        if (dispatchError) {
          await dispatch(userRequiredError());
        }
        throw new Error('no user or user expired');
      }
      if (requiredScopes === undefined) {
        // If not set, all requested scopes are required.
        requiredScopes = config.oidc.scope.split(' ');
      }
      if (requiredScopes) {
        await dispatch(ensureRequiredScopes(user, requiredScopes, dispatchError));
      }
      return {user, config};
    });
  };
}
