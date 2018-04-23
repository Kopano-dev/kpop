import React from 'react';
import PropTypes from 'prop-types';

import {IntlProvider} from 'react-intl';

import translations from '../../i18n/locales';
import initializeIntl from './intl';
import { parseParams } from '../utils';
import { defaultLocale } from '../common/constants';

const defaultLocaleFromQuery = (() => {
  return parseParams(window.location.search.substr(1))['kpop-locale'];
})();

class IntlContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      initialized: props.onLocaleChanged ? props.onLocaleChanged(props.locale) : Promise.resolve(),
    };
  }

  componentDidMount() {
    initializeIntl().then(
      this.state.initialized.then(() => {
        this.setState({
          ready: true,
        });
      })
    );
  }

  componentDidUpdate(prevProps) {
    const { locale, onLocaleChanged } = this.props;

    if (onLocaleChanged && prevProps.locale !== locale) {
      if (onLocaleChanged) {
        onLocaleChanged(locale);
      }
    }
  }

  render() {
    const {
      children,
      locale,
      messages,

      ...other
    } = this.props;

    const { ready } = this.state;

    if (!ready) {
      return (
        <div id="loader">...</div>
      );
    }

    // NOTE(longsleep): This injects kpop messages.
    const allMessages = Object.assign({}, translations[locale], messages[locale]);
    return (
      <IntlProvider locale={locale} key={locale} messages={allMessages} {...other}>
        {children}
      </IntlProvider>
    );
  }
}

// NOTE(longsleep): Poor mans way to support parameters - probably remove.
IntlContainer.defaultProps = {
  locale: defaultLocaleFromQuery ? defaultLocaleFromQuery : defaultLocale,
  defaultLocale: defaultLocale,
};

IntlContainer.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * The current locale to use for rendering this container.
   */
  locale: PropTypes.string,
  /**
   * The default locale to use for rendering this container.
   */
  defaultLocale: PropTypes.string,
  /**
   * The message to use for the given locale.
   */
  messages: PropTypes.object,
  /**
   * Callback fireed when the locale has changed.
   */
  onLocaleChanged: PropTypes.func,
};

export default IntlContainer;
