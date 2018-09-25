import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import renderIf from 'render-if';

import FatalErrorDialog from './FatalErrorDialog';
import UpdateAvailableSnack from './UpdateAvailableSnack';
import errorShape from '../shapes/error';
import A2HsAvailableSnack from '../pwa/A2HsAvailableSnack';
import { triggerA2HsPrompt } from '../pwa/actions';

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

  handleA2Hs = () => {
    const { dispatch } = this.props;

    // Trigger system prompt.
    dispatch(triggerA2HsPrompt());
  }

  render() {
    const {
      children,

      ready,
      error,
      updateAvailable,
      a2HsAvailable,
    } = this.props;

    const readyAndNotFatalError = ready && (!error || !error.fatal);

    const ifReady = renderIf(readyAndNotFatalError);
    const ifNotReady = renderIf(!ready);
    const ifFatalError = renderIf(error && error.fatal);
    const ifUpdateAvailable = renderIf(updateAvailable);
    const ifA2HsAvailable = renderIf(!updateAvailable && a2HsAvailable);

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
        {ifA2HsAvailable(
          <A2HsAvailableSnack onAddClick={this.handleA2Hs}/>
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
   * A dispatch function, for example from redux.
   */
  dispatch: PropTypes.func.isRequired,
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
  /**
   * If true the component will showa notification that the app can be installed
   * to the home screen (Progressive web app app to home screen a2hs).
   */
  a2HsAvailable: PropTypes.bool,
};

export default BaseContainer;
