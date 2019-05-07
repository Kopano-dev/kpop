import React from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';

import { defineLocale } from '../../i18n/locales';
import { initializeIntl } from './intl';
import { parseParams } from '../utils';
import { defaultLocale } from '../common/constants';

const defaultLocaleFromQuery = (() => {
  return parseParams(window.location.search.substr(1))['kpop-locale'];
})();

const defaultLocalesFromBrowser = (() => {
  if (navigator.languages) {
    return navigator.languages;
  }
  if (navigator.language) {
    return [navigator.language];
  }
  return [defaultLocale];
})();

function supportedLocale(locale, messages) {
  if (!messages) {
    return [defaultLocale, {}];
  }

  // Filter locale.
  const locales = [locale, ...defaultLocalesFromBrowser, defaultLocale];
  for (let l of locales) {
    if (!l) {
      continue;
    }
    const [ base, country ] = l.replace('_', '-').split('-', 2);
    l = base.toLowerCase();
    if (country) {
      l += '-' + country.toUpperCase();
    }
    let k = l;
    if (!messages[k]) {
      if (k === 'en') {
        // Use default locale when requesting plain english and not explicitly
        // sypported in messages.
        l = k = defaultLocale;
      } else {
        // Unsupported. Check if we can fallback to a parent language.
        if (base !== 'en' && !messages[base]) {
          continue;
        } else {
          k = base;
        }
      }
    }
    return [l, messages[k] ? messages[k] : {}];
  }

  return [defaultLocale, {}];
}

class IntlContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      initialized: props.onLocaleChanged ? async locale => props.onLocaleChanged(locale) : () => Promise.resolve(),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { messages } = props;

    const [ locale, localeMessages ] = supportedLocale(props.locale, messages);
    if (locale === state.locale && messages === state.messages) {
      return null;
    }

    return {
      locale,
      localeMessages,
      messages,
    };
  }

  componentDidMount() {
    const { locale } = this.state;

    initializeIntl().then(
      this.state.initialized(locale).then(() => {
        this.setState({
          ready: true,
        });
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { onLocaleChanged } = this.props;
    const { locale } = this.state;

    if (onLocaleChanged && prevState.locale !== locale) {
      if (onLocaleChanged) {
        onLocaleChanged(locale);
      }
    }
  }

  render() {
    const {
      children,
      locale: _locale, // eslint-disable-line no-unused-vars
      messages: _messages, // eslint-disable-line no-unused-vars

      ...other
    } = this.props;
    const {
      locale,
      localeMessages,
    } = this.state;

    const { ready } = this.state;

    if (!ready) {
      return (
        <div id="loader">...</div> // eslint-disable-line react-intl-format/missing-formatted-message
      );
    }

    // Inject kpop messages.
    const allMessages = defineLocale(localeMessages, locale);
    return (
      <IntlProvider key={locale} locale={locale} defaultLocale={defaultLocale} messages={allMessages} {...other}>
        {children}
      </IntlProvider>
    );
  }
}

// NOTE(longsleep): Poor mans way to support parameters - probably remove.
IntlContainer.defaultProps = {
  locale: defaultLocaleFromQuery,
  defaultLocale: defaultLocale,
  messages: {},
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
  defaultLocale: PropTypes.string.isRequired,
  /**
   * The message to use for the given locale.
   */
  messages: PropTypes.object.isRequired,
  /**
   * Callback fireed when the locale has changed.
   */
  onLocaleChanged: PropTypes.func,
};

export default IntlContainer;
