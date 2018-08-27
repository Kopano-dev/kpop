// NOTE(longsleep): Helper for visibility detection. The visibility API seems to
// be widely supported and is a good start (https://caniuse.com/#search=visibility).

const record = {
  visibilityManager: null,
};

export class VisibilityManager {
  initiallyHidden = true;
  initialVisibilityState = null;

  constructor(onChangeCb) {
    document.addEventListener('visibilitychange', async () => {
      const { hidden, visibilityState } = document;
      await onChangeCb({hidden, visibilityState, mgr: this});
    });

    this.initiallyHidden = document.hidden;
    this.initialVisibilityState = document.visibilityState;
  }
}

export function newVisibilityManager(onChangeCb) {
  const visibilityManager = record.visibilityManager = new VisibilityManager(onChangeCb);

  return visibilityManager;
}
export function getVisibilityManager() {
  return record.visibilityManager;
}
