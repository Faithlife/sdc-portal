/**
 * The server-side SDC Portal API.
 *
 * NOTE: This module is not isomorphic, and requiring it on the client will
 * break. Please use `lib/clients/portal` instead.
 */
var util = require('util');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var express = require('express');
var when = require('when');
var SDCClient = require('../clients/sdc.js');
var config = require('../config');
var Machine = require('../models/machine');

/**
 * Generates an Express subapp for the internal SDC Portal API.
 */
function generateSubapp(options) {
  var subapp = express();
  var authProvider = options.authProvider;
  var client = new SDCClient();

  subapp.use(bodyParser.json());

  subapp.use(session({
    secret: config.session.secret
  }));

  subapp.get('/signin', function (req, res, next) {
    authProvider.authenticate(req, res);
  });

  subapp.get('/authorize', function (req, res, next) {
    authProvider.authorize(req, res);
  });

  subapp.get('/signout', function (req, res, next) {
    req.session = null;

    return res
      .redirect('/');
  });

  subapp.get('/verify', function (req, res, next) {
    return res
      .status(200)
      .send({
        user: {
          id: req.session.userId || -1,
          alias: req.session.userAlias || ''
        }
      });
  });

  /**
   * Ensure a developer is signed-in.
   */
  subapp.use(function (req, res, next) {
    if (authProvider.isAuthenticated(req, res) === false) {
      return res
        .status(401)
        .end();
    }

    next();
  });

  /**
   * Gets the list of data centers the Portal server is configured for.
   * Requires a signed-in developer.
   */
  subapp.get('/datacenters', function (req, res, next) {
    return res
      .status(200)
      .send({
        dataCenters: Object.keys(config.sdc.dataCenters)
      });
  });

  /**
   * Gets the list of sdc users the currently signed in user has access to.
   * Requires a signed-in developer.
   */
  subapp.get('/datacenters/:dc/users', function (req, res, next) {
    // TODO(schoon) - Support non-linked SDC deployments.
    return res
      .status(200)
      .send({
        users: authProvider.getSDCUsers(req, res)
      });
  });

  /**
   * Ensure the signed-in developer has access to :dc/:user.
   */
  subapp.use('/datacenters/:dc/users/:user', function (req, res, next) {
    if (!authProvider.hasAccessToSDCUser(req, res, req.param('user'))) {
      return res
        .status(403)
        .send({
          message: 'not authorized to access SDC user'
        });
    }

    next();
  });

  /**
   * Retrieves a list of Machines on :dc associated with :user.
   */
  subapp.get('/datacenters/:dc/users/:user/machines', function (req, res, next) {
    client
      .listMachines(req.param('user'), req.param('dc'))
      .then(function (machines) {
        return when.all(
          machines
            .map(Machine.createMachine)
            .filter(function (machine) {
              return machine.isActive();
            })
            .map(function (machine) {
              return machine.loadExtendedData(client.getChild({
                user: req.param('user'),
                dataCenter: req.param('dc')
              }));
            })
        );
      })
      .then(function (machines) {
        return res
          .status(200)
          .send({
            machines: machines
          });
      }, next);
  });

  /**
   * Ensure :dc/:id exists, retrieving it for use in other middleware.
   */
  subapp.use('/datacenters/:dc/users/:user/machines/:id', function (req, res, next) {
    client
      .getMachine(req.param('user'), req.param('dc'), req.param('id'))
      .then(function (machine) {
        if (!machine) {
          res
            .status(404)
            .send({
              message: 'Machine not found'
            });
        }

        req.machine = machine;

        next();
      }, next);
  });

  /**
   * Gets the Machine data for :dc/:id. The signed-in developer must have
   * access to the associated :user, and :dc/:id must exist.
   */
  subapp.get('/datacenters/:dc/users/:user/machines/:id', function (req, res, next) {
    Machine.createMachine(req.machine)
      .loadExtendedData(client.getChild({
        user: req.param('user'),
        dataCenter: req.param('dc')
      }))
      .then(function (machine) {
        res.send(machine);
      });
  });

  /**
   * Queues a "reboot" action for :dc/:id. The signed-in developer must have
   * access to the associated :user, and :dc/:id must exist.
   */
  subapp.post('/datacenters/:dc/users/:user/machines/:id/reboot', function (req, res, next) {
    if (req.machine.state !== 'running') {
      return res
        .status(400)
        .send({
          message: 'machine can only be rebooted if in state \'running\''
        });
    }

    client
      .rebootMachine(req.param('user'), req.param('dc'), req.param('id'))
      .then(function () {
        return res
          .status(202)
          .end();
      }, next);
  });

  /**
   * Queues a "start" action for :dc/:id. The signed-in developer must have
   * access to the associated :user, and :dc/:id must exist.
   */
  subapp.post('/datacenters/:dc/users/:user/machines/:id/start', function (req, res, next) {
    if (req.machine.state !== 'stopped') {
      return res
        .status(400)
        .send({
          message: 'machine can only be started if in state \'stopped\''
        });
    }

    client
      .startMachine(req.param('user'), req.param('dc'), req.param('id'))
      .then(function () {
        return res
          .status(202)
          .end();
      }, next);
  });

  /**
   * Queues a "stop" action for :dc/:id. The signed-in developer must have
   * access to the associated :user, and :dc/:id must exist.
   */
  subapp.post('/datacenters/:dc/users/:user/machines/:id/stop', function (req, res, next) {
    if (req.machine.state !== 'running') {
      return res
        .status(400)
        .send({
          message: 'machine can only be stopped if in state \'running\''
        });
    }

    client
      .stopMachine(req.param('user'), req.param('dc'), req.param('id'))
      .then(function () {
        return res
          .status(202)
          .end();
      }, next);
  });

  return subapp;
}

/*!
 * Export `generateSubapp`.
 */
module.exports = {
  generateSubapp: generateSubapp
};
