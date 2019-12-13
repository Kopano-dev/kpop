import PropTypes from 'prop-types';

export const errorPropTypes = {
  /**
   * The id of the error. Can be used to trigger special action for individual
   * errors. If empty it is a standard fatal error without special handling.
   */
  id: PropTypes.string,
  /**
   * The error message.
   */
  message: PropTypes.string,
  /**
   * Detailed error message.
   */
  detail: PropTypes.string,
  /**
   * Values mapping for placeholders in text.
   */
  values: PropTypes.object,
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
  /**
   * Additional options attached for this error.
   */
  options: PropTypes.object,
};

const errorShape = PropTypes.shape({
  ...errorPropTypes,
});

export default errorShape;
