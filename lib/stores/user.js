var context = require('../context');

context.createStore('user')
  .define('users', [])
  .define('user', null)
  .handle('user:users:succeeded', function (data) {
    this.users = data;
  })
  .handle('user:getme:succeeded', function (data) {
    this.user = data;
  });
