import {
  registerResolver,
} from '../errors/resolver';
import {
  clearError,
} from '../errors/actions';

import {
  KPOP_RESET_USER,
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
} from './constants';
import {
  getOrCreateUserManager,
  startSignin,
} from './actions';

function resetUser() {
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
    await dispatch(clearError(error));
  };
}

const register = () => {
  registerResolver(KPOP_RESET_USER, resetUser);
  registerResolver(KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN, resetUserAndRedirectToSignin);
};

export default register;
