import { UserManager } from 'oidc-client';

const userManager = new UserManager();

export function signinSilentCallback() {
  return userManager.signinSilentCallback().catch(err => {
    console.error('silent refresh callback failed', err); // eslint-disable-line no-console
  });
}
