/* Private selectors.
 *
 * These selectors follow the idea that they get passed in only the part of
 * the store which is needed by them by the application actually using the
 * selector and has control of the store. Do not pass the whole store, so that
 * the apps stay in control of the nesting and data structure.
 *
 */

import { scopeGuestOK } from '../oidc/scopes';

export function hasScope(store, requiredScope) {
  const { user } = store;

  return user && user.scope.indexOf(requiredScope) >= 0;
}

export function isGuest(store) {
  return hasScope(store, scopeGuestOK);
}
