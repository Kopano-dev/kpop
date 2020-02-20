import React from 'react';
import PropTypes from 'prop-types';

import {injectIntl, intlShape, defineMessages, FormattedMessage} from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
});

const translations = defineMessages({
  closeButtonAriaLabel: {
    id: 'kpop.a2A2HsAvailableSnack.closeButton.ariaLabel',
    defaultMessage: 'close',
  },
});

class A2HsAvailableSnack extends React.PureComponent {
  state = {
    closed: false,
  };

  handleAddClick = () => {
    const { onAddClick } = this.props;

    this.setState({
      closed: true,
    });

    onAddClick();
  }

  handleClose = () => {
    this.setState({
      closed: true,
    });
  }

  render() {
    const { classes, anchorOrigin, open, intl } = this.props;
    const { closed } = this.state;

    const show = open && !closed;

    return (
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={show}
        onClose={this.handleClose}
        action={[
          <Button key="add" color="primary" size="small" onClick={this.handleAddClick}>
            <FormattedMessage
              id="kpop.a2hsAvailableSnack.addButton.text"
              defaultMessage="Add"
            ></FormattedMessage>
          </Button>,
          <IconButton
            key="close"
            aria-label={intl.formatMessage(translations.closeButtonAriaLabel)}
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
        ContentProps={{
          'aria-describedby': 'kpop-a2hs-available-snack-message-id',
        }}
        message={
          <span id="kpop-a2hs-available-snack-message-id">
            <FormattedMessage
              id="kpop.a2hsAvailableSnack.message"
              defaultMessage="Install as app"
            ></FormattedMessage>
          </span>}
      />
    );
  }
}

A2HsAvailableSnack.defaultProps = {
  open: true,
  anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
};

A2HsAvailableSnack.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Internationalization api.
   */
  intl: intlShape.isRequired,
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
   * Callback fired when the add button is clicked.
   */
  onAddClick: PropTypes.func.isRequired,
  /**
   * If true, `Snackbar` is open.
   */
  open: PropTypes.bool,
};

export default  injectIntl(withStyles(styles, { name: 'KpopA2HsAvailableSnack' })(A2HsAvailableSnack));
