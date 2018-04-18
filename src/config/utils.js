export function getHeadersFromConfig(config, user, additionalHeaders) {
  const headers = new Headers({
    'Kopano-XSRF': '1',
  });
  if (user) {
    if (user.access_token && user.token_type) {
      headers.set('Authorization', `${user.token_type} ${user.access_token}`);
    } else if (user.profile.sub) {
      // TODO(longsleep): This is for debugging only, remove or put behind a flag.
      headers.set('X-Kopano-UserEntryID', user.profile.sub || '');
    }
  }
  if (additionalHeaders) {
    for (let name in additionalHeaders) {
      if (additionalHeaders.hasOwnProperty(name)) {
        headers.set(name, additionalHeaders[name]);
      }
    }
  }

  return headers;
}
