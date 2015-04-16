var context = require('../context');

context.createStore('dataCenter')
  .define('dataCenters', [])
  .handle('dataCenter:dataCenters:get:succeeded', function (data) {
    this.dataCenters = data;
  });
