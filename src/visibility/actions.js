import {
  KPOP_VISIBILITY_CHANGE,
} from './constants';
import { getVisibilityManager, newVisibilityManager } from './visibilitymanager';

export function initialize() {
  return async (dispatch) => {
    const mgr = await dispatch(getOrCreateVisibilityManager());

    return mgr.initiallyHidden;
  };
}

export function getOrCreateVisibilityManager() {
  return async (dispatch) => {
    let visibilityManager = getVisibilityManager();
    if (visibilityManager) {
      return visibilityManager;
    }

    return dispatch(createVisbilityManager());
  };
}

export function createVisbilityManager() {
  return async (dispatch) => {
    const mgr = newVisibilityManager(async ({hidden, visibilityState}) => {
      return dispatch(visbilityChange(hidden, visibilityState));
    });

    await dispatch(visbilityChange(mgr.initiallyHidden, mgr.initialVisibilityState));
    return mgr;
  };
}

export function visbilityChange(hidden, visibilityState) {
  return {
    type: KPOP_VISIBILITY_CHANGE,
    hidden,
    visibilityState,
  };
}
