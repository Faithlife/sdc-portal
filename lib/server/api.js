var bodyParser = require('body-parser');
var express = require('express');
var session = require('cookie-session');
var when = require('when');
var SDCClient = require('../clients/sdc.js');
var sdcConfig = require('../config').sdc;

function generateSubapp (options) {
  var subapp = express();
  subapp.use(bodyParser.json());
  var authProvider = options.authProvider;

  subapp.use(session({
    secret: 'ebcc7e3b4f9147678e8204681e562f36',
  }));

  subapp.get('/signin', function (req, res) {
    authProvider.authenticate(req, res);
  });

  subapp.get('/authorize', function (req, res) {
    authProvider.authorize(req, res);
  });

  subapp.get('/signout', function (req, res) {
    req.session = null;

    return res
      .redirect('/');
  });

  /**
   * JSON API
   */

  subapp.get('/currentuser', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var currentUser = {
      user: {
        id: req.session.userId || -1,
        alias: req.session.userAlias || ''
      }
    };

    return res
      .status('200')
      .send(JSON.stringify(currentUser));
  });

  /*
   * Gets the list of sdc users the currently signed in user has access to.
   */
  subapp.get('/users', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var users = authProvider.getSDCUsers(req, res);

    return res
      .status('200')
      .send(JSON.stringify({users: users}));
  });

  /**
   * Gets the list of sdc users the currently signed in user has access to.
   */
  subapp.get('/datacenters', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    return res
      .status('200')
      .send(JSON.stringify({ dataCenters: Object.keys(sdcConfig.dataCenters) }));
  });

  /*
   * All endpoints below this middleware require authentication
   */
  subapp.use(function(req, res, next) {
    if (authProvider.isAuthenticated(req, res) === false) {
      return res
        .status('401')
        .end();
    }

    next();
  });

  /*
   * Get list of machines for a user
   */
  subapp.get('/machines', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var client = new SDCClient();

    var user = req.query.user;
    if (user === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter user is required' });
    }

    var dataCenter = req.query.dataCenter;
    if (dataCenter === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter dataCenter is required' });
    }

    if (authProvider.hasAccessToSDCUser(req, res, user) === false) {
      return res
        .status('403')
        .send({ message: 'not authorized to access SDC user' });
    }

    client
      .getMachinesForDataCenter(user, dataCenter)
      .then(function(machineList) {
        return res
          .status('200')
          .send(JSON.stringify({ machines: machineList }));
      }, function (err) {
        return res
          .status(500)
          .send(err.message)
      });
  });

  subapp.get('/machines/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var client = new SDCClient();

    var user = req.query.user;
    if (user === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter user is required' });
    }

    var dataCenter = req.query.dataCenter;
    if (dataCenter === undefined) {
      return res
        .status('400')
        .send({ message: 'dataCenter is required' });
    }

    if (authProvider.hasAccessToSDCUser(req, res, user) === false) {
      return res
        .status('403')
        .send({ message: 'not authorized to access SDC user' });
    }

    client
      .getMachine(user, dataCenter, req.params.id)
      .then(function(machine) {

        return res
          .status('200')
          .send(JSON.stringify(machine));
      });
  });

  /*
   * Deprecate
   */
  subapp.get('/machines/states', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var client = new SDCClient();

    var user = req.query.user;
    if (user === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter user is required' });
    }

    if (authProvider.hasAccessToSDCUser(req, res, user) === false) {
      return res
        .status('403')
        .send({ message: 'not authorized to access SDC user' });
    }

    statuses = [];
    client
      .getMachines(user)
      .then(function(machineList) {
        machineList.forEach(function(machine) {
          statuses.push({ id: machine.id, state: machine.state });
        });

        return res
          .status('200')
          .send(JSON.stringify(statuses));
      });
  });

  subapp.post('/machines/:id/reboot', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.query.user;
    if (user === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter user is required' });
    }

    var dataCenter = req.body.dataCenter;
    if (dataCenter === undefined) {
      return res
        .status('400')
        .send({ message: 'dataCenter is required' });
    }

    if (authProvider.hasAccessToSDCUser(req, res, user) === false) {
      return res
        .status('403')
        .send({ message: 'not authorized to access SDC user' });
    }

    var client = new SDCClient();
    var machineId = req.params.id;

    client
      .getMachine(user, dataCenter, machineId)
      .then(function (machine) {

        if (machine === undefined || machine.state !== 'running') {
          return res
            .status('400')
            .send({ message: 'machine can only be started if in state \'running\'' });
        }

        client
          .rebootMachine(user, dataCenter, machineId)
          .then(function() {
            return res
              .status('202')
              .end();
          });
      });
  });

  subapp.post('/machines/:id/start', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.query.user;
    if (user === undefined) {
      return res
        .status('400')
        .send({ message: 'parameter user is required' });
    }

    var dataCenter = req.body.dataCenter;
    if (dataCenter === undefined) {
      return res
        .status('400')
        .send({ message: 'dataCenter is required' });
    }

    if (authProvider.hasAccessToSDCUser(req, res, user) === false) {
      return res
        .status('403')
        .send({ message: 'not authorized to access SDC user' });
    }

    var client = new SDCClient();
    var machineId = req.params.id;

    client
      .getMachine(user, dataCenter, machineId)
      .then(function (machine) {

        if (machine === undefined || machine.state !== 'stopped') {
          return res
            .status('400')
            .send({ message: 'machine can only be started if in state \'stopped\'' });
        }

        client
          .startMachine(user, dataCenter, machineId)
          .then(function() {
            return res
              .status('202')
              .end();
          });
      });
  });

  return subapp;
};

module.exports = {
  generateSubapp: generateSubapp
};
