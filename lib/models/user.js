/**
 * Creates a new instance of User from the provided `data`, which should
 * be an Account record from SDC.
 *
 * See https://apidocs.joyent.com/cloudapi/#GetAccount for more information.
 */
function User(data) {
  if (!(this instanceof User)) {
    return new User(data);
  }

  this.name = data.name;
}
User.createUser = User;

/*!
 * Export `User`.
 */
module.exports = User;
