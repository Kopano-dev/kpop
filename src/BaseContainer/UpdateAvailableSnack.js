import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

function UpdateAvailableSnack(props) {
  const { onReloadClick } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
      open
      action={<Button color="secondary" size="small" onClick={onReloadClick}>
        Reload
      </Button>}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">Update available</span>}
    />
  );
}

UpdateAvailableSnack.propTypes = {
  /**
   * Callback fired when the reload button is clicked.
   */
  onReloadClick: PropTypes.func.isRequired,
};

export default UpdateAvailableSnack;
