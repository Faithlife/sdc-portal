/**
 * SDCClient is reponsible for managing the one-to-many relationship between
 * Developer Portal instances and data centers. Additionally, the API provided
 * by SDCClient is Promise-based and whitelisted.
 */
var fs = require('fs');
var smartdc = require('smartdc');
var when = require('when');
var config = require('../config');
var clients = {};

/**
 * Creates a new instance of SDCClient with the provided `options`.
 *
 * Available options:
 * - `dataCenter`: The SDC data center to use for requests.
 * - `user`: The SDC user to use for requests.
 */
function SDCClient(options) {
  if (!(this instanceof SDCClient)) {
    return new SDCClient(options);
  }

  options = options || {};

  this.dataCenter = options.dataCenter;
  this.user = options.user;
}

/**
 * Returns a Promise to be fulfilled with a first-party SDC client associated
 * with the given `user` and `dataCenter`. Lazily creates any missing client
 * instances.
 */
SDCClient.getClient = function (user, dataCenter) {
  var clientKey = user + ':' + dataCenter;

  if (clients[clientKey]) {
    return when(clients[clientKey]);
  }

  return when.promise(function (resolve, reject) {
    fs.readFile(config.sdc.users[user].key, 'utf8', function (err, keyData) {
      if (err) {
        return reject(err);
      }

      resolve(keyData);
    });
  })
    .then(function (keyData) {
      clients[clientKey] = smartdc.createClient({
        sign: smartdc.privateKeySigner({
          key: keyData,
          keyId: config.sdc.users[user].keyId,
          user: config.sdc.users[user].login
        }),
        user: config.sdc.users[user].login,
        url: config.sdc.dataCenters[dataCenter].cloudapiUrl,
        noCache: true
      });

      return clients[clientKey];
    });
};

/**
 * Returns a new SDCClient with the provided `options`. Defaults to the same
 * options provided to this SDCClient.
 */
SDCClient.prototype.getChild = function getChild(options) {
  var child = new SDCClient(this);

  child.dataCenter = options.dataCenter;
  child.user = options.user;

  return child;
};

/**
 * These methods each return a Promise to be fulfilled with a single result
 * value as defined by [the first-party SDC client][smartdc].
 *
 * [smartdc]: https://apidocs.joyent.com/cloudapi
 */
[
  'getImage', 'getMachine', 'getMachineAudit', 'listMachines', 'rebootMachine',
  'startMachine', 'stopMachine'
].forEach(function (key) {
  SDCClient.prototype[key] = function (user, dataCenter) {
    var remaining = Array.prototype.slice.call(arguments, 2);

    if (this.dataCenter) {
      if (dataCenter) {
        remaining.unshift(dataCenter);
      }
      dataCenter = this.dataCenter;
    }

    if (this.user) {
      if (user) {
        remaining.unshift(user);
      }
      user = this.user;
    }

    return SDCClient
      .getClient(user, dataCenter)
      .then(function (client) {
        return when.promise(function (resolve, reject) {
          client[key].apply(client, remaining.concat(function (err, value) {
            if (err) {
              return reject(err);
            }

            resolve(value);
          }));
        });
      });
  };
});

/*!
 * Export `SDCClient`.
 */
module.exports = SDCClient;
