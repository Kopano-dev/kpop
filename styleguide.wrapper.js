import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider } from '@material-ui/core/styles';

import { defaultTheme as theme } from './src/theme';
import { locales } from './i18n/locales';
import IntlContainer from './src/IntlContainer';

// Generate empty translations for syleguide app. This enables all translations
// defined in kpop.
const translations = (() => {
  return Object.keys(locales).reduce(function(result, item) {
    result[item] = {};
    return result;
  }, {});
})();

class Wrapper extends Component {
  onLocaleChanged = () => {
  }

  render() {
    const { children } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <IntlContainer messages={translations} onLocaleChanged={this.onLocaleChanged}>{children}</IntlContainer>
      </MuiThemeProvider>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
