var context = require('../context');

context.createStore('user')
  .define('users', [])
  .define('user', {})
  .handle('user:users:succeeded', function (data) {
    this.users = data;
  })
  .handle('user:get:succeeded', function (data) {
    this.user = data;
  })
  .handle('user:sshkey:create:succeeded', function (data) {
    if (this.user.sshKeys) {
      this.user.sshKeys.push(data);
    } else {
      this.user.sshKeys = [data];
    }

    this.user = this.user;
  });
