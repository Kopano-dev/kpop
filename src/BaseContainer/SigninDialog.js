import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { KopanoLogo } from '../logos';

const styles = () => ({
  kopanoLogo: {
    height: 48,
    maxWidth: 160,
  },
  appLogo: {
    maxHeight: 160,
    maxWidth: 160,
  },
  title: {
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
    marginBottom: 20,
  },
  backdrop: {
    backgroundColor: 'white',
  },
});

function SigninDialog(props) {
  const {
    classes,
    onSignInClick,
    fullScreen,
    ...other
  } = props;

  // FIXME(longsleep): Crappy dom code follows, extracts any image from the
  // bg element and instead should allow customization somehow.
  let logo;
  const bg = document.getElementById('bg');
  if (bg) {
    const style = window.getComputedStyle(bg);
    let bgImage = style.getPropertyValue('background-image');
    if (bgImage) {
      bgImage = bgImage.substring(5, bgImage.length - 2); // Strips url("...") enclosure.
      logo = <img src={bgImage} className={classes.appLogo} alt=""/>;
    }
  }
  if (!logo) {
    logo = <img src={KopanoLogo} className={classes.kopanoLogo} alt="Kopano"/>;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      BackdropProps={{
        className: classes.backdrop,
      }}
      {...other}
      aria-labelledby="kpop-sign-in-dialog-title"
    >
      <DialogTitle id="kpop-sign-in-dialog-title" className={classes.title}>{logo}</DialogTitle>
      <DialogActions className={classes.actions}>
        <Button variant="outlined" onClick={onSignInClick} color="primary" autoFocus>
          <FormattedMessage
            id="kpop.signinDialog.signInButton.text"
            defaultMessage="Sign in">
          </FormattedMessage>
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

export default withStyles(styles)(SigninDialog);
