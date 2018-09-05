import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import errorShape from '../shapes/error';

const styles = () => ({
});

function FatalErrorDialog(props) {
  const {
    onReloadClick,
    fullScreen,
    error,
    ...other
  } = props;

  const suffixes = [];
  if (!error.withoutFatalSuffix) {
    suffixes.push(
      <DialogContentText variant="body2" key="fatal-suffix">
        <FormattedMessage
          id="kpop.fatalErrorDialog.message"
          defaultMessage="This is a fatal error and the app needs to be reloaded."
        ></FormattedMessage>
      </DialogContentText>
    );
  }
  const reloadButtonText = error.reloadButtonText ?
    error.reloadButtonText :
    <FormattedMessage
      id="kpop.fatalErrorDialog.reloadButton.text"
      defaultMessage="Reload"
    ></FormattedMessage>;

  return (
    <Dialog
      fullScreen={fullScreen}
      {...other}
      aria-labelledby="kpop-fatal-error-dialog-title"
    >
      <DialogTitle id="kpop-fatal-error-dialog-title">{error.message}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          {error.detail}
        </DialogContentText>
        {suffixes}
      </DialogContent>
      <DialogActions>
        <Button onClick={onReloadClick} color="primary" autoFocus>
          {reloadButtonText}
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
  error: errorShape.isRequired,
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
