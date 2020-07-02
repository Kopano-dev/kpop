import { UserManager } from 'oidc-client';

const userManager = new UserManager({
  response_mode: 'fragment',
});

export function signinSilentCallback() {
  return userManager.signinSilentCallback().catch(err => {
    console.error('silent refresh callback failed', err); // eslint-disable-line no-console
  });
}

export function signinPopupCallback() {
  return userManager.signinPopupCallback().catch(err => {
    console.error('signin popup callback failed', err); // eslint-disable-line no-console
  });
}

export function signoutPopupCallback() {
  return userManager.signoutPopupCallback().catch(err => {
    console.error('signout popup callback failed', err); // eslint-disable-line no-console
  });
}
