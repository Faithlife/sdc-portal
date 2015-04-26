var context = require('../context');

context.createAction('machine:machines:get', function (params) {
  return this.client.getMachines({
    dataCenter: params.dataCenter,
    userId: params.userId
  });
});

context.createAction('machine:filter:update', function (params) {
  return {
    filter: params.filter
  };
});

context.createAction('machine:get', function (params) {
  return this.client.getMachine({
    userId: params.userId,
    machineId: params.machineId,
    dataCenter: params.dataCenter
  });
});

context.createAction('machine:poll', function (params) {
  var self = this;
  // TODO(schoon) - Retry on error?
  // TODO(schoon) - Reconnect on close.
  var ws = new WebSocket('ws://localhost:8080/datacenters/' + params.dataCenter + '/users/' + params.userId + '/machines/' + params.machineId);

  ws.onmessage = function (event) {
    self.dispatcher.dispatch('machine:poll:update', JSON.parse(event.data));
  };
});

context.createAction('machine:poll:stop', function (params) {
  clearInterval(this['timer:' + params.machineId]);
});

context.createAction('machine:reboot', function (params) {
  return this.client.rebootMachine({
    userId: params.userId,
    machineId: params.machineId,
    dataCenter: params.dataCenter
  });
});

context.createAction('machine:start', function (params) {
  return this.client.startMachine({
    userId: params.userId,
    machineId: params.machineId,
    dataCenter: params.dataCenter
  });
});

context.createAction('machine:stop', function (params) {
  return this.client.stopMachine({
    userId: params.userId,
    machineId: params.machineId,
    dataCenter: params.dataCenter
  });
});
