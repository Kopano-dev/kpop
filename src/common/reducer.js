import {
  KPOP_RECEIVE_CONFIG,
  KPOP_RESET_CONFIG,
} from '../config/constants';
import {
  KPOP_SERVICE_WORKER_NEW_CONTENT,
} from '../serviceWorker/constants';
import {
  KPOP_RECEIVE_USER,
} from '../oidc/constants';
import {
  KPOP_OFFLINE_ONLINE,
  KPOP_OFFLINE_OFFLINE,
} from '../offline/constants';
import {
  KPOP_VISIBILITY_CHANGE,
} from '../visibility/constants';

import {
  KPOP_SET_ERROR,
} from './constants';

const defaultState = {
  updateAvailable: false,
  config: null,
  user: null,
  profile: null,
  error: null,
  offline: true,
  hidden: true,
};

function commonReducer(state = defaultState, action) {
  switch (action.type) {
    case KPOP_SET_ERROR:
      if (action.error) {
        // NOTE(longsleep): Why do we make all set errors fatal?
        action.error.fatal = true;
      }
      return Object.assign({}, state, {
        error: action.error,
      });

    case KPOP_SERVICE_WORKER_NEW_CONTENT:
      return Object.assign({}, state, {
        updateAvailable: true,
      });

    case KPOP_RESET_CONFIG:
      return Object.assign({}, state, {
        config: null,
      });

    case KPOP_RECEIVE_CONFIG:
      return Object.assign({}, state, {
        config: action.config,
      });

    case KPOP_RECEIVE_USER:
      return Object.assign({}, state, {
        user: action.user,
        profile: action.profile,
      });

    case KPOP_OFFLINE_ONLINE:
    case KPOP_OFFLINE_OFFLINE:
      return Object.assign({}, state, {
        offline: action.offline,
      });

    case KPOP_VISIBILITY_CHANGE:
      return Object.assign({}, state, {
        hidden: action.hidden,
      });

    default:
      return state;
  }
}

export default commonReducer;
