// NOTE(longsleep): Helper for offline/online detection. This might need some
// more stuff for proper/better derection. See https://www.html5rocks.com/en/mobile/workingoffthegrid/
// for some hints. Also the offline API seems to be widely supported, so relying
// on it seems to be a good start (https://caniuse.com/#search=offline).

const record = {
  offlineManager: null,
};

export class OfflineManager {
  wasInitiallyOnline = false;
  wasOnlineBefore = false;
  wasOnlineOnce = false;
  wasOfflineOnce = false;

  constructor(onOfflineCb, onOnlineCb) {
    window.addEventListener('offline', async () => {
      this.wasOfflineOnce = true;
      await onOfflineCb(this);
      this.wasOnlineBefore = false;
    });
    window.addEventListener('online', async () => {
      this.wasOnlineOnce = true;
      await onOnlineCb(this);
      this.wasOnlineBefore = true;
    });

    this.wasInitiallyOnline = this.wasOnlineBefore = this.wasOnlineOnce = this.online;
    this.wasOfflineOnce = !this.online;
  }

  get online() {
    return navigator.onLine;
  }
}

export function newOfflineManager(onOfflineCb, onOnlineCb) {
  const offlineManager = record.offlineManager = new OfflineManager(onOfflineCb, onOnlineCb);

  return offlineManager;
}
export function getOfflineManager() {
  return record.offlineManager;
}
