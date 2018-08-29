import PropTypes from 'prop-types';

export const errorPropTypes = {
  /**
   * The error message.
   */
  message: PropTypes.string,
  /**
   * Detailed error message.
   */
  detail: PropTypes.string,
  /**
   * Flag indicating that the error is fatal and that the app cannot continue.
   */
  fatal: PropTypes.bool,
  /**
   * Flag preventing the error message to automatically be extended by a message
   * that the error is fatal.
   */
  withoutFatalSuffix: PropTypes.boolean,
  /**
   * Text label to be show on the button when an error dialog is shown.
   */
  reloadButtonText: PropTypes.string,
  /**
   * Action ID for a potentially registered error resultion for this error.
   */
  resolution: PropTypes.string,
};

const errorShape = PropTypes.shape({
  ...errorPropTypes,
});

export default errorShape;
