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
   * The user's email address.
   */
  mail: PropTypes.string,
  /**
   * The users globally unique id.
   */
  guid: PropTypes.string,

  /**
   * Callback function which triggers sign out.
   */
  signoutHandler: PropTypes.func,
};

const userShape = PropTypes.shape({
  ...userPropTypes,
});

export default userShape;
