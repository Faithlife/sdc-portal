var fs = require('fs');
var smartdc = require('smartdc');
var config = require('../config').sdc;
var when = require('when');
var log = require('../logger');
var Machine = require('../models/machine.js');

function SDCClient () {}

var getClient = function (user, datacenter) {
  var client = smartdc.createClient({
    sign: smartdc.privateKeySigner({
      key: fs.readFileSync(config.users[user].key, 'utf8'),
      keyId: config.users[user].keyId,
      user: config.users[user].login
    }),
    user: config.users[user].login,
    url: config.dataCenters[datacenter].cloudapiUrl
  });

  return client;
};

SDCClient.prototype.getMachine = function (user, dataCenter, machineId) {
  var deferred = when.defer();
  var client = getClient(user, dataCenter);

  client.getMachine(machineId, function (error, machine) {
    if (error) {
      var message = 'Error getting machine ' + machineId;
      log.error(message);
      log.error(JSON.stringify(error));
      log.error(error);
      deferred.reject(new Error(message));
      return;
    }

    m = new Machine(machine);

    deferred.resolve(m);
  });

  return deferred.promise;
};

SDCClient.prototype.getMachinesForDataCenter = function (user, dataCenter) {
  var deferred = when.defer();
  var machineList = [];
  var client = getClient(user, dataCenter);

  client.listMachines(function (err, machines) {
    if (err) {
      log.error('Error getting machines');
      log.error(err);
      deferred.reject(new Error('Error getting machines'));
      return;
    }

    machines.forEach(function (m) {
      m.dataCenter = dataCenter;
      machine = new Machine(m);
      if (machine.state === 'running' || machine.state === 'stopped' || machine.state === 'stopping') {
        machineList.push(machine);
      }
    });

    deferred.resolve(machineList);
  });

  return deferred.promise;
}

SDCClient.prototype.getMachines = function (user) {
  var machineList = [];
  var deferred = when.defer();
  var promises = [];

  log.info('Getting machines for %s...', user);

  Object.keys(config.dataCenters).forEach(function (dataCenter) {
    promises.push(getMachinesForDataCenter(user, dataCenter));
  });

  when.all(promises)
    .then(function (machines) {
      log.info('Got: %j', machines);

      machines.forEach(function (machineArray) {
        machineArray.forEach(function (machine) {
          machineList.push(machine);
        });
      });
      deferred.resolve(machineList);
    });

  return deferred.promise;
};

SDCClient.prototype.rebootMachine = function (user, dataCenter, machineId) {
  var deferred = when.defer();
  var client = getClient(user, dataCenter);

  client.rebootMachine(machineId, function (error) {
    if (error) {
      log.error('Error rebooting machine ' + machineId);
      log.error(error);
      deferred.reject(new Error('Error rebooting machine ' + machineId));
    }

    deferred.resolve();
  });

  return deferred.promise;
}

SDCClient.prototype.startMachine = function (user, dataCenter, machineId) {
  var deferred = when.defer();
  var client = getClient(user, dataCenter);

  client.startMachine(machineId, function (error) {
    if (error) {
      log.error('Error starting machine ' + machineId);
      log.error(error);
      deferred.reject(new Error('Error starting machine ' + machineId));
    }

    deferred.resolve();
  });

  return deferred.promise;
}

module.exports = SDCClient;
