import { showErrorInLoader } from '../utils';
import { isSilentRefreshRequest } from './utils';
import { setup } from './settings';

export { profileAsUserShape } from './utils';

export default function initialize(appBaseURL=window.location.href, handleError=true) {
  return setup(appBaseURL).then(() => {
    return new Promise((resolve, reject) => {
      // Top level poor man's minimal URL routing. This also is async and thus enables
      // code splitting via Webpack.
      if (isSilentRefreshRequest()) {
        // OIDC silent refresh code - Dynaimically imported to keep the initial
        // javascript chunk size small. This is supported by webpack and the spec
        // can be found at https://github.com/tc39/proposal-dynamic-import.
        import(/* webpackChunkName: "kpop-oidc-silent-refresh" */ './silent-refresh').then(m => {
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
    }).catch(err => {
      if (handleError) {
        showErrorInLoader('Initialization error ', err);
      }
      throw(err);
    });
  });
}
