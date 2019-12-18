import React from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

const AuthenticatedRoute = ({ component: C, authenticated, config, props: childProps, alternative: A, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (config && config.continue) {
        config.continue();
      }
      return authenticated
        ? <C {...props} {...childProps} />
        : A ? A : null;
    }}
  />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  alternative: PropTypes.element,
  authenticated: PropTypes.bool.isRequired,
  config: PropTypes.object,
  props: PropTypes.object,
};

export default AuthenticatedRoute;
