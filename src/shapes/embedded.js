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
};

const embeddedShape = PropTypes.shape({
  ...embeddedPropTypes,
});

export default embeddedShape;
