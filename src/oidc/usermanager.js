import { UserManager as BaseUserManager, Log } from 'oidc-client';

// Setup oidc logging.
Log.logger = console;
Log.level = Log.WARN;

const record = {
  userManager: null,
  metadata: null,

  onBeforeSignin: null,
  onbeforeSignout: null,
};

export function newUserManager(config) {
  const userManager = record.userManager = new UserManager(config);
  return userManager;
}
export function getUserManager() {
  return record.userManager;
}

export function setUserManagerMetadata(userManager, metadata) {
  if (userManager !== record.userManager) {
    return;
  }
  record.metadata = metadata;
}
export function getUserManagerMetadata(userManager) {
  if (userManager !== record.userManager) {
    return null;
  }
  return record.metadata;
}

export function onBeforeSignin(handler) {
  record.onBeforeSignin = handler;
}

export function onBeforeSignout(handler) {
  record.onbeforeSignout = handler;
}

export class UserManager {
  constructor(config, ...args) {
    this._um = new BaseUserManager(config, ...args);
  }

  // Helpers to access sub structure.

  get usermanager() {
    return this._um;
  }

  get settings() {
    return this._um.settings;
  }

  get events() {
    return this._um.events;
  }

  set scope(value) {
    // NOTE(longsleep): Upstream oidc-client-js currently has no setter for
    // scope and since sometimes we want to change the scope after creating
    // the user manager, this provides a direct accessor to set the scope.
    this._um.settings._scope = value;
  }

  // Public API.

  async signinRedirect(...args) {
    if (record.onBeforeSignin) {
      await record.onBeforeSignin(this, ...args);
    }

    return this._um.signinRedirect(...args);
  }

  signinRedirectCallback(...args) {
    return this._um.signinRedirectCallback(...args);
  }

  async signinPopup(...args) {
    if (record.onBeforeSignin) {
      await record.onBeforeSignin(this, ...args);
    }

    return this._um.signinPopup(...args);
  }

  signinPopupCallback(...args) {
    return this._um.signinPopupCallback(...args);
  }

  async signinSilent(...args) {
    if (record.onBeforeSignin) {
      await record.onBeforeSignin(this, ...args);
    }

    return this._um.signinSilent(...args);
  }

  signinSilentCallback(...args) {
    return this._um.signinSilentCallback(...args);
  }

  async signoutRedirect(...args) {
    if (record.onBeforeSignout) {
      await record.onBeforeSignout(this, ...args);
    }

    return this._um.signoutRedirect(...args);
  }

  signoutRedirectCallback(...args) {
    return this._um.signoutRedirectCallback(...args);
  }

  async signoutPopup(...args) {
    if (record.onBeforeSignout) {
      await record.onBeforeSignout(this, ...args);
    }

    return this._um.signoutPopup(...args);
  }

  signoutPopupCallback(...args) {
    return this._um.signoutPopupCallback(...args);
  }

  removeUser() {
    return this._um.removeUser();
  }

  getUser() {
    return this._um.getUser();
  }

  querySessionStatus(...args) {
    return this._um.querySessionStatus(...args);
  }

  revokeAccessToken() {
    return this._um.revokeAccessToken();
  }

  // Internal functions.

  _clearStaleState() {
    return this._um.clearStaleState();
  }

  _getMetadata() {
    return this._um.metadataService.getMetadata();
  }
}

