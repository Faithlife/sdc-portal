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

  this.login = data.login || null;
  this.sshKeys = data.sshKeys || [];
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
    sshKeys: client.listKeys(self.login),
  })
    .then(function (data) {
      self.sshKeys = data.sshKeys;

      return self;
    });
};

/*!
 * Export `User`.
 */
module.exports = User;
