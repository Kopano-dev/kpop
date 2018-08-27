import {
  KPOP_OFFLINE_ONLINE,
  KPOP_OFFLINE_OFFLINE,
} from './constants';
import { getOfflineManager, newOfflineManager } from './offlinemanager';

export function initialize() {
  return async (dispatch) => {
    const mgr = await dispatch(getOrCreateOfflineManager());

    return mgr.online;
  };
}

export function getOrCreateOfflineManager() {
  return async (dispatch) => {
    let offlineManager = getOfflineManager();
    if (offlineManager) {
      return offlineManager;
    }

    return dispatch(createOfflineManager());
  };
}

export function createOfflineManager() {
  return async (dispatch) => {
    const mgr = newOfflineManager(async mgr => {
      return dispatch(nowOffline(mgr));
    }, async mgr => {
      return dispatch(nowOnline(mgr));
    });

    await dispatch(mgr.online ? nowOnline(mgr) : nowOffline(mgr));
    return mgr;
  };
}

export function nowOnline(mgr) {
  const { wasInitiallyOnline , wasOnlineBefore, wasOnlineOnce, wasOfflineOnce } = mgr;

  return {
    type: KPOP_OFFLINE_ONLINE,
    offline: false,

    wasInitiallyOnline,
    wasOnlineBefore,
    wasOnlineOnce,
    wasOfflineOnce,
  };
}

export function nowOffline(mgr) {
  const { wasInitiallyOnline , wasOnlineBefore, wasOnlineOnce, wasOfflineOnce } = mgr;

  return {
    type: KPOP_OFFLINE_OFFLINE,
    offline: true,

    wasInitiallyOnline,
    wasOnlineBefore,
    wasOnlineOnce,
    wasOfflineOnce,
  };
}
