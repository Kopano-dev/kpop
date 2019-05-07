import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { IntlContext } from './IntlContainer';

class LocaleSelect extends React.PureComponent {
  static contextType = IntlContext;

  handleChange = event => {
    const { locale, setLocale } = this.context;
    const { onChange, afterChange } = this.props;

    if (locale === event.target.value) {
      // Unchanged.
      return;
    }

    if (onChange) {
      onChange(event);
    }
    if (!event.defaultPrevented) {
      setLocale(event.target.value).then(locale => {
        if (afterChange) {
          afterChange(locale);
        }
      });
    }
  }

  render() {
    const { locale, languages } = this.context;
    const {
      onChange: _onChange, // eslint-disable-line no-unused-vars
      afterChange: _afterChange, // eslint-disable-line no-unused-vars

      ...other
    } = this.props;

    return <Select
      value={locale}
      onChange={this.handleChange}
      {...other}
    >
      {languages.map(language => {
        return <MenuItem
          key={language.locale}
          value={language.locale}>
          {language.nativeName}
        </MenuItem>;
      })}
    </Select>;
  }
}

LocaleSelect.defaultProps = {
  displayEmpty: true,
};

LocaleSelect.propTypes = {
  displayEmpty: PropTypes.bool,

  onChange: PropTypes.func,
  afterChange: PropTypes.func,
};

export default LocaleSelect;
