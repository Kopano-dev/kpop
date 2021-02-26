import { defineMessages } from 'react-intl';

import {
  resolveError,
} from '../errors/actions';

import {
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
} from '../oidc/constants';

import {
  KPOP_SET_ERROR,
  KPOP_GLUE_GLUED,
  KPOP_SNACKBAR_ENQUEUE,
  KPOP_SNACKBAR_REMOVE,
  KPOP_SNACKBAR_CLOSE,
  KPOP_ERRORID_USER_REQUIRED,
  KPOP_ERRORID_NETWORK_ERROR,
  KPOP_ERRORID_APP_INITIALIZATION_ERROR,


} from './constants';
import {
  UnexpectedNetworkResponseError,
} from './errors';

const translations = defineMessages({
  signInButtonText: {
    id: 'kpop.common.actions.signInButton.label',
    defaultMessage: 'Sign in',
  },
  noActiveUserSessionMessage: {
    id: 'kpop.common.errorMessage.noActiveUserSession.message',
    defaultMessage: 'No active user session.',
  },
  noActiveUserSessionDetail: {
    id: 'kpop.common.errorMessage.noActiveUserSession.detail',
    defaultMessage:
      'To use this app you must be signed in, but your active session could not be validated or is expired.',
  },
  networkRequestFailed: {
    id: 'kpop.common.errorMessage.networkRequestFailed.message',
    defaultMessage: 'Error: network request failed: {status}',
  },
  networkRequestForbidden: {
    id: 'kpop.common.errorMessage.networkRequestForbidden.message',
    defaultMessage: 'Error: network request forbidden: {status}',
  },
  appInitializationError: {
    id: 'kpop.common.errorMessage.appInitializationError.message',
    defaultMessage: 'App start failed with error!',
  },
});

export function setError(error) {
  return async (dispatch) => {
    if (error) {
      if (error.resolution) {
        error.resolver = async () => {
          await dispatch(resolveError(error));
        };
      }

      if (!error.fatal && !error.snack)  {
        if (error.resolution) {
          // Auto resolve.
          await dispatch(resolveError(error));
        }
      } else if (!error.fatal) {
        dispatch(enqueueErrorSnackbar(error));
      }
    }

    dispatch({
      type: KPOP_SET_ERROR,
      error,
    });
  };
}

export function glueGlued(glue) {
  return {
    type: KPOP_GLUE_GLUED,
    glue,
  };
}

export function networkFetch(input, init, expectedStatus=200, expectJSON=true, dispatchError=true) {
  return async (dispatch) => {
    // Fetch via fetch API.
    return fetch(input, init).then(response => {
      // First check for response status.
      if (expectedStatus && response.status !== expectedStatus) {
        const err = new UnexpectedNetworkResponseError(`unexpected status: ${response.status}`, response.status);
        if (dispatchError) {
          err.handled = true;
          dispatch(networkError(response.status, response, err));
        }
        throw err;
      } else {
        return response;
      }
    }).then(response => {
      // Decode JSON is JSON is expected and received.
      if (expectJSON && response.headers.get('Content-Type').indexOf('application/json') === 0) {
        return response.json().then(json => ({
          response,
          data: json,
        }));
      } else {
        // Return directly, if not JSON or raise error when expected.
        if (expectJSON) {
          const err = new UnexpectedNetworkResponseError('unexpected Content-Type', response.status);
          if (dispatchError) {
            err.handled = true;
            dispatch(networkError(response.status, response, err));
          }
          throw err;
        }
        return {
          data: response,
        };
      }
    }).then(result => {
      // No error - return data.
      return result.data;
    }, raisedError => {
      // Error case, dispatch when not already handled.
      if (dispatchError && !raisedError.handled) {
        dispatch(networkError(0, null, raisedError));
      }
      throw raisedError;
    });
  };
}


export function networkError(status, response, raisedError=null) {
  return async (dispatch) => {
    const error = {
      id: KPOP_ERRORID_NETWORK_ERROR,
      status,
      fatal: false,
      resolution: null,
      raisedError,
    };
    if (response) {
      if (response.headers && response.headers.get('Content-Type').indexOf('application/json') === 0) {
        error.json = await response.json();
      } else {
        error.detail = await response.text();
      }
    } else if (raisedError) {
      error.detail = ''+raisedError;
    }

    switch (status) {
      case 403:
        // Forbidden.
        error.message = translations.networkRequestForbidden;
        error.fatal = true;
        error.resolution = KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN;
        break;

      default:
        error.message = translations.networkRequestFailed;
        break;
    }

    error.values = {
      status,
    };

    return dispatch(setError(error));
  };
}

export function userRequiredError(fatal=true, raisedError=null) {
  return (dispatch) => {
    const error = {
      id: KPOP_ERRORID_USER_REQUIRED,
      fatal,
      resolution: KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
      raisedError,
      message: translations.noActiveUserSessionMessage,
      detail: translations.noActiveUserSessionDetail,
      withoutFatalSuffix: true,
      reloadButtonText: translations.signInButtonText,
    };

    return dispatch(setError(error));
  };
}

export function appInitializationError(fatal=true, {raisedError, detail} = {}) {
  return (dispatch) => {
    const error = {
      id: KPOP_ERRORID_APP_INITIALIZATION_ERROR,
      fatal,
      raisedError,
      message: translations.appInitializationError,
      detail,
    };

    return dispatch(setError(error));
  };
}

export function enqueueErrorSnackbar(error) {
  return (dispatch) => {
    const snack = {
      ...error.snack,
    }
    return dispatch(enqueueSnackbar({
      message: error.message,
      values: error.values,
      ...snack,
      options: {
        ...error.options,
        variant: 'error',
        ...snack.options,
      },
      error,
    }));
  };
}

export function enqueueSnackbar(notification) {
  const key = notification.options && notification.options.key;

  return {
    type: KPOP_SNACKBAR_ENQUEUE,
    key: key ? key : String(new Date().getTime() + Math.random()),
    notification: {
      ...notification,
    },
  };
}

export function removeSnackbar(key) {
  return {
    type: KPOP_SNACKBAR_REMOVE,
    key,
  };
}

export function closeSnackbar(key) {
  return {
    type: KPOP_SNACKBAR_CLOSE,
    dismissAll: !key,
    key,
  };
}
