import {
  KPOP_RECEIVE_CONFIG,
  KPOP_RESET_CONFIG,
} from '../config/constants';
import {
  KPOP_SERVICE_WORKER_NEW_CONTENT,
  KPOP_SERVICE_WORKER_REGISTRATION,
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
  KPOP_GLUE_GLUED,
  KPOP_SNACKBAR_ENQUEUE,
  KPOP_SNACKBAR_REMOVE,
  KPOP_SNACKBAR_CLOSE,
} from './constants';

const defaultState = {
  updateAvailable: false,
  registration: null,
  glue: null,
  config: null,
  user: null,
  profile: null,
  error: null,
  offline: true,
  hidden: true,
  notifications: [],
};

const snackGlobalState = {
  count: 0,
};

function commonReducer(state = defaultState, action) {
  switch (action.type) {
    case KPOP_SET_ERROR:
      return Object.assign({}, state, {
        error: action.error,
      });

    case KPOP_GLUE_GLUED:
      return Object.assign({}, state, {
        glue: action.glue,
      });

    case KPOP_SERVICE_WORKER_NEW_CONTENT:
      return Object.assign({}, state, {
        updateAvailable: true,
      });

    case KPOP_SERVICE_WORKER_REGISTRATION:
      return Object.assign({}, state, {
        registration: action.registration,
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

    case KPOP_SNACKBAR_ENQUEUE:
      if (state.notifications.findIndex(notification => notification.key === action.key) > -1) {
        // Prevent adding duplicates.
        return state;
      }
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            uid: snackGlobalState.count++, // Always add a unique ID for each added snack.
            key: action.key,
            ...action.notification,
          },
        ],
      };
    case KPOP_SNACKBAR_REMOVE:
    case KPOP_SNACKBAR_CLOSE:
      if (action.dismissAll) {
        return {
          ...state,
          notifications: [],
        }
      } else {
        return {
          ...state,
          notifications: state.notifications.filter(
            notification => notification.key !== action.key
          ),
        };
      }

    default:
      return state;
  }
}

export default commonReducer;
