/**
 * PortalClient is reponsible for abstracting the internal API.
 */
var ProxyClient = require('proxy-client');

/**
 * Creates a new instance of PortalClient with the provided `options`. See
 * `ProxyClient` for available options.
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
 * Returns a Promise to be fulfilled with an Array of Machines associated with
 * a given use and data center.
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
 * Returns a Promise to be fulfilled with a single Machine, identified by ID,
 * associated with a given use and data center.
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
 * Returns a Promise to be fulfilled once a "reboot" action is queued, given a
 * user, data center, and the target machine's ID.
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
 * Returns a Promise to be fulfilled once a "start" action is queued, given a
 * user, data center, and the target machine's ID.
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

/**
 * Returns a Promise to be fulfilled once a "stop" action is queued, given a
 * user, data center, and the target machine's ID.
 */
PortalClient.prototype.stopMachine = function stopMachine(params) {
  var self = this;

  return self.post('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines/' + params.machineId + '/stop')
    .end()
    .then(function (response) {
      if (response.status !== 202) {
        return self.rejectResponse(response);
      }

      return response.body;
    });
};

/*
 * Returns a Promise to be fulfilled with a list of the users the signed-in
 * developer has access to.
 */
PortalClient.prototype.getAllUsers = function getAllUsers(params) {
  var self = this;

  return self.get('/datacenters/' + params.dataCenter + '/users')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.users;
    });
};

/**
 * Returns a Promise to be fulfilled with the user requested.
 */
PortalClient.prototype.getUser = function getUser(params) {
  var self = this;
  console.log('getting user: %s', params.userId);

  return self.get('/datacenters/' + params.dataCenter + '/users/' + params.userId)
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.user;
    });
};

/**
 * Returns a promise to be fulfilled with the created ssh key
 */
PortalClient.prototype.createSSHKey = function createSSHKey (params) {
  var self = this;

  return self.post('/datacenters/' + params.dataCenter + '/users/' + params.userId + '/sshkeys')
    .send({
      name: params.name,
      key: params.key
    })
    .end()
    .then(function (response) {
      if (response.status !== 201) {
        return self.rejectResponse(response);
      }

      return response.body.sshKey;
    });
};

/**
 * Returns a Promise to be fulfilled with the currently signed-in developer.
 */
PortalClient.prototype.getCurrentDeveloper = function getCurrentDeveloper() {
  var self = this;

  return self.get('/verify')
    .end()
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.developer;
    });
};

/**
 * Returns a Promise to be fulfilled with an Array of the data centers this
 * SDC Portal is configured for.
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
