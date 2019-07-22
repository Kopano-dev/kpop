import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import { MainContext } from './MainContext';
import { withBase } from '../BaseContainer/BaseContext';
import { embeddedShape } from '../shapes';

const asideWidth = 300;

const styles = theme => {
  return {
    root: {
      flex: 1,
      display: 'flex',
    },
    main: {
      flex: 1,
      display: 'flex',
    },
    aside: {
      zIndex: 1,
      display: 'flex',
      width: asideWidth,
      position: 'relative',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: 0,
      boxSizing: 'border-box',
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
    asideShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: -1 * asideWidth,
    },
    asideFrame: {
      border: 0,
      flex: 1,
      display: 'none',
    },
    active: {
      display: 'inherit',
    },
  };
};

class MainContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      apps: {},
      active: null,

      value: {
        aside: {
          load: this.handleLoadAside,
        },
      },
    };
  }

  handleLoadAside = (app, href) => {
    if (!app || !app.name || !href) {
      console.warn('ignoring invalid load aside app', app); // eslint-disable-line no-console
      return;
    }

    const { apps, active } = this.state;

    if (!apps[app.name]) {
      this.setState({
        apps: {
          ...apps,
          [app.name]: {
            ...app,
            src: href,
          },
        },
        active: app.name,
      });
    } else {
      this.setState({
        active: active !== app.name ? app.name : null,
      });
    }
  }

  render() {
    const {
      children,
      classes,
      embedded,
    } = this.props;
    const { active, apps } = this.state;

    const asideOpen = !!active;

    // NOTE(longsleep): Render iframe for each embedded app. For now we
    // hardcode the feature policy (https://w3c.github.io/webappsec-feature-policy/)
    // to a sane value to allow cross domain apps to do stuff.
    return <MainContext.Provider value={this.state.value}>
      <div className={classes.root}>
        <div className={classes.main}>
          {children}
        </div>
        { (!embedded || !embedded.enabled) &&
          <Hidden mdDown>
            <div className={classNames(classes.aside, {
              [classes.asideShift]: !asideOpen,
            })}>
              {Object.values(apps).map(app => {
                return <iframe
                  key={app.name}
                  title={app.title}
                  className={classNames(classes.asideFrame, {
                    [classes.active]: app.name === active,
                  })}
                  src={app.src + '?embedded=4'}
                  sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
                  allow="animations; autoplay; camera; encrypted-media; fullscreen; geolocation; microphone; speaker; vr"
                />;
              })}
            </div>
          </Hidden>
        }
      </div>
    </MainContext.Provider>;
  }
}

MainContainer.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,

  /**
   * The app configuration object. This value is made available by the
   * integrated BaseContext.
   */
  config: PropTypes.object,
  /**
   * The app embedded object. This value is made available by the
   * integrated BaseContext.
   */
  embedded: embeddedShape,
};

export default withStyles(styles, { name: 'KpopMainContainer' })(withBase(MainContainer));
