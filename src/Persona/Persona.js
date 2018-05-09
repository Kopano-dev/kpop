import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui-icons/Person';
import { withStyles } from 'material-ui/styles';
import { firstLetters, generateColorRGB, isLatin, splitDisplayName } from '../utils';


export const userShape =  PropTypes.shape({
  // /users API endpoint
  // TODO(jelle): email address, if displayName is empty?
  givenName: PropTypes.string,
  surname: PropTypes.string,
  displayName: PropTypes.string,
});

const styles = theme => ({
  colorDefault: {
    color: theme.palette.text.primary,
  },
});

export class Persona extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
      },
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  static changed(nextProps, prevState) {
    const displayName = nextProps.user.displayName === prevState.user.displayName;
    const givenName = 'givenName' in nextProps.user ? nextProps.user.givenName === prevState.user.givenName: false;
    const surname = 'surname' in nextProps.user ? nextProps.user.surname === prevState.user.surname: false;
    return displayName || givenName || surname;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (Persona.changed(nextProps, prevState)) {
      return null;
    }

    let givenName, surname;
    if ('givenName' in nextProps.user && 'surname' in nextProps.user) {
      givenName = nextProps.user.givenName;
      surname = nextProps.user.surname;
    } else {
      [givenName, surname] = splitDisplayName(nextProps.user.displayName);
    }

    return {
      color: generateColorRGB(nextProps.user.displayName),
      letters: firstLetters(givenName, surname),
    };
  }

  render() {
    const { classes } = this.props;
    const { color, letters } = this.state;

    const latin = isLatin(letters);

    return (
      <Avatar
        classes={{colorDefault: classes.colorDefault}}
        style={{backgroundColor: color}}>{latin ? letters: <PersonIcon/>}
      </Avatar>
    );
  }
}

Persona.propTypes = {
  /**
   * The user object must contain givenName, surname, displayName.
   */
  user: userShape,

  /**
   * The image url, if provided shows the image of the user.
   */
  image: PropTypes.string,

  /**
   * The presence of the user.
   */
  presence: PropTypes.number,

  /*
   * CSS Classes to override colorDefault.
   */
  classes: PropTypes.object,
};

export default withStyles(styles)(Persona);
