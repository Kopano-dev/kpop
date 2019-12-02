import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import { MainContext } from './MainContext';
import { withBase } from '../BaseContainer/BaseContext';
import { embeddedShape } from '../shapes';
import GlueEmbed from './GlueEmbed';

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

    // NOTE(longsleep): Embed apps using Glue.
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
                const hidden = app.name !== active;
                return <GlueEmbed
                  key={app.name}
                  className={classNames(classes.asideFrame, {
                    [classes.active]: !hidden,
                  })}
                  url={app.src}
                  hidden={hidden}
                  timeout={30000}
                  GlueOptions={app.options}
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
