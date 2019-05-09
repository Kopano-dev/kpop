import PropTypes from 'prop-types';

export const embeddedPropTypes = {
  /**
   * Wether or not the app runs embedded.
   */
  enabled: PropTypes.bool,
  /**
   * The mode defines hop the app in embededd more should behave.
   */
  mode: PropTypes.string,
  /**
   * Wether or not the embedded app shall proceed to render.
   */
  wait: PropTypes.bool,
  /**
   * Wether or not the embedded app is bound with its user. If bound is true,
   * the embedded app might choose not to display user related controls since
   * the parent has control.
   */
  bound: PropTypes.bool,
};

const embeddedShape = PropTypes.shape({
  ...embeddedPropTypes,
});

export default embeddedShape;
