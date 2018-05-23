import React from 'react';

import { userShape } from '../shapes';
import { getDisplayName } from './utils';

export class DisplayName extends React.Component {
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const { user } = nextProps;

    if (prevState.user &&
        user.displayName === prevState.user.displayName &&
        user.givenName === prevState.user.givenName &&
        user.surname === prevState.user.surname) {
      return null;
    }

    return {
      user,
      displayName: getDisplayName(user),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { displayName } = this.state;

    if (nextState.displayName !== displayName) {
      return true;
    }

    return false;
  }

  render() {
    const {
      user, // eslint-disable-line
      ...other
    } = this.props;

    const {
      displayName,
    } = this.state;

    return (
      <span {...other}>{displayName}</span>
    );
  }
}

DisplayName.propTypes = {
  /**
   * The user object. Will be used to consistently select the color and label.
   */
  user: userShape.isRequired,
};

export default DisplayName;
