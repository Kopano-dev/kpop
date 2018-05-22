import PropTypes from 'prop-types';

export const userPropTypes = {
  /**
   * The users display name.
   */
  displayName: PropTypes.string,
  /**
   * The users given or first name.
   */
  givenName: PropTypes.string,
  /**
   * The user surname / last name.
   */
  surname: PropTypes.string,
  /**
   * The users unique id.
   */
  id: PropTypes.string,
};

const userShape = PropTypes.shape({
  ...userPropTypes,
});

export default userShape;
