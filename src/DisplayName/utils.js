/**
 * Take a user shape and return the displayName when set or a combination of
 * the other fields.
 */
export function getDisplayName(user) {
  let displayName = user.displayName;
  if (displayName) {
    return displayName;
  }
  displayName = user.givenName ? user.givenName : '';
  displayName += user.surname ? ' ' + user.surname : '';
  return displayName.trim();
}
