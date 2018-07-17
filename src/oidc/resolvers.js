import {
  registerResolver,
} from '../errors/resolver';

import {
  KPOP_RESET_USER,
  KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN,
} from './constants';
import {
  getOrCreateUserManager,
  signinRedirect,
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
    await dispatch(signinRedirect({
      prompt,
    }));
  };
}

const register = () => {
  registerResolver(KPOP_RESET_USER, resetUser);
  registerResolver(KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN, resetUserAndRedirectToSignin);
};

export default register;
