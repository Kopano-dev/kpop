import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { KopanoLogo } from '../logos';

const styles = () => ({
  kopanoLogo: {
    height: 22,
  },
  title: {
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
    marginBottom: 20,
  },
});

function SigninDialog(props) {
  const {
    classes,
    onSignInClick,
    fullScreen,
    ...other
  } = props;

  return (
    <Dialog
      fullScreen={fullScreen}
      {...other}
      aria-labelledby="kpop-sign-in-dialog-title"
    >
      <DialogTitle id="kpop-sign-in-dialog-title" className={classes.title}><img src={KopanoLogo} className={classes.kopanoLogo} alt="Kopano"/></DialogTitle>
      <DialogActions className={classes.actions}>
        <Button variant="outlined" onClick={onSignInClick} color="primary" autoFocus>
          Sign in
        </Button>
      </DialogActions>

    </Dialog>
  );
}

SigninDialog.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Callback fired when the reload button is clicked.
   */
  onSignInClick: PropTypes.func.isRequired,
  /**
   * If `true`, the dialog will be full-screen
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the FatalErrorDialog is open.
   */
  open: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles)(SigninDialog));
