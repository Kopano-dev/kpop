import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';

import { KopanoLogo } from '../logos';

export const styles = theme => {
  return {
    root: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      boxSizing: 'border-box',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    logo: {
      height: 24,
      verticalAlign: 'middle',
      paddingRight: 10,
    },
    flex: {
      flex: 1,
    },
    anchor: {
      marginLeft: -12,
      marginRight: 20,
    },
    userDisplayName: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.secondary,
      fontSize: theme.typography.pxToRem(14),
      lineHeight: 1,
    },
  };
};

function TopBar(props) {
  const {
    children,
    classes,
    className: classNameProp,

    forceAnchor,
    onAnchorClick,
    title,
    centerContent,
    user,

    ...other
  } = props;

  const className = classNames(
    classes.root,
    classNameProp,
  );

  const anchor = onAnchorClick || forceAnchor ? (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={onAnchorClick}
      className={classes.anchor}
    >
      <MenuIcon />
    </IconButton>
  ) : null;

  const userProfile = user ? (
    <div>
      <IconButton
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <span className={classes.userDisplayName}>{user.name}</span>
    </div>
  ) : null;

  return (
    <AppBar
      className={className}
      {...other}
    >
      <Toolbar>
        {anchor}
        <Typography variant="title" color="inherit" noWrap className={classes.flex}>
          <img src={KopanoLogo} className={classes.logo} alt="Kopano"/> {title}
        </Typography>
        <div className={classes.flex}>{centerContent}</div>
        {children}
        {userProfile}
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * The elevation of the component
   */
  elevation: PropTypes.number,

  forceAnchor: PropTypes.bool,
  onAnchorClick: PropTypes.func,
  title: PropTypes.node,
  centerContent: PropTypes.node,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

TopBar.defaultProps = {
  elevation: 0,
  title: 'Kopano',

  color: 'inherit',
  position: 'fixed',

};

export default withStyles(styles, { name: 'KpopTopBar' })(TopBar);
