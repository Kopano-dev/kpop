import { setError } from '../common/actions';

import { resolve } from './resolver';

export function resolveError(error) {
  return async (dispatch) => {
    const resolver = resolve(error.resolution);
    if (resolver) {
      await dispatch(resolver(error));
    }
  };
}

export function clearError(error) {
  return async (dispatch, getState) => {
    const { error: currentError } = getState().common;
    if (currentError === error) {
      // Clear current error if resolving.
      await dispatch(setError(null));
    }
  };
}
