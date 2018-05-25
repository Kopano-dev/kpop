import { UserManager } from 'oidc-client';

const record = {
  userManager: null,
  metadata: null,
};

export function newUserManager(config) {
  const userManager = record.userManager = new UserManager(config);
  return userManager;
}
export function getUserManager() {
  return record.userManager;
}

export function setUserManagerMetadata(metadata) {
  record.metadata = metadata;
}
export function getUserManagerMetadata(userManager) {
  if (userManager !== record.userManager) {
    return null;
  }
  return record.metadata;
}
