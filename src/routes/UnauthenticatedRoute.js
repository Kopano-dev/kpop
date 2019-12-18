import React from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

const UnauthenticatedRoute = ({ component: C, authenticated, props: childProps, alternative: A, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !authenticated
        ? <C {...props} {...childProps} />
        : A ? A : null
    }
  />
);

UnauthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  alternative: PropTypes.element,
  authenticated: PropTypes.bool.isRequired,
  props: PropTypes.object,
};

export default UnauthenticatedRoute;
