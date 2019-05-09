import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import AppsGrid from './AppsGrid';
import { withBase } from '../BaseContainer/BaseContext';

const styles = theme => {
  return {
    card: {
      paddingTop: theme.spacing.unit,
    },
  };
};

class AppsSwitcherButton extends React.PureComponent {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleAppClick = (event, app) => {
    const { onAppClick } = this.props;

    if (onAppClick) {
      onAppClick(event, app);
    }

    if (!event.defaultPrevented) {
      setTimeout(this.handleClose, 0);
    }
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, AppsGridProps, config, ...other } = this.props;

    if (config && config.apps && config.apps.enabled && config.apps.enabled.length === 0) {
      // Render nothing if no apps are enabled.
      return null;
    }

    const menuID = 'kpop-apps-switcher-menu';

    const appsGridProps = {
      onAppClick: this.handleAppClick,
      ...AppsGridProps,
    };

    return (
      <React.Fragment>
        <IconButton
          aria-owns={anchorEl ? menuID : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          {...other}
        >
          <AppsIcon />
        </IconButton>
        <Popover
          id={menuID}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Card className={classes.card}>
            <CardContent>
              <AppsGrid {...appsGridProps}/>
            </CardContent>
          </Card>
        </Popover>
      </React.Fragment>
    );
  }

}

AppsSwitcherButton.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,

  /**
   * Properties applied to the `AppsGrid` element.
   */
  AppsGridProps: PropTypes.object,

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

export default withBase(withStyles(styles, { name: 'KpopAppsSwitcherButton' })(AppsSwitcherButton));
