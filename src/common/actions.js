import {
  resolveError,
} from '../errors/actions';

import {
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
} from '../oidc/constants';

import {
  KPOP_SET_ERROR,
  KPOP_ERRORID_USER_REQUIRED,
  KPOP_ERRORID_NETWORK_ERROR,
} from './constants';
import {
  UnexpectedNetworkResponseError,
} from './errors';

export function setError(error) {
  return async (dispatch) => {
    if (error && error.resolution) {
      if (error.fatal) {
        error.resolver = async () => {
          await dispatch(resolveError(error));
        };
      } else {
        await dispatch(resolveError(error));
      }
    }

    dispatch({
      type: KPOP_SET_ERROR,
      error,
    });
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
        error.message = `Error: network request forbidden (${status})`;
        error.fatal = true;
        error.resolution = KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN;
        break;

      default:
        error.message = `Error: network request failed with status ${status}`;
        break;
    }

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
      message: 'No active user session',
      detail: 'To use this app you must be signed in, but your active session could not be validated or is expired.',
      withoutFatalSuffix: true,
      reloadButtonText: 'Sign in',
    };

    return dispatch(setError(error));
  };
}
