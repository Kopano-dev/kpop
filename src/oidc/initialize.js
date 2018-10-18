// NOTE(longsleep): Keep this file as minimal as possible. Especially avoid any
// dependency which pulls in oidc-client so that the early bundles do include
// the very large oidc-client with its dependencies.

import { showErrorInLoader } from '../utils';
import { isSilentRefreshRequest, isSigninPopupCallbackRequest, isPostSignoutPopupCallbackRequest } from './utils';
import { setup } from './settings';
import registerResolvers from './resolvers';

export function initialize(appBaseURL=window.location.href, handleError=true) {
  return setup(appBaseURL).then(() => {
    return new Promise((resolve, reject) => {
      // Top level poor man's minimal URL routing. This also is async and thus enables
      // code splitting via Webpack.
      if (isSilentRefreshRequest()) {
        // OIDC silent refresh code - Dynaimically imported to keep the initial
        // javascript chunk size small. This is supported by webpack and the spec
        // can be found at https://github.com/tc39/proposal-dynamic-import.
        import(/* webpackChunkName: "kpop-oidc-callbacks" */ './callbacks').then(m => {
          m.signinSilentCallback().catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      } else if (isSigninPopupCallbackRequest()) {
        // OIDC popup callback. Trigger our callback to notify opener. Dynamically
        // imported to keep the initial javascript chunk size small. This is
        // supported by webpack and the spec can be found at
        // https://github.com/tc39/proposal-dynamic-import.
        import(/* webpackChunkName: "kpop-oidc-callbacks" */ './callbacks').then(m => {
          m.signinPopupCallback().catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      } else if (isPostSignoutPopupCallbackRequest()) {
        // OIDC popup callback. Trigger our callback to notify opener. Dynamically
        // imported to keep the initial javascript chunk size small. This is
        // supported by webpack and the spec can be found at
        // https://github.com/tc39/proposal-dynamic-import.
        import(/* webpackChunkName: "kpop-oidc-callbacks" */ './callbacks').then(m => {
          m.signoutPopupCallback().catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      } else {
        // Normal startup, set config and resolve promise so app can continue.
        registerResolvers();
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

export default initialize;
