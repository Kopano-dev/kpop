import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

function UpdateAvailableSnack(props) {
  const { onReloadClick } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
      open
      action={<Button color="secondary" size="small" onClick={onReloadClick}>
        <FormattedMessage
          id="kpop.updateAvailableSnack.reloadButton.text"
          defaultMessage="Reload"
        ></FormattedMessage>
      </Button>}
      SnackbarContentProps={{
        'aria-describedby': 'kpop-update-available-snack-message-id',
      }}
      message={
        <span id="kpop-update-available-snack-message-id">
          <FormattedMessage
            id="kpop.updateAvailableSnack.message"
            defaultMessage="Update available"
          ></FormattedMessage>
        </span>}
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
