import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import { MuiThemeProvider } from 'material-ui/styles';

import { defaultTheme as theme } from './src/theme';

class Wrapper extends Component {
  render() {
    const { children } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <IntlProvider locale="en">{children}</IntlProvider>
      </MuiThemeProvider>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
