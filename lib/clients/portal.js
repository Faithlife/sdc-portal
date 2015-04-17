/**
 * TODO: Description.
 */
var ProxyClient = require('proxy-client');

/**
 * Creates a new instance of PortalClient with the provided `options`.
 *
 * @param {Object} options
 */
function PortalClient(options) {
  if (!(this instanceof PortalClient)) {
    return new PortalClient(options);
  }

  options = options || {};

  this.rootUrl = options.rootUrl || 'http://localhost:8080/api';

  ProxyClient.call(this, options);
}
ProxyClient.inherit(PortalClient);

/*
 * Get list of machines for a user
 */
PortalClient.prototype.getMachines = function getMachines(params) {
  var self = this;

  return self.get('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.machines;
    });
};

/**
 * TODO: Description.
 */
PortalClient.prototype.getMachine = function getMachine(params) {
  var self = this;

  return self.get('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines/' + params.machineId)
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body;
    });
};

/**
 * TODO: Description.
 */
PortalClient.prototype.rebootMachine = function rebootMachine(params) {
  var self = this;

  return self.post('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines/' + params.machineId + '/reboot')
    .end()
    .then(function (response) {
      if (response.status !== 202) {
        return self.rejectResponse(response);
      }

      return response.body;
    });
};

/**
 * TODO: Description.
 */
PortalClient.prototype.startMachine = function startMachine(params) {
  var self = this;

  return self.post('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines/' + params.machineId + '/start')
    .end()
    .then(function (response) {
      if (response.status !== 202) {
        return self.rejectResponse(response);
      }

      return response.body;
    });
};

/*
 * Get list of users currently signed in user has access to.
 */

/**
 * TODO: Description.
 */
PortalClient.prototype.getAllUsers = function getAllUsers() {
  var self = this;

  return self.get('/datacenters/test/users')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.users;
    });
};

/**
 * TODO: Description.
 */
PortalClient.prototype.getCurrentUser = function getCurrentUser() {
  var self = this;

  return self.get('/verify')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.user;
    });
};

/**
 * Get the list of all DataCenters
 */
PortalClient.prototype.getAllDataCenters = function getAllDataCenters() {
  var self = this;

  return self.get('/datacenters')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.dataCenters;
    });
};

/*!
 * Export `PortalClient`.
 */
module.exports = PortalClient;
