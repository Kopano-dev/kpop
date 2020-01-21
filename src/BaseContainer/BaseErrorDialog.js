import React from 'react';
import PropTypes from 'prop-types';

import errorShape from '../shapes/error';
import { KPOP_ERRORID_USER_REQUIRED } from '../common/constants';
import FatalErrorDialog from './FatalErrorDialog';
import SigninDialog from './SigninDialog';

const BaseErrorDialog = React.forwardRef(function BaseErrorDialog(props, ref) {
  const {
    error,
    onSigninClick,
    onReloadClick,
  } = props;

  if (!error) {
    return null;
  }

  switch (error.id) {
    case KPOP_ERRORID_USER_REQUIRED:
      return <SigninDialog
        ref={ref}
        open fullWidth maxWidth="xs" disableBackdropClick disableEscapeKeyDown
        onSigninClick={onSigninClick}
        PaperProps={{elevation: 0}}
      />;

    default:
      return <FatalErrorDialog open error={error} onReloadClick={onReloadClick} ref={ref}/>;
  }

});

BaseErrorDialog.propTypes = {
  /**
   * The error what will be shown.
   */
  error: errorShape,
  /**
   * Callback fired when the reload button is clicked.
   */
  onSigninClick: PropTypes.func.isRequired,
  /**
   * Callback fired when the reload button is clicked.
   */
  onReloadClick: PropTypes.func.isRequired,
};

export default BaseErrorDialog;
