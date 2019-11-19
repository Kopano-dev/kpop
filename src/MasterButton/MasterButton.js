import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';


const styles = theme => {
  return {
    root: {
      lineHeight: 1.75, // To remove with v4.
      ...theme.typography.button,
      boxSizing: 'border-box',
      minWidth: 64,
      padding: '6px 16px',
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.text.primary,
      transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: fade(theme.palette.text.primary, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
        '&$disabled': {
          backgroundColor: 'transparent',
        },
      },
      '&$disabled': {
        color: theme.palette.action.disabled,
      },
    },
    fab: {
      boxShadow: theme.shadows[4],
    },
    label: {
      marginLeft: theme.spacing.unit * 1.5,
    },
    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},
  };
};

class MasterButton extends React.PureComponent {
  render() {
    const {
      classes,
      className: classNameProp,
      children,
      color,
      icon,
      disabled,

      ...other
    } = this.props;

    const className = classNames(
      classes.root,
      classNameProp,
    );

    return (
      <ButtonBase className={className} disabled={disabled} {...other}>
        <Fab size="small" color={color} component="div" disabled={disabled} className={classes.fab}>
          {icon}
        </Fab>
        <Typography variant="subtitle2" color="inherit" className={classes.label}>{children}</Typography>
      </ButtonBase>
    );
  }
}

MasterButton.defaultProps = {
  color: 'primary',
};

MasterButton.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  /**
   * The icon for the button.
   */
  icon: PropTypes.node.isRequired,
  /**
   * If `true`, the button will be disabled.
   */
  disabled: PropTypes.bool,
};



export default withStyles(styles, { name: 'KpopMasterButton' })(MasterButton);
