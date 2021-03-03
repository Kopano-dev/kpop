import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import * as Glue from '@gluejs/glue';

import A2HsAvailableSnack from '../pwa/A2HsAvailableSnack';
import { errorShape, embeddedShape } from '../shapes';
import { isInFrame } from '../utils';
import { triggerA2HsPrompt } from '../pwa/actions';
import { startSignin } from '../oidc/actions';
import { glueGlued } from '../common/actions';
import { initialize as initializeVisibility } from '../visibility/actions';
import { initialize as initializeOffline } from '../offline/actions';
import { reloadAfterUpdate, reloadWithState } from '../config/actions';

import BaseErrorDialog from './BaseErrorDialog';
import UpdateRequiredDialog from './UpdateRequiredDialog';
import UpdateAvailableSnack from './UpdateAvailableSnack';
import { BaseContext } from './BaseContext';
import SnackbarProvider from './SnackbarProvider';
import Notifier from './Notifier';

const defaultConfig = {};  // Default config is empty;
function getDefaultConfig() {
  return defaultConfig;
}

const defaultEmbedded = {
  enabled: false,
  mode: undefined,
  wait: true,
  bound: false,
};
function getDefaultEmbedded(embedded, options={}) {
  if (embedded !== undefined) {
    // Already set up.
    return embedded;
  }
  embedded = {
    ...defaultEmbedded,
    ...options,
  };
  if (isInFrame()) {
    embedded.enabled = true;
    embedded.mode = ''; // Empty string mode means the simplest of all modes which requires no initialization.
  }

  return embedded;
}

class BaseContainer extends React.PureComponent {
  state = {
    value: {},
    initialized: false,
    updateRequired: false,
  }

  static getDerivedStateFromProps(props, state) {
    const { config, withGlue, embedded, currentVersion } = props;

    if (config !== undefined && state.value.config === config) {
      return null;
    }

    return {
      updateRequired: config && config.minimumVersion && config.minimumVersion > currentVersion,
      value: {
        config: config ? config : getDefaultConfig(),
        embedded: embedded ? embedded : getDefaultEmbedded(state.value.embedded, {
          wait: !!withGlue,
        }),
      },
    };
  }

  componentDidMount() {
    Promise.all([
      this.initializeGlue().then(glue => this.initializeVisibility(glue)),
      this.initializeOffline(),
    ]).then(() => {
      this.setState({
        initialized: true,
      });
    });
  }

  initializeOffline = async () => {
    const { dispatch, withOffline } = this.props;

    if (withOffline) {
      await dispatch(initializeOffline());
    }
  }

  initializeGlue = async () => {
    const { value } = this.state;
    const { dispatch, events, features } = this.props;

    if (!value.embedded.wait) {
      return;
    }

    return new Promise(resolve => {
      Glue.enable(window.parent, {
        events,
        features,
        origins: ['*'], // TODO(longsleep): Add origin white list to configuration.
        onBeforeReady: (glue) => {
          // Glue is ready, set to state, this continues and renders the app.
          dispatch(glueGlued(glue));
          this.setState({
            value: {
              ...value,
              embedded: {
                ...value.embedded,
                enabled: true,
                mode: glue.mode,
                wait: false,
              },
            },
          });
          resolve(glue);
        },
      }).then(glue => {
        if (glue.mode === undefined) {
          // When no Glue, continue just normal.
          this.setState({
            value: {
              ...value,
              embedded: {
                ...value.embedded,
                wait: false,
              },
            },
          });
        }
        resolve(glue);
      }).catch(err => {
        console.error('error while Glue enable', err); // eslint-disable-line no-console
        resolve(undefined);
      });
    });
  };

  initializeVisibility = async (glue) => {
    const { dispatch, withVisibility } = this.props;

    if (withVisibility) {
      await dispatch(initializeVisibility(glue));
    }
  }

  handleReloadClick = (error=null) => async (event) => {
    const { dispatch } = this.props;

    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (error && error.resolver) {
      // Special actions for error handling.
      await error.resolver();
      if (error.withoutReloadAfterResolve) {
        // Exit early, resolve is the last action if flag is set.
        return;
      }
    }

    dispatch(reloadWithState());
  };

  handleUpdateClick = () => {
    const { dispatch } = this.props;

    dispatch(reloadAfterUpdate());
  }

  handleA2HsClick = () => {
    const { dispatch } = this.props;

    // Trigger system prompt.
    dispatch(triggerA2HsPrompt());
  }

  handleSigninClick = (error=null) => async () => {
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
      dispatch,
      children,

      config,
      ready: readyProp,
      error,
      updateAvailable,
      updateRequired: updateRequiredProp,
      a2HsAvailable,
      withSnackbar,
      notifications,
    } = this.props;

    const { initialized, updateRequired: updateRequiredState } = this.state;
    const { embedded } = this.state.value;

    const updateRequired = Boolean(updateRequiredProp || updateRequiredState);
    const ready = Boolean(readyProp && initialized && !embedded.wait && !updateRequired && config);
    const readyAndNotFatalError = Boolean(ready && (!error || !error.fatal));

    return (
      <BaseContext.Provider value={this.state.value}>
        <SnackbarProvider withSnackbar={withSnackbar}>
          {(notifications !== undefined) && (
            <Notifier dispatch={dispatch} notifications={notifications}/>
          )}
          {(readyAndNotFatalError) && (
            children
          )}
          {(!ready || !config || !config.ready) && (
            <React.Fragment>
              <div id="loader">
                {(!ready || !config) ?
                  <FormattedMessage
                    id="kpop.loader.initializing.message"
                    defaultMessage="Initializing...">
                  </FormattedMessage>
                  :
                  <FormattedMessage
                    id="kpop.loader.connecting.message"
                    defaultMessage="Connecting...">
                  </FormattedMessage>
                }
              </div>
            </React.Fragment>
          )}
          {(error && error.fatal) && (
            <BaseErrorDialog
              error={error}
              onSigninClick={this.handleSigninClick(error)}
              onReloadClick={this.handleReloadClick(error)}
            />
          )}
          {(updateAvailable && !updateRequired) && (
            <UpdateAvailableSnack onReloadClick={this.handleUpdateClick}/>
          )}
          {(updateRequired) && (
            <UpdateRequiredDialog
              open
              fullWidth
              maxWidth={false}
              disableBackdropClick
              disableEscapeKeyDown
              PaperProps={{elevation: 0}}
              onReloadClick={this.handleUpdateClick}
              updateAvailable={updateAvailable}
            />
          )}
          {(a2HsAvailable && !updateAvailable && !updateRequired) && (
            <A2HsAvailableSnack onAddClick={this.handleA2HsClick}/>
          )}
        </SnackbarProvider>
      </BaseContext.Provider>
    );
  }
}

BaseContainer.defaultProps = {
  withGlue: true,
  withVisibility: true,
  withOffline: true,
  currentVersion: 1,
};

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
   * If true and if the component otherwise is ready and initialized, children
   * are rendered.
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
   * If true the component will show a update required message.
   */
  updateRequired: PropTypes.bool,
  /**
   * A numeric version which is used to force automatic app update when a
   * higher number is set as config.minimumVersion.
   */
  currentVersion: PropTypes.number.isRequired,
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
  /**
   * Feature function to expose to apps via Glue.
   */
  features: PropTypes.object,
  /**
   * The events available for apps via Glue.
   */
  events: PropTypes.arrayOf(PropTypes.string),
  /**
   * Notifications array. If this is set, automatically creates a Notifier.
   */
  notifications: PropTypes.array,
  /**
   * Wether or not to initialize Glue.
   */
  withGlue: PropTypes.bool,
  /**
   * Wether or not to initialize the visibility manager.
   */
  withVisibility: PropTypes.bool,
  /**
   * Wether or not to initialize the offline manager.
   */
  withOffline: PropTypes.bool,
};

export default BaseContainer;
