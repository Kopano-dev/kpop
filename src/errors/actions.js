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

export function clearError(error, matchField=null) {
  return async (dispatch, getState) => {
    const { error: currentError } = getState().common;
    if (!currentError) {
      return;
    }

    // Clear current error if resolving.
    let action = currentError === error;
    if (!action) {
      switch (matchField) {
        case 'id':
          action = currentError.id === error.id;
          break;
        case 'resolution':
          action = currentError.resolution === error.resolution;
          break;

        default:
          break;
      }
    }
    if (action) {
      await dispatch(setError(null));
    }
  };
}
