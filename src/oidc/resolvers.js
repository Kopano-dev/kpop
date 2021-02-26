import {
  registerResolver,
} from '../errors/resolver';
import {
  clearError,
} from '../errors/actions';

import {
  KPOP_RESET_USER,
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
  KPOP_RESTART_SIGNIN_SILENT,
} from './constants';
import {
  getOrCreateUserManager,
  startSignin,
  fetchUserSilent,
} from './actions';

function resetUser(error) { // eslint-disable-line no-unused-vars
  return async (dispatch) => {
    const userManager = await dispatch(getOrCreateUserManager());

    await userManager.removeUser();
  };
}

function resetUserAndRedirectToSignin(error, prompt='select_account') {
  return async (dispatch) => {
    await dispatch(resetUser(error));
    await dispatch(startSignin({
      prompt,
    }));
  };
}

function restartSigninSilent() {
  return async (dispatch) => {
    const user = await dispatch(fetchUserSilent());
    if (!user || !user.access_token || user.expired) {
      throw new Error('failed to restart silent sign in');
    }
    await dispatch(clearError({
      resolution: KPOP_RESTART_SIGNIN_SILENT,
    }, 'resolution'));
  };
}

const register = () => {
  registerResolver(KPOP_RESET_USER, resetUser);
  registerResolver(KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN, resetUserAndRedirectToSignin);
  registerResolver(KPOP_RESTART_SIGNIN_SILENT, restartSigninSilent);
};

export default register;
