import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import createPalette from 'material-ui/styles/createPalette';

import blue from 'material-ui/colors/blue';

export const styles = () => {
  return {
    root: {
      fontFamily: 'monospace',
      display: 'inline-block',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      '& th': {
        padding: 10,
        textTransform: 'capitalize',
        textAlign: 'left',
      },
    },
    colorRow: {
      '&> td': {
        padding: 10,
        width: 90,
      },
    },
  };
};

class ColorPreview extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    const palette = createPalette({
      primary: nextProps.color,
      type: nextProps.type,
      contrastThreshold: nextProps.contrastThreshold,
      tonalOffset: nextProps.tonalOffset,
    });

    return {
      palette,
    };
  }

  render() {
    const { classes, color, title } = this.props;
    const { palette } = this.state;

    return (
      <table className={classes.root}>
        <thead><tr><th colSpan="2">{title}</th></tr></thead>
        <tbody>
          {Object.keys(color).map(function(k) {
            const c = color[k];
            return (
              <tr className={classes.colorRow} style={{backgroundColor: c, color: palette.getContrastText(c)}} key={k}>
                <td>{k}</td><td>{c}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

ColorPreview.defaultProps = {
  title: 'color preview',
  color: blue,

  type: 'light',
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

ColorPreview.propTypes = {
  classes: PropTypes.object.isRequired,

  title: PropTypes.string.isRequired,
  color: PropTypes.object.isRequired,

  type: PropTypes.string.isRequired,
  contrastThreshold: PropTypes.number.isRequired,
  tonalOffset: PropTypes.number.isRequired,
};

export default withStyles(styles)(ColorPreview);
