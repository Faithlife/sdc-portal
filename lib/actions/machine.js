var context = require('../context');

context.createAction('machine:machines:get', function (params) {
  return this.client.getMachines({
    dataCenter: params.dataCenter,
    userId: params.userId
  });
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

  if (self['timer:' + params.machineId]) {
    return;
  }

  self['timer:' + params.machineId] = setInterval(function () {
    self.performAction('machine:get', params);
  }, 5000);
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
