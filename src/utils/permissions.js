const marker = {};

/**
 * Wraps any action so it only triggers when the current user has the provided
 * scope. If the user does not have the scope, either a provided default value
 * is returned or the action is rejected with error.
 */
export function requireScope(scope, f, defaultValue=marker) {
  return async (dispatch, getState) => {
    const { user } = getState().common;

    if (userHasScope(scope, user)) {
      return f(dispatch, getState);
    }

    if (defaultValue === marker) {
      throw new Error(`missing scope: ${scope}`);
    }
    return defaultValue;
  };
}

export const userHasScope = (scope, user) => {
  if (!scope || !user) {
    return false;
  }

  const scopes = user.scope.split(' ');
  return scopes.includes(scope);
};
