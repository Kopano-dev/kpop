export const AUTHORIZE_CALLBACK_MARKER = '#oidc-callback';
export const ENDSESSION_CALLBACK_MARKER = '#oidc-endsession-callback';
export const SILENT_REFRESH_MARKER = '/oidc-silent-refresh.html';

export const settings = {
};

export async function setup(appBaseURL=window.location.href) {
  settings.appBaseURL = appBaseURL;
  settings.redirectURL = `${appBaseURL}${AUTHORIZE_CALLBACK_MARKER}`;
  settings.postLogoutRedirectURL = `${appBaseURL}${ENDSESSION_CALLBACK_MARKER}`;
  settings.silentRedirectURL = appBaseURL.replace(/\/$/, '') + SILENT_REFRESH_MARKER;

  console.info('OIDC setup complete', settings); // eslint-disable-line no-console
}

export default settings;
