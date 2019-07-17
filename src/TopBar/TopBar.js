import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import ButtonBase from '@material-ui/core/ButtonBase';

import { KopanoLogo } from '../logos';
import { userShape, embeddedShape } from '../shapes';
import { withBase } from '../BaseContainer/BaseContext';

import UserProfileButton from './UserProfileButton';

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
    bar: {
      // Inherits from toolbar mixin, but we use a smaller height even for
      // large screens.
      [theme.breakpoints.up('sm')]: {
        minHeight: 56,
      },
    },
    title: {
      verticalAlign: 'middle',
    },
    kopanoLogo: {
      height: 18,
      verticalAlign: 'middle',
      marginTop: 3,
      paddingRight: 10,
    },
    appLogo: {
      height: 48,
      paddingRight: 10,
      cursor: 'default',
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
    embedded: {
      minHeight: 64,
    },
  };
};

function TopBar(props) {
  const {
    children,
    classes,
    className: classNameProp,
    embedded,

    forceAnchor,
    onAnchorClick,
    title,
    centerContent,
    profile,
    appLogo,

    ...other
  } = props;

  const className = classNames(
    classes.root,
    classNameProp,
  );

  const anchor = onAnchorClick || forceAnchor ? (
    <IconButton
      color="inherit"
      onClick={onAnchorClick}
      className={classes.anchor}
    >
      <MenuIcon />
    </IconButton>
  ) : null;

  const userProfileButton = (!embedded.bound && profile) ? (
    <UserProfileButton
      profile={profile}
    />
  ): null;

  const logo = appLogo ?
    <ButtonBase disableRipple className={classes.appLogo}>{appLogo}</ButtonBase> :
    <Hidden smDown><img src={KopanoLogo} className={classes.kopanoLogo} alt="Kopano"/> </Hidden>;

  return (
    <AppBar
      className={className}
      {...other}
    >
      <Toolbar className={classes.bar}>
        {anchor}
        <Typography variant="h6" color="inherit" noWrap className={classes.flex}>
          {logo}<span className={classes.title}>{title}</span>
        </Typography>
        <div className={classes.flex}>{centerContent}</div>
        {children}
        {userProfileButton}
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
   * The app embedded object. This value is made available by the integrated
   * BaseContext and contains helpers and information if the app is running
   * embedded within another app.
   */
  embedded: embeddedShape,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'default']),
  /**
  * The positioning type. The behavior of the different options is described
  * [here](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning).
  * Note: `sticky` is not universally supported and will fall back to `static` when unavailable.
  */
  position: PropTypes.oneOf(['fixed', 'absolute', 'sticky', 'static']),
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The elevation of the component.
   */
  elevation: PropTypes.number,
  /**
   * If `true`, the anchor is visible even when no `onAnchorClick` is set.
   */
  forceAnchor: PropTypes.bool,
  /**
   * Callback fired when the anchor is clicked.
   */
  onAnchorClick: PropTypes.func,
  /**
   * The header label shown on the top bar.
   */
  title: PropTypes.node,
  /**
   * The content of the middle part of the component.
   */
  centerContent: PropTypes.node,
  /**
   * The user defails. When used, the right part of the component includes
   * a user profile section.
   */
  profile: userShape,
  /**
   * The apps logo to show instead of Kopano logo.
   */
  appLogo: PropTypes.element,
};

TopBar.defaultProps = {
  elevation: 0,
  title: 'Kopano',

  color: 'inherit',
  position: 'absolute',

};

export default withBase(withStyles(styles, { name: 'KpopTopBar' })(TopBar));
