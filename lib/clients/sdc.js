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

  return when.promise(function (resolve, reject) {
    if (clients[clientKey]) {
      resolve(clients[clientKey]);
    }

    fs.readFile(config.sdc.users[user].key, 'utf8', function (error, keyData) {
      if (error) {
        reject(new Error('Error getting key ' + config.sdc.users[user].key));
      }

      clients[clientKey] = smartdc.createClient({
        sign: smartdc.privateKeySigner({
          key: keyData,
          keyId: config.sdc.users[user].keyId,
          user: config.sdc.users[user].login
        }),
        user: config.sdc.users[user].login,
        url: config.sdc.dataCenters[dataCenter].cloudapiUrl
      });

      resolve(clients[clientKey]);
    });
  });
};

SDCClient.prototype.getMachine = function (user, dataCenter, machineId) {
  var message;

  return when.promise(function (resolve, reject) {
    SDCClient
      .getClient(user, dataCenter)
      .then(function (client) {
        client.getMachine(machineId, function (error, machine) {
          if (error) {
            message = 'Error getting machine ' + machineId;
            log.error(message);
            log.error(JSON.stringify(error));
            log.error(error);
            reject(new Error(message));
            return;
          }

          resolve(new Machine(machine));
        });
      });
  });
};

SDCClient.prototype.getMachinesForDataCenter = function (user, dataCenter) {
  var machineList = [];

  return when.promise(function (resolve, reject) {
    SDCClient
      .getClient(user, dataCenter)
      .then(function (client) {
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
  });
};

SDCClient.prototype.rebootMachine = function (user, dataCenter, machineId) {
  return when.promise(function (resolve, reject) {
    SDCClient
      .getClient(user, dataCenter)
      .then(function (client) {
        client.rebootMachine(machineId, function (error) {
          if (error) {
            log.error('Error rebooting machine ' + machineId);
            log.error(error);
            reject(new Error('Error rebooting machine ' + machineId));
          }

          resolve();
        });
      });
  });
};

SDCClient.prototype.startMachine = function (user, dataCenter, machineId) {
  return when.promise(function (resolve, reject) {
    SDCClient
      .getClient(user, dataCenter)
      .then(function (client) {
        client.startMachine(machineId, function (error) {
          if (error) {
            log.error('Error starting machine ' + machineId);
            log.error(error);
            reject(new Error('Error starting machine ' + machineId));
          }

          resolve();
        });
      });
  });
};

module.exports = SDCClient;
