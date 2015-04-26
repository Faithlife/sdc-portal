var context = require('../context');

context.createStore('user')
  .define('users', [])
  .define('user', {})
  .handle('user:users:succeeded', function (data) {
    this.users = data;
  })
  .handle('user:get:succeeded', function (data) {
    this.user = data;
  });
