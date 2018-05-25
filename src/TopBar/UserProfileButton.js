import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Popover from 'material-ui/Popover';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { userShape } from '../shapes';
import DisplayName from '../DisplayName';
import Persona from '../Persona';

export const styles = () => {
  return {
    root: {
    },
    card: {
      maxWidth: 400,
      minWidth: 250,
    },
    actions: {
      display: 'flex',
    },
    signout: {
      marginLeft: 'auto',
    },
  };
};

class UserProfileButton extends React.PureComponent {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, user, theme } = this.props;

    const menuID = 'kpop-user-profile-menu';
    const signout = user.signoutHandler ? (
      <Button
        className={classes.signout}
        size="small"
        color="primary"
        onClick={user.signoutHandler}
      >
        Sign out
      </Button>
    ) : null;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? menuID : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <AccountCircle />
        </IconButton>
        <Popover
          id={menuID}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: theme.direction === 'ltr' ? 'right' : 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: theme.direction === 'ltr' ? 'right' : 'left',
          }}
        >
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Persona className={classes.persona} user={user}/>
              }
              title={<Typography variant="subheading"><DisplayName user={user}/></Typography>}
              subheader={user.mail}
            />
            <CardActions className={classes.actions} disableActionSpacing>
              {signout}
            </CardActions>
          </Card>
        </Popover>
      </div>
    );
  }
}

UserProfileButton.propTypes = {
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  theme: PropTypes.object.isRequired,
  /**
   * The user defails. When used, the right part of the component includes
   * a user profile section.
   */
  user: userShape,
};

export default withStyles(styles, { name: 'KpopUserProfileButton', withTheme: true })(UserProfileButton);
