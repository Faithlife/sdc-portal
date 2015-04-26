var context = require('../context');

context.createStore('developer')
  .define('current', null)
  .handle('developer:current:get:succeeded', function (data) {
    this.current = data;
  });
