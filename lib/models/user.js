var whenKeys = require('when/keys');

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

  this._user = data;
  this._sshKeys = null;
}
User.createUser = User;

/**
 * Returns a Promise to be fulfilled with the updated User once it has
 * loaded any extended data from `client`, which should be pre-configured with
 * the desired `user` and `dataCenter`.
 */
User.prototype.loadExtendedData = function loadExtendedData(client) {
  var self = this;

  return whenKeys.all({
    sshKeys: client.listKeys(self._user.login)
  })
    .then(function (data) {
      self._sshKeys = data.sshKeys;

      return self;
    });
};

/**
 * Returns an Object suitable to serialize as JSON.
 */
User.prototype.toJSON = function toJSON() {
  if (!this._user) {
    return null;
  }

  return {
    login: this._user.login,
    sshKeys: this._sshKeys
  };
};

/*!
 * Export `User`.
 */
module.exports = User;
