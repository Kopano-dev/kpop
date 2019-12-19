import { getHistory } from '../config/history';

const state = {
  idx: 0,
  state: {},
};

function getCurrentRoute() {
  const h = getHistory();
  const l = h.location || window.location;

  return l.pathname + l.search + l.hash;
}

export function restoreOIDCState(s) {
  if (s.route) {
    Promise.resolve().then(() => {
      const h = getHistory();
      h.replaceState(s.state ? s.state : null, '', s.route);
    });
  }

  state.state = s;
}

export function updateOIDCState(s) {
  Object.assign(state.state, s);
}

export function applyOIDCOptionsFromState(options) {
  if (state.state.options) {
    Object.assign(options, state.state.options);
  }
  return options;
}

export function makeOIDCState() {
  const h = getHistory();
  return {
    id: ++state.idx,
    route: getCurrentRoute(),
    state: h.state,

    ...state.state,
  };
}
