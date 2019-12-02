import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Glue from '@longsleep/glue';

const styles = theme => {
  return {
    root: {
      flex: 1,
      display: 'flex',
    },
    loader: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      background: theme.palette.background.paper,
      display: 'flex',

      '& > *': {
        margin: 'auto',
      },
    },
    iframe: {
      flex: 1,
      border: 0,
    },
  };
};

class GlueEmbed extends React.PureComponent {
  container = null;
  glue = null;

  state = {
    ready: false,
    error: false,
  }

  setContainerRef = element => {
    const { classes, url, timeout, hidden, GlueOptions } = this.props;

    if (element === this.container) {
      return;
    }

    const options = {
      timeout,
      ...GlueOptions,
      onBeforeInit: (glue, cont, ...args) => {
        cont = cont.then(() => {
          this.glue = glue;
          this.setState({
            ready: true,
          });
        });
        let initOptions;
        if (GlueOptions && GlueOptions.onBeforeInit) {
          initOptions = GlueOptions.onBeforeInit(glue, cont, ...args);
        }
        return {
          hidden,
          ...initOptions,
        };
      },
    };
    options.className = classNames(classes.iframe, options.className);

    this.container = element;
    this.glue = null;

    Glue.embed(url, element, options).then(glue => {
      if (this.container !== element) {
        return;
      }

      this.glue = glue;
      if (!timeout) {
        this.setState({
          ready: true, // Directly ready, when no timeout.
        });
      }
    }).catch(reason => {
      if (this.container !== element) {
        return;
      }

      console.error(`glue failed: ${reason}`); // eslint-disable-line no-console

      this.glue = null;
      this.setState({
        error: timeout !== 0,
        ready: timeout === 0,
      });
    });
  }

  componentWillUnmount() {
    if (this.glue) {
      this.glue.destroy();
      this.glue = null;
    }
    this.container = null;
  }

  render() {
    const {
      classes,
      className: classNameProp,
      hidden,
    } = this.props;
    const {
      ready,
    } = this.state;

    if (this.glue) {
      if ('hidden' in this.glue) {
        this.glue.hidden = hidden;
      }
    }

    // TODO(longsleep): Add retry/error screen.
    return <div
      className={classNames(classes.root, classNameProp)}
      ref={this.setContainerRef}
    >
      <Fade in={!ready} unmountOnExit>
        <div className={classes.loader}><CircularProgress color="secondary" /></div>
      </Fade>
    </div>;
  }
}

GlueEmbed.defaultProps = {
  timeout: 30000,
};

GlueEmbed.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,

  url: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  hidden: PropTypes.bool,

  GlueOptions: PropTypes.object,
};

export default withStyles(styles, { name: 'KpopGlueEmbed' })(GlueEmbed);
