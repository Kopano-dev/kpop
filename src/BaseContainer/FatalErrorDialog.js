import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import errorShape from '../shapes/error';
import sleep from '../utils/sleep';

const styles = () => ({
  paper: {
    minWidth: 'max(300px, 30%)',
  },
});

const FatalErrorDialog = React.forwardRef(function FatalErrorDialog(props, ref) {
  const {
    classes,
    intl,
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

  // Translation support.
  let { message, detail, values, reloadButtonText } = error;
  if (reloadButtonText && typeof reloadButtonText !== 'string') {
    reloadButtonText = intl.formatMessage(reloadButtonText, values);
  }
  if (!reloadButtonText) {
    reloadButtonText = <FormattedMessage
      id="kpop.fatalErrorDialog.reloadButton.text"
      defaultMessage="Reload"
      values={values}
    ></FormattedMessage>;
  }
  if (message && typeof message !== 'string') {
    message = intl.formatMessage(message, values);
  }
  if (detail && typeof detail !== 'string') {
    detail = intl.formatMessage(detail, values);
  }

  const [pending, setPending] = useState(false);
  const handleReloadClick = useCallback(async () => {
    setPending(true);
  }, [onReloadClick, setPending]);
  useEffect(async () => {
    if (pending) {
      await sleep(500);
      try {
        await onReloadClick();
      } catch(e) {
        console.error(e); // eslint-disable-line no-console
        setPending(false); // Allow to click again, on error.
      }
    }
  }, [setPending, pending]);

  return (
    <Dialog
      fullScreen={fullScreen}
      PaperProps={{
        className: classes.paper,
      }}
      ref={ref}
      {...other}
      aria-labelledby="kpop-fatal-error-dialog-title"
    >
      <DialogTitle id="kpop-fatal-error-dialog-title">{message}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          {detail}
        </DialogContentText>
        {suffixes}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReloadClick} color="primary" autoFocus disabled={pending}>
          {reloadButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

FatalErrorDialog.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Internationalization support.
   */
  intl: intlShape.isRequired,
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


export default withMobileDialog()(withStyles(styles, { name: 'KpopFatalErrorDialog' })(injectIntl(FatalErrorDialog)));
