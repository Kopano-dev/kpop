import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

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
    display: 'inline-block',
  },
  button: {
    width: 84,
    height: 84,
    padding: 2,
    display: 'inline-block',
    textAlign: 'center',
    boxSizing: 'border-box',
    border: '1px solid transparent',
    '&:hover': {
      textDecoration: 'none',
      borderColor: theme.palette.divider,
    },
  },
  icon: {
    fontSize: theme.typography.pxToRem(54),
    display: 'block',
    margin: '0 auto',
  },
  label: {
    display: 'block',
    padding: 2,
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

class AppsGrid extends React.PureComponent {
  handleClick = (app) => (event) => {
    const { onAppClick } = this.props;

    if (onAppClick) {
      onAppClick(event, app);
    }
  }

  render() {
    const { classes, apps, enabledApps, target, baseHref, config } = this.props;

    const enabled = enabledApps === undefined ? ((config && config.apps) ? config.apps.enabled : null) : enabledApps;

    const icons = [];
    for (let app of apps) {
      if (enabled && !enabled.includes(app.name)) {
        continue;
      }
      const href = `${baseHref}${app.href}`;
      icons.push(<li className={classes.app} key={app.name}>
        <ButtonBase className={classes.button} target={target} href={href}
          onClick={this.handleClick(app)} aria-label={app.title} component="a">
          <app.icon className={classes.icon} fontSize="inherit"/>
          <Typography className={classes.label}>{app.title}</Typography>
        </ButtonBase>
      </li>);
    }

    return <ul className={classes.root}>
      {icons}
    </ul>;
  }
}

AppsGrid.defaultProps = {
  apps: kopanoApps,
  target: '_blank',
  baseHref: '',
};

AppsGrid.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,

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
   * The app configuration object. This value is made available by the
   * integrated BaseContext.
   */
  config: PropTypes.object,
};

export default withBase(withStyles(styles, { name: 'KpopAppsGrid' })(AppsGrid));
