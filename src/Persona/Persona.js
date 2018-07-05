import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import { withStyles } from '@material-ui/core/styles';

import { styled } from '../styled';
import { userShape } from '../shapes';
import { getInitials } from '../utils/initials';
import { generateColorRGB } from '../utils/color';
import { getDisplayName } from '../DisplayName/utils';

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
        user.guid === prevState.user.guid) {
      return null;
    }

    const displayName = getDisplayName(user);
    return {
      user,
      displayName,
      backgroundColor: generateColorRGB(`${user.guid}-${displayName}`),
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
      forceIcon,
      icon,
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
      >{initials && !forceIcon ? initials: icon}
      </ColoredAvatar>
    );
  }
}

Persona.defaultProps = {
  icon: <PersonIcon/>,
};

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

  /**
   * Wether or not to force icon instead of initials.
   */
  forceIcon: PropTypes.bool,

  /**
   * Icon for Persona when no initials or icon forced.
   */
  icon: PropTypes.element.isRequired,
};

export default withStyles(styles, {withTheme: true, name: 'KpopPersona'})(Persona);
