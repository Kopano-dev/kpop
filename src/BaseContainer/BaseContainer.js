import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import renderIf from 'render-if';

import FatalErrorDialog from './FatalErrorDialog';
import UpdateAvailableSnack from './UpdateAvailableSnack';

const handleReload = (event) => {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  window.location.reload();
};

function BaseContainer(props) {
  const {
    children,

    ready,
    error,
    updateAvailable,
  } = props;

  const ifReady = renderIf(ready);
  const ifNotReady = renderIf(!ready);
  const ifFatalError = renderIf(error && error.fatal);
  const ifUpdateAvailable = renderIf(updateAvailable);

  return (
    <div>
      {ifReady(
        children
      )}
      {ifNotReady(
        <div id="loader">
          <FormattedMessage id="kpop.loader.initializing.message" defaultMessage="Initializing..."></FormattedMessage>
        </div>
      )}
      {ifFatalError(
        <FatalErrorDialog open error={error} onReloadClick={handleReload}/>
      )}
      {ifUpdateAvailable(
        <UpdateAvailableSnack onReloadClick={handleReload}/>
      )}
    </div>
  );
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
  error: PropTypes.shape({
    message: PropTypes.string,
    detail: PropTypes.string,
  }),
  /**
   * If true the component will show a notification that an update is available.
   */
  updateAvailable: PropTypes.bool,
};

export default BaseContainer;
