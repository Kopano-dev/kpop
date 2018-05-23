import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui-icons/Person';
import { withStyles } from 'material-ui/styles';

import { styled } from '../styled';
import { userShape } from '../shapes';
import { getInitials } from '../utils/initials';
import { generateColorRGB } from '../utils/color';

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.pxToRem(18),
  },
});

/**
 * Personas are used for rendering an individual's avatar.
 * @since 0.3.0
 */
export class Persona extends React.Component {
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const { user, allowPhoneInitials, theme } = nextProps;

    if (prevState.user &&
        user.displayName === prevState.user.displayName &&
        user.givenName === prevState.user.givenName &&
        user.surname === prevState.user.surname &&
        user.id === prevState.user.id) {
      return null;
    }

    const displayName = user.displayName ? user.displayName : `${user.givenName} ${user.surname}`;
    return {
      user,
      displayName,
      backgroundColor: generateColorRGB(`${user.id}-${displayName}`),
      initials: getInitials(displayName, theme.direction === 'rtl', !!allowPhoneInitials),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { backgroundColor, initials } = this.state;

    if (nextState.backgroundColor !== backgroundColor ||
        nextState.initials !== initials) {
      return true;
    }

    return false;
  }

  render() {
    const {
      classes,
      className: classNameProp,

      user, // eslint-disable-line
      theme, // eslint-disable-line
      allowPhoneInitials, // eslint-disable-line
      ...other
    } = this.props;
    const { backgroundColor, initials } = this.state;

    const className = classNames(
      classes.root,
      classNameProp,
    );

    const ColoredAvatar = styled(Avatar)({
      colorDefault: {
        backgroundColor,
      },
    });

    return (
      <ColoredAvatar
        className={className}
        {...other}
      >{initials ? initials: <PersonIcon/>}
      </ColoredAvatar>
    );
  }
}

Persona.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * The user object. Will be used to consistently select the color and label.
   */
  user: userShape.isRequired,

  /**
   * Wether or not to allow phone numbers as initials.
   */
  allowPhoneInitials: PropTypes.bool,
};

export default withStyles(styles, {withTheme: true, name: 'KpopPersona'})(Persona);
