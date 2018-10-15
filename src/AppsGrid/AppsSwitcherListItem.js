import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AppsIcon from '@material-ui/icons/Apps';

import AppsGrid from './AppsGrid';
import { withConfig } from '../BaseContainer/ConfigContext';

const styles = () => {
  return {
  };
};

class AppsSwitcherListItem extends React.PureComponent {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleAppClick = (event, app) => {
    const { onAppClick } = this.props;

    if (onAppClick) {
      onAppClick(event, app);
    }
  };

  render() {
    const { classes, label, AppsGridProps, config, ...other } = this.props;

    if (config && config.apps && config.apps.enabled && config.apps.enabled.length === 0) {
      // Render nothing if no apps are enabled.
      return null;
    }

    const appsGridProps = {
      onAppClick: this.handleAppClick,
      ...AppsGridProps,
    };

    return (
      <React.Fragment>
        <ListItem button onClick={this.handleClick} {...other}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary={label} />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <AppsGrid {...appsGridProps}/>
            </ListItem>
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
}

AppsSwitcherListItem.defaultProps = {
  label: 'Kopano Apps',
};

AppsSwitcherListItem.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,

  /**
   * List item label.
   */
  label: PropTypes.string.isRequired,

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
   * integrated ConfigContext.
   */
  config: PropTypes.object,
};

export default withStyles(styles, { name: 'KpopAppsSwitcherListItem' })(withConfig(AppsSwitcherListItem));
