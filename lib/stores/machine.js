var context = require('../context');

context.createStore('machine')
  .define('machines', [])
  .handle('machine:machines:get:succeeded', function (data) {
    this.machines = data;
  })
