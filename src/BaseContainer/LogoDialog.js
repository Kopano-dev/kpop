import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
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

const LogoDialog = React.forwardRef(function LogoDialog(props, ref) {
  const {
    classes,
    fullScreen,
    open,
    actions,
    children,
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
      open={open}
      BackdropProps={{
        className: classes.backdrop,
      }}
      ref={ref}
      {...other}
    >
      <DialogTitle className={classes.title}>{logo}</DialogTitle>
      <DialogActions className={classes.actions}>
        {actions}
      </DialogActions>
      {children}
    </Dialog>
  );
});

LogoDialog.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * If `true`, the dialog will be full-screen
   */
  fullScreen: PropTypes.bool,
  /**
   * If `true`, the dialog is open.
   */
  open: PropTypes.bool.isRequired,
  /**
   * Additional content of the component, used after the actions.
   */
  children: PropTypes.node,
  /**
   * Actions of the component.
   */
  actions: PropTypes.node,
};

export default withStyles(styles, { name: 'KpopLogoDialog' })(LogoDialog);
