import {
  KPOP_VISIBILITY_CHANGE,
} from './constants';
import { getVisibilityManager, newVisibilityManager } from './visibilitymanager';

export function initialize(glue=null) {
  return async (dispatch) => {
    const mgr = await dispatch(getOrCreateVisibilityManager(glue));

    return mgr.initiallyHidden;
  };
}

export function getOrCreateVisibilityManager(glue=null) {
  return async (dispatch) => {
    let visibilityManager = getVisibilityManager();
    if (visibilityManager) {
      return visibilityManager;
    }

    return dispatch(createVisbilityManager(glue));
  };
}

export function createVisbilityManager(glue=null) {
  return async (dispatch) => {
    const mgr = newVisibilityManager(async ({hidden, visibilityState}) => {
      return dispatch(visbilityChange(hidden, visibilityState));
    }, glue);

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
