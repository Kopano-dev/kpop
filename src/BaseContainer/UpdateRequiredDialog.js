import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import LogoDialog from './LogoDialog';

const styles = () => ({
  spinner: {},
});

const UpdateRequiredDialog = React.forwardRef(function UpdateRequiredDialog(props, ref) {
  const {
    classes,
    fullScreen,
    open,
    updateAvailable,
    onReloadClick,
    ...other
  } = props;

  if (updateAvailable && onReloadClick) {
    console.info('auto trigger of reload after update became available.'); // eslint-disable-line no-console
    Promise.resolve().then(onReloadClick);
  }

  return (
    <LogoDialog
      fullScreen={fullScreen}
      open={open}
      ref={ref}
      actions={
        <Typography variant="subtitle1">
          <FormattedMessage
            id="kpop.updateRequiredDialog.message.appIsUpdating"
            defaultMessage="Please wait while the app is updating ...">
          </FormattedMessage>
        </Typography>
      }
      {...other}
    >
      <DialogContent className={classes.spinner}>
        <LinearProgress/>
      </DialogContent>
    </LogoDialog>
  );
});

UpdateRequiredDialog.propTypes = {
  /**
  * Useful to extend the style applied to components.
  */
  classes: PropTypes.object.isRequired,
  /**
   * Callback fired when the reload button is clicked.
   */
  onReloadClick: PropTypes.func.isRequired,
  /**
   * If `true`, the dialog will be full-screen
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the dialog is open.
   */
  open: PropTypes.bool.isRequired,
  /**
   * If `true`, an update is available.
   */
  updateAvailable: PropTypes.bool.isRequired,
};

export default withStyles(styles, { name: 'KpopUpdateRequiredDialog' })(UpdateRequiredDialog);
