import {
  KPOP_A2HS_PROMPT_AVAILABLE,
  KPOP_A2HS_PROMPT_RESULT,
} from './constants';

const defaultState = {
  a2hs: {
    available: false,
    accepted: null,
    outcome: undefined,
  },
};

function pwaReducer(state = defaultState, action) {
  switch (action.type) {
    case KPOP_A2HS_PROMPT_AVAILABLE: {
      const a2hs = Object.assign({}, state.a2hs, {
        available: action.available,
        accepted: null,
        outcome: undefined,
      });
      return Object.assign({}, state, {
        a2hs: a2hs,
      });
    }

    case KPOP_A2HS_PROMPT_RESULT: {
      const a2hs = Object.assign({}, state.a2hs, {
        available: false,
        accepted: action.accepted,
        outcome: action.outcome,
      });
      return Object.assign({}, state, {
        a2hs: a2hs,
      });
    }

    default:
      return state;
  }
}

export default pwaReducer;
