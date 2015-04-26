var context = require('../context');

context.createStore('user')
  .define('users', [])
  .handle('user:users:succeeded', function (data) {
    this.users = data;
  })
