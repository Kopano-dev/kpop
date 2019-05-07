import React from 'react';
import PropTypes from 'prop-types';

import { IntlContext } from './IntlContainer';

class IfIntld extends React.PureComponent {
  static contextType = IntlContext;

  render() {
    const { languages } = this.context;

    if (!languages || !languages.length) {
      return null;
    }

    return this.props.children;
  }
}

IfIntld.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
};

export default IfIntld;
