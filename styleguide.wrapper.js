import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';

class Wrapper extends Component {
  render() {
    const { children } = this.props;

    return (
      <IntlProvider locale="en">{children}</IntlProvider>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
