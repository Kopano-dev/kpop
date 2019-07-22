import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import AppsGrid from '../AppsGrid';
import { withMain } from '../MainContainer/MainContext';
import { withBase } from '../BaseContainer/BaseContext';
import { embeddedShape } from '../shapes';

const styles = theme => {
  return {
    root: {
      width: 48,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      boxSizing: 'border-box',
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
    apps: {
      gridTemplateColumns: '48px',
    },
  };
};

class AsideBar extends React.PureComponent {
  handleAppClick = (event, app, href) => {
    const { aside } = this.props;

    event.preventDefault();
    aside.load(app, href);
  }

  render() {
    const {
      children,
      classes,
      className: classNameProp,
      embedded,
      config, // eslint-disable-line no-unused-vars
      aside, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const apps = (config && config.apps && config.apps.aside) ? config.apps.aside : [];
    if (apps.length === 0 || (embedded && embedded.enabled)) {
      // Render nothing, when no aside apps configured or running embedded.
      return null;
    }

    return <Hidden mdDown>
      <div className={classNames(classes.root, classNameProp)} {...other}>
        <AppsGrid
          apps={apps}
          enabledApps={[]}
          className={classes.apps}
          size="small"
          onAppClick={this.handleAppClick}
        />
        {children}
      </div>
    </Hidden>;
  }
}

AsideBar.propTypes = {
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
   * The app configuration object. This value is made available by the
   * integrated BaseContext.
   */
  config: PropTypes.object,
  /**
   * The app embedded object. This value is made available by the
   * integrated BaseContext.
   */
  embedded: embeddedShape,

  /**
   * Aside helper, comes from the withMain wrapper.
   */
  aside: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'KpopAsideBar' })(withBase(withMain(AsideBar)));
