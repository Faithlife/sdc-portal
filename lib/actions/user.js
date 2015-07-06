var context = require('../context');

context.createAction('user:users', function (params) {
  return this.client.getAllUsers(params);
});

context.createAction('user:get', function (params) {
  return this.client.getUser(params);
});

context.createAction('user:sshkey:create', function (params) {
  return this.client.createSSHKey(params);
});
