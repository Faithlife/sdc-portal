/**
 * The server-side WebSocket API.
 */
var WebSocket = require('faye-websocket');
var pathToRegExp = require('path-to-regexp');
var sigmund = require('sigmund');
var SDCClient = require('../clients/sdc');
var logger = require('../logger');
var Machine = require('../models/machine');
var client = new SDCClient();
var pollers = {};
var LIST_MACHINES_RE = pathToRegExp('/datacenters/:dc/users/:user/machines');
var GET_MACHINE_RE = pathToRegExp('/datacenters/:dc/users/:user/machines/:id');

/**
 * Returns an 'upgrade' event handler to add WebSocket support to an
 * http.Server instance.
 */
function generateHandler(options) {
  var authProvider = options && options.authProvider;

  return function (request, socket, body) {
    var params = parseRoute(request.url);

    if (!WebSocket.isWebSocket(request)) {
      return socket.end();
    }

    if (!params) {
      return socket.end();
    }

    authProvider.getUsers(request)
      .then(function (users) {
        var ws;
        var poller;

        if (users.indexOf(params.user) === -1) {
          return socket.end();
        }

        ws = new WebSocket(request, socket, body);

        poller = getMachinePoller(params);

        poller.sockets.push(ws);

        ws.on('close', function (event) {
          poller.sockets.splice(poller.sockets.indexOf(ws), 1);
        });
      });
  };
}

/**
 * Returns an object of route parameters in `url`. If the URL doesn't match
 * those supported by Websockets, it returns `null`.
 */
function parseRoute(url) {
  var parsed = LIST_MACHINES_RE.exec(url);

  if (parsed) {
    return {
      dataCenter: parsed[1],
      user: parsed[2],
      id: null
    };
  }

  parsed = GET_MACHINE_RE.exec(url);

  if (parsed) {
    return {
      dataCenter: parsed[1],
      user: parsed[2],
      id: parsed[3]
    };
  }

  return null;
}

/**
 * Attaches `ws` to receive updates from the Machine or Machines pointed to by
 * `params`.
 */
function getMachinePoller(params) {
  var pollerKey = params.user + ':' + params.dataCenter + ':' + params.id;
  var poller = pollers[pollerKey];

  if (!poller) {
    logger.info('Creating new Machine poller for %j.', pollerKey);

    poller = pollers[pollerKey] = {
      sockets: [],
      hash: null,
      timerId: setInterval(function () {
        client.getMachine(params.user, params.dataCenter, params.id)
          .then(function (machine) {
            var newHash = sigmund(machine);

            if (poller.hash === newHash) {
              return;
            }

            poller.hash = newHash;

            machine = Machine.createMachine(machine);
            machine.loadExtendedData(client.getChild({
              user: params.user,
              dataCenter: params.dataCenter
            }))
              .then(function () {
                logger.debug('Broadcasting Machine update:', machine);

                poller.sockets.forEach(function (ws) {
                  ws.send(JSON.stringify(machine));
                });
              });
          });
      }, 1000)
    };
  }

  return poller;
}

/*!
 * Export `generateHandler`.
 */
module.exports = {
  generateHandler: generateHandler
};
