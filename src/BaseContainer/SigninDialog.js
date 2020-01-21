import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';

import LogoDialog from './LogoDialog';

const SigninDialog = React.forwardRef(function SigninDialog(props, ref) {
  const {
    fullScreen,
    open,
    onSigninClick,
    ...other
  } = props;

  return (
    <LogoDialog
      fullScreen={fullScreen}
      open={open}
      ref={ref}
      actions={
        <Button variant="outlined" onClick={onSigninClick} color="primary" autoFocus>
          <FormattedMessage
            id="kpop.signinDialog.signInButton.text"
            defaultMessage="Sign in">
          </FormattedMessage>
        </Button>
      }
      {...other}
    ></LogoDialog>
  );
});

SigninDialog.propTypes = {
  /**
   * Callback fired when the reload button is clicked.
   */
  onSigninClick: PropTypes.func.isRequired,
  /**
   * If `true`, the dialog will be full-screen
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the dialog is open.
   */
  open: PropTypes.bool.isRequired,
};

export default SigninDialog;
