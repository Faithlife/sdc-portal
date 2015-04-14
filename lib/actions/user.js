var context = require('../context');

context.createAction('user:users', function (params) {
  return this.client.getAllUsers();
});
