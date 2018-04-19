export const CALLBACK_MARKER = '#oidc-callback';
export const SILENT_REFRESH_MARKER = '/oidc-silent-refresh.html';

export const settings = {
};

export async function setup(appBaseURL=window.location.href) {
  settings.appBaseURL = appBaseURL;
  settings.callbackURL = `${appBaseURL}${CALLBACK_MARKER}`;
  settings.silentRedirectURL = appBaseURL.replace(/\/$/, '') + SILENT_REFRESH_MARKER;

  console.info('OIDC setup complete', settings); // eslint-disable-line no-console
}

export default settings;
