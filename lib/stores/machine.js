var context = require('../context');

context.createStore('machine')
  .define('machines', [])
  .handle('machine:machines:get:succeeded', function (data) {
    var self = this;

    self.machines = data;

    data.forEach(function (machine) {
      self.define(machine.id, machine);
    });
  })
  .define('filter', '')
  .handle('machine:filter:update:succeeded', function (params) {
    this.filter = params.filter;
  })
  .handle('machine:get:succeeded', function (data) {
    this.define(data.id, data);
  })
  .handle('machine:poll:update', function (data) {
    this.define(data.id, data);
  })
  .handle('machine:reboot:failed', function (data) {
    console.error('Failed to reboot with:', data);
  })
  .handle('machine:start:failed', function (data) {
    console.error('Failed to start with:', data);
  })
  .handle('machine:stop:failed', function (data) {
    console.error('Failed to stop with:', data);
  });
