export function getHeadersFromConfig(config, user, additionalHeaders) {
  const headers = new Headers({
    'Kopano-XSRF': '1',
  });
  if (user) {
    if (user.access_token && user.token_type) {
      headers.set('Authorization', `${user.token_type} ${user.access_token}`);
    } else if (process.env.NODE_ENV !== 'production' && user.profile.sub) { /*eslint-disable-line no-undef*/
      // NOTE(longsleep): User pass through is disabled in production builds.
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
