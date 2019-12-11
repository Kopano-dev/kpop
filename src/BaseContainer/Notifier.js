import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from 'react-intl';

import { withSnackbar } from './SnackbarContext';

import {
  removeSnackbar,
} from '../common/actions';

class Notifier extends React.PureComponent {
  displayed = [];

  storeDisplayed = key => {
    this.displayed = [ ...this.displayed, key ];
  }

  removeDisplayed = key => {
    this.displayed = this.displayed.filter(k => key !== k);
  }

  componentDidUpdate() {
    const {
      dispatch,
      intl,
      enqueueSnackbar,
      closeSnackbar,
      notifications = [],
    } = this.props;

    notifications.forEach(({ key, message, values, options = {}, dismissed = false }) => {
      // Fastpass to dismiss.
      if (dismissed) {
        closeSnackbar(key);
        return;
      }

      // Avoid to display again.
      if (this.displayed.includes(key)) {
        return;
      }

      // Translation support.
      if (typeof message !== 'string') {
        message = intl.formatMessage(message, values);
      }

      // Display.
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, key) => {
          if (options.onClose) {
            options.onClose(event, reason, key);
          }
        },
        onExited: (event, key) => {
          dispatch(removeSnackbar(key));
          this.removeDisplayed(key);
        },
      });

      // Keep track.
      this.storeDisplayed(key);
    });
  }

  render() {
    return null;
  }
}

Notifier.defaultProps = {
  notifications: [],
};

Notifier.propTypes = {
  /**
   * Internationalization api.
   */
  intl: intlShape.isRequired,
  /**
   * Helper function to enqueue notification to snackbar.
   */
  enqueueSnackbar: PropTypes.func.isRequired,
  /**
   * Helper function to dismiss notification from snackbar.
   */
  closeSnackbar: PropTypes.func.isRequired,
  /**
   * A dispatch function, for example from redux.
   */
  dispatch: PropTypes.func.isRequired,
  /**
   * Notifications array.
   */
  notifications: PropTypes.array.isRequired,
};

export default withSnackbar(injectIntl(Notifier));
