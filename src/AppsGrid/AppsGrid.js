import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core/utils/helpers';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ExtensionIcon from '@material-ui/icons/Extension';

import { withBase } from '../BaseContainer/BaseContext';
import KopanoCalendarIcon from '../icons/KopanoCalendarIcon';
import KopanoContactsIcon from '../icons/KopanoContactsIcon';
import KopanoKonnectIcon from '../icons/KopanoKonnectIcon';
import KopanoMailIcon from '../icons/KopanoMailIcon';
import KopanoMeetIcon from '../icons/KopanoMeetIcon';
import KopanoWebappIcon from '../icons/KopanoWebappIcon';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '84px 84px 84px',
    gridGap: '2px',
    margin: 0,
    padding: 0,
  },
  app: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 84,
    height: 84,
    padding: 2,
    display: 'inline-block',
    textAlign: 'center',
    boxSizing: 'border-box',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    fontSize: theme.typography.pxToRem(54),
  },
  icon: {
    display: 'block',
    margin: '0 auto',
  },
  label: {
    display: 'block',
    padding: 2,
  },
  /* Styles applied to the button element if `size="small"`. */
  sizeSmall: {
    width: 32,
    height: 32,
    border: 'none',
    fontSize: theme.typography.pxToRem(24),
    display: 'flex',

    '& $icon': {
      maxHeight: 24,
      maxWidth: 24,
    },
  },
});

export const kopanoApps = [
  {
    name: 'kopano-mail',
    icon: KopanoMailIcon,
    title: 'Mail',
    href: '/mail/',
  },
  {
    name: 'kopano-calendar',
    icon: KopanoCalendarIcon,
    title: 'Calendar',
    href: '/calendar/',
  },
  {
    name: 'kopano-contacts',
    icon: KopanoContactsIcon,
    title: 'Contacts',
    href: '/contacts/',
  },
  {
    name: 'kopano-meet',
    icon: KopanoMeetIcon,
    title: 'Meet',
    href: '/meet/',
  },
  {
    name: 'kopano-webapp',
    icon: KopanoWebappIcon,
    title: 'Webapp',
    href: '/webapp/',
  },
  {
    name: 'kopano-konnect',
    icon: KopanoKonnectIcon,
    title: 'Account',
    href: '/signin/v1/welcome',
  },
];
export const kopanoAppsTable = kopanoApps.reduce((t, v) => {
  t[v.name] = v;
  return t;
}, {});

class AppsGrid extends React.PureComponent {
  handleClick = (app, href) => (event) => {
    const { onAppClick } = this.props;

    if (onAppClick) {
      onAppClick(event, app, href);
    }
  }

  getIcon(app) {
    const { classes } = this.props;

    let Component;
    const props = {
      className: classes.icon,
      fontSize: 'inherit',
    };

    if (app.icon) {
      Component = app.icon;
    } else if (app.iconURL) {
      Component = 'img';
      props.src = app.iconURL;
      props.alt = '';
    } else {
      // Check if its a kopano app.
      const kopanoApp = kopanoAppsTable[app.name];
      if (kopanoApp) {
        Component = kopanoApp.icon;
      }
    }

    if (!Component) {
      Component = ExtensionIcon;
    }

    return <Component {...props}/>;
  }

  getHref(app) {
    const { baseHref } = this.props;

    if (app.href) {
      if (app.href.indexOf('http') === 0) {
        return app.href;
      }
      return `${baseHref}${app.href}`;
    } else {
      // Check if its a kopano app.
      const kopanoApp = kopanoAppsTable[app.name];
      if (kopanoApp) {
        return `${baseHref}${kopanoApp.href}`;
      }
    }

    return '';
  }

  render() {
    const {
      classes,
      className: classNameProp,
      apps,
      enabledApps,
      target,
      size,
      config,
    } = this.props;

    const enabled = enabledApps === undefined ?
      ((config && config.apps && config.apps.enabled) ? config.apps.enabled : []) : enabledApps;

    const icons = [];
    for (let app of apps) {
      if (enabled.length > 0 && !enabled.includes(app.name)) {
        continue;
      }
      const href = this.getHref(app);
      const icon = this.getIcon(app);
      icons.push(<li className={classes.app} key={app.name}>
        <ButtonBase
          className={classNames(
            classes.button, {
              [classes[`size${capitalize(size)}`]]: size !== 'medium',
            }
          )}
          target={target} href={href}
          onClick={this.handleClick(app, href)} aria-label={app.title} component="a"
        >
          { icon }
          { size !== 'small' && <Typography className={classes.label}>{app.title}</Typography> }
        </ButtonBase>
      </li>);
    }

    return <ul className={classNames(classes.root, classNameProp)}>
      {icons}
    </ul>;
  }
}

AppsGrid.defaultProps = {
  apps: kopanoApps,
  target: '_blank',
  baseHref: '',
  size: 'medium',
};

AppsGrid.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * By default Kopano apps are used. This property allows override of the
   * apps to show.
   */
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * A list of app names to show. Essentially this filters on the name field
   * of each value of the apps property showing only apps which are listed
   * in this array.
   */
  enabledApps: PropTypes.arrayOf(PropTypes.string),

  /**
   * The target attribute of the generated <a> elements.
   */
  target: PropTypes.string.isRequired,

  /**
   * The base href to be prepended to the invidual href values for each app.
   */
  baseHref: PropTypes.string.isRequired,

  /**
   * Callback fired when the an app is clicked.
   */
  onAppClick: PropTypes.func,

  /**
   * The size of the button.
   * `small` is equivalent to the dense button styling.
   */
  size: PropTypes.oneOf(['small', 'medium']),

  /**
   * The app configuration object. This value is made available by the
   * integrated BaseContext.
   */
  config: PropTypes.object,
};

export default withBase(withStyles(styles, { name: 'KpopAppsGrid' })(AppsGrid));
