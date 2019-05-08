import React from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import ISO6391 from 'iso-639-1';

import { defineLocale } from '../../i18n/locales';
import { initializeIntl } from './intl';
import { parseParams } from '../utils';
import { defaultLocale } from '../common/constants';

const defaultLocalesFromBrowser = (() => {
  if (navigator.languages) {
    return navigator.languages;
  }
  if (navigator.language) {
    return [navigator.language];
  }
  return [defaultLocale];
})();

// NOTE(longsleep): Certain locales are considered aliases to more specific
// locales. Locales are using BCP 47 format (https://tools.ietf.org/html/rfc5646).
function mapLocale(locale) {
  switch(locale) {
    case 'pt':
      // Map plain pt to Portugal.
      return 'pt-PT';
    case 'zh':
      // Map plain zh to China.
      return 'zh-CN';
    default:
      return locale;
  }
}

// NOTE(longsleep): Locales are using BCP 47 format (https://tools.ietf.org/html/rfc5646).
function mapNativeCountryName(locale, code) {
  switch (locale) {
    case 'en-GB':
      return 'UK';
    case 'pt-PT':
      return 'Portugal';
    case 'pt-BR':
      return 'Brasil';
    case 'fr-CA':
      return 'Canada';
    case 'es-419':
      return 'Latinoamérica';
    case 'zh-HK':
      return '香港';
    case 'zh-CN':
      return '简体';
    case 'zh-TW':
      return '繁體';
    default:
      return code;
  }
}

function supportedLocale(requestedLocales, messages) {
  if (!messages) {
    return [defaultLocale, {}];
  }

  // Filter locale.
  const locales = [...requestedLocales, ...defaultLocalesFromBrowser, defaultLocale];
  for (let l of locales) {
    if (!l) {
      continue;
    }
    const [ base, country ] = l.replace('_', '-').split('-', 2);
    l = base.toLowerCase();
    if (country) {
      l += '-' + country.toUpperCase();
    }
    l = mapLocale(l);
    let k = l;
    if (!messages[k]) {
      if (k === 'en') {
        // Use default locale when requesting plain english and not explicitly
        // supported in messages.
        l = k = defaultLocale;
      } else {
        // Unsupported. Check if we can fallback to a parent language.
        if (!messages[base]) {
          continue;
        } else {
          k = l = base;
        }
      }
    }
    return [l, messages[k] ? messages[k] : {}];
  }

  return [defaultLocale, {}];
}

const localeCompare = (() => {
  let supportsLocales = false;
  try {
    'foo'.localeCompare('bar', 'i');
  } catch (e) {
    supportsLocales = e.name === 'RangeError';
  }
  if (supportsLocales) {
    return (a, b, locales, options) => {
      return (''+a).localeCompare(b, locales, options);
    };
  } else {
    return (a, b) => {
      return (''+a).localeCompare(b);
    };
  }
})();

function getDefaultLocales(locale, storageKey, queryKey) {
  if (locale) {
    return [locale];
  }
  if (queryKey) {
    const locales = parseParams(window.location.search.substr(1))[queryKey];
    if (locales) {
      return locales.split(' ');
    }
  }
  if (!window.localStorage || !storageKey) {
    return [locale];
  }
  locale = window.localStorage.getItem(storageKey);
  if (locale) {
    return [locale];
  }
  return [];
}

function setDefautLocale(locale, storageKey) {
  if (!window.localStorage) {
    return;
  }
  if (!locale) {
    window.localStorage.removeItem(storageKey);
  }
  window.localStorage.setItem(storageKey, locale);
}

export const IntlContext = React.createContext({
  languages: [],
  locale: defaultLocale,
});

class IntlContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      requestedLocale: null,
      initialized: props.onLocaleChanged ? async locale => props.onLocaleChanged(locale) : () => Promise.resolve(),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { messages, locale: propsLocale, localeStorageKey, localeQueryKey } = props;
    const requestedLocales = state.requestedLocale ?
      [state.requestedLocale] : getDefaultLocales(propsLocale, localeStorageKey, localeQueryKey);

    const [ locale, localeMessages ] = supportedLocale(requestedLocales, messages);
    if (locale === state.locale && messages === state.messages) {
      return null;
    }
    const locales = Object.keys(messages);
    const languages = locales.map(function(locale) {
      let [ code, country ] = locale.split('-', 2);
      let nativeName = ISO6391.getNativeName(code);
      nativeName = nativeName[0].toUpperCase() + nativeName.slice(1);
      if (country) {
        nativeName += ' (' + mapNativeCountryName(locale, country) + ')';
      }
      return {
        locale,
        code,
        country,
        nativeName,
      };
    });
    languages.sort(function (a, b) {
      return localeCompare(a.nativeName, b.nativeName, defaultLocalesFromBrowser, {sensitivity: 'base'});
    });

    return {
      locale,
      localeMessages,
      messages,
      languages,
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

  handleSetLocale = (requestedLocale) => {
    const { requireReloadForNewLocale, localeStorageKey } = this.props;
    setDefautLocale(requestedLocale, localeStorageKey);

    if (requireReloadForNewLocale) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.setState({
        requestedLocale,
      }, () => {
        resolve(this.state.requestedLocale);
      });
    });
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
      languages,
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
        <IntlContext.Provider value={{
          locale,
          languages,
          setLocale: this.handleSetLocale,
        }}>
          {children}
        </IntlContext.Provider>
      </IntlProvider>
    );
  }
}

// NOTE(longsleep): Poor mans way to support parameters - probably remove.
IntlContainer.defaultProps = {
  defaultLocale: defaultLocale,
  localeStorageKey: 'kpop:ui_locale.default',
  localeQueryKey: 'ui_locales',
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
   * The key to use to persistently read and write locale information from. This
   * value is used with locale storage. If empty, persistency is disabled.
   */
  localeStorageKey: PropTypes.string,
  /**
   * The key of a URL query parameter to use a default locale. If empty, the
   * query parameters are ignored.
   */
  localeQueryKey: PropTypes.string,
  /**
   * The message to use for the given locale.
   */
  messages: PropTypes.object.isRequired,
  /**
   * Callback fireed when the locale has changed.
   */
  onLocaleChanged: PropTypes.func,
  /**
   * Flag wether or not a locale change gets applied directly or not.
   */
  requireReloadForNewLocale: PropTypes.bool,
};

export default IntlContainer;
