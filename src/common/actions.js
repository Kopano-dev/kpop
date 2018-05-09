import {
  KPOP_SET_ERROR,
} from './constants';
import {
  UnexpectedNetworkResponseError,
} from './errors';

export function setError(error) {
  return async (dispatch) => {
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
        const err = new UnexpectedNetworkResponseError(`unexpected status: ${response.status}`);
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
          const err = new UnexpectedNetworkResponseError('unexpected Content-Type');
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
      status,
      fatal: false,
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
        break;

      default:
        error.message = `Error: network request failed with status ${status}`;
        break;
    }

    return dispatch(setError(error));
  };
}