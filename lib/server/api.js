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
var whenKeys = require('when/keys');
var SDCClient = require('../clients/sdc.js');
var config = require('../config');
var Machine = require('../models/machine');

/**
 * Generates an Express subapp for the SDC Portal API.
 */
function generateSubapp (options) {
  var subapp = express();
  var authProvider = options.authProvider;
  var client = new SDCClient();

  subapp.use(bodyParser.json());

  subapp.use(session({
    secret: config.session.secret,
  }));

  /**
   * JSON API
   */

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

  /*
   * All endpoints below this middleware require authentication
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
   * Gets the list of sdc users the currently signed in user has access to.
   */
  subapp.get('/datacenters', function (req, res, next) {
    return res
      .status(200)
      .send({
        dataCenters: Object.keys(config.sdc.dataCenters)
      });
  });

  /*
   * Gets the list of sdc users the currently signed in user has access to.
   */
  subapp.get('/datacenters/:dc/users', function (req, res, next) {
    // TODO(schoon) - Support non-linked SDC deployments.
    return res
      .status(200)
      .send({
        users: authProvider.getSDCUsers(req, res)
      });
  });

  /*
   * Gets the list of sdc users the currently signed in user has access to.
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

  /*
   * Get list of machines for a user
   */
  subapp.get('/datacenters/:dc/users/:user/machines', function (req, res, next) {
    client
      .listMachines(req.param('user'), req.param('dc'))
      .then(function (machines) {
        return when.all(
          machines
            .filter(function (machine) {
              return machine.state === 'running' || machine.state === 'stopped' || machine.state === 'stopping';
            })
            .map(function (machine) {
              return whenKeys.all(util._extend(machine, {
                audit: client.getMachineAudit(req.param('user'), req.param('dc'), machine.id),
                image: client.getImage(req.param('user'), req.param('dc'), machine.image),
                dataCenter: req.param('dc')
              }));
            })
        );
      })
      .then(function (machines) {
        return machines.map(function (machine) {
          return new Machine(machine);
        });
      })
      .then(function (machines) {
        return res
          .status(200)
          .send({
            machines: machines
          });
      }, next);
  });

  subapp.use('/datacenters/:dc/users/:user/machines/:id', function (req, res, next) {
    client
      .getMachine(req.param('user'), req.param('dc'), req.param('id'))
      .then(function (machine) {
        if (!machine) {
          res
            .status(404)
            .send({
              message: 'Machine not found'
            })
        }

        req.machine = machine;

        next();
      }, next);
  });

  subapp.get('/datacenters/:dc/users/:user/machines/:id', function (req, res, next) {
    whenKeys.all(util._extend(req.machine, {
      audit: client.getMachineAudit(req.param('user'), req.param('dc'), req.machine.id),
      image: client.getImage(req.param('user'), req.param('dc'), req.machine.image),
      dataCenter: req.param('dc')
    }))
      .then(function (machine) {
        res.send(new Machine(machine));
      });
  });

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
      .then(function() {
        return res
          .status(202)
          .end();
      }, next);
  });

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
};

/*!
 * Export `generateSubapp`.
 */
module.exports = {
  generateSubapp: generateSubapp
};
