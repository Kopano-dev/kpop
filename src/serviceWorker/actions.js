import {
  KPOP_SERVICE_WORKER_NEW_CONTENT,
  KPOP_SERVICE_WORKER_READY,
  KPOP_SERVICE_WORKER_ERROR,
  KPOP_SERVICE_WORKER_OFFLINE,
}  from './constants';

export function newContent() {
  return {
    type: KPOP_SERVICE_WORKER_NEW_CONTENT,
  };
}

export function readyForOfflineUse() {
  return {
    type: KPOP_SERVICE_WORKER_READY,
  };
}

export function registrationError(error) {
  return {
    type: KPOP_SERVICE_WORKER_ERROR,
    error,
  };
}

export function isOfflineMode() {
  return {
    type: KPOP_SERVICE_WORKER_OFFLINE,
  };
}
