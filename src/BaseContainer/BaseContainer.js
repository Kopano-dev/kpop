import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import renderIf from 'render-if';

import FatalErrorDialog from './FatalErrorDialog';
import UpdateAvailableSnack from './UpdateAvailableSnack';
import errorShape from '../shapes/error';

class BaseContainer extends React.PureComponent {
  handleReload = (error=null) => async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (error && error.resolver) {
      // Special actions for error handling.
      await error.resolver();
    }

    window.location.reload();
  };

  render() {
    const {
      children,

      ready,
      error,
      updateAvailable,
    } = this.props;

    const readyAndNotFatalError = ready && (!error || !error.fatal);

    const ifReady = renderIf(readyAndNotFatalError);
    const ifNotReady = renderIf(!ready);
    const ifFatalError = renderIf(error && error.fatal);
    const ifUpdateAvailable = renderIf(updateAvailable);

    return (
      <React.Fragment>
        {ifReady(
          children
        )}
        {ifNotReady(
          <div id="loader">
            <FormattedMessage id="kpop.loader.initializing.message" defaultMessage="Initializing..."></FormattedMessage>
          </div>
        )}
        {ifFatalError(
          <FatalErrorDialog open error={error} onReloadClick={this.handleReload(error)}/>
        )}
        {ifUpdateAvailable(
          <UpdateAvailableSnack onReloadClick={this.handleReload()}/>
        )}
      </React.Fragment>
    );
  }
}

BaseContainer.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * If true the component will show its content.
   */
  ready: PropTypes.bool.isRequired,
  /**
   * If an error is provided, the component will show an error dialog.
   */
  error: errorShape,
  /**
   * If true the component will show a notification that an update is available.
   */
  updateAvailable: PropTypes.bool,
};

export default BaseContainer;
