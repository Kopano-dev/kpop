import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from 'react-intl';

import Button from '@material-ui/core/Button';

import { withSnackbar } from './SnackbarContext';

import {
  removeSnackbar,
} from '../common/actions';

const Notification = React.memo(function Notification({ dispatch, intl, enqueueSnackbar, closeSnackbar, notification }) {
  useEffect(() => {
    let { message, values, error, options = {} } = notification;
    let closed = false;

    // Translation support.
    if (typeof message !== 'string') {
      message = intl.formatMessage(message, values);
    }

    // Generate action if an error with an resolver is set.
    const action = {};
    if (error && error.resolver) {
      let buttonText = error.reloadButtonText ? error.reloadButtonText : 'Retry';
      if (typeof buttonText !== 'string') {
        buttonText = intl.formatMessage(buttonText, values);
      }
      action.action = key => {
        return <Button
          size="small"
          onClick={async () => {
            try {
              await error.resolver();
            } catch(e) {
              console.error(e);
              return;
            }
            await dispatch(removeSnackbar(key));
          }}
        >
          {buttonText.toLowerCase()}
        </Button>
      }
    }

    // Display.
    const key = enqueueSnackbar(message, {
      ...action,
      ...options,
      onClose: (event, reason, key) => {
        if (options.onClose) {
          options.onClose(event, reason, key);
        }
        closed = true;
        dispatch(removeSnackbar(key));
      },
    });

    // Cleanup via unmount handler.
    return () => {
      if (!closed) {
        closeSnackbar(key);
      }
    }
  }, []);

  return null;
});

class Notifier extends React.PureComponent {
  render() {
    const {
      notifications,
      ...other
    } = this.props;

    return <React.Fragment>
      {notifications.map(notification => {
        const { uid } = notification;
        return <Notification
          key={uid}
          notification={notification}
          {...other}
        ></Notification>
      })}
    </React.Fragment>;
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
