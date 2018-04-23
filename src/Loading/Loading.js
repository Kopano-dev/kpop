import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

function Loading(props) {
  if (props.error) {
    // When the loader has errored.
    return <div id="loader">
      <FormattedMessage id="kpop.loader.error.message" defaultMessage="Error!"></FormattedMessage>
    </div>;
  } else if (props.timedOut) {
    // When the loader has taken longer than the timeout.
    return <div id="loader">
      <FormattedMessage id="kpop.loader.longtime.message" defaultMessage="Taking a long time..."></FormattedMessage>
    </div>;
  } else if (props.pastDelay) {
    // When the loader has taken longer than the delay.
    return <div id="loader">
      <FormattedMessage id="kpop.loader.loading.message" defaultMessage="Loading..."></FormattedMessage>
    </div>;
  } else {
    // When the loader has just started.
    return null;
  }
}

Loading.propTypes = {
  error: PropTypes.bool,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
};

export default Loading;
