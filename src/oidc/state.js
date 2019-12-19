const state = {
  idx: 0,
  state: {},
};

function getCurrentRoute() {
  return window.location.pathname + window.location.search + window.location.hash;
}

export function restoreOIDCState(s) {
  if (s.route) {
    history.replaceState(s.state ? s.state : null, document.title, s.route);
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
  const s = {
    id: ++state.idx,
    route: getCurrentRoute(),
    state: history.state,
  };

  Object.assign(s, state.state);
  return s;
}
