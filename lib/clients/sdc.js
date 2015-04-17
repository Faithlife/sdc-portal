var fs = require('fs');
var smartdc = require('smartdc');
var when = require('when');
var config = require('../config');
var log = require('../logger');
var Machine = require('../models/machine.js');
var clients = {};

function SDCClient () {};

SDCClient.getClient = function (user, dataCenter) {
  var clientKey = user + ':' + dataCenter;
  if (clients[clientKey]) {
    return clients[clientKey];
  }

  clients[clientKey] = smartdc.createClient({
    sign: smartdc.privateKeySigner({
      key: fs.readFileSync(config.sdc.users[user].key, 'utf8'),
      keyId: config.sdc.users[user].keyId,
      user: config.sdc.users[user].login
    }),
    user: config.sdc.users[user].login,
    url: config.sdc.dataCenters[dataCenter].cloudapiUrl
  });

  return clients[clientKey];
};

SDCClient.prototype.getMachine = function (user, dataCenter, machineId) {
  var client = SDCClient.getClient(user, dataCenter);

  return when.promise(function (resolve, reject) {
    client.getMachine(machineId, function (error, machine) {
      if (error) {
        var message = 'Error getting machine ' + machineId;
        log.error(message);
        log.error(JSON.stringify(error));
        log.error(error);
        reject(new Error(message));
        return;
      }

      resolve(new Machine(machine));
    });
  });
};

SDCClient.prototype.getMachinesForDataCenter = function (user, dataCenter) {
  var client = SDCClient.getClient(user, dataCenter);
  var machineList = [];

  return when.promise(function (resolve, reject) {
    client.listMachines(function (error, machines) {
      if (error) {
        log.error('Error getting machines');
        log.error(error);
        reject(new Error('Error getting machines'));
        return;
      }

      machines.forEach(function (m) {
        m.dataCenter = dataCenter;
        machine = new Machine(m);
        if (machine.state === 'running' || machine.state === 'stopped' || machine.state === 'stopping') {
          machineList.push(machine);
        }
      });

      resolve(machineList);
    });
  });
};

SDCClient.prototype.rebootMachine = function (user, dataCenter, machineId) {
  var client = SDCClient.getClient(user, dataCenter);

  return when.promise(function (resolve, reject) {
    client.rebootMachine(machineId, function (error) {
      if (error) {
        log.error('Error rebooting machine ' + machineId);
        log.error(error);
        reject(new Error('Error rebooting machine ' + machineId));
      }

      resolve();
    });
  });
}

SDCClient.prototype.startMachine = function (user, dataCenter, machineId) {
  var client = SDCClient.getClient(user, dataCenter);

  return when.promise(function (resolve, reject) {
    client.startMachine(machineId, function (error) {
      if (error) {
        log.error('Error starting machine ' + machineId);
        log.error(error);
        reject(new Error('Error starting machine ' + machineId));
      }

      resolve();
    });
  });
}

module.exports = SDCClient;
