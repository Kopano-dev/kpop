import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

/* eslint-disable react-intl-format/missing-formatted-message */

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class Example extends React.Component {
  render() {
    const { classes } = this.props;

    return <div>
      <div>
        <Button className={classes.button}>Default</Button>
        <Button color="primary" className={classes.button}>
          Primary
        </Button>
        <Button color="secondary" className={classes.button}>
          Secondary
        </Button>
        <Button disabled className={classes.button}>
          Disabled
        </Button>
        <Button className={classes.button}>
          Link
        </Button>
      </div>
      <div>
        <Button variant="contained" className={classes.button}>
          Default
        </Button>
        <Button variant="contained" color="primary" className={classes.button}>
          Primary
        </Button>
        <Button variant="contained" color="secondary" className={classes.button}>
          Secondary
        </Button>
        <Button variant="contained" color="secondary" disabled className={classes.button}>
          Disabled
        </Button>
        <Button variant="contained" className={classes.button}>
          Link
        </Button>
      </div>
      <div>
        <Button variant="outlined" className={classes.button}>
          Default
        </Button>
      </div>
    </div>;
  }
}

Example.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Example);
