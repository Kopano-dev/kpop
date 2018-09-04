import {
  KPOP_RECEIVE_USER,
} from '../oidc/constants';
import {
  hasScopes,
} from '../oidc/utils';

import {
  KOPANO_GRAPI_SCOPE,
  KOPANO_GRAPI_ID_CLAIM,
} from './constants';

const defaultState = {
  id: null,
};

function grapiReducer(state = defaultState, action) {
  switch (action.type) {
    case KPOP_RECEIVE_USER: {
      let id = null;
      if (hasScopes(action.user, KOPANO_GRAPI_SCOPE)) {
        id = action.user.profile ? action.user.profile[KOPANO_GRAPI_ID_CLAIM] : null;
      }

      return Object.assign({}, state, {
        id: id ? id : null,
      });
    }

    default:
      return state;
  }
}

export default grapiReducer;
