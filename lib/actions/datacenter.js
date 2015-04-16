var context = require('../context');

context.createAction('dataCenter:dataCenters:get', function (params) {
  return this.client.getAllDataCenters();
});
