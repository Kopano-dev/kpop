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

  render() {
    const { classes, label, AppsGridProps, ...other } = this.props;

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
              <AppsGrid {...AppsGridProps}/>
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
};

export default withStyles(styles, { name: 'KpopAppsSwitcherListItem' })(AppsSwitcherListItem);
