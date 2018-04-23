import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

const styles = () => ({
});

function FatalErrorDialog(props) {
  const {
    onReloadClick,
    fullScreen,
    error,
    ...other
  } = props;

  return (
    <Dialog
      fullScreen={fullScreen}
      {...other}
      aria-labelledby="kpop-fatal-error-dialog-title"
    >
      <DialogTitle id="kpop-fatal-error-dialog-title">{error.message}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {error.detail}
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="kpop.fatalErrorDialog.message"
            defaultMessage="This is a fatal error and the app needs to be reloaded."
          ></FormattedMessage>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReloadClick} color="primary" autoFocus>
          <FormattedMessage
            id="kpop.fatalErrorDialog.reloadButton.text"
            defaultMessage="Reload"
          ></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FatalErrorDialog.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * The error what will be shown.
   */
  error: PropTypes.shape({
    message: PropTypes.string,
    detail: PropTypes.string,
  }).isRequired,
  /**
   * Callback fired when the reload button is clicked.
   */
  onReloadClick: PropTypes.func.isRequired,
  /**
   * If `true`, the dialog will be full-screen
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the FatalErrorDialog is open.
   */
  open: PropTypes.bool.isRequired,
};


export default withMobileDialog()(withStyles(styles)(FatalErrorDialog));
