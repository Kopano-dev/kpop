// NOTE(longsleep): Helper for visibility detection. The visibility API seems to
// be widely supported and is a good start (https://caniuse.com/#search=visibility).

const record = {
  visibilityManager: null,
};

export class VisibilityManager {
  onChangeCb = null;
  glue = null;

  initiallyHidden = true;
  initialVisibilityState = null;
  hidden = null;
  visibilityState = null;

  constructor(onChangeCb, glue=null) {
    this.onChangeCb = onChangeCb;
    this.glue = glue;

    const { hidden, visibilityState } = this.getVisibility();
    this.initiallyHidden = hidden;
    this.initialVisibilityState = visibilityState;

    // Register document visibilitiy API.
    document.addEventListener('visibilitychange', this.handleVisibilityChangeEvent);
    if (glue && glue.enabled && 'addEventListener' in glue) {
      // Glue can control visibiltiy too. Register event for it.
      glue.addEventListener('glue.visibilitychange', this.handleVisibilityChangeEvent);
    }
  }

  handleVisibilityChangeEvent = () => {
    this.triggerVisibilityUpdate();
  }

  getVisibility = () => {
    return {
      hidden: document.hidden || (this.glue && this.glue.hidden),
      visibilityState: this.glue && this.glue.hidden ? 'hidden' : document.visibilityState,
    };
  }

  triggerVisibilityUpdate = () => {
    const { hidden, visibilityState } = this.getVisibility();
    if (hidden !== this.hidden || visibilityState !== this.visibilityState) {
      this.hidden = hidden;
      this.visibilityState = visibilityState;
      this.onChangeCb({hidden, visibilityState, mgr: this});
    }
  }
}

export function newVisibilityManager(onChangeCb, glue=null) {
  const visibilityManager = record.visibilityManager = new VisibilityManager(onChangeCb, glue);

  return visibilityManager;
}
export function getVisibilityManager() {
  return record.visibilityManager;
}
