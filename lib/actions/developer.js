var context = require('../context');

context.createAction('developer:current:get', function (params) {
  return this.client.getCurrentDeveloper();
});
