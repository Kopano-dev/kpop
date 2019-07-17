import React from 'react';
import PropTypes from 'prop-types';

import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';

function SnackbarProvider(props) {
  const { withSnackbar, children, ...other } = props;

  if (!withSnackbar) {
    return children;
  }

  return <NotistackSnackbarProvider {...other}>
    {children}
  </NotistackSnackbarProvider>;
}

SnackbarProvider.defaultProps = {
  maxSnack: 3,
  anchorOrigin: {
    horizontal: 'center',
    vertical: 'top',
  },
};

SnackbarProvider.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * If true the component with also be add a snackbar, otherwise just its
   * children.
   */
  withSnackbar: PropTypes.bool,

  /**
   * The maximum number of snaks visible at the same time.
   */
  maxSnack: PropTypes.number.isRequired,
  /**
   * Position of the nach bac.
   */
  anchorOrigin: PropTypes.object.isRequired,
};

export default SnackbarProvider;
