import React from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

import BaseContext from '../BaseContainer/BaseContext';

const AuthenticatedRoute = ({ component: C, authenticated, props: childProps, alternative: A, ...rest }) => {
  const base = React.useContext(BaseContext);

  return <Route
    {...rest}
    render={props => {
      if (base && base.config && base.config.continue) {
        // Ensure our configuration gets completed.
        Promise.resolve().then(() => {
          if (base && base.config && base.config.continue) {
            base.config.continue();
          }
        });
      }
      return authenticated
        ? <C {...props} {...childProps} />
        : A ? A : null;
    }}
  />;
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  alternative: PropTypes.element,
  authenticated: PropTypes.bool.isRequired,
  props: PropTypes.object,
};

export default AuthenticatedRoute;
