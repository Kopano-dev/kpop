import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import renderIf from 'render-if';

import FatalErrorDialog from './FatalErrorDialog';
import SigninDialog from './SigninDialog';
import UpdateAvailableSnack from './UpdateAvailableSnack';
import { BaseContext } from './BaseContext';

import A2HsAvailableSnack from '../pwa/A2HsAvailableSnack';
import { errorShape, embeddedShape } from '../shapes';
import { isInFrame } from '../utils';
import { triggerA2HsPrompt } from '../pwa/actions';
import { startSignin } from '../oidc/actions';
import { KPOP_ERRORID_USER_REQUIRED } from '../common/constants';
import SnackbarProvider from './SnackbarProvider';

const defaultConfig = {};  // Default config is empty;
function getDefaultConfig() {
  return defaultConfig;
}

const defaultEmbedded = {
  enabled: undefined,
  mode: undefined,
  wait: false,
  bound: false,
};
function getDefaultEmbedded() {
  const embedded = defaultEmbedded;
  if (embedded.enabled !== undefined) {
    // Already set up.
    return embedded;
  }
  embedded.enabled = false;

  if (isInFrame()) {
    embedded.enabled = true;
    embedded.mode = ''; // Empty string mode means the simplest of all modes which requires no initialization.
  }

  return embedded;
}

class BaseContainer extends React.PureComponent {
  state = {
    value: {},
  }

  static getDerivedStateFromProps(props, state) {
    const { config, embedded } = props;

    if (state.value.config === config) {
      return null;
    }

    return {
      value: {
        config: config ? config : getDefaultConfig(),
        embedded: embedded ? embedded : getDefaultEmbedded(),
      },
    };
  }

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

  handleSignIn = (error=null) => async () => {
    const { dispatch } = this.props;
    if (error && error.resolver) {
      // Special actions for error handling.
      try {
        await error.resolver();
      } catch(err) {
        console.warn('error while resolving sign-in', err); // eslint-disable-line no-console
      }
    } else {
      await dispatch(startSignin());
    }
  }

  render() {
    const {
      children,

      ready,
      error,
      updateAvailable,
      a2HsAvailable,
      withSnackbar,
    } = this.props;

    const { embedded } = this.state.value;

    const readyAndNotFatalError = ready && !embedded.wait && (!error || !error.fatal);

    const ifReady = renderIf(readyAndNotFatalError);
    const ifNotReady = renderIf(!ready || embedded.wait);
    const ifFatalError = renderIf(error && error.fatal);
    const ifUpdateAvailable = renderIf(updateAvailable);
    const ifA2HsAvailable = renderIf(!updateAvailable && a2HsAvailable);

    return (
      <BaseContext.Provider value={this.state.value}>
        <SnackbarProvider withSnackbar={withSnackbar}>
          {ifReady(
            children
          )}
          {ifNotReady(
            <React.Fragment>
              <div id="loader">
                <FormattedMessage
                  id="kpop.loader.initializing.message"
                  defaultMessage="Initializing...">
                </FormattedMessage>
              </div>
            </React.Fragment>
          )}
          {ifFatalError(
            this.fatalErrorDialog(error)
          )}
          {ifUpdateAvailable(
            <UpdateAvailableSnack onReloadClick={this.handleReload()}/>
          )}
          {ifA2HsAvailable(
            <A2HsAvailableSnack onAddClick={this.handleA2Hs}/>
          )}
        </SnackbarProvider>
      </BaseContext.Provider>
    );
  }

  fatalErrorDialog = (error) => {
    if (!error) {
      return;
    }

    switch (error.id) {
      case KPOP_ERRORID_USER_REQUIRED:
        return <SigninDialog
          open fullWidth maxWidth="xs" disableBackdropClick disableEscapeKeyDown
          onSignInClick={this.handleSignIn(error)}
          PaperProps={{elevation: 0}}
        />;

      default:
        return <FatalErrorDialog open error={error} onReloadClick={this.handleReload(error)}/>;
    }
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
   * If true the component with also be add a snackbar.
   */
  withSnackbar: PropTypes.bool,
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
  /**
   * The app configuration object. This value is made available by the
   * integrated BaseContext.
   */
  config: PropTypes.object,
  /**
   * The app embedded object. This value is made available by the integrated
   * BaseContext and contains helpers and information if the app is running
   * embedded within another app.
   */
  embedded: embeddedShape,
};

export default BaseContainer;
