import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

/* eslint-disable react-intl-format/missing-formatted-message */

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
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
        <Button variant="raised" className={classes.button}>
          Default
        </Button>
        <Button variant="raised" color="primary" className={classes.button}>
          Primary
        </Button>
        <Button variant="raised" color="secondary" className={classes.button}>
          Secondary
        </Button>
        <Button variant="raised" color="secondary" disabled className={classes.button}>
          Disabled
        </Button>
        <Button variant="raised" href="#raised-buttons" className={classes.button}>
          Link
        </Button>
      </div>
    </div>;
  }
}

Example.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Example);
