import React from 'react';
import PropTypes from 'prop-types';

function Loading(props) {
  if (props.error) {
    // When the loader has errored.
    return <div id="loader">Error!</div>;
  } else if (props.timedOut) {
    // When the loader has taken longer than the timeout.
    return <div id="loader">Taking a long time...</div>;
  } else if (props.pastDelay) {
    // When the loader has taken longer than the delay.
    return <div id="loader">Loading...</div>;
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
