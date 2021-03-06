import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const UpdateAvailableSnack = React.forwardRef(function UpdateAvailableSnack(props, ref) {
  const { anchorOrigin, onReloadClick, open } = props;

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      ref={ref}
      action={<Button color="primary" size="small" onClick={onReloadClick}>
        <FormattedMessage
          id="kpop.updateAvailableSnack.reloadButton.text"
          defaultMessage="Reload"
        ></FormattedMessage>
      </Button>}
      ContentProps={{
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
});

UpdateAvailableSnack.defaultProps = {
  open: true,
  anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
};

UpdateAvailableSnack.propTypes = {
  /**
   * The anchor of the `Snackbar`.
   */
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf(['left', 'center', 'right']),
    ]),
    vertical: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['top', 'center', 'bottom'])]),
  }),
  /**
   * Callback fired when the reload button is clicked.
   */
  onReloadClick: PropTypes.func.isRequired,
  /**
   * If true, `Snackbar` is open.
   */
  open: PropTypes.bool,
};

export default UpdateAvailableSnack;
