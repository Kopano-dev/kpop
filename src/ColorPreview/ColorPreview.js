import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';

export const styles = () => {
  return {
    root: {
      tableLayout: 'fixed',
      verticalAlign: 'top',
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
        width: 155,
        textAlign: 'right',
      },
      '&> td:first-child': {
        width: 90,
        textAlign: 'left',
      },
    },
  };
};

class ColorPreview extends React.Component {
  state = {};

  static getDerivedStateFromProps(nextProps) {
    let title = nextProps.title;
    let palette;
    if (nextProps.palette) {
      palette = nextProps.palette;
    } else {
      palette = nextProps.theme.palette;
      if (!title) {
        title = `theme ${nextProps.paletteColor}`;
      }
    }
    let color = palette[nextProps.paletteColor];
    if (nextProps.color) {
      if (!nextProps.palette) {
        palette = createPalette({
          primary: nextProps.color,
          type: nextProps.type,
          contrastThreshold: nextProps.contrastThreshold,
          tonalOffset: nextProps.tonalOffset,
        });
        if (!nextProps.title) {
          title = 'color';
        }
      }
      color = nextProps.color;
    }

    return {
      title,
      palette,
      color,
    };
  }

  render() {
    const { classes } = this.props;
    const { title, palette, color } = this.state;

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
  paletteColor: 'primary',

  type: 'light',
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

ColorPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object,

  title: PropTypes.string,
  color: PropTypes.object,
  palette: PropTypes.object,
  paletteColor: PropTypes.oneOf(['primary', 'secondary', 'text', 'grey', 'error', 'common', 'background']),

  type: PropTypes.oneOf(['light', 'dark']),
  contrastThreshold: PropTypes.number.isRequired,
  tonalOffset: PropTypes.number.isRequired,
};

export default withStyles(styles, {withTheme: true})(ColorPreview);
