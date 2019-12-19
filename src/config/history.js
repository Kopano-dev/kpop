const browserHistory = {
  history: window.history,
};

/**
 * Simple wrapper to provide common API for custom history implementations.
 */
class wrappedHistory {
  constructor(h) {
    this.history = h;
  }

  replaceState(state, title, url) {
    this.history.replace(url, state);
  }

  pushState(state, title, url) {
    this.history.push(url, state);
  }

  get state() {
    return this.history.location.state;
  }

  get location() {
    return this.history.location;
  }
}

export function setHistory(history) {
  if (!('replaceState' in history)) {
    history = new wrappedHistory(history);
  }

  browserHistory.history = history;
}

export function getHistory() {
  return browserHistory.history;
}

