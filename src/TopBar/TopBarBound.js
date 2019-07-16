import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => {
  return {
    root: {
      marginTop: 56,
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        marginTop: 48,
      },
      [theme.breakpoints.up('sm')]: {
        marginTop: 56,
      },
    },
  };
};

function TopBarBound(props) {
  const {
    children,
    classes,
    className: classNameProp,
    ...other
  } = props;

  return <div className={classNames(classes.root, classNameProp)} {...other}>
    {children}
  </div>;
}

TopBarBound.propTypes = {
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
};

export default withStyles(styles, { name: 'KpopTopBarBound' })(TopBarBound);
