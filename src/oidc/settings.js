import { isInStandaloneMode, isMobileSafari  } from '../utils';

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
  let standalone = isInStandaloneMode();
  if (standalone) {
    // Blacklist stuff.
    if (isMobileSafari()) {
      // Mobile safari is broken since it reloads the PWA every time it becomes
      // visiblen. Weed to sign in though (which is an external request via
      // Safari), making PWA in iOS currently (iOS 12 at 20181018) useless for
      // apps which use OAuth2 redirect based authentication.
      // Reference: https://medium.com/@firt/pwas-are-coming-to-ios-11-3-cupertino-we-have-a-problem-2ff49fd7d6ea
      // Reference: https://forums.developer.apple.com/thread/100407
      standalone = false;
      console.warn('oidc ignoring standalone mode of Mobile Safari'); // eslint-disable-line no-console
    }
  }

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
