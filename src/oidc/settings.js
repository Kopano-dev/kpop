import { isInStandaloneMode } from '../utils';

export const AUTHORIZE_CALLBACK_MARKER = '#oidc-callback';
export const AUTHORIZE_CALLBACK_POPUP_MARKER = '#oidc-popup-callback';
export const ENDSESSION_CALLBACK_MARKER = '#oidc-endsession-callback';
export const ENDSESSION_CALLBACK_POPUP_MARKER = '#oidc-endsession-popup-callback';
export const SILENT_REFRESH_MARKER = '#oidc-silent-refresh';

export const settings = {
  popup: false,
  popupWindowTarget: 'kpop-oidc-sign-in-' + Math.random().toString(36).substring(7),
  popupWindowFeatures: 'location=no,toolbar=no,width=500,height=580',
};

export async function setup(appBaseURL=window.location.href) {
  const standalone = isInStandaloneMode();

  // Use popups when in standalone mode.
  settings.popup = !!standalone;

  // Apply settings.
  settings.appBaseURL = appBaseURL;
  settings.redirectURL = `${appBaseURL}${AUTHORIZE_CALLBACK_MARKER}`;
  settings.popupRedirectURL = `${appBaseURL}${AUTHORIZE_CALLBACK_POPUP_MARKER}`;
  settings.postLogoutRedirectURL = `${appBaseURL}${ENDSESSION_CALLBACK_MARKER}`;
  settings.popupPostLogoutRedirectURL = `${appBaseURL}${ENDSESSION_CALLBACK_POPUP_MARKER}`;
  settings.silentRedirectURL = `${appBaseURL}${SILENT_REFRESH_MARKER}`;

  console.info('oidc setup complete', settings); // eslint-disable-line no-console
}

export default settings;
