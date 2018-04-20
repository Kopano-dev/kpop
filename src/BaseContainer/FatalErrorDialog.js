import React from 'react';
import PropTypes from 'prop-types';

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
          This is a fatal error and the app needs to be reloaded.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReloadClick} color="primary" autoFocus>
          Reload
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
