import { resolve } from './resolver';

export function resolveError(error) {
  return async (dispatch) => {
    const resolver = resolve(error.resolution);
    if (resolver) {
      await dispatch(resolver(error));
    }
  };
}
