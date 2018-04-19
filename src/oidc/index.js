import { isSilentRefreshRequest } from './utils';
import { setup } from './settings';

export default function initialize(appBaseURL=window.location.href) {
  return setup(appBaseURL).then(
    new Promise((resolve, reject) => {
      // Top level poor man's minimal URL routing. This also is async and thus enables
      // code splitting via Webpack.
      if (isSilentRefreshRequest()) {
        // OIDC silent refresh code - Dynaimically imported to keep the initial
        // javascript chunk size small. This is supported by webpack and the spec
        // can be found at https://github.com/tc39/proposal-dynamic-import.
        import('./silent-refresh').then(m => {
          m.signinSilentCallback().catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      } else {
        // Normal startup, set config and resolve promise so app can continue.
        resolve();
      }
    })
  );
}
